const CONFIG = {
    // Replace with your actual Render backend URL
    API_BASE_URL: 'https://milesandmemories-backend.onrender.com'
};

// If running locally, you might want to use localhost
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // CONFIG.API_BASE_URL = 'http://localhost:5000';
}

window.API_BASE_URL = CONFIG.API_BASE_URL;
