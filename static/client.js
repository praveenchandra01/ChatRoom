const socket = io()
let n;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');
do{
   n = prompt('Enter your name :');
} while(!n)

textarea.addEventListener('keyup',(e)=>{
    if (e.key === "Enter"){
        sendMessage(e.target.value)
    }
})

function sendMessage(message){
    let msg = {
    user: n,
    message :message.trim()   
    } 
    //Append
    appendMessage(msg,"outgoing")
    textarea.value=''
    scrollToBottom()

    //Send to server
    socket.emit('event',msg)

}

function appendMessage(msg,type){
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className,'message')

    let markup = `<h4>${msg.user}</h4>
                <p>${msg.message}</p>`
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv)   
}

//Recieve message
socket.on('event',(msg)=>{
    // console.log(msg)
    appendMessage(msg,'incoming')
    scrollToBottom()

})

function scrollToBottom(){
    messageArea.scrollTop = messageArea.scrollHeight
}