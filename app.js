const randomWordLink="https://random-word-api.vercel.app/api?words=1",
usedLetters={},
MAX_NUMBER_OF_GUESSES=6;
let currentWord,
guessesLeft,
wordLength=0;
function start(){
    fetch(randomWordLink)
    .then(res=>res.json())
    .then(data=>{
        currentWord=data[0];
        setNewWord();
    })
    guessesLeft=MAX_NUMBER_OF_GUESSES;
    updateGueesesDisplay();
}
function updateGueesesDisplay(){
    document.getElementById("numberOfGuesses").innerHTML=guessesLeft;
}
function clearCheckedLetters(){
    for(const key in usedLetters){
        delete usedLetters[key];
        updateCheckedLetters();
    }

}
function setNewWord(){
    const wordContainer=document.getElementById("word");
    for(let i=0;i<currentWord.length;i++){
        const letterSpan=document.createElement('span');
        letterSpan.innerHTML="_";
        letterSpan.setAttribute("value",currentWord[i]);
        letterSpan.classList.add('char');
        wordContainer.appendChild(letterSpan);
    }
}
function handleKeyDown(e){
    e.preventDefault();
    if(e.key==="Enter" || e.keyCode===13){
        submitGuess();
    }else if(e.key.match(/[a-zA-Z]/)){
        document.getElementById("input").value=e.key;
    }
}
function submitGuess(){
    const value=document.getElementById("input").value.toLowerCase();
    if(value.length===1 && value.match(/[a-zA-Z]/)){
        if(!usedLetters[value]){
            usedLetters[value]=true;
            checkEntry(value);
            updateCheckedLetters();
        }else{
            alert(`already guessed ${value}`)
        }
        
        clearInput();
    }else{
        alert("please enter a single letter");
        clearInput();
    }
}
function init(){
    document.getElementById('submit').addEventListener('click',()=>{
        submitGuess();
    })
    document.addEventListener("keydown",handleKeyDown)
    document.getElementById('new').addEventListener('click',newGame)
    start();
}

function checkEntry(value){
    if(currentWord.indexOf(value)>-1){
        const charSpans=document.querySelectorAll(`span.char[value=${value}]`)
        charSpans.forEach(span=>{
            span.innerHTML=value;
            wordLength++;
        });
        if(wordLength===currentWord.length){
            finishGame('win')
        }
    }else{
        guessesLeft--;
        updateGueesesDisplay();
        if(guessesLeft===0){
            finishGame('lose')
        }
    }
}
function finishGame(state){
    document.getElementById('input').setAttribute("disabled",'true');
    document.removeEventListener('keydown',handleKeyDown);
    document.querySelectorAll("#word span").forEach(span=>span.classList.add(state))
    if(state==='lose'){
        document.querySelectorAll('span.char').forEach(span=>span.innerHTML=span.getAttribute('value'))
    }

}
function clearInput(){
    const input=document.getElementById("input");
    input.value="";
    input.focus();
}
function updateCheckedLetters(){
    const usedContainer=document.getElementById('usedLetters');
    usedContainer.innerHTML='';
    Object.keys(usedLetters).forEach(char=>{
        const usedChar= document.createElement('span');
        usedChar.innerHTML=char;
        usedContainer.appendChild(usedChar)
    })
}
function newGame(){
    document.getElementById('input').setAttribute("disabled",'false');
    document.querySelectorAll(".win").forEach(span=>span.classList.remove("win"));
    document.querySelectorAll(".lose").forEach(span=>span.classList.remove("lose"));
    document.addEventListener("keydown",handleKeyDown);
    document.getElementById("word").innerHTML='';
    clearCheckedLetters();
    start();
}
init();