const CONFIG = {
    // ⚠️ IMPORTANT: Replace this with your ACTUAL Render URL from the Dashboard
    API_BASE_URL: 'https://milesandmemories-0st4.onrender.com'
};

// Ensure no trailing slash for consistency
if (CONFIG.API_BASE_URL.endsWith('/')) {
    CONFIG.API_BASE_URL = CONFIG.API_BASE_URL.slice(0, -1);
}

window.API_BASE_URL = CONFIG.API_BASE_URL;
