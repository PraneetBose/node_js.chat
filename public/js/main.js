// public/js/main.js

$(function () {
    $('form').submit(function () {
        const message = $('#m').val();
        if (message.trim() !== '') {
            socket.emit('chat message', message);
            $('#m').val('');
        }
        return false;
    });

    $('#setUsername').click(function () {
        const username = $('#username').val();
        if (username.trim() !== '') {
            socket.emit('setUsername', username);
            $('#username-container').hide();
            $('#username-display').text(`Welcome, ${username}!`);
        }
    });

    const socket = io();

    socket.on('chat message', function (msg) {
        const li = $(`<li>${msg.username}: ${msg.message}</li>`);
        if (msg.username === $('#username').val()) {
            li.addClass('sender');
        } else {
            li.addClass('receiver');
        }
        $('#messages').append(li);
        updateScroll();
    });

    socket.on('system message', function (msg) {
        const systemMessage = $('<div class="system-message"></div>').text(msg);
        $('#chat-content').append(systemMessage);
        updateScroll();
    });

    function updateScroll() {
        const element = document.getElementById('messages');
        element.scrollTop = element.scrollHeight;
    }
});
