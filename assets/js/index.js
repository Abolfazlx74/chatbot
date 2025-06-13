const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const chatPart = document.querySelector('.chat-part');
const darkModeButton = document.getElementById('dark-mode-button');
const sendButton = document.getElementById('send-button');
const clearButton = document.getElementById('clear-button');
const kebabMenuButton = document.getElementById('kebab-menu-button');
const kebabMenuDropdown = document.getElementById('kebab-menu-dropdown');
const settingsContainer = document.getElementById('settings-container');
const tabsContainer = document.querySelector(".tabs") 
const tabs = document.querySelectorAll(".tab")

let autoScroll = true;

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

    if(autoScroll){
        scrollToBottom();
    }
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

    typeMessage(messageElement, message, 5);
}

function typeMessage(element, text, speed = 5) {
    const words = text.split(' ');
    let i = 0;
    element.textContent = '';
    const interval = setInterval(() => {
        if (i < words.length) {
            element.textContent += (i === 0 ? '' : ' ') + words[i];
            i++;
            if(autoScroll){
                scrollToBottom();
            }
        } else {
            clearInterval(interval);
            if(autoScroll){
                scrollToBottom();
            }
        }
    }, speed);
}

function scrollToBottom() {
    chatPart.scrollTop = chatPart.scrollHeight;
}

let isWaitingForResponse = false;

function showTypingIndicator() {
    const container = document.createElement('div');
    container.classList.add("bot-message-container");
    container.id = "typing-indicator-container";

    const profile = document.createElement('img');
    profile.classList.add("bot-profile");
    profile.src = document.body.classList.contains('dark-mode') ? "assets/images/bot-dark.svg" : "assets/images/bot.svg";

    const typing = document.createElement('div');
    typing.classList.add('typing-indicator');
    typing.innerHTML = '<span class="typing-dot">.</span><span class="typing-dot">.</span><span class="typing-dot">.</span>';

    container.appendChild(profile);
    container.appendChild(typing);
    chatMessages.appendChild(container);

    if(autoScroll){
        scrollToBottom();
    }
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator-container');
    if (indicator) {
        indicator.remove();
    }
}

function setInputEnabled(enabled) {
    userInput.disabled = !enabled;
    sendButton.disabled = !enabled;
    if (enabled) {
        userInput.focus();
    }
}

function sendMessage(message) {
    if (isWaitingForResponse) return;
    addUserMessage(message);
    userInput.value = '';
    setInputEnabled(false);
    isWaitingForResponse = true;
    showTypingIndicator();

    fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
        removeTypingIndicator();
        addBotMessage(data.reply);
    })
    .catch(() => {
        removeTypingIndicator();
        addBotMessage("Error communicating with the server!");
    })
    .finally(() => {
        setInputEnabled(true);
        isWaitingForResponse = false;
    });
}

function classListRemover(elements, className) {
    elements.forEach(e => e.classList.remove(className));
}

function elementRemover(className){
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(el => el.remove());
}

userInput.addEventListener('keypress', function(event) {
    const message = event.target.value.trim();
    if (event.key === 'Enter' && message !== "" && !isWaitingForResponse) {
        sendMessage(message)
    }
});

sendButton.addEventListener('click', function() {
    const message = userInput.value.trim();
    if (message !== "" && !isWaitingForResponse) {
        sendMessage(message)
    }
});

clearButton.addEventListener('click', function() {
    chatMessages.innerHTML = '';
});

kebabMenuButton.addEventListener('click', function(event) {
    event.stopPropagation();
    if (kebabMenuDropdown.style.display === 'none' || kebabMenuDropdown.style.display === '') {
        kebabMenuDropdown.style.display = 'flex';
    } else {
        kebabMenuDropdown.style.display = 'none';
    }
});

document.addEventListener('click', function(event) {
    if (kebabMenuDropdown.style.display === 'flex' && !kebabMenuDropdown.contains(event.target) && event.target !== kebabMenuButton) {
        kebabMenuDropdown.style.display = 'none';
    }
});

document.getElementById('menu-settings').addEventListener('click', function() {
    kebabMenuDropdown.style.display = 'none';
    settingsContainer.style.display = "flex";
});

document.getElementById('close-settings').addEventListener('click', function() {
    settingsContainer.style.display = "none";
});

document.getElementById('menu-attach').addEventListener('click', function() {
    kebabMenuDropdown.style.display = 'none';
});

document.getElementById('menu-new-chat').addEventListener('click', function() {
    kebabMenuDropdown.style.display = 'none';
});

function setAutoScroll(){
    autoScroll = !autoScroll;
}

function enableMemory(){
    console.log("memory enabled")
}

function checkBoxCreate(tabName){
    const content = settingsElements[tabName];
    elementRemover("op-element");
    Object.values(content).forEach(el=>{
        const label = document.createElement("label");
        label.classList.add("op-element");
        label.innerText = `${el.text}`;
        const checkbox = document.createElement("input");
        checkbox.style.marginLeft = "5px";
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.addEventListener("change", () => {
              el.func();
        });
        label.style.display = "flex";
        label.appendChild(checkbox);
        document.querySelector(".settings-box").appendChild(label);
    })
}

const settingsElements = { 
    "General Settings": { 
      element_1: {
        text: "Auto Scroll",
        func: setAutoScroll
      },
      element_2: {
        text: "Enable memory",
        func: enableMemory
      }
    },
  
    "Customizations": {
      element_1: {
        text: "",
        type: "",
        func: ""
      }
    },
  
    "About us": {
      element_1: {
        text: "",
        type: ""
      }
    }
};
checkBoxCreate("General Settings")

function switchTab(tab){
    tab.classList.add("active");
    const tabName = tab.innerText;
    if (tabName=="General Settings"){
        checkBoxCreate(tabName);
    }
};

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        classListRemover(tabs,"active");
        switchTab(tab)
    });
});
