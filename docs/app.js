// Configuration Supabase
const SUPABASE_URL = 'https://hpjywzvwmtiikhntbbyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwanl3enZ3bXRpaWtobnRiYnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MDI1OTIsImV4cCI6MjA2NDI3ODU5Mn0.rogNUkmTWdOpK-UuxTG9q3Hj-mj89UKtBnQtALNrtX4';

// Éléments DOM
const errorDiv = document.getElementById('error');
const statsDiv = document.getElementById('stats');
const clicksEl = document.getElementById('clicks');
const revenueEl = document.getElementById('revenue');
const lastUpdateEl = document.getElementById('lastUpdate');

// Formatage des nombres
const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
});

// Récupération du paramètre ref
const urlParams = new URLSearchParams(window.location.search);
const ref = urlParams.get('ref');

if (!ref) {
    showError('Aucun identifiant créateur spécifié');
} else {
    fetchStats(ref);
}

async function fetchStats(pseudo) {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/affiliates_stats?pseudo=eq.${encodeURIComponent(pseudo)}&select=clicks,click_rate,updated_at`,
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

function displayStats(stats) {
    // Calcul du revenu estimé
    const estimatedRevenue = stats.clicks * stats.click_rate;

    // Mise à jour du DOM
    clicksEl.textContent = stats.clicks.toLocaleString('fr-FR');
    revenueEl.textContent = formatter.format(estimatedRevenue);
    lastUpdateEl.textContent = new Date(stats.updated_at).toLocaleString('fr-FR');

    // Affichage des stats
    errorDiv.classList.add('hidden');
    statsDiv.classList.remove('hidden');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    statsDiv.classList.add('hidden');
} 