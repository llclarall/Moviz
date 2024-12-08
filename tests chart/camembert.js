// Charger les données JSON
fetch("data.json") // Remplacez par le chemin réel de votre fichier JSON
  .then((response) => response.json())
  .then((json) => {
    const data = json.data;

    // Configurer le centre et le rayon
    const centerX = 200;
    const centerY = 200;
    const radius = 100;
    const innerRadius = 60;
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Récupérer l'élément SVG
    const svg = document.getElementById("donutChart");

    // Variables pour les angles
    let startAngle = 0;

    // Dessiner chaque segment
    data.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      // Calculer les coordonnées des arcs
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

      // Chemin SVG pour le segment
      const pathData = `
          M ${centerX + innerRadius * Math.cos(startAngle)} ${
        centerY + innerRadius * Math.sin(startAngle)
      }
          L ${x1} ${y1}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
          L ${centerX + innerRadius * Math.cos(endAngle)} ${
        centerY + innerRadius * Math.sin(endAngle)
      }
          A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${
        centerX + innerRadius * Math.cos(startAngle)
      } ${centerY + innerRadius * Math.sin(startAngle)}
          Z
        `;

      // Créer un élément <path> pour chaque segment
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", pathData);
      path.setAttribute("fill", item.color);

      svg.appendChild(path);

      startAngle = endAngle; // Mettre à jour l'angle de départ
    });

    // Ajouter le texte des pourcentages
    startAngle = 0; // Réinitialiser l'angle
    data.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const midAngle = startAngle + sliceAngle / 2;

      // Position du texte
      const textX = centerX + (radius + 20) * Math.cos(midAngle);
      const textY = centerY + (radius + 20) * Math.sin(midAngle);

      // Créer un élément <text>
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", textX);
      text.setAttribute("y", textY);
      text.setAttribute("fill", "#FFF");
      text.setAttribute("font-size", "16");
      text.setAttribute("text-anchor", "middle");
      text.textContent = `${item.value}%`;

      svg.appendChild(text);

      startAngle += sliceAngle; // Mettre à jour l'angle de départ
    });
  });
