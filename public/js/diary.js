document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    const diaryForm = document.getElementById('diary-form');
    const diaryTimeline = document.getElementById('diary-timeline');

    // Load entries
    const loadEntries = async () => {
        try {
            const res = await fetch('/api/diary', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const entries = await res.json();

            diaryTimeline.innerHTML = entries.map(entry => `
        <div class="diary-entry">
          <div class="diary-date">${new Date(entry.date).toLocaleString()}</div>
          <p>${entry.text}</p>
        </div>
      `).join('');
        } catch (err) {
            console.error('Error loading diary entries:', err);
        }
    };

    // Add entry
    if (diaryForm) {
        diaryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = document.getElementById('diary-text').value;

            try {
                const res = await fetch('/api/diary', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ text })
                });

                if (res.ok) {
                    document.getElementById('diary-text').value = '';
                    loadEntries();
                } else {
                    alert('Failed to save entry');
                }
            } catch (err) {
                console.error(err);
            }
        });
    }

    loadEntries();
});
