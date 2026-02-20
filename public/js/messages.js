document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-text');
    const messagesList = document.getElementById('messages-list');
    const quickReplyBtns = document.querySelectorAll('.quick-reply-btn');

    // Quick reply logic
    quickReplyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            messageInput.value = btn.innerText;
        });
    });

    // Load messages
    const loadMessages = async () => {
        try {
            const res = await fetch(`${window.API_BASE_URL}/api/messages`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const messages = await res.json();

            messagesList.innerHTML = messages.map(msg => `
        <div class="message-card">
          <div class="message-text">"${msg.text}"</div>
          <div class="message-time">Sent on ${new Date(msg.createdAt).toLocaleString()}</div>
        </div>
      `).join('');
        } catch (err) {
            console.error('Error loading messages:', err);
        }
    };

    // Send message
    if (messageForm) {
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = messageInput.value;

            try {
                const res = await fetch(`${window.API_BASE_URL}/api/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ text })
                });

                if (res.ok) {
                    messageInput.value = '';
                    loadMessages();
                } else {
                    alert('Failed to send message');
                }
            } catch (err) {
                console.error(err);
            }
        });
    }

    loadMessages();
});
