 function goToForm() {
  document.getElementById("home").classList.remove("active");
  document.getElementById("form").classList.add("active");
}

function goHome() {
  document.getElementById("form").classList.remove("active");
  document.getElementById("home").classList.add("active");
}

 function envoyerWhatsApp() {
  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const tel = document.getElementById("telephone").value.trim();
  const nat = document.getElementById("nationalite").value.trim();

  if (!nom || !prenom || !tel || !nat) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  // 1️⃣ ENVOI À LA BASE DE DONNÉES
  await fetch("/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nom,
      prenom,
      telephone: tel,
      nationalite: nat
    })
  });

  // 2️⃣ ENVOI WHATSAPP
  const message =
`Nouvelle inscription ARJAP

Nom : ${nom}
Prénom : ${prenom}
Téléphone : ${tel}
Nationalité : ${nat}`;

  window.open(
    `https://wa.me/237653375470?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}
