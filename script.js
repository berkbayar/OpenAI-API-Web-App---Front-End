document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-btn');

    function sendMessage() {
        const input = inputField.value;
        if (input.trim() !== '') { // Check if the input is not empty
            addMessageToChat(input);
            inputField.value = ''; // Clear input box
        }
    }

    // Event listener for the enter keypress
    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevents the page from refreshing
            sendMessage();
        }
    });

    // Event listener for the send button click
    sendButton.addEventListener('click', function () {
        sendMessage();
    });
});

function sendMessageToAPI(message) {
    fetch('https://bayarai.azurewebsites.net/Chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Message: message })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            addBotResponseToChat(data);
        })
        .catch(error => console.error('Error:', error));
}


function addMessageToChat(message) {
    const chatBox = document.getElementById('chat-box');
    const userMsgDiv = document.createElement('div');
    userMsgDiv.style = "margin:10px";
    userMsgDiv.textContent = `Siz: ${message}`;
    userMsgDiv.classList.add('user-message');
    chatBox.appendChild(userMsgDiv);

    sendMessageToAPI(message); // Send message to API

    chatBox.scrollTop = chatBox.scrollHeight;
}

function addBotResponseToChat(message) {
    const chatBox = document.getElementById('chat-box');
    const botMsgDiv = document.createElement('div');
    botMsgDiv.textContent = `Bayar AI: `;
    botMsgDiv.style = "margin:10px";

    botMsgDiv.classList.add('bot-message'); 
    botMsgDiv.classList.add('visible');

    chatBox.appendChild(botMsgDiv);

    // Function to slowly add each letter of the answer
    function typeLetterByLetter(text, index) {
        if (index < text.length) {
            botMsgDiv.textContent += text[index++];
            setTimeout(() => typeLetterByLetter(text, index), 10); // Add letters per 10 ms
        }
    }

    // Call animation function
    typeLetterByLetter(message, 0);

    chatBox.scrollTop = chatBox.scrollHeight;
}