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
let timer;
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
        case 5:
            // decrease 1 star if there is more than 5 unmatched moves
            stars[2].classList.replace('fa-star', 'fa-star-o');
            starsCount--;
            break;
        case 10:
            stars[1].classList.replace('fa-star', 'fa-star-o');
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
    let currentCard = {
        className: icon.className,
        index: indexOfCurrentCard
    };
    openCard.push(currentCard);

    // call timerDisplay on when the first card is fliped
    if (openCard.length == 1 && movesCount == 0) {
        timerDisplay();
    } else if (openCard.length == 2) {
        if ((openCard[0].index != openCard[1].index)) {
            matchCheck(openCard);
            openCard = [];
        } else {
            notMatched();
            openCard = [];
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
    movesHandler();
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
    // get timer display and split into chars 
    const timeFinish = document.querySelector('#timer span').innerText.split('');
    let hrs, mins, secs;
    // format timer units string
    if (timeFinish[0] == 0 && timeFinish[1] <= 1) {
        hrs = timeFinish[1] + ' hour ';
    } else if (timeFinish[0] == 0) {
        hrs = timeFinish[1] + ' hours ';
    } else {
        hrs = timeFinish[0] + timeFinish[1] + ' hours ';
    }

    if (timeFinish[3] == 0 && timeFinish[4] <= 1) {
        mins = timeFinish[4] + ' min ';
    } else if (timeFinish[3] == 0) {
        mins = timeFinish[4] + ' mins ';
    } else {
        mins = timeFinish[3] + timeFinish[4] + ' mins ';
    }

    if (timeFinish[6] == 0 && timeFinish[7] <= 1) {
        secs = timeFinish[7] + ' second ';
    } else if (timeFinish[6] == 0) {
        secs = timeFinish[7] + ' seconds ';
    } else {
        secs = timeFinish[6] + timeFinish[7] + ' seconds ';
    }

    let msgTemplate = `<div class="container win"> 
                        <header>
                            <h1> Congratulation! You Won! </h1>
                            <h2> you finished in ${hrs + mins + secs} <h2> 
                            <h3> With ${movesCount} Moves and ${starsCount} Stars.</h3>                   
                            <button onclick="restartGame()">Play Again</button>
                        </header>
                    </div>
                       `;
    container.parentElement.appendChild(document.createElement('div')).innerHTML = msgTemplate;

}

// restart
function restartGame() {
    clearInterval(timer);
    document.querySelector('#timer span').innerText = '00:00:00';
    movesCount = 0;
    matchCount = 0;
    moves.innerText = 0;
    starsCount = 3;
    deck.innerHTML = "";
    openCard = [];
    createLayout();

    // show deck and hide winning board
    swapClass('hide.container', 'container');
    swapClass('win.container', 'hide container');
    // reset stars
    swapClass('fa-star-o', 'fa fa-star');
    // remove the win container div when player hit restart
    if (document.querySelector('.container').classList.contains('hide')) {
        document.querySelector('.hide.container').remove();
    }


}
document.querySelector('.restart').addEventListener('click', function () {
    let restart = confirm('Are you sure you want to restart?');
    if (restart == true) {
        restartGame();
    }
});


// Timer for player
function timerDisplay() {
    const gameStart = new Date().getTime();
    timer = setInterval(function () {
        let currentTime = new Date().getTime();
        let currentTimePlay = currentTime - gameStart;
        let hrs = Math.floor((currentTimePlay % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let mins = Math.floor((currentTimePlay % (1000 * 60 * 60)) / (1000 * 60));
        let secs = Math.floor((currentTimePlay % (1000 * 60)) / (1000));
        //formating the second value
        if (secs < 10) {
            secs = '0' + secs;
        }
        if (mins < 10) {
            mins = '0' + mins;
        }
        if (hrs < 10) {
            hrs = '0' + hrs;
        }
        document.querySelector('#timer span').innerText = hrs + ':' + mins + ":" + secs;
    }, 500);
}