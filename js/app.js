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

    // in case player click on the icon (child element of card) than the card
    if (target.tagName == 'LI') {
        // prevent player click again on matched card
        // show card if the card is not matched
        if (!target.classList.contains('match')) {
            let indexOfCurrentCard = [...target.parentNode.children].indexOf(target);
            showCard(target, indexOfCurrentCard);
        }
        
    } else if (target.tagName == 'I') {
        target = target.parentElement;
        if (!target.classList.contains('match')) {
            let indexOfCurrentCard = [...target.parentNode.children].indexOf(target);
            showCard(target, indexOfCurrentCard);
        }
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
function showCard(card, indexOfCurrentCard) {
    // reveal the individual card
    card.classList.add('show', 'open');
    // target icon element
    let icon = card.querySelector('i');

    // store current card info into object and then push to openCard array
    let currentCard ={className:icon.className, index:indexOfCurrentCard};
    openCard.push(currentCard);
    
    if (openCard.length == 2) {
        if ( (openCard[0].index != openCard[1].index)) {
             matchCheck(openCard);
             openCard = [];
        }else{
            notMatched();
            openCard=[];
        }
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
    openCard = [];
}
function notMatched() {
      setTimeout(function () {
          swapClass('open', 'card error show');
          setTimeout(() => {
              swapClass('error', 'card');
          }, 400);
      }, 400);
      openCard = [];
}
function matchCheck(array) {
    if (array[0].className != array[1].className) {
        notMatched();
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