/**
* Initializes star rating functionality by assigning unique IDs 
* and names to inputs and labels.
*/ 
function initStarRating() {
    const ratingBlocks = document.querySelectorAll('.simple-rating__items');

    ratingBlocks.forEach((block, index) => {
        const uniquePrefix = `rating-${index + 1}`;
        const inputs = block.querySelectorAll('.simple-rating__item');
        const labels = block.querySelectorAll('.simple-rating__label');
        
        inputs.forEach((input, i) => {
            const uniqueId = `${uniquePrefix}-${5 - i}`;
            input.id = uniqueId;
            input.name = uniquePrefix;
            labels[i].setAttribute('for', uniqueId);
        });
    });
}

document.addEventListener('DOMContentLoaded', initStarRating);