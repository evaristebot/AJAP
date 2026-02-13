// ============================================
// CONFIGURATION SUPABASE
// ============================================
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
// 🔴 REMPLACE PAR TA VRAIE CLÉ (Settings > API > anon key)
const supabaseKey = 'cxvetkmbhohutyprwxjx'; // À CHANGER !
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ADMIN UNIQUE - TON ID (récupère ton vrai ID après connexion)
// Méthode simple : on utilise ton numéro de téléphone comme identifiant
const ADMIN_TELEPHONE = "237653375470"; // 🔴 Mets TON numéro ici

// ============================================
// NAVIGATION ENTRE PAGES
// ============================================
function goHome() {
  hideAllPages();
  document.getElementById("home").classList.add("active");
}

function goToForm() {
  hideAllPages();
  document.getElementById("form").classList.add("active");
}

function goToArticles() {
  hideAllPages();
  document.getElementById("articles").classList.add("active");
  chargerArticles(); // Charge les articles
}

function goToAdmin() {
  hideAllPages();
  document.getElementById("admin").classList.add("active");
  chargerArticlesAdmin(); // Charge pour gestion
}

function hideAllPages() {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
}

// ============================================
// VÉRIFICATION ADMIN
// ============================================
function checkIfAdmin() {
  // Simule une vérification - À ADAPTER selon ton système
  // Pour l'instant, on stocke dans localStorage
  const isAdmin = localStorage.getItem('isArjapAdmin');
  const adminBtn = document.getElementById('adminBtn');
  
  if (isAdmin === 'true') {
    adminBtn.style.display = 'block';
  } else {
    adminBtn.style.display = 'none';
  }
}

// Pour devenir admin (à appeler une fois depuis la console)
function devenirAdmin() {
  localStorage.setItem('isArjapAdmin', 'true');
  alert('✅ Tu es maintenant admin ! Rafraîchis la page.');
  location.reload();
}

// ============================================
// INSCRIPTION + WHATSAPP
// ============================================
async function envoyerWhatsApp() {
  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const tel = document.getElementById("telephone").value.trim();
  const nat = document.getElementById("nationalite").value.trim();

  if (!nom || !prenom || !tel || !nat) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  // Enregistrement Supabase
  try {
    const { error } = await supabase
      .from('inscriptions')
      .insert([{ nom, prenom, telephone: tel, nationalite: nat }]);

    if (error) {
      console.error("Erreur Supabase:", error);
      alert("❌ Erreur d'enregistrement: " + error.message);
    } else {
      console.log("✅ Inscription enregistrée");
      alert("✅ Inscription reçue ! WhatsApp va s'ouvrir.");
      
      // Réinitialiser formulaire
      document.getElementById("nom").value = "";
      document.getElementById("prenom").value = "";
      document.getElementById("telephone").value = "";
      document.getElementById("nationalite").value = "";
    }
  } catch (err) {
    console.error("Erreur:", err);
    alert("❌ Erreur de connexion");
  }

  // WhatsApp
  const message = `Bonjour ARJAP 👋\nNouvelle inscription\n\nNom : ${nom}\nPrénom : ${prenom}\nTéléphone : ${tel}\nNationalité : ${nat}`;
  const numeros = ["237653375470", "237653794702"];
  numeros.forEach(num => {
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, "_blank");
  });
}

// ============================================
// PUBLICATIONS (ARTICLES)
// ============================================

// CHARGER les articles pour les visiteurs
async function chargerArticles() {
  const container = document.getElementById('articles-list');
  
  try {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data.length === 0) {
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
    container.innerHTML = '<p style="color: red;">❌ Erreur chargement articles</p>';
    console.error(err);
  }
}

// PUBLIER un article (ADMIN SEULEMENT)
async function publierArticle() {
  const titre = document.getElementById('admin-title').value.trim();
  const contenu = document.getElementById('admin-content').value.trim();

  if (!titre || !contenu) {
    alert('Veuillez remplir tous les champs');
    return;
  }

  try {
    const { error } = await supabase
      .from('publications')
      .insert([{ 
        titre: titre, 
        contenu: contenu,
        auteur: 'ARJAP Admin'
      }]);

    if (error) throw error;

    alert('✅ Article publié !');
    document.getElementById('admin-title').value = '';
    document.getElementById('admin-content').value = '';
    chargerArticlesAdmin(); // Rafraîchir la liste
    
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
    console.error(err);
  }
}

// CHARGER articles pour l'admin (avec boutons suppression)
async function chargerArticlesAdmin() {
  const container = document.getElementById('admin-articles-list');
  if (!container) return;

  try {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data.length === 0) {
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
          <button onclick="supprimerArticle(${article.id})" class="delete-btn">
            🗑️ Supprimer
          </button>
        </div>
      `;
    });
    
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = '<p style="color: red;">Erreur chargement</p>';
    console.error(err);
  }
}

// SUPPRIMER un article (ADMIN SEULEMENT)
async function supprimerArticle(id) {
  if (!confirm('Supprimer cet article ?')) return;

  try {
    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', id);

    if (error) throw error;

    alert('✅ Article supprimé');
    chargerArticlesAdmin();
    chargerArticles(); // Mettre à jour la vue publique
    
  } catch (err) {
    alert('❌ Erreur: ' + err.message);
  }
}

// ============================================
// PDF PLAN ARJAP
// ============================================
function openPDF() {
  // Si le PDF est en ligne
  window.open('plan_arjap.pdf', '_blank');
  
  // Alternative : téléchargement
  // window.location.href = 'plan_arjap.pdf';
}

// ============================================
// UTILITAIRE : Protéger contre XSS
// ============================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// INITIALISATION
// ============================================
// Vérifier admin au démarrage
checkIfAdmin();
