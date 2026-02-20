document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/'; return; }

    const linkedView = document.getElementById('linked-view');
    const unlinkedView = document.getElementById('unlinked-view');
    const codeBox = document.getElementById('code-box');
    const codeText = document.getElementById('couple-code-text');
    const partnerName = document.getElementById('partner-name-display');
    const statusMsg = document.getElementById('status-msg');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const joinBtn = document.getElementById('join-btn');
    const unlinkBtn = document.getElementById('unlink-btn');
    const joinInput = document.getElementById('join-code-input');

    function setStatus(msg, type = 'success') {
        statusMsg.textContent = msg;
        statusMsg.className = type;
        if (msg) setTimeout(() => { statusMsg.textContent = ''; statusMsg.className = ''; }, 4000);
    }

    function authHeaders() {
        return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    }

    async function loadProfile() {
        const res = await fetch(`${window.API_BASE_URL}/api/users/profile`, { headers: authHeaders() });
        if (!res.ok) { window.location.href = '/'; return; }
        const user = await res.json();

        if (user.partner_id) {
            // Linked state
            partnerName.textContent = user.partner_name || 'Your Partner';
            linkedView.classList.remove('hidden');
            unlinkedView.classList.add('hidden');
        } else {
            // Unlinked state — show code if they have one
            linkedView.classList.add('hidden');
            unlinkedView.classList.remove('hidden');
            if (user.couple_code) {
                codeText.textContent = user.couple_code;
                codeBox.classList.remove('hidden');
                generateBtn.textContent = '🔄 Regenerate Code';
            }
        }
    }

    // Generate / Regenerate code
    generateBtn.addEventListener('click', async () => {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating…';
        const res = await fetch(`${window.API_BASE_URL}/api/users/couple/generate`, {
            method: 'POST', headers: authHeaders()
        });
        const data = await res.json();
        generateBtn.disabled = false;
        if (res.ok) {
            codeText.textContent = data.couple_code;
            codeBox.classList.remove('hidden');
            generateBtn.textContent = '🔄 Regenerate Code';
            setStatus('New code generated!', 'success');
        } else {
            generateBtn.textContent = '✨ Generate My Code';
            setStatus(data.message || 'Failed to generate code', 'error');
        }
    });

    // Copy code to clipboard
    copyBtn.addEventListener('click', () => {
        const code = codeText.textContent;
        navigator.clipboard.writeText(code).then(() => {
            copyBtn.textContent = '✅';
            setTimeout(() => { copyBtn.textContent = '📋'; }, 2000);
        });
    });

    // Join with partner's code
    joinBtn.addEventListener('click', async () => {
        const code = joinInput.value.trim().toUpperCase();
        if (!code || code.length < 4) { setStatus('Please enter a valid code', 'error'); return; }
        joinBtn.disabled = true;
        joinBtn.textContent = 'Linking…';
        const res = await fetch(`${window.API_BASE_URL}/api/users/couple/join`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ couple_code: code })
        });
        const data = await res.json();
        joinBtn.disabled = false;
        joinBtn.textContent = 'Link 💞';
        if (res.ok) {
            setStatus(data.message, 'success');
            await loadProfile();
        } else {
            setStatus(data.message || 'Failed to link', 'error');
        }
    });

    // Auto-uppercase the join input
    joinInput.addEventListener('input', () => {
        joinInput.value = joinInput.value.toUpperCase();
    });

    // Unlink
    unlinkBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to unlink from your partner?')) return;
        const res = await fetch(`${window.API_BASE_URL}/api/users/couple/unlink`, {
            method: 'DELETE', headers: authHeaders()
        });
        const data = await res.json();
        if (res.ok) {
            setStatus('Unlinked successfully', 'success');
            await loadProfile();
        } else {
            setStatus(data.message || 'Failed to unlink', 'error');
        }
    });

    await loadProfile();
});
