
/* vérifie la taille des fichiers JSON pour voir si j'ai bien les données pour mes 1000 films */


fetch('filmsDataEnriched.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json();
  })
  .then(films => {
    if (Array.isArray(films)) {
      console.log(`Nombre d'objets dans le tableau : ${films.length}`);
    } else {
      console.error("Le contenu du fichier JSON n'est pas un tableau.");
    }
  })
  .catch(err => console.error("Erreur :", err));




/* GRAPHIQUE 1 */


// Fonction pour afficher les infos du film
function showInfo(film) {
  const infoBox = document.getElementById('info-box');

  // Vérification des données disponibles
  const title = film.title || "Titre inconnu";
  const releaseDate = film.releaseDate || "Année inconnue";
  const director = film.director || "Réalisateur inconnu";
  const plot = film.plot || "Résumé non disponible.";
  const poster = film.poster || "https://via.placeholder.com/150"; // Image par défaut si pas de poster
  const boxOffice = film.boxOffice || "Données non disponibles";

  // Insertion des données dans l'élément HTML
  infoBox.innerHTML = `
    <div class="movie-info">
      <img src="${poster}" alt="Affiche du film ${title}" class="movie-poster">
      <div class="movie-details">
        <h2>${title} <span>(${releaseDate})</span></h2>
        <p><strong>Réalisateur :</strong> ${director}</p>
        <p><strong>Revenus bruts :</strong> ${boxOffice} $</p>
        <p><strong>Résumé :</strong> ${plot}</p>
      </div>
    </div>
  `;
}


// Fonction pour filtrer par genre et afficher le graphique
function filterByGenre(films, selectedGenre) {
  const svg = document.getElementById('barChart');
  svg.innerHTML = `
  <line x1="10" y1="500" x2="775" y2="500" class="axis-line"></line>
  <polygon points="785,500 775,495 775,505" fill="#ffffff"></polygon>
  <line x1="10" y1="50" x2="10" y2="500" class="axis-line"></line>
  <text x="10" y="520" class="axis-label">0</text>
  <text x="160" y="520" class="axis-label">250M</text>
  <text x="360" y="520" class="axis-label">500M</text>
  <text x="560" y="520" class="axis-label">750M</text>
  <text x="760" y="520" class="axis-label">1000M</text>
  <text x="350" y="550" class="axis-label">Revenus bruts (en $)</text>
`; // Nettoyer le SVG avant de redessiner mais garder les axes

  // Filtrer les films par genre si un genre est sélectionné
  let filteredFilms = [];

  // Filtrer les films qui correspondent au genre sélectionné
  if (selectedGenre) {
    filteredFilms = films.filter(film => film.genre.includes(selectedGenre));
  } else {
    filteredFilms = films;
  }

  // Trier les films par box office décroissant
  filteredFilms.sort((a, b) => {
    const boxA = Number(a.boxOffice.replace(/,/g, '')) || 0;
    const boxB = Number(b.boxOffice.replace(/,/g, '')) || 0;
    return boxB - boxA;
  });

  // Prendre les 5 premiers films
  filteredFilms = filteredFilms.slice(0, 5);

  // Redessiner les barres pour les films filtrés
  let yPosition = 70; // Position verticale initiale

  filteredFilms.forEach(film => {
    // Nettoyer et convertir les revenus en nombre
    const cleanedBoxOffice = film.boxOffice.replace(/,/g, '');
    const boxOfficeValue = Number(cleanedBoxOffice);

    // Vérifier si la valeur est valide
    if (isNaN(boxOfficeValue)) {
      console.warn(`Revenus invalides pour le film : ${film.title}`);
      return;
    }

    // Calculer les dimensions
    const barWidth = boxOfficeValue / 1320000;

    // Barre principale
    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar.setAttribute("x", 15);
    bar.setAttribute("y", yPosition + 1);
    bar.setAttribute("width", barWidth);
    bar.setAttribute("height", 37);
    bar.setAttribute("class", "bar");
    bar.style.cursor = "pointer";
    bar.addEventListener("click", () => {
      showInfo(film); 
      const infoBox = document.querySelector(".info-box"); 
      if (infoBox) {
          infoBox.scrollIntoView({ behavior: "smooth", block: "start" }); 
      }
    });
    svg.appendChild(bar);

    // Ajouter les stripes à la barre
    const stripeHeight = 27;
    const stripeWidth = 11;
    const gap = 8;

    for (let i = 0; i < Math.floor(barWidth / (stripeWidth + gap)); i++) {
      const stripe = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      stripe.setAttribute("x", 25 + i * (stripeWidth + gap));
      stripe.setAttribute("y", yPosition + 6);
      stripe.setAttribute("width", stripeWidth);
      stripe.setAttribute("height", stripeHeight);
      stripe.setAttribute("fill", "#c8c3b4");
      stripe.setAttribute("class", "bar-stripe");
      stripe.style.cursor = "pointer";
      stripe.addEventListener("click", () => {
        showInfo(film); 
        const infoBox = document.querySelector(".info-box"); 
        if (infoBox) {
            infoBox.scrollIntoView({ behavior: "smooth", block: "start" }); 
        }
      });
      svg.appendChild(stripe);
    }

    const cassetteWidth = 220;

    // Ajouter la cassette
    const cassette = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    cassette.setAttribute("x", 10);
    cassette.setAttribute("y", yPosition - 5);
    cassette.setAttribute("width", cassetteWidth);
    cassette.setAttribute("height", 50);
    cassette.setAttribute("rx", "3");
    cassette.style.cursor = "pointer";
    cassette.addEventListener("click", () => {
      showInfo(film); 
      const infoBox = document.querySelector(".info-box"); 
      if (infoBox) {
          infoBox.scrollIntoView({ behavior: "smooth", block: "start" }); 
      }
    });
    cassette.setAttribute("class", "cassette-body");
    svg.appendChild(cassette);

    // Lignes de détail de la cassette
    for (let i = 0; i < 2; i++) {
      const detail = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      detail.setAttribute("x", 16 + i * 192);
      detail.setAttribute("y", yPosition + 4);
      detail.setAttribute("width", 15);
      detail.setAttribute("height", 32);
      detail.setAttribute("rx", "2");
      detail.style.cursor = "pointer";
      detail.addEventListener("click", () => {
        showInfo(film); 
        const infoBox = document.querySelector(".info-box"); 
        if (infoBox) {
            infoBox.scrollIntoView({ behavior: "smooth", block: "start" }); 
        }
      });
      detail.setAttribute("class", "cassette-detail");
      svg.appendChild(detail);
    }

    // Etiquette de la cassette
    const middleDetail = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    middleDetail.setAttribute("x", 40);
    middleDetail.setAttribute("y", yPosition + 2);
    middleDetail.setAttribute("width", 160);
    middleDetail.setAttribute("height", 36);
    middleDetail.style.cursor = "pointer";
    middleDetail.addEventListener("click", () => {
      showInfo(film); 
      const infoBox = document.querySelector(".info-box"); 
      if (infoBox) {
          infoBox.scrollIntoView({ behavior: "smooth", block: "start" }); 
      }
    });
    middleDetail.setAttribute("class", "cassette-etiquette");
    svg.appendChild(middleDetail);

    // Largeur maximale de l'étiquette
    const maxWidth = 150;

    // Ajouter le texte de la cassette
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", 110); // Position initiale
    label.setAttribute("y", yPosition + 24); // Position verticale initiale
    label.setAttribute("class", "cassette-label");
    label.style.cursor = "pointer";
    label.addEventListener("click", () => {
      showInfo(film); 
      const infoBox = document.querySelector(".info-box"); 
      if (infoBox) {
          infoBox.scrollIntoView({ behavior: "smooth", block: "start" }); 
      }
    });

    // Diviser le texte en plusieurs lignes si nécessaire
    const words = film.title.split(" ");
    let currentLine = "";
    let lines = [];

    // SVG ne peut pas mesurer directement les mots avant leur ajout, donc on utilise un élément temporaire
    const tempText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tempText.setAttribute("class", "cassette-label");
    svg.appendChild(tempText);

    words.forEach((word) => {
      tempText.textContent = currentLine + (currentLine ? " " : "") + word;
      const textWidth = tempText.getBBox().width;

      if (textWidth > maxWidth) {
        // Si la ligne actuelle dépasse la largeur max, on enregistre la ligne et on démarre une nouvelle
        lines.push(currentLine);
        currentLine = word;
        label.setAttribute("y", yPosition + 16);
      } else {
        // Sinon, on continue d'ajouter à la ligne actuelle
        currentLine += (currentLine ? " " : "") + word;
      }
    });

    // Ajouter la dernière ligne
    if (currentLine) lines.push(currentLine);

    // Supprimer l'élément temporaire
    svg.removeChild(tempText);

    // Ajouter les lignes au label avec des tspan
    lines.forEach((line, index) => {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute("x", 120); // Garder la position horizontale fixe
      tspan.setAttribute("dy", index === 0 ? 0 : 16); // Décalage vertical entre les lignes (16 px ici)
      tspan.textContent = line;
      label.appendChild(tspan);
    });

    // Ajouter le label au SVG
    svg.appendChild(label);


    // Augmenter la position verticale pour le prochain film
    yPosition += 90;
  });
}


// Charger les données des films enrichies
fetch('./filmsDataEnriched.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des données.');
    }
    return response.json();
  })
  .then(films => {
    const svg = document.getElementById('barChart');
    const buttonsContainer = document.getElementById('genre-buttons');

    // Liste personnalisée des genres à afficher
    const selectedGenres = ['Sci-Fi', 'Action', 'Drama', 'Fantasy', 'Animation'];

    // Créer un bouton pour chaque genre sélectionné
    selectedGenres.forEach(genre => {
      const button = document.createElement('button');
      button.textContent = genre;
      /*           button.style.marginRight = "10px";
                button.style.padding = "8px 12px";
                button.style.cursor = "pointer";
                button.style.borderRadius = "5px";
                button.style.border = "none";
                button.style.backgroundColor = "#746e67";
                button.style.color = "#fff"; */
      button.setAttribute("class", "filtre");

      button.addEventListener('click', () => filterByGenre(films, genre));
      buttonsContainer.appendChild(button);
    });

    // Ajouter un bouton "Tous les genres"
    const allButton = document.createElement('button');
    allButton.textContent = "Tous les genres";
    allButton.style.marginRight = "10px";
    allButton.style.padding = "8px 12px";
    allButton.style.cursor = "pointer";
    allButton.style.borderRadius = "5px";
    allButton.style.border = "none";
    allButton.style.backgroundColor = "#6b6b6b";
    allButton.style.color = "#fff";

    allButton.addEventListener('click', () => filterByGenre(films, null));
    buttonsContainer.appendChild(allButton);

    // Afficher les 5 meilleurs de tous les genres au début
    filterByGenre(films, null);
  })
  .catch(error => {
    console.error('Erreur lors du chargement ou du traitement des données :', error);
  });
fetch('./filmsDataEnriched.json')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erreur lors du chargement des données :', error));