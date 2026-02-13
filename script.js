// ============================================
// CONFIGURATION SUPABASE
// ============================================
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dmV0a21iaG9odXR5cHJ3eGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjA0NzAsImV4cCI6MjA1MTM5NjQ3MH0.Zh4aM3g1Nt4EmRtaIedfKn43GkjjSR-7nVgW3W_6pOw';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase connecté');

// ============================================
// FONCTIONS DE NAVIGATION (ACCESSIBLES PARTOUT)
// ============================================
window.hideAllPages = function() {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
};

window.goHome = function() {
  console.log('🏠 Accueil');
  window.hideAllPages();
  const home = document.getElementById('home');
  if (home) home.classList.add('active');
};

window.goToForm = function() {
  console.log('📝 Formulaire');
  window.hideAllPages();
  const form = document.getElementById('form');
  if (form) form.classList.add('active');
};

window.goToArticles = function() {
  console.log('📰 Publications');
  window.hideAllPages();
  const articles = document.getElementById('articles');
  if (articles) {
    articles.classList.add('active');
    window.chargerArticles();
  }
};

window.goToAdmin = function() {
  console.log('⚡ Admin');
  window.hideAllPages();
  const admin = document.getElementById('admin');
  if (admin) {
    admin.classList.add('active');
    window.chargerArticlesAdmin();
  }
};

window.openPDF = function() {
  console.log('📄 PDF');
  window.open('./plan_arjap.pdf', '_blank');
};

// ============================================
// ADMIN (TOI SEULEMENT)
// ============================================
window.devenirAdmin = function() {
  localStorage.setItem('isArjapAdmin', 'true');
  alert('✅ Admin activé ! Rafraîchis la page.');
  location.reload();
};

window.checkIfAdmin = function() {
  const adminBtn = document.getElementById('adminBtn');
  if (adminBtn) {
    adminBtn.style.display = localStorage.getItem('isArjapAdmin') === 'true' ? 'block' : 'none';
  }
};

// ============================================
// INSCRIPTION + WHATSAPP
// ============================================
window.envoyerWhatsApp = async function() {
  const nom = document.getElementById('nom')?.value.trim();
  const prenom = document.getElementById('prenom')?.value.trim();
  const tel = document.getElementById('telephone')?.value.trim();
  const nat = document.getElementById('nationalite')?.value.trim();

  if (!nom || !prenom || !tel || !nat) {
    alert('❌ Veuillez remplir tous les champs');
    return;
  }

  // Enregistrement Supabase
  try {
    const { error } = await supabase
      .from('inscriptions')
      .insert([{ nom, prenom, telephone: tel, nationalite: nat }]);

    if (error) {
      console.error('Erreur Supabase:', error);
      alert('❌ Erreur: ' + error.message);
    } else {
      alert('✅ Inscription réussie ! WhatsApp va s\'ouvrir.');
      
      // Réinitialiser
      document.getElementById('nom').value = '';
      document.getElementById('prenom').value = '';
      document.getElementById('telephone').value = '';
      document.getElementById('nationalite').value = '';
    }
  } catch (err) {
    console.error('Erreur:', err);
    alert('❌ Erreur de connexion');
  }

  // WhatsApp
  const message = `Bonjour ARJAP 👋\nNouvelle inscription\n\nNom : ${nom}\nPrénom : ${prenom}\nTéléphone : ${tel}\nNationalité : ${nat}`;
  const numeros = ['237653375470', '237653794702'];
  numeros.forEach(num => {
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
  });
};

// ============================================
// PUBLICATIONS (ARTICLES)
// ============================================
window.chargerArticles = async function() {
  const container = document.getElementById('articles-list');
  if (!container) return;

  try {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="no-articles">📭 Aucune publication pour le moment.</p>';
      return;
    }

    let html = '';
    data.forEach(article => {
      html += `
        <div class="article-card">
          <h3>${escapeHtml(article.titre)}</h3>
          <p>${escapeHtml(article.contenu).replace(/\n/g, '<br>')}</p>
          <div class="article-date">
            Publié le ${new Date(article.created_at).toLocaleDateString('fr-FR')}
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = '<p style="color: red;">❌ Erreur chargement</p>';
    console.error(err);
  }
};

window.publierArticle = async function() {
  const titre = document.getElementById('admin-title')?.value.trim();
  const contenu = document.getElementById('admin-content')?.value.trim();

  if (!titre || !contenu) {
    alert('❌ Remplis tous les champs');
    return;
  }

  try {
    const { error } = await supabase
      .from('publications')
      .insert([{ titre, contenu, auteur: 'ARJAP Admin' }]);

    if (error) throw error;

    alert('✅ Article publié !');
    document.getElementById('admin-title').value = '';
    document.getElementById('admin-content').value = '';
    window.chargerArticlesAdmin();
    window.chargerArticles();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
};

window.chargerArticlesAdmin = async function() {
  const container = document.getElementById('admin-articles-list');
  if (!container) return;

  try {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<p>Aucune publication</p>';
      return;
    }

    let html = '';
    data.forEach(article => {
      html += `
        <div class="admin-article-item">
          <div>
            <strong>${escapeHtml(article.titre)}</strong><br>
            <small>${new Date(article.created_at).toLocaleDateString()}</small>
          </div>
          <button onclick="window.supprimerArticle(${article.id})" class="delete-btn">
            🗑️ Supprimer
          </button>
        </div>
      `;
    });
    
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = '<p style="color: red;">Erreur chargement</p>';
  }
};

window.supprimerArticle = async function(id) {
  if (!confirm('Supprimer cet article ?')) return;

  try {
    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', id);

    if (error) throw error;

    alert('✅ Article supprimé');
    window.chargerArticlesAdmin();
    window.chargerArticles();
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
};

// ============================================
// UTILITAIRE
// ============================================
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  window.checkIfAdmin();
  console.log('✅ Script initialisé');
});
