function insertPlaceholder() {
    const placeHolderImage = "assets/images/placeholder.jpg";
    const imageElement = document.getElementById('profile-image');
    
    if (imageElement) {
        imageElement.src = placeHolderImage; // Set src to placeholder image URL
    }
}

// const elements = document.querySelectorAll('.profile li');
// const count = elements.length;
// console.log(count);

function updateProfileCount() {
    const elements = document.querySelectorAll('.profile li');
    const count = elements.length;
    // Update the content of the h1 element with the count
    const h1Element = document.querySelector('h1#profileCount');
    h1Element.textContent = 'Vrienden (' + count + ')';
  }
  
  // Call the function to update the profile count when the page loads
  updateProfileCount();