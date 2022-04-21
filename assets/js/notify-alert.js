'use strict';
        const button = document.getElementById('button'),
        toasts = document.getElementById('toasts');
        // const types = ['info', 'success', 'error'];

        function createNotification(message, type) {
            const notif = document.createElement('div');
            notif.classList.add('toast');
            notif.classList.add(type);

            notif.innerText = message;

            toasts.appendChild(notif);

            setTimeout(() => {
                notif.remove();
            }, 3000);
        }