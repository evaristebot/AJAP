//// ======================
// CONFIG SUPABASE
// ======================
const SUPABASE_URL = "https://cxvetkmbhohutyprwxjx.supabase.co";
const SUPABASE_KEY = "sb_publishable_06m0Zc_V-QEzc2U8sbmbSQ_Rd7JiGFs";

// Supabase client
const supabase = supabasejs.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ======================
// NAVIGATION PAGES
// ======================
function goToForm() {
  document.getElementById("home").classList.remove("active");
  document.getElementById("home").style.display = "none";

  document.getElementById("form").classList.add("active");
  document.getElementById("form").style.display = "block";
}

function goHome() {
  document.getElementById("form").classList.remove("active");
  document.getElementById("form").style.display = "none";

  document.getElementById("home").classList.add("active");
  document.getElementById("home").style.display = "block";
}

// ======================
// ENVOI DONNÉES
// ======================
async function envoyerWhatsApp() {
  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const telephone = document.getElementById("telephone").value.trim();
  const nationalite = document.getElementById("nationalite").value.trim();

  if (!nom || !prenom || !telephone || !nationalite) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  // ----------------------
  // 1️⃣ ENREGISTREMENT SUPABASE
  // ----------------------
  const { error } = await supabase
    .from("inscriptions")
    .insert([
      { nom, prenom, telephone, nationalite }
    ]);

  if (error) {
    console.error("Erreur Supabase :", error);
    alert("Erreur lors de l'enregistrement.");
    return;
  }

  // ----------------------
  // ======================
  // 2️⃣ MESSAGE WHATSAPP
  // ======================
  const message = `
Nouvelle inscription ARJAP

Nom : ${nom}
Prénom : ${prenom}
Téléphone : ${telephone}
Nationalité : ${nationalite}
`;

  // 📌 NUMÉRO PRIORITAIRE (EN PREMIER)
  const numeroPrioritaire = "237653375470";

  // 📌 AUTRES NUMÉROS
  const autresNumeros = [
    "237654823558",
    "237653794702"
  ];

  // 1️⃣ Ouvre d'abord le numéro prioritaire
  window.open(
    `https://wa.me/${numeroPrioritaire}?text=${encodeURIComponent(message)}`,
    "_blank"
  );

  // 2️⃣ Puis les autres avec un léger délai
  autresNumeros.forEach((numero, index) => {
    setTimeout(() => {
      window.open(
        `https://wa.me/${numero}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    }, (index + 1) * 800); // délai pour éviter le blocage navigateur
  });
