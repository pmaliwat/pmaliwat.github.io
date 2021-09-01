window.onload = function() {
    // alert("Welcome to Patrick's Official Homepage");
    setVisitCount();
    setVisitDateSince();
    setLastUpdated();
};

function setVisitCount() {
    let visitsCountEl = document.querySelector('.visits .count');
    visitsCountEl.textContent = randomNumberBetween(20, 30);
}

function setVisitDateSince() {
    let visitsDateSinceEl = document.querySelector('.visits .date');
    visitsDateSinceEl.textContent = generateRandomDateString();
}

function setLastUpdated() {
    let lastUpdatedEl = document.querySelector('.last-updated');
    lastUpdatedEl.textContent = generateRandomDateString();
}

function generateRandomDateString() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month = monthNames[randomNumberBetween(0,11)]; 
    
    let day = randomNumberBetween(1,28); 
    let year = randomNumberBetween(1992,1999);

    return `${month} ${day}, ${year}`;
}


function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}