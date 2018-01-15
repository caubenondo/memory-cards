/*
 * Create a list that holds all of your cards
 */
let cardIconsList = ['fa-camera', 'fa-bug', 'fa-bomb', 'fa-bolt', 'fa-diamond', 'fa-bell', 'fa-anchor', 'fa-area-chart'];
// double itself
cardIconsList = cardIconsList.concat(cardIconsList);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// temporary variables
let openCard = [];
let movesCount = 0;
let moves = document.querySelector('.moves');
let matchCount = 0;
let starsCount = 3;

// selecting the deck
let deck = document.querySelector('.deck');


// create layout
function createLayout() {
    let shuffledCardList = shuffle(cardIconsList);
    for (const card of shuffledCardList) {
        let node = document.createElement('li');
        node.className = 'card';
        let icon = document.createElement('i');
        icon.className = 'fa ' + card;
        node.appendChild(icon);
        deck.appendChild(node);
    }
}
createLayout();




// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */



// Flip the card
deck.addEventListener('click', function (e) {
    e.preventDefault();
    movesHandler();

    let target = e.target;
    if (target.tagName == 'LI') {
        showCard(target);
    } else if (target.tagName == 'I') {
        showCard(target.parentElement);
    }

});

function movesHandler() {
    movesCount++;
    moves.innerText = String(movesCount);
    let stars = document.querySelectorAll('.fa-star');
    switch (movesCount) {
        case 16:
            stars[2].classList.replace('fa-star', 'fa-star-o');
            starsCount--;
            break;
        case 26:
            stars[1].classList.replace('fa-star', 'fa-star-o');
            starsCount--;
            break;
        case 36:
            stars[0].classList.replace('fa-star', 'fa-star-o');
            starsCount--;
            break;
        default:
            break;
    }
}

// show cards to the table
function showCard(card) {
    card.classList.add('show', 'open');
    let icon = card.querySelector('i');
    openCard.push(icon.className);
    if (openCard.length == 2) {
        matchCheck(openCard);
        openCard = [];
    }
}

// select all elemnt that has specific class and then replace it with a define classList
function swapClass(target, result) {
    let elements = document.querySelectorAll('.' + target);
    for (const key in elements) {
        elements[key].className = result;
    }

}

function matched() {
    let elements = document.querySelectorAll('.open');
    for (const key in elements) {
        elements[key].className = "card match";
    }
}

function matchCheck(array) {
    if (array[0] != array[1]) {
        setTimeout(function () {
            swapClass('open', 'card error show');
            setTimeout(() => {
                swapClass('error', 'card');
            }, 400);
        }, 400);
    } else {
        matched();
        matchCount++;
        if (matchCount == 8) {
            setTimeout(() => {
                finalMessage();
            }, 200);
        }
    }
}


//  win Message
function finalMessage() {
    let container = document.querySelector('.container');
    container.classList.add('hide');
    let msgTemplate = `<div class="container win"> 
                            <header><h1> Congratulation! You Won! </h1></header>
                       <p> With ${movesCount} Moves and ${starsCount} Stars.</p> 
                        <button onclick="restartGame()">Play Again</button>
                    </div>
                       `;
    container.parentElement.appendChild(document.createElement('div')).innerHTML = msgTemplate;

}

// restart
function restartGame() {
    movesCount = 0;
    matchCount = 0;
    moves.innerText = 0;
    starsCount = 3;
    deck.innerHTML = "";
    createLayout();

    // show deck and hide winning board
    swapClass('hide.container', 'container');
    swapClass('win.container', 'hide container');
    // reset stars
    swapClass('fa-star-o', 'fa fa-star');
    // remove the win container div when player hit restart
    document.querySelector('.hide.container').remove();
}
document.querySelector('.restart').addEventListener('click', function () {
    let restart = confirm('Are you sure you want to restart?');
    if (restart == true) {
        restartGame();
    }
});