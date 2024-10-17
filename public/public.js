const username = localStorage.getItem('username');
const token = localStorage.getItem('auth-token');
const room = '';

document.addEventListener('DOMContentLoaded', () => {
    socket.emit('join', username);
})

window.addEventListener('DOMContentLoaded', (e) => {
    socket.on('online users', (username) => {
        const userList = document.getElementById('users');
        const li = document.createElement('li');
        li.classList.add('user');
        li.innerHTML = `<span class="username">${username}</span>`;
        userList.appendChild(li);
    });
})

window.addEventListener('DOMContentLoaded', (e) => {
    socket.on('user history', (users) => {
        users.forEach((username) => {
            const userList = document.getElementById('users');
            const li = document.createElement('li');
            li.classList.add('user');
            li.innerHTML = `<span class="username">${username}</span>`;
            userList.appendChild(li);
        })
    });
})

// Display chat history on load
window.addEventListener('DOMContentLoaded', (e) => {
    socket.on('chat history', () => {
        let data;

        fetch(`http://localhost:9000/api/messages/${room}`, {
            method: 'GET',
            headers: {
                'auth-token': token,
                'Content-Type': 'application/json'
            }
        })
            .then(async (response) => {
                if (response.ok) {
                    data = await response.json();
                    const messageList = document.getElementById('messages');
                    data.reverse().forEach((msg) => {
                        const li = document.createElement('li');
                        li.classList.add('message');
                        li.innerHTML = `<span class="username">${msg.username}:</span> ${msg.message} <span class="timestamp">[${new Date(msg.createdAt).toLocaleTimeString()}]</span>`;
                        messageList.appendChild(li);
                    });
                } else {
                    window.alert(await response.text());
                }
            })
            .catch(error => {
                window.alert(error);
            })
    });
})

// Add message to the list when received
window.addEventListener('DOMContentLoaded', (e) => {
    socket.on('chat message', (msg) => {
        const numOfLis = document.querySelectorAll("#messages > li").length;

        if (numOfLis === 10) {
            const element = document.querySelectorAll("ul > li")[0];
            element.remove();
            console.log('remove kard');
        }
        const messageList = document.getElementById('messages');
        const li = document.createElement('li');
        li.classList.add('message');
        li.innerHTML = `<span class="username">${msg.username}:</span> ${msg.message} <span class="timestamp">[${new Date(msg.timestamp).toLocaleTimeString()}]</span>`;
        messageList.appendChild(li);
    });
})

// Handle message form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const message = {
            message: input.value,
            username: username,
            room
        }
        if (input.value) {
            fetch('http://localhost:9000/api/message', {
                method: 'POST',
                headers: {
                    'auth-token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            })
                .then(async (response) => {
                    if (response.ok) {
                        const data = await response.json();
                        socket.emit('chat message', data, room);
                        return;
                    }
                    window.alert(await response.text());
                })
                .catch(error => {
                    window.alert(error);
                })
            input.value = '';
        }
    });
})