// Configuration de Supabase
const supabaseUrl = 'https://cxvetkmbhohutyprwxjx.supabase.co';
const supabaseKey = 'sb_publishable_06m0Zc_V-QEzc2U8sbmbSQ_Rd7JiGFs';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

function goToForm() {
  document.getElementById("home").classList.remove("active");
  document.getElementById("form").classList.add("active");
}

function goHome() {
  document.getElementById("form").classList.remove("active");
  document.getElementById("home").classList.add("active");
}

// Fonction principale pour envoyer à la base de données ET à WhatsApp
async function envoyerWhatsApp() {
  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const tel = document.getElementById("telephone").value.trim();
  const nat = document.getElementById("nationalite").value.trim();

  if (!nom || !prenom || !tel || !nat) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  // --- ACTION 1 : Enregistrement dans Supabase ---
  try {
    const { error } = await _supabase
      .from('inscriptions') // Vérifie que ta table s'appelle bien "inscriptions" sur Supabase
      .insert([{ nom: nom, prenom: prenom, telephone: tel, nationalite: nat }]);

    if (error) throw error;
    console.log("Enregistré dans la base de données !");
  } catch (err) {
    console.error("Erreur base de données:", err.message);
    alert("Erreur lors de l'enregistrement. Vérifiez votre connexion.");
    return; // On stoppe si la base de données n'a pas reçu l'info
  }

  // --- ACTION 2 : Envoi vers WhatsApp ---
  const message = `Bonjour ARJAP 👋\nNouvelle inscription\n\nNom : ${nom}\nPrénom : ${prenom}\nTéléphone : ${tel}\nNationalité : ${nat}`;
  
  const numeros = ["237653375470", "237653794702"];

  numeros.forEach(num => {
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, "_blank");
  });
}
