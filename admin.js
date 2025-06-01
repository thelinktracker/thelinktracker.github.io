import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Supabase Config
const SUPABASE_URL = 'https://hpjywzvwmtiikhntbbyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwanl3enZ3bXRpaWtobnRiYnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDI1OTIsImV4cCI6MjA2NDI3ODU5Mn0.rogNUkmTWdOpK-UuxTG9q3Hj-mj89UKtBnQtALNrtX4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// HTML escape function
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// DOM Elements
const loadingDiv = document.getElementById('loading');
const adminContent = document.getElementById('adminContent');
const logoutBtn = document.getElementById('logoutBtn');
const addCreatorForm = document.getElementById('addCreatorForm');
const messageDiv = document.getElementById('message');
const creatorsTableBody = document.querySelector('#creators tbody');
const totalRevenueEl = document.getElementById('totalRevenue');
const totalPaidEl = document.getElementById('totalPaid');
const totalRemainingEl = document.getElementById('totalRemaining');
const lastUpdateEl = document.getElementById('lastUpdate');

// Modal elements
const modal = document.getElementById('paymentModal');
const closeModal = document.querySelector('.close');
const cancelPaymentBtn = document.getElementById('cancelPayment');
const paymentForm = document.getElementById('paymentForm');
const paymentCreatorNameEl = document.getElementById('paymentCreatorName');
const paymentRemainingEl = document.getElementById('paymentRemaining');
let currentPaymentCreator = null;
let currentRemaining = 0;

// Number formatting
const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
});

// Check auth on load
checkAuth();

async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    
    loadingDiv.style.display = 'none';
    adminContent.style.display = 'block';
    fetchAllCreators();
}

// Logout
logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
});

// Modal handling
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    paymentForm.reset();
});

cancelPaymentBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    paymentForm.reset();
});

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
        paymentForm.reset();
    }
};

// Open payment modal
window.openPaymentModal = function(pseudo, remaining) {
    currentPaymentCreator = pseudo;
    currentRemaining = remaining;
    paymentCreatorNameEl.textContent = pseudo;
    paymentRemainingEl.textContent = formatter.format(remaining);
    
    // Set max amount to remaining
    const amountInput = document.getElementById('paymentAmount');
    amountInput.max = remaining;
    amountInput.value = remaining.toFixed(2);
    
    modal.style.display = 'block';
}

// Handle payment submission
paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('paymentAmount').value);
    const comment = document.getElementById('paymentComment').value;
    
    if (amount > currentRemaining) {
        showMessage(`The amount cannot exceed ${formatter.format(currentRemaining)}`, 'error');
        return;
    }
    
    try {
        const { error } = await supabase
            .from('payments')
            .insert([{
                pseudo: currentPaymentCreator,
                amount: amount,
                comment: comment || null,
                date: new Date().toISOString().split('T')[0]
            }]);
        
        if (error) throw error;
        
        showMessage(`Payment of ${formatter.format(amount)} recorded for ${escapeHtml(currentPaymentCreator)}`, 'success');
        modal.style.display = 'none';
        paymentForm.reset();
        fetchAllCreators();
        
    } catch (error) {
        showMessage(`Error: ${escapeHtml(error.message)}`, 'error');
    }
});

// Add creator
addCreatorForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const pseudo = document.getElementById('pseudo').value;
    const link = document.getElementById('link').value;
    const rate = parseFloat(document.getElementById('rate').value);
    
    try {
        const { error } = await supabase
            .from('affiliates_stats')
            .insert([{ 
                pseudo: pseudo, 
                rebrandly_link: link, 
                click_rate: rate,
                clicks: 0
            }]);
        
        if (error) throw error;
        
        showMessage('Creator added successfully!', 'success');
        addCreatorForm.reset();
        fetchAllCreators();
        
    } catch (error) {
        showMessage(`Error: ${escapeHtml(error.message)}`, 'error');
    }
});

function showMessage(message, type) {
    messageDiv.innerHTML = `<div class="${type === 'success' ? 'success-message' : 'error'}">${message}</div>`;
    setTimeout(() => messageDiv.innerHTML = '', 3000);
}

window.deleteCreator = async function(pseudo) {
    if (!confirm(`Are you sure you want to delete ${pseudo}?`)) return;
    
    try {
        // Delete associated payments first
        const { error: paymentsError } = await supabase
            .from('payments')
            .delete()
            .eq('pseudo', pseudo);
        
        if (paymentsError) throw paymentsError;
        
        // Then delete the creator
        const { error } = await supabase
            .from('affiliates_stats')
            .delete()
            .eq('pseudo', pseudo);
        
        if (error) throw error;
        
        showMessage(`Creator ${escapeHtml(pseudo)} deleted successfully!`, 'success');
        fetchAllCreators();
        
    } catch (error) {
        showMessage(`Error: ${escapeHtml(error.message)}`, 'error');
    }
}

async function fetchAllCreators() {
    try {
        // Get all creators
        const { data: creators, error: creatorsError } = await supabase
            .from('affiliates_stats')
            .select('*');
        
        if (creatorsError) throw creatorsError;
        
        // Get all payments
        const { data: payments, error: paymentsError } = await supabase
            .from('payments')
            .select('pseudo,amount');
        
        if (paymentsError) throw paymentsError;
        
        // Calculate total paid by creator
        const paidByCreator = {};
        payments.forEach(payment => {
            if (!paidByCreator[payment.pseudo]) {
                paidByCreator[payment.pseudo] = 0;
            }
            paidByCreator[payment.pseudo] += payment.amount;
        });
        
        // Display data
        displayCreators(creators, paidByCreator);
        
        // Update date
        lastUpdateEl.textContent = new Date().toLocaleString('fr-FR');
        
    } catch (error) {
        console.error('Error retrieving data:', error);
        creatorsTableBody.innerHTML = '<tr><td colspan="8">Error retrieving data</td></tr>';
    }
}

function displayCreators(creators, paidByCreator) {
    // Clear table
    creatorsTableBody.innerHTML = '';
    
    // Calculate totals
    let totalRevenue = 0;
    let totalPaid = 0;
    let totalRemaining = 0;
    
    // Sort creators by remaining amount (descending)
    creators.sort((a, b) => {
        const revenueA = a.clicks * a.click_rate;
        const revenueB = b.clicks * b.click_rate;
        const paidA = paidByCreator[a.pseudo] || 0;
        const paidB = paidByCreator[b.pseudo] || 0;
        return (revenueB - paidB) - (revenueA - paidA);
    });
    
    // Add each creator
    creators.forEach(creator => {
        const revenue = creator.clicks * creator.click_rate;
        const paid = paidByCreator[creator.pseudo] || 0;
        const remaining = revenue - paid;
        
        // Add to totals
        totalRevenue += revenue;
        totalPaid += paid;
        totalRemaining += remaining;
        
        const row = document.createElement('tr');
        
        // Create cells safely
        const cells = [
            escapeHtml(creator.pseudo),
            `<a href="${escapeHtml(creator.rebrandly_link)}" target="_blank" title="${escapeHtml(creator.rebrandly_link)}">${escapeHtml(creator.rebrandly_link)}</a>`,
            formatter.format(creator.click_rate),
            creator.clicks.toLocaleString('fr-FR'),
            formatter.format(revenue),
            formatter.format(paid),
            formatter.format(remaining)
        ];
        
        cells.forEach(content => {
            const td = document.createElement('td');
            td.innerHTML = content;
            row.appendChild(td);
        });
        
        // Create actions cell safely
        const actionsCell = document.createElement('td');
        
        const viewLink = document.createElement('a');
        viewLink.href = `dashboard.html?ref=${encodeURIComponent(creator.pseudo)}`;
        viewLink.target = '_blank';
        
        const viewButton = document.createElement('button');
        viewButton.className = 'view-button';
        viewButton.textContent = 'View';
        viewLink.appendChild(viewButton);
        
        const payButton = document.createElement('button');
        payButton.className = 'pay-button';
        payButton.textContent = 'Pay';
        payButton.onclick = () => openPaymentModal(creator.pseudo, remaining);
        payButton.disabled = remaining <= 0;
        if (remaining <= 0) {
            payButton.style.opacity = '0.5';
            payButton.style.cursor = 'not-allowed';
        }
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteCreator(creator.pseudo);
        
        actionsCell.appendChild(viewLink);
        actionsCell.appendChild(payButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);
        
        creatorsTableBody.appendChild(row);
    });
    
    // Update totals
    totalRevenueEl.textContent = formatter.format(totalRevenue);
    totalPaidEl.textContent = formatter.format(totalPaid);
    totalRemainingEl.textContent = formatter.format(totalRemaining);
} 