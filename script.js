function goToForm() {
  document.getElementById("home").classList.remove("active");
  document.getElementById("form").classList.add("active");
}

function goHome() {
  document.getElementById("form").classList.remove("active");
  document.getElementById("home").classList.add("active");
}

function envoyerWhatsApp() {
  const nom = nomInput();
  const prenom = prenomInput();
  const tel = telInput();
  const nat = natInput();

  if (!nom || !prenom || !tel || !nat) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  const message =
`Bonjour ARJAP 👋
Nouvelle inscription

Nom : ${nom}
Prénom : ${prenom}
Téléphone : ${tel}
Nationalité : ${nat}`;

  const numeros = [
    "237653375470",
    "237653794702",
    "237653375470"
  ];

  numeros.forEach(num => {
    window.open(
      `https://wa.me/${num}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  });
}

function nomInput() { return document.getElementById("nom").value.trim(); }
function prenomInput() { return document.getElementById("prenom").value.trim(); }
function telInput() { return document.getElementById("telephone").value.trim(); }
function natInput() { return document.getElementById("nationalite").value.trim(); }
