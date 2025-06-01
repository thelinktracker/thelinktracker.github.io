import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://hpjywzvwmtiikhntbbyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwanl3enZ3bXRpaWtobnRiYnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDI1OTIsImV4cCI6MjA2NDI3ODU5Mn0.rogNUkmTWdOpK-UuxTG9q3Hj-mj89UKtBnQtALNrtX4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');

// Check if already logged in
checkAuth();

async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.href = 'admin.html';
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitButton = loginForm.querySelector('button');
    
    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';
    messageDiv.innerHTML = '';

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        messageDiv.innerHTML = '<div class="success-message">Login successful! Redirecting...</div>';
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);

    } catch (error) {
        messageDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        submitButton.disabled = false;
        submitButton.textContent = 'Log in';
    }
}); 