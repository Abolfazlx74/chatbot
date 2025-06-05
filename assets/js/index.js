const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const chatPart = document.querySelector(".chat-part");
const darkModeButton = document.getElementById('dark-mode-button');
const sendButton = document.getElementById('send-button');

const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
    document.body.classList.add('dark-mode');
    document.querySelectorAll(".dark-mode svg")
}

function setProfileImagesForMode(isDark) {
    const userProfiles = document.querySelectorAll('.user-profile');
    const botProfiles = document.querySelectorAll('.bot-profile');
    userProfiles.forEach(img => {
        img.src = isDark ? 'assets/images/user-dark.svg' : 'assets/images/user.svg';
    });
    botProfiles.forEach(img => {
        img.src = isDark ? 'assets/images/bot-dark.svg' : 'assets/images/bot.svg';
    });
}

setProfileImagesForMode(isDarkMode);

darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    setProfileImagesForMode(isDarkMode);
});

function addUserMessage(message) {
    const container = document.createElement('div');
    container.classList.add("user-message-container");

    const profile = document.createElement('img');
    profile.classList.add("user-profile");
    profile.src = document.body.classList.contains('dark-mode') ? "assets/images/user-dark.svg" : "assets/images/user.svg";

    const messageElement = document.createElement('div');
    messageElement.classList.add('user-message');
    messageElement.textContent = message;

    container.appendChild(profile);
    container.appendChild(messageElement);
    chatMessages.appendChild(container);

    scrollToBottom();
}

function addBotMessage(message) {
    const container = document.createElement('div');
    container.classList.add("bot-message-container");

    const profile = document.createElement('img');
    profile.classList.add("bot-profile");
    profile.src = document.body.classList.contains('dark-mode') ? "assets/images/bot-dark.svg" : "assets/images/bot.svg";

    const messageElement = document.createElement('div');
    messageElement.classList.add('bot-message');

    container.appendChild(profile);
    container.appendChild(messageElement);
    chatMessages.appendChild(container);

    typeMessage(messageElement, message, 20);
}

function typeMessage(element, text, speed = 20) {
    const words = text.split(' ');
    let i = 0;
    element.textContent = '';
    const interval = setInterval(() => {
        if (i < words.length) {
            element.textContent += (i === 0 ? '' : ' ') + words[i];
            i++;
            scrollToBottom();
        } else {
            clearInterval(interval);
            scrollToBottom();
        }
    }, speed);
}

function scrollToBottom() {
    chatPart.scrollTop = chatPart.scrollHeight;
}

function sendMessage(message) {
    addUserMessage(message);
    userInput.value = '';
    fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => addBotMessage(data.reply))
    .catch(() => addBotMessage("Error communicating with the server!"));
}


userInput.addEventListener('keypress', function(event) {
    const message = event.target.value.trim();
    if (event.key === 'Enter' && message !== "") {
        sendMessage(message)
    }
});

sendButton.addEventListener('click', function() {
    const message = userInput.value.trim();
    sendMessage(message)
});
