document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    const eventForm = document.getElementById('event-form');
    const eventsList = document.getElementById('events-list');

    // Load events
    const loadEvents = async () => {
        try {
            const res = await fetch(`${window.API_BASE_URL}/api/events`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const events = await res.json();

            eventsList.innerHTML = events.map(event => `
        <div class="event-card">
          <div class="event-details">
            <h3>${event.title}</h3>
            <div class="event-date">${new Date(event.date).toLocaleDateString()} at ${new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div class="event-desc">${event.description || ''}</div>
          </div>
          <button class="btn btn-delete" onclick="deleteEvent(${event.id})">Delete</button>
        </div>
      `).join('');
        } catch (err) {
            console.error('Error loading events:', err);
        }
    };

    // Add event
    if (eventForm) {
        eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('event-title').value;
            const date = document.getElementById('event-date').value;
            const description = document.getElementById('event-desc').value;

            try {
                const res = await fetch(`${window.API_BASE_URL}/api/events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ title, date, description })
                });

                if (res.ok) {
                    eventForm.reset();
                    loadEvents();
                } else {
                    alert('Failed to save event');
                }
            } catch (err) {
                console.error(err);
            }
        });
    }

    window.deleteEvent = async (id) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        try {
            const res = await fetch(`${window.API_BASE_URL}/api/events/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (res.ok) {
                loadEvents();
            }
        } catch (err) {
            console.error(err);
        }
    };

    loadEvents();
});
