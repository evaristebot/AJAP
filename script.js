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

  const message =
`Bonjour ARJAP 👋
Nouvelle inscription

Nom : ${nom}
Prénom : ${prenom}
Téléphone : ${tel}
Nationalité : ${nat}

📌 Responsables :
+237654823558
+237653794702
+237653375470`;

  const numeroPrincipal = "237653375470";

  window.open(
    `https://wa.me/${numeroPrincipal}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}
