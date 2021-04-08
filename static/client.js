const socket = io()
let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');
let bottom = document.querySelector('.bottom');

do{
   name = prompt('Enter your name :');
} while(!name)

// First event called from here
socket.emit('user',name)
//Recive event
socket.on("user-joined",name => {
    appendUser(name)
    scrollToBottom()
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
    if (msg.message !== ""){
    appendMessage(msg,"outgoing")
    textarea.value=''
    scrollToBottom()
    }
    //Send to server
    if (msg.message !== ""){
    socket.emit('s_event',msg) //Msg send event
    }
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
}
function removeUser(name){
    let userDiv = document.createElement('div');
    userDiv.classList.add('join')
    let markup = `<p>${name} left the chat</p>`
    userDiv.innerHTML = markup;
    messageArea.appendChild(userDiv)    
    
}

//Recieve message
socket.on('b_event',(msg)=>{ //broadcast event accept here
    appendMessage(msg,'incoming')
    scrollToBottom()
})
socket.on('left',(name)=>{
    if(name !== null){
    removeUser(name)
    scrollToBottom()
    }
})
function scrollToBottom(){
    messageArea.scrollTop = messageArea.scrollHeight
};

