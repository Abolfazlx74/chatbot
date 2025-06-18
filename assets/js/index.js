const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const chatPart = document.querySelector('.chat-part');
const darkModeButton = document.getElementById('dark-mode-button');
const sendButton = document.getElementById('send-button');
const clearButton = document.getElementById('clear-button');
const kebabMenuButton = document.getElementById('kebab-menu-button');
const kebabMenuDropdown = document.getElementById('kebab-menu-dropdown');
const settingsContainer = document.getElementById('settings-container');
const tabsContainer = document.querySelector(".tabs"); 
const tabs = document.querySelectorAll(".tab");
const settingsBoxBody = document.querySelector(".settings-box-body");
const userFileInput = document.getElementById("user-file-input");

let autoScroll = true;
let imagesPaths = { 
    user: ['assets/images/user-dark.svg','assets/images/user.svg'], 
    bot: ['assets/images/bot-dark.svg','assets/images/bot.svg']
}

const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
    document.body.classList.add('dark-mode');
}

function setProfileImages(isDark, imagesPaths) {
    const userProfiles = document.querySelectorAll('.user-profile');
    const botProfiles = document.querySelectorAll('.bot-profile');
    userProfiles.forEach(img => {
        img.src = isDark ? imagesPaths.user[0] : imagesPaths.user[1];
    });
    botProfiles.forEach(img => {
        img.src = isDark ? imagesPaths.bot[0] : imagesPaths.bot[1];
    });
}

setProfileImages(isDarkMode, imagesPaths);

darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    setProfileImages(isDarkMode,imagesPaths);
});

function addUserMessage(message) {
    const container = document.createElement('div');
    container.classList.add("user-message-container");

    const profile = document.createElement('img');
    profile.classList.add("user-profile");
    profile.src = document.body.classList.contains('dark-mode') ? imagesPaths.user[0] : imagesPaths.user[1];

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
    profile.src = document.body.classList.contains('dark-mode') ? imagesPaths.bot[0] : imagesPaths.bot[1];

    const messageElement = document.createElement('div');
    messageElement.classList.add('bot-message');
    messageElement.textContent = message;

    container.appendChild(profile);
    container.appendChild(messageElement);
    chatMessages.appendChild(container);

    if(autoScroll){
        scrollToBottom();
    }
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
    profile.src = document.body.classList.contains('dark-mode') ? imagesPaths.bot[0] : imagesPaths.bot[1];

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

function clearSettingsBox(){
    settingsBoxBody.innerHTML="";
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

function clearMessages(){
    chatMessages.innerHTML = '';
}

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
    userFileInput.click();
});

document.getElementById('menu-new-chat').addEventListener('click', function() {
    kebabMenuDropdown.style.display = 'none';
});

function setAutoScroll(){
    autoScroll = !autoScroll;
}

function enableMemory(){
    console.log("memory enabled/desabled")
}

function checkBoxCreate(tabName){
    const content = settingsElements[tabName];
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
        settingsBoxBody.appendChild(label);
    })
}

function flipCardCreate(tabName){
    const xmlns = "http://www.w3.org/2000/svg";
    const content = settingsElements[tabName]
    const container = document.createElement("div");
    container.classList.add("flip-cards-container");
    Object.values(content).forEach(el=>{
        const flipCard = document.createElement("a");
        flipCard.href = el.url;
        flipCard.classList.add("flip-card");
        const flipCardInner = document.createElement("div");
        flipCardInner.classList.add("flip-card-inner");
        const flipCardFront = document.createElement("div");
        flipCardFront.classList.add("flip-card-front");
        const backImage = document.createElementNS(xmlns, "svg");
        backImage.setAttribute("viewBox", "0 0 16 16");
        const svgPath = document.createElementNS(xmlns, "path");
        svgPath.setAttribute("d", el.d);
        const flipCardBack = document.createElement("div");
        flipCardBack.classList.add("flip-card-back");
        flipCardBack.innerText = el.text;
        backImage.appendChild(svgPath);
        flipCardFront.appendChild(backImage);
        flipCardInner.appendChild(flipCardFront);
        flipCardInner.appendChild(flipCardBack);
        flipCard.appendChild(flipCardInner);
        container.appendChild(flipCard);
    })
    const randomText = document.createElement("span");
    randomText.id = ("random-text");
    randomText.innerText = "Lorem ipsum dolorLorem ipsum dolor Lorem m dolorLorem ipsum dolor Loremm dolorLorem ipsum dolor Loremm dolorLorem ipsum dolor Lorem ipsum dolor sit amet, consectetur adipisicing elit ipsum dolor  ipsum possimus explicabo consectetur autem mollitia consequatur corrupti repellendus laborum vero, doloribus esse? Quod corrupti repellendus laborum vero, doloribus esse? Quodcorrupti repellendus laborum vero, doloribus esse? Quod?";
    settingsBoxBody.appendChild(randomText);
    settingsBoxBody.appendChild(container);
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
            text: "GitHub",
            d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z",
            url:"https://github.com/abolfazlx74",
          },
          element_2: {
            text: "Telegram",
            d:"M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09",
            url:"https://t.me/abolfazlx74",
          },
          element_3: {
            text: "LinkedIn",
            d:"M0 1.146C0 .513.526 0 1.175 0h13.65C15.473 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.527 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.341-1.248-.822 0-1.358.54-1.358 1.248 0 .694.52 1.248 1.327 1.248h.014zm4.908 8.212V9.359c0-.215.016-.43.08-.584.175-.43.574-.875 1.243-.875.876 0 1.226.66 1.226 1.63v3.864h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.015a5.54 5.54 0 0 1 .015-.025V6.169h-2.4c.03.7 0 7.225 0 7.225h2.4z",
            url:"https://www.linkedin.com/in/abolfazl-bahrami-604b16345",
          }
    }
};
checkBoxCreate("General Settings")

function handleTabContent(tabName){
    if (tabName=="General Settings"){
        checkBoxCreate(tabName);
    }
    else if(tabName=="Customizations"){
        avatarCreate("user");
        avatarCreate("bot");
    }
    else{
        flipCardCreate("About us");
    }
}
function switchTab(tab){
    tab.classList.add("active");
    clearSettingsBox();
    const tabName = tab.innerText;
    handleTabContent(tabName)
};

const currentTabName = document.getElementById("tab-name");
tabs.forEach(tab => {
    tab.addEventListener("click", (el) => {
        classListRemover(tabs,"active");
        switchTab(tab);
        currentTabName.innerText = tab.innerText;
    });
});

const tabsNames = ['General Settings','Customizations','About us'] 
document.getElementById("tab-arrow-left").addEventListener('click',()=>{
    index = tabsNames.indexOf(currentTabName.innerText);
    let newTabName = null;
    if (index > 0) {newTabName = tabsNames[index - 1];}
    else{newTabName = tabsNames[2];}
        clearSettingsBox();
        handleTabContent(newTabName);
        currentTabName.innerText = newTabName;
    
})

document.getElementById("tab-arrow-right").addEventListener('click',()=>{
    index = tabsNames.indexOf(currentTabName.innerText);
    let newTabName = null;
    if (index < 2) {newTabName = tabsNames[index + 1];}
    else{newTabName = tabsNames[0];}
        clearSettingsBox();
        handleTabContent(newTabName);
        currentTabName.innerText = newTabName;
})

function avatarCreate(role) {
    const avatarContainer = document.createElement("div");
    avatarContainer.classList.add("avatar-container");
    const label = document.createElement("label");
    label.htmlFor = `${role}-avatar-input`;
    label.innerText = `${role} avatar:`;
    const input = document.createElement("input");
    input.type = "file";
    input.name = `${role}-avatar`;
    input.id = `${role}-avatar-input`;
    input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        fetch('http://localhost:3001/api/upload-avatar', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            const img = document.querySelector(`.${role}-profile`);
            if (img) {
                img.src = data.filePath;
            }
            imagesPaths[role] = [data.filePath,data.filePath];
            console.log(imagesPaths)
        })
        .catch(err => {
            console.error('Error uploading avatar:', err);
        });
    });
    avatarContainer.appendChild(label);
    avatarContainer.appendChild(input);
    settingsBoxBody.appendChild(avatarContainer);
}