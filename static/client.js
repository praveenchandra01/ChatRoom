const socket = io()
let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');
let bottom = document.querySelector('.bottom');

do{
   name = prompt('Enter your name :');
} while(!name)

socket.emit('user',name)
socket.on("user-joined",name => {
    appendUser(name)
})

textarea.addEventListener('keyup',(e)=>{
    if (e.key === "Enter"){
        sendMessage(e.target.value)
    }
})
bottom.addEventListener('submit',(e)=>{
        e.preventDefault()
        sendMessage(textarea.value)
    
})

function sendMessage(message){
    let msg = {
    user: name,
    message :message.trim()   
    } 
    //Append
    appendMessage(msg,"outgoing")
    textarea.value=''
    scrollToBottom()

    //Send to server
    socket.emit('event',msg)

}

function appendMessage(msg,className){
    let mainDiv = document.createElement('div');
    mainDiv.classList.add(className,'message')

    let markup = `<h4>${msg.user}</h4>
                  <p>${msg.message}</p>`
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv)    
}
function appendUser(name){
    let userDiv = document.createElement('div');
    userDiv.classList.add('join')
    let markup = `<p>${name} joined the chat</p>`
    userDiv.innerHTML = markup;
    messageArea.appendChild(userDiv)  
    scrollToBottom()  
}
function removeUser(name){
    let userDiv = document.createElement('div');
    userDiv.classList.add('join')
    let markup = `<p>${name} left the chat</p>`
    userDiv.innerHTML = markup;
    messageArea.appendChild(userDiv)    
    scrollToBottom()
}

//Recieve message
socket.on('event',(msg)=>{
    appendMessage(msg,'incoming')
    scrollToBottom()
})

socket.on('user',(name)=>{
    appendUser(name)
})

socket.on('left',(name)=>{
    removeUser(name)
})
function scrollToBottom(){
    messageArea.scrollTop = messageArea.scrollHeight
};