window.onload = function() {
    // alert("Welcome to Patrick's Official Homepage");
    setVisitCount();
    setVisitDateSince();
};

function setVisitCount() {
    let visitsCountEl = document.querySelector('.visits .count');
    visitsCountEl.textContent = randomNumberBetween(20, 30);
}

function setVisitDateSince() {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let monthEl = document.querySelector('.visits .month');
  monthEl.textContent = monthNames[randomNumberBetween(0,11)]; 

  let dayEl = document.querySelector('.visits .day');
  dayEl.textContent = randomNumberBetween(1,28); 

  let yearEl = document.querySelector('.visits .year');
  yearEl.textContent = randomNumberBetween(1992,1999); 
}

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
