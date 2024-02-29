// Importeer het npm pakket express uit de node_modules map
import express, { json } from 'express'
// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Stel het basis endpoint in
const apiUrl = 'https://fdnd.directus.app/items'

// Haal alle squads uit de WHOIS API op
// const squadData = await fetchJson('https://fdnd.directus.app/items/squad')

// Maak een nieuwe express app aan
const app = express()
app.use(express.urlencoded({ extended: true }));
    
const messages = []

// Stel ejs in als template engine
app.set('view engine', 'ejs')
// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources
app.use(express.static('public'))

// Maak een GET route voor de index
app.get('/', function (request, response) {
  // Haal alle personen uit de FDND API op
  fetchJson(apiUrl + '/person/').then((apiData) => {
    // Render index.ejs uit de views map en geef uit FDND API opgehaalde data mee
    response.render('index', {
      personsdata: apiData.data,
    })
  })
})

// Maak een GET route voor person met een request parameter id
app.get('/person/:id', function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de FDND API op
  fetchJson(apiUrl + '/person/' + request.params.id).then((apiData) => {
   
    try {
      apiData.data.custom = JSON.parse(apiData.data.custom)
    } catch (e) {}


    // console.log(data.data.name);
    // Render index.ejs uit de views map en geef uit FDND API opgehaalde data mee
    response.render('details', {person: apiData.data, messages: messages})
  })
})

app.post('/messages/:id', function(request,response) {
  //wat moet er gebeure als een gebruiker post naar messages?
  console.log(request.params.id)
  console.log(request.body)

  messages.push(request.body.message)
  console.log(messages)

  response.redirect(303, '/person/' + request.params.id)

})

// Waarvoor is dit nodig?


app.post('/details/:id', function(request,response) {
  fetchJson(apiUrl + "/person" + request.params.id).then((apiResponse) => {

  try {
    apiResponse.data.custom = JSON.parse(apiResponse.data.custom)
  } catch (e) {
    apiResponse.data.custom = {}
  }

  // Stap 2: Gebruik de data uit het formulier
  // Deze stap zal voor iedereen net even anders zijn, afhankelijk van de functionaliteit

  // Controleer eerst welke actie is uitgevoerd, aan de hand van de submit button
  // Dit kan ook op andere manieren, of in een andere POST route
  if (request.body.actie == 'verstuur') {

    // Als het custom object nog geen messages Array als eigenschap heeft, voeg deze dan toe
    if (!apiResponse.data.custom.messages) {
      apiResponse.data.custom.messages = []
    }

    // Voeg een nieuwe message toe voor deze persoon, aan de hand van het bericht uit het formulier
    apiResponse.data.custom.messages.push(request.body.message)
    } else if (request.body.actie == 'vind-ik-leuk') {

      apiResponse.data.custom.like = true

    } else if (request.body.actie == 'vind-ik-niet-leuk') {

      apiResponse.data.custom.like = false

    }

    fetch(apiUrl + "/person" + request.params.id, {
      method: "patch",
      body: json.stringify({
        custom: apiResponse.data.custom
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
      
    }).then((patchResponse) => {
      response.redirect(303, '/person/' + request.params.id)
    })
  }) 
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})



