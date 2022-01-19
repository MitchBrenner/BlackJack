// localStorage.clear()
let startChips 
if(localStorage.getItem("chips")){
    startChips = localStorage.getItem("chips")
    console.log("WORKING")
}else{
    startChips = 100
}

let player = {
    name: "Jade",
    chips: parseInt(startChips)
}

localStorage.setItem("chips",player.chips)

// array - ordered list of items
let cards = []
let hasBlackJack = false
let isAlive = false
let message = ""
let playerHold = false
let messageEl = document.getElementById("message-el")
let dealerEl = document.querySelector(".dealer-el")
let dealerSumEl = document.querySelector(".dealer-sum")
let dealerCards = []
let dealerSum = 0
let sumEl = document.querySelector(".sum-el")
let cardsEl = document.querySelector(".cards-el")
let playerEl = document.querySelector(".player-el")
let playerBet = 0
let betMessage = document.querySelector(".bet-message");
let profit = 0
let hasWon = false

// BETTING VARS //
let betEl = document.querySelector(".bet-el")
// let playerBet = betEl.value 
betEl.max = player.chips


playerEl.textContent = player.name + ": $" + player.chips

//function to get a random card
//function declaration have scope throughout entire code
function getRandomCard(){
    let randomCard = Math.floor(Math.random() * 13) + 1
    if(randomCard === 1){
        return 11
    }else if(randomCard > 10){
        return 10
    }else{
        return randomCard
    }
}

function startGame(){


    //Resets dealers cards
    dealerEl.textContent = "Dealer: "
    dealerSumEl.textContent = "Dealer Sum: "
    dealerSum = 0
    dealerCards = []
    
    hasBlackJack = false
    isAlive = true
    playerHold = false
    hasWon = false


    let firstCard =  getRandomCard() 
    let secondCard = getRandomCard() 
    cards = [firstCard, secondCard]
    sum = firstCard + secondCard

    playerBet = betEl.value 

    if(playerBet > player.chips){
        alert("Bet is too high")
        return
    }

    // displayBet()


    console.log(player.chips)
    console.log("bet: " + playerBet)

    renderGame()
}

function renderGame(){

    betEl.disabled = true

    // updateChips()

    sumEl.textContent = "Sum: " + sum

    cardsEl.textContent = "Cards: "
    //loop through to print out all of cards
    for(let i = 0; i < cards.length; i++){
        cardsEl.textContent += cards[i] + " "
    }

    if(sum < 21){
        message = "Do you want to draw a new card?"
    }else if(sum === 21){
        hasBlackJack = true
        dealer()
    }else {
        message = "You're out of the game!"
        isAlive = false
        betEl.disabled = false
        betEl.max = player.chips
        profit = playerBet * -1
        player.chips += profit
        updateChips()
        displayBet()
        localStorage.setItem("chips",player.chips)
    }

    messageEl.textContent = message
}

function newCard(){
    if(isAlive && !hasBlackJack && playerHold === false){
        console.log("NEW CARD")
        let newCard = getRandomCard()
        cards.push(newCard)
        sum += newCard
        renderGame()
    }
}



function dealer(){
    
    if(isAlive &&  !playerHold){
        playerHold = true
        dealerSum = 0
        let dealerFirst = getRandomCard()
        let dealerSecond = getRandomCard()
        dealerSum = dealerSum + dealerFirst + dealerSecond
        
        dealerCards = [dealerFirst, dealerSecond]
    
        dealerEl.textContent = "Dealer: "
        for(let i = 0; i < dealerCards.length; i++){
            dealerEl.textContent += dealerCards[i] + " "
        }
        dealerSumEl.textContent = "Sum: " + dealerSum
    
        while(dealerSum < sum && dealerSum < 21){
            dealerNewCard()
        }
        checkWinner()

        betEl.disabled = false
    }
}

function dealerNewCard(){
    
    console.log("NEW CARD")
    let newCard = getRandomCard()
    dealerCards.push(newCard)
    dealerSum += newCard
    dealerEl.textContent =  dealerEl.textContent + " " + newCard
    dealerSumEl.textContent = "Sum: " + dealerSum
    
}

function checkWinner(){
    let dealerBust = false
    let userBust = false 
    let dealerWin = false
    let userWin  = false
    let tie = false
    

    if(dealerSum > 21) dealerBust = true
    if(sum > 21) userBust = true

    if(sum < 22 && dealerSum < sum || dealerBust){
        message = "YOU WON!!!!"
        userWin = true
        hasWon = true
    }else if(sum < dealerSum && dealerSum < 22){
        message = "You lost..."
        dealerWin = true
    }else {
        message = "It's a tie"
        tie = true
    }
    messageEl.textContent = message

    if(userWin){
        profit = playerBet
        player.chips = player.chips + (profit * 1)
    } else if(tie) {
        player.chips = player.chips 
        profit = 0
    }else{
        profit = playerBet * -1
        player.chips = player.chips + (profit * 1)
    }

    updateChips()
    displayBet()
    localStorage.setItem("chips",player.chips)
}

function updateChips(){
    playerEl.textContent = player.name + ": $" + player.chips
    betEl.max = player.chips
    betEl.value = 0
}

function displayBet(){

    let sign = ""
    let color = "white"

    if(profit > 0){
        sign = "+"
        color = "greenyellow"
    }else if(profit <  0){
        sign = "-"
        color = "red"
        profit = profit * -1
    }

    betMessage.style.color = color
    betMessage.textContent = sign + "$" + profit
    console.log(playerBet)


    betMessage.opacity = 1
    setTimeout(function(){
        betMessage.textContent = ""
    }, 1500)


}


function resetMoney(){
    player.chips = 100
    updateChips()
    localStorage.setItem("chips",player.chips)
}