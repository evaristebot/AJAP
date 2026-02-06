// 🔐 CONFIG SUPABASE
const SUPABASE_URL = "https://cxvetkmbhohutyprwxjx.supabase.co";
const SUPABASE_KEY = "sb_publishable_06m0Zc_V-QEzc2U8sbmbSQ_Rd7JiGFs";

const supabase = supabasejs.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// 🔄 Navigation
function ouvrirInscription() {
  document.getElementById("accueil").style.display = "none";
  document.getElementById("inscription").style.display = "block";
}

// 📩 Envoi formulaire
async function envoyerWhatsApp() {
  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const telephone = document.getElementById("telephone").value.trim();
  const nationalite = document.getElementById("nationalite").value.trim();

  if (!nom || !prenom || !telephone || !nationalite) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  // 🗄️ ENREGISTREMENT DANS SUPABASE
  const { error } = await supabase
    .from("inscriptions")
    .insert([
      { nom, prenom, telephone, nationalite }
    ]);

  if (error) {
    console.error(error);
    alert("Erreur lors de l'enregistrement ❌");
    return;
  }

  // 📲 WHATSAPP
  const message =
`Nouvelle inscription ARJAP

Nom : ${nom}
Prénom : ${prenom}
Téléphone : ${telephone}
Nationalité : ${nationalite}`;

  window.open(
    `https://wa.me/237653375470?text=${encodeURIComponent(message)}`,
    "_blank"
  );
                }
