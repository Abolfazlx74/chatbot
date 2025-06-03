const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const chatPart = document.querySelector(".chat-part");

function addUserMessage(message) {
    const container = document.createElement('div');
    container.classList.add("user-message-container");

    const profile = document.createElement('img');
    profile.src = "chatbot-pictures/user.svg";
    profile.classList.add("user-profile");

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
    profile.src = "chatbot-pictures/bot.svg";
    profile.classList.add("bot-profile");

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
