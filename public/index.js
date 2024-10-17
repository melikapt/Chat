let username = null;
let password = null;
let room = '';

// Set the username and start the chat
document.addEventListener('DOMContentLoaded', (e) => {
    document.getElementById('Register').addEventListener('click', () => {
        const regInfo = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }

        if (regInfo.username && regInfo.password) {
            username = regInfo.username;
            password = regInfo.password;

            fetch('http://localhost:9000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(regInfo)
            })
                .then(async (response) => {
                    if (response.ok) {
                        const data = await response.json();
                        document.getElementById('roomName-form').style.display = 'flex';
                        document.querySelector('.auth-form').style.display = 'none';
                        localStorage.setItem('username', regInfo.username);
                        localStorage.setItem('auth-token', data.token);
                        return;
                    }
                    window.alert(await response.text())
                })
                .catch(error => {
                    window.alert(error);
                })
        }

        if (!regInfo.username || !regInfo.password) {
            window.alert('Enter info completely')
        }
    });
})

document.addEventListener('DOMContentLoaded', (e) => {
    document.getElementById('Login').addEventListener('click', () => {
        const regInfo = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }

        if (regInfo.username && regInfo.password) {
            username = regInfo.username;
            password = regInfo.password;

            fetch('http://localhost:9000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(regInfo)
            })
                .then(async (response) => {
                    if (response.ok) {
                        const data = await response.json();
                        document.getElementById('roomName-form').style.display = 'flex';
                        document.querySelector('.auth-form').style.display = 'none';
                        localStorage.setItem('username', regInfo.username);
                        localStorage.setItem('auth-token', data.token);
                        return;
                    }
                    window.alert(await response.text())
                })
                .catch(error => {
                    window.alert(error);
                })
        }

        if (!regInfo.username || !regInfo.password) {
            window.alert('Enter info completely')
        }
    });
})


// Handle room form submission
document.addEventListener('DOMContentLoaded', () => {
    const roomForm = document.getElementById('roomName-form');
    const roomName = document.getElementById('roomName');
    roomForm.addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.setItem('room', roomName.value);

        if (!roomName.value) {
            // public room
            window.location.href = 'http://localhost:9000/public.html';
        }
        if (roomName.value) {
            // private room
            room = roomName.value;
            window.location.href = 'http://localhost:9000/private.html'
        }
    });
})