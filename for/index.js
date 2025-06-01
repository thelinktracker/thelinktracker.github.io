// Configuration Supabase
const SUPABASE_URL = 'https://hpjywzvwmtiikhntbbyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwanl3enZ3bXRpaWtobnRiYnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDI1OTIsImV4cCI6MjA2NDI3ODU5Mn0.rogNUkmTWdOpK-UuxTG9q3Hj-mj89UKtBnQtALNrtX4';

// HTML escape function
function escapeHtml(text) {
    if (text == null) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// DOM Elements
const errorDiv = document.getElementById('error');
const statsDiv = document.getElementById('stats');
const creatorNameEl = document.getElementById('creatorName');
const creatorLinkEl = document.getElementById('creatorLink');
const clickRateEl = document.getElementById('clickRate');
const clicksEl = document.getElementById('clicks');
const revenueEl = document.getElementById('revenue');
const remainingEl = document.getElementById('remaining');
const lastUpdateEl = document.getElementById('lastUpdate');
const paymentsTableBody = document.querySelector('#payments tbody');
const totalPaidEl = document.getElementById('totalPaid');
const copyLinkBtn = document.getElementById('copyLink');

// Global variables for calculations
let totalRevenue = 0;
let totalPaid = 0;

// Number formatting
const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
});

// Percentage formatting
const percentFormatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

// Date formatting
const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Get creator name from URL
const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name');

if (!name) {
    showError('No creator identifier specified');
} else {
    fetchStats(name);
    fetchPayments(name);
}

async function fetchStats(pseudo) {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/affiliates_stats?pseudo=eq.${encodeURIComponent(pseudo)}&select=*`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const data = await response.json();

        if (!data.length) {
            showError('Creator not found');
            return;
        }

        const stats = data[0];
        displayStats(stats);

    } catch (error) {
        showError('Error retrieving data');
        console.error('Error:', error);
    }
}

async function fetchPayments(pseudo) {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/payments?pseudo=eq.${encodeURIComponent(pseudo)}&select=date,amount,comment&order=date.desc`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const payments = await response.json();
        displayPayments(payments);

    } catch (error) {
        console.error('Error fetching payments:', error);
    }
}

function displayStats(stats) {
    // Display creator information
    creatorNameEl.textContent = `Dashboard of ${stats.pseudo}`;
    creatorLinkEl.textContent = stats.rebrandly_link;
    clickRateEl.textContent = percentFormatter.format(stats.click_rate);

    // Configure copy button
    copyLinkBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(stats.rebrandly_link)
            .then(() => {
                const originalText = copyLinkBtn.textContent;
                copyLinkBtn.textContent = 'Copied!';
                copyLinkBtn.style.background = '#00b894';
                setTimeout(() => {
                    copyLinkBtn.textContent = originalText;
                    copyLinkBtn.style.background = '';
                }, 2000);
            })
            .catch(err => console.error('Error copying link:', err));
    });

    // Calculate estimated revenue
    totalRevenue = stats.clicks * stats.click_rate;

    // Update DOM
    clicksEl.textContent = stats.clicks.toLocaleString('fr-FR');
    revenueEl.textContent = formatter.format(totalRevenue);
    lastUpdateEl.textContent = new Date(stats.updated_at).toLocaleString('fr-FR');

    // Show stats
    errorDiv.classList.add('hidden');
    statsDiv.classList.remove('hidden');

    // Update remaining amount
    updateRemaining();
}

function displayPayments(payments) {
    // Clear table
    paymentsTableBody.innerHTML = '';

    // Calculate total payments
    totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

    if (payments.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="3" style="text-align: center;">No payments recorded</td>';
        paymentsTableBody.appendChild(row);
    } else {
        // Add each payment safely
        payments.forEach(payment => {
            const row = document.createElement('tr');
            
            const dateCell = document.createElement('td');
            dateCell.textContent = dateFormatter.format(new Date(payment.date));
            row.appendChild(dateCell);
            
            const amountCell = document.createElement('td');
            amountCell.textContent = formatter.format(payment.amount);
            row.appendChild(amountCell);
            
            const commentCell = document.createElement('td');
            commentCell.textContent = payment.comment || '-';
            row.appendChild(commentCell);
            
            paymentsTableBody.appendChild(row);
        });
    }

    // Update total paid
    totalPaidEl.textContent = formatter.format(totalPaid);

    // Update remaining amount
    updateRemaining();
}

function updateRemaining() {
    // Only update if we have both values
    if (totalRevenue !== undefined && totalPaid !== undefined) {
        const remaining = totalRevenue - totalPaid;
        remainingEl.textContent = formatter.format(remaining);
    }
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    statsDiv.classList.add('hidden');
} 