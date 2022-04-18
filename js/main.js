//Connecting API
function doGet(url) {
    let request = new XMLHttpRequest()
    request.open('GET', url, false)
    request.send()
    return request.responseText
}

//Choose random word from API
function pickWord() {
    const wordObject = JSON.parse(doGet('https://api.dicionario-aberto.net/random'))
    return wordObject.word
}

//Loading page
window.addEventListener('load', function(){

//Choose only words with less than 6 letters
let finalWord = (function aa() {
    let preloader = document.getElementById('loading')
    let palavras = pickWord()

    while(parseInt(palavras.length) > 6) {
        palavras = pickWord()
        //preloader.style.display = 'flex'
        console.log(palavras)
    }

    //Loading screen
    
        preloader.classList.add('fade-out')
    
        setTimeout (function(){
            preloader.style.display = 'none'
        }, 500)

    return palavras

}())


console.log(`A palavra final é ${finalWord}`)

//Remove special alphanumeric characters
function specialAlphanumeric(specialChar){
    let noSpecialChar = specialChar.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return noSpecialChar
}

//Remove non alphanumeric characters
function specialNonAlphanumeric(specialChar){
    let noSpecialChar = specialChar.replace(/[!@#$%&*()_|+-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
    return noSpecialChar
}

//Removing special characters from the word
let chosenWordView = specialNonAlphanumeric(finalWord) 
let chosenWordSpecial = specialAlphanumeric(finalWord)
let chosenWordFinal = specialNonAlphanumeric(chosenWordSpecial)

//Spliting word
const splitWordSpecial = chosenWordView.split('')
const splitWord = chosenWordFinal.split('')



// -------- DOM -------- //


//Declaring variables 1
const keyboard = document.getElementById('keyboard')
const wordDiv = document.getElementById('word')
let characters = ['q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m']
const btnSwitch = document.getElementById('switch')
const btwSwitchCircle = document.getElementById('switch-circle')


//Switch light and dark mode
btnSwitch.addEventListener('click', function() {
    btwSwitchCircle.classList.toggle('move-switch')

    if (!btwSwitchCircle.classList.contains('move-switch')) {
        document.body.style.backgroundColor = '#D5DCF2'
        btnSwitch.style.backgroundColor = '#D5DCF2'
        finishedMessage.style.color = '#857b9b'
        btwSwitchCircle.style.backgroundPositionX = '7px'
    } else {
        document.body.style.backgroundColor = '#393249'
        btnSwitch.style.backgroundColor = '#393249'
        finishedMessage.style.color = '#e4e9f8'
        btwSwitchCircle.style.backgroundPositionX = '-22px'
    }
})


//Create keyboard
function createKeys(key) {
    let newKey = document.createElement('div')
    newKey.classList.add('keyboard-letter')
    newKey.innerHTML = key

    keyboard.appendChild(newKey)
}

const createKeyboard = (function() {
    for (let i of characters) {
        createKeys(i)
    }
}())

//Create word spaces
const placeWord = (function() {

    for(let i = 0; i < splitWord.length; i++) {
        let newLetter = document.createElement('div')
        newLetter.classList.add('dscv-letter')

        wordDiv.appendChild(newLetter)
    }
}())

//Declaring variables 2
const keyButton = document.querySelectorAll('.keyboard-letter')
const letterSpace = document.querySelectorAll('.dscv-letter')
const finishedMessage = document.getElementById('finished-message')
const btnRefresh = document.getElementById('refresh')

//Keyboard click function
for (let i = 0; i < keyButton.length; i++) {
    keyButton[i].addEventListener('click', function() {
        let keyValue = this.innerHTML

        discoverKeyPlace(keyValue, keyButton[i])
    })
}

function discoverKeyPlace (key, keyBtn) {
    for (let i = 0; i < letterSpace.length; i++) {

        for (let index = 0; index < splitWord.length; index++) {
            if (key !== splitWord[index]) {
                keyBtn.classList.add('wrong')
            } else {
                letterSpace[index].innerHTML = splitWordSpecial[index];
                letterSpace[index].classList.add('right-letter')
                keyBtn.classList.add('right')
            }
        }
    }

    //Finished game verifier
    let test = 0

    for (let i = 0; i < letterSpace.length; i++) {
        if (letterSpace[i].innerHTML.length !== 0) {
            test++
        } else {
            test = 0
        }
    
        if (test === letterSpace.length) {
            
                for (let index = 0; index < letterSpace.length; index++) {
                    setInterval(() => {
                        letterSpace[index].classList.add('anim')
                    }, 100*index)
                }

            console.log('Parabéns você conseguiu!')
            finishedMessage.style.display = 'block'
            finishedMessage.classList.add('anim')
            btnRefresh.classList.add('anim-btn')

            for (let keyIndex = 0; keyIndex < keyButton.length; keyIndex++) {
                if (keyButton[keyIndex].classList.contains('right')) {
                    keyButton[keyIndex].classList.add('anim-key')
                } else {
                    keyButton[keyIndex].classList.add('wrong')
                }
            }

        }

    }

}


//Refresh button
const refreshBtn = document.getElementById('refresh')

refreshBtn.addEventListener('click', function(){
    location.reload()
})

})