function insertPlaceholder() {
    const placeHolderImage = "assets/images/placeholder.jpg";
    const imageElement = document.getElementById('profile-image');
    
    if (imageElement) {
        imageElement.src = placeHolderImage; // Set src to placeholder image URL
    }
}

const elements = document.querySelectorAll('.profile');
const count = elements.length;
console.log(count);