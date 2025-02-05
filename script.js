// Create pet event listener
document.getElementById('create-pet-button').addEventListener('click', function() {
    const petName = document.getElementById('pet-name').value;
    const petType = document.getElementById('pet-type').value;
    const petImage = document.getElementById('pet-image').value;

    if (!petName || !petType || !petImage) {
        alert("Please fill in all fields to create your pet.");
        return;
    }

    fetch('/api/create_pet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: petName, type: petType, image_url: petImage })
    })
    .then(response => response.json())
    .then(data => {
        // Hide creation form and show pet display, actions, and chatbox
        document.getElementById('pet-creation').style.display = 'none';
        document.getElementById('pet-display').style.display = 'block';
        document.getElementById('pet-actions').style.display = 'block';
        document.getElementById('chatbox').style.display = 'block';
        document.getElementById('pet-title').textContent = `${petName} the ${petType}`;
        document.getElementById('pet-image-display').src = data.image_url;
        document.getElementById('response-message').textContent = data.message;
    })
    .catch(error => console.error('Error:', error));
});

// Action buttons (Feed, Play, Check Mood)
const actionButtons = document.querySelectorAll('.action-button');
actionButtons.forEach(button => {
    button.addEventListener('click', function() {
        const command = this.getAttribute('data-command');
        fetch('/api/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: command })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('response-message').textContent = data.response;
            document.getElementById('pet-happiness').textContent = `Happiness: ${data.happiness}`;
        })
        .catch(error => console.error('Error:', error));
    });
});

// Chatbox functionality
document.getElementById('chat-send-button').addEventListener('click', function() {
    const message = document.getElementById('chat-input').value;
    if (message.trim() === '') return;
    // Append user's message to the chat area
    const chatMessages = document.getElementById('chat-messages');
    const userMsgElem = document.createElement('p');
    userMsgElem.textContent = "You: " + message;
    chatMessages.appendChild(userMsgElem);

    fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        const botMsgElem = document.createElement('p');
        botMsgElem.textContent = data.response;
        chatMessages.appendChild(botMsgElem);
        // Clear the chat input field
        document.getElementById('chat-input').value = '';
    })
    .catch(error => console.error('Error:', error));
});
