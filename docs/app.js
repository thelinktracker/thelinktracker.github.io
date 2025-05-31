// Configuration Supabase
const SUPABASE_URL = 'https://hpjywzvwmtiikhntbbyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwanl3enZ3bXRpaWtobnRiYnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDI1OTIsImV4cCI6MjA2NDI3ODU5Mn0.rogNUkmTWdOpK-UuxTG9q3Hj-mj89UKtBnQtALNrtX4';

// Éléments DOM
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

// Variables globales pour les calculs
let totalRevenue = 0;
let totalPaid = 0;

// Formatage des nombres
const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
});

// Formatage des pourcentages
const percentFormatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

// Formatage des dates
const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Récupération du paramètre ref
const urlParams = new URLSearchParams(window.location.search);
const ref = urlParams.get('ref');

if (!ref) {
    showError('Aucun identifiant créateur spécifié');
} else {
    fetchStats(ref);
    fetchPayments(ref);
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
            showError('Créateur non trouvé');
            return;
        }

        const stats = data[0];
        displayStats(stats);

    } catch (error) {
        showError('Erreur lors de la récupération des données');
        console.error('Erreur:', error);
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
        console.error('Erreur lors de la récupération des paiements:', error);
    }
}

function displayStats(stats) {
    // Affichage des informations du créateur
    creatorNameEl.textContent = `Dashboard de ${stats.pseudo}`;
    creatorLinkEl.textContent = stats.rebrandly_link;
    clickRateEl.textContent = percentFormatter.format(stats.click_rate);

    // Configuration du bouton de copie
    copyLinkBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(stats.rebrandly_link)
            .then(() => {
                const originalText = copyLinkBtn.textContent;
                copyLinkBtn.textContent = 'Copié !';
                copyLinkBtn.style.background = '#00b894';
                setTimeout(() => {
                    copyLinkBtn.textContent = originalText;
                    copyLinkBtn.style.background = '';
                }, 2000);
            })
            .catch(err => console.error('Erreur lors de la copie:', err));
    });

    // Calcul du revenu estimé
    totalRevenue = stats.clicks * stats.click_rate;

    // Mise à jour du DOM
    clicksEl.textContent = stats.clicks.toLocaleString('fr-FR');
    revenueEl.textContent = formatter.format(totalRevenue);
    lastUpdateEl.textContent = new Date(stats.updated_at).toLocaleString('fr-FR');

    // Affichage des stats
    errorDiv.classList.add('hidden');
    statsDiv.classList.remove('hidden');

    // Mise à jour du reste à payer
    updateRemaining();
}

function displayPayments(payments) {
    // Vider le tableau
    paymentsTableBody.innerHTML = '';

    // Calculer le total des paiements
    totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

    if (payments.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="3" style="text-align: center;">Aucun paiement enregistré</td>';
        paymentsTableBody.appendChild(row);
    } else {
        // Ajouter chaque paiement
        payments.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dateFormatter.format(new Date(payment.date))}</td>
                <td>${formatter.format(payment.amount)}</td>
                <td>${payment.comment || '-'}</td>
            `;
            paymentsTableBody.appendChild(row);
        });
    }

    // Mise à jour du total payé
    totalPaidEl.textContent = formatter.format(totalPaid);

    // Mise à jour du reste à payer
    updateRemaining();
}

function updateRemaining() {
    // On ne met à jour que si on a les deux valeurs
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