const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const chatPart = document.querySelector(".chat-part");
const darkModeButton = document.getElementById('dark-mode-button');

const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
    document.body.classList.add('dark-mode');
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

    typeMessage(messageElement, message, 15);
}

function typeMessage(element, text, speed = 15) {
    let i = 0;
    const interval = setInterval(() => {
        element.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            scrollToBottom();
        }
    }, speed);
}

function scrollToBottom() {
    chatPart.scrollTop = chatPart.scrollHeight;
}

userInput.addEventListener('keypress', function(event) {
    const message = event.target.value.trim();
    if (event.key === 'Enter' && message !== "") {
        addUserMessage(message);
        userInput.value = '';
        setTimeout(() => addBotMessage("سلام! چطور می‌توانم به شما کمک کنم؟"), 500);
    }
});
