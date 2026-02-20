document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    const memoryForm = document.getElementById('memory-form');
    const memoryImageInput = document.getElementById('memory-image');
    const imagePreview = document.getElementById('image-preview');
    const memoryGallery = document.getElementById('memory-gallery');

    // Preview Image
    if (memoryImageInput) {
        memoryImageInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Load Memories
    const loadMemories = async () => {
        try {
            const res = await fetch(`${window.API_BASE_URL}/api/memories`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const memories = await res.json();

            memoryGallery.innerHTML = memories.map(memory => `
        <div class="memory-card">
          <img src="${memory.image_path}" class="memory-img" alt="Memory">
          <div class="memory-label">${memory.category}</div>
        </div>
      `).join('');
        } catch (err) {
            console.error('Error loading memories:', err);
        }
    };

    // Upload Memory
    if (memoryForm) {
        memoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const file = memoryImageInput.files[0];
            const category = document.getElementById('memory-category').value;

            if (!file) return alert('Please select an image');

            const formData = new FormData();
            formData.append('image', file);
            formData.append('category', category);

            try {
                const res = await fetch(`${window.API_BASE_URL}/api/memories`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    body: formData
                });

                if (res.ok) {
                    memoryForm.reset();
                    imagePreview.style.display = 'none';
                    loadMemories();
                } else {
                    const data = await res.json();
                    alert(data.message || 'Failed to upload image');
                }
            } catch (err) {
                console.error(err);
            }
        });
    }

    loadMemories();
});
