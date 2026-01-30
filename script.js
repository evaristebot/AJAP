 function ouvrirInscription() {
  document.getElementById("accueil").style.display = "none";
  document.getElementById("inscription").style.display = "block";
}

function envoyerWhatsApp() {
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const telephone = document.getElementById("telephone").value;
  const nationalite = document.getElementById("nationalite").value;

  if (!nom || !prenom || !telephone || !nationalite) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  const message = 
`Nouvelle inscription ARJAP :
Nom : ${nom}
Prénom : ${prenom}
Téléphone : ${telephone}
Nationalité : ${nationalite}`;

  const numeros = [
    "237653375470",
    "237654823559",
    "237XXXXXXXXX" // remplace si besoin
  ];

  numeros.forEach(num => {
    const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  });
}
