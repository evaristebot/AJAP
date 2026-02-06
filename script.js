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

async function envoyerWhatsApp() {
  // Récupération des données
  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const tel = document.getElementById("telephone").value.trim();
  const nat = document.getElementById("nationalite").value.trim();

  // Vérification basique
  if (!nom || !prenom || !tel || !nat) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  // --- ÉTAPE 1 : TENTATIVE D'ENREGISTREMENT (SUPABASE) ---
  // On utilise un bloc try/catch qui ne bloque pas la suite
  try {
    const { error } = await _supabase
      .from('inscriptions') 
      .insert([{ 
        nom: nom, 
        prenom: prenom, 
        telephone: tel, 
        nationalite: nat 
      }]);

    if (error) {
        console.error("Erreur de base de données (mais on continue) :", error.message);
    } else {
        console.log("Enregistrement réussi dans Supabase");
    }
  } catch (err) {
    console.error("Erreur critique Supabase :", err);
  }

  // --- ÉTAPE 2 : ENVOI WHATSAPP (S'EXÉCUTE QUOI QU'IL ARRIVE) ---
  const message = `Bonjour ARJAP 👋\nNouvelle inscription\n\nNom : ${nom}\nPrénom : ${prenom}\nTéléphone : ${tel}\nNationalité : ${nat}`;
  
  const numeros = ["237653375470", "237653794702"];

  numeros.forEach(num => {
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, "_blank");
  });
        }
