let BJgame = {
    you: { scoreSpan: '#yourscore', div: '#your-box', score: 0, cards: [] },
    dealer: { scoreSpan: '#dealerscore', div: '#dealer-box', score: 0, cards: [] },
  
    cards: [
      '2C',
      '3C',
      '4C',
      '5C',
      '6C',
      '7C',
      '8C',
      '9C',
      '10C',
      'KC',
      'QC',
      'JC',
      'AC',
      '2D',
      '3D',
      '4D',
      '5D',
      '6D',
      '7D',
      '8D',
      '9D',
      '10D',
      'KD',
      'QD',
      'JD',
      'AD',
      '2H',
      '3H',
      '4H',
      '5H',
      '6H',
      '7H',
      '8H',
      '9H',
      '10H',
      'KH',
      'QH',
      'JH',
      'AH',
      '2S',
      '3S',
      '4S',
      '5S',
      '6S',
      '7S',
      '8S',
      '9S',
      '10S',
      'KS',
      'QS',
      'JS',
      'AS',
    ],
  
    cardsmap: {
      '2C': 2,
      '3C': 3,
      '4C': 4,
      '5C': 5,
      '6C': 6,
      '7C': 7,
      '8C': 8,
      '9C': 9,
      '10C': 10,
      KC: 10,
      QC: 10,
      JC: 10,
      AC: [1, 11],
      '2D': 2,
      '3D': 3,
      '4D': 4,
      '5D': 5,
      '6D': 6,
      '7D': 7,
      '8D': 8,
      '9D': 9,
      '10D': 10,
      KD: 10,
      QD: 10,
      JD: 10,
      AD: [1, 11],
      '2H': 2,
      '3H': 3,
      '4H': 4,
      '5H': 5,
      '6H': 6,
      '7H': 7,
      '8H': 8,
      '9H': 9,
      '10H': 10,
      KH: 10,
      QH: 10,
      JH: 10,
      AH: [1, 11],
      '2S': 2,
      '3S': 3,
      '4S': 4,
      '5S': 5,
      '6S': 6,
      '7S': 7,
      '8S': 8,
      '9S': 9,
      '10S': 10,
      KS: 10,
      QS: 10,
      JS: 10,
      AS: [1, 11],
    },
  };
  const You = BJgame['you'];
  const Dealer = BJgame['dealer'];
  
  function drawCard(activeplayer) {
    const randomNumber = Math.floor(Math.random() * BJgame['cards'].length);
    const currentCard = BJgame['cards'].splice(randomNumber, 1)[0]; 
    let card = document.createElement('img');
    card.src = `./cards/${currentCard}.png`;
    document.querySelector(activeplayer['div']).appendChild(card);

    updateScore(currentCard, activeplayer);
    activeplayer.cards.push(currentCard);
    showScore(activeplayer);
    if (activeplayer === Dealer && activeplayer.cards.length === 2) {
        removeFaceDownCard();
    }
}
  
  function updateScore(currentcard, activeplayer) {
    if (
      currentcard == 'AC' ||
      currentcard == 'AD' ||
      currentcard == 'AH' ||
      currentcard == 'AS'
    ) {
      if (activeplayer['score'] + BJgame['cardsmap'][currentcard][1] <= 21) {
        activeplayer['score'] += BJgame['cardsmap'][currentcard][1];
      } else {
        activeplayer['score'] += BJgame['cardsmap'][currentcard][0];
      }
    } else {
      activeplayer['score'] += BJgame['cardsmap'][currentcard];
    }
  }
  
  function showScore(activeplayer) {
    if (activeplayer['score'] > 21) {
      document.querySelector(activeplayer['scoreSpan']).textContent = 'BUST!';
      document.querySelector(activeplayer['scoreSpan']).style.color = 'yellow';
    } else {
      document.querySelector(activeplayer['scoreSpan']).textContent =
        activeplayer['score'];
    }
  }

  function findwinner(betAmount) {
    let winner;

    if (You['score'] <= 21) {
        if (Dealer['score'] < You['score'] || Dealer['score'] > 21) {
            winner = You;
        } else if (Dealer['score'] === You['score']) {
            winner = null;
        } else {
            winner = Dealer;
        }
    } else if (You['score'] > 21 && Dealer['score'] <= 21) {
        winner = Dealer;
    }

    console.log("Bet amount:", betAmount);
    console.log("Outcome of the game:", winner);

    if (winner === You) {
        if (hasBlackjack(You)) {   
            betAmount *= 2.5;
        } else {
            betAmount *= 2; 
        }
    } else if (winner === Dealer) {
        betAmount = 0;
    }

    let currentBalance = parseInt(document.getElementById('balanceAmount').textContent);
    let newBalance = currentBalance + betAmount;
    updateBalance(newBalance);

    return winner;
}


function hasBlackjack(player) {
    let hasAce = false;
    let hasTenValueCard = false;
    player['cards'].forEach(card => {
        if (card[0] === 'A') {
            hasAce = true;
            if(card[1] === '1' || card[1] === 'K' || card[1] === 'Q' || card[1] === 'J'){
                hasTenValueCard = true;
            }
        } else if (card[0] === '1' || card[0] === 'K' || card[0] === 'Q' || card[0] === 'J') {
            hasTenValueCard = true;
            if(card[1] === 'A'){
                hasAce = true;
            }
        }
    });
    return hasAce && hasTenValueCard;
}
  document.querySelector('#hit').addEventListener('click', BJhit);
  
  function BJhit() {
    if (You['score'] < 1) {
      alert('Please press deal first!');
    } else {
      if (You['score'] <= 21 && Dealer['score'] <= 21) {
        drawCard(You);
      }
    }
  }  
  

  document.querySelector('#deal').addEventListener('click', BJdeal);
  
  function addFaceDownCard() {
    let card = document.createElement('img');
    card.src = `./cards/gray_back.png`;
    document.querySelector('#dealer-box').appendChild(card);
}

function BJdeal() {
  const betInput = document.getElementById('betInput');
  const betAmount = parseInt(betInput.value);

  if (isNaN(betAmount) || betAmount <= 0) {
    alert('Please enter a valid bet amount.');
    return;
  }

  const currentBalance = parseInt(document.getElementById('balanceAmount').textContent);
  if (betAmount > currentBalance) {
    alert('You do not have enough balance to place this bet.');
    return;
  }

  let yourimg = document.querySelector('#your-box').querySelectorAll('img');
  let dealerimg = document.querySelector('#dealer-box').querySelectorAll('img');

  for (let i = 0; i < yourimg.length; i++) {
    yourimg[i].remove();
  }
  for (let i = 0; i < dealerimg.length; i++) {
    dealerimg[i].remove();
  }

  BJgame['cards'] = [
    '2C',
    '3C',
    '4C',
    '5C',
    '6C',
    '7C',
    '8C',
    '9C',
    '10C',
    'KC',
    'QC',
    'JC',
    'AC',
    '2D',
    '3D',
    '4D',
    '5D',
    '6D',
    '7D',
    '8D',
    '9D',
    '10D',
    'KD',
    'QD',
    'JD',
    'AD',
    '2H',
    '3H',
    '4H',
    '5H',
    '6H',
    '7H',
    '8H',
    '9H',
    '10H',
    'KH',
    'QH',
    'JH',
    'AH',
    '2S',
    '3S',
    '4S',
    '5S',
    '6S',
    '7S',
    '8S',
    '9S',
    '10S',
    'KS',
    'QS',
    'JS',
    'AS',
  ];

  You['score'] = 0;
  Dealer['score'] = 0;
  Dealer['cards'] = []; 

  let newBalance = currentBalance - betAmount;
  updateBalance(newBalance);

  addFaceDownCard(); 
  drawCard(Dealer);
  drawCard(You);
  drawCard(You);
}

  
function removeFaceDownCard() {
    let faceDownCard = document.querySelector('#dealer-box').querySelector('img[src="./cards/gray_back.png"]');
    if (faceDownCard) {
        faceDownCard.remove();
    }
}

  function updateBalance(newBalance) {
    let balanceElement = document.getElementById('balanceAmount');
    console.log('Balance Element:', balanceElement);
    console.log('New Balance:', newBalance);
    if (balanceElement) {
      balanceElement.textContent = newBalance;
    } else {
      console.error('Balance element not found.');
    }
  }
  
  document.querySelector('#stand').addEventListener('click', BJstand);
  
  function BJstand() {
    if (You['score'] === 0) {
      alert('Please press deal first!');
    } else {
      removeFaceDownCard();
      while (Dealer['score'] <= 16) {
        drawCard(Dealer);
      }
      setTimeout(function () {
        let betInput = document.getElementById('betInput');
        let betAmount = parseInt(betInput.value); 
        findwinner(betAmount);
      }, 800);
    }
}


  
