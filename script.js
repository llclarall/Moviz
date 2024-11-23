
/* vérifie la taille des fichiers JSON pour voir si j'ai bien les données pour mes 1000 films */

// Charger le fichier JSON
fetch('filmsDataEnriched.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json(); // Parser la réponse en JSON
  })
  .then(films => {
    if (Array.isArray(films)) {
      console.log(`Nombre d'objets dans le tableau : ${films.length}`);
    } else {
      console.error("Le contenu du fichier JSON n'est pas un tableau.");
    }
  })
  .catch(err => console.error("Erreur :", err));
