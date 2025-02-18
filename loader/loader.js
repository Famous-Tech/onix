document.addEventListener("DOMContentLoaded", function () {
    // Charger dynamiquement le HTML du loader
    fetch("/loader/loader.html")
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML("afterbegin", html);
            setTimeout(() => {
                document.querySelector('.loader-container').classList.add('hidden');
            }, 3000); // Le loader disparaît après 3 secondes
        })
        .catch(error => console.error("Erreur lors du chargement du loader :", error));

    // Charger dynamiquement le CSS du loader
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/loader/loader.css";
    document.head.appendChild(link);
});
