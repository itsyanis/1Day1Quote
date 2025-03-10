import { ref, onMounted } from "vue";

export function useQuote() {
  // États réactifs
  const currentQuote = ref("Chargement...");
  const currentAuthor = ref("");
  const currentImage = ref("");
  const currentBio = ref("");
  const showAuthorInfo = ref(false); // État pour afficher/masquer les infos de l'auteur

  // Cache pour les citations et les images
  const cachedQuotes = ref(
    JSON.parse(localStorage.getItem("cachedQuotes")) || []
  );
  const cachedImages = ref(
    JSON.parse(localStorage.getItem("cachedImages")) || {}
  );

  // Fonction pour valider les données de citation
  const validateQuoteData = (data) => {
    if (typeof data.content !== "string" || typeof data.author !== "string") {
      throw new Error("Données de citation invalides.");
    }

    // Vérifie l'absence de balises HTML ou de scripts
    const htmlRegex = /<[^>]*>/;
    if (htmlRegex.test(data.content) || htmlRegex.test(data.author)) {
      throw new Error("Données de citation contiennent du HTML non autorisé.");
    }

    return data;
  };

  const validateImageUrl = (url) => {
    if (!url) return "/default-avatar.png";
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const isSecure = url.startsWith("https://");
    const hasValidExtension = allowedExtensions.some((ext) =>
      url.endsWith(ext)
    );
    return isSecure && hasValidExtension ? url : "/default-avatar.png";
  };

  const resizeImageUrl = (url, width = 200) => {
    if (!url) return "/default-avatar.png";

    // Regex pour correspondre aux URLs d'images de Wikipedia
    const wikipediaImageRegex =
      /\/commons\/thumb\/([a-f0-9]\/[a-f0-9]{2}\/)?([^\/]+)\/(\d+)px-([^\/]+)/;

    if (wikipediaImageRegex.test(url)) {
      // Redimensionne l'URL en remplaçant la largeur
      return url.replace(/(\d+)px-/, `${width}px-`);
    }

    // Si l'URL ne correspond pas, retourne l'URL d'origine ou une image par défaut
    return url;
  };

  // Fonction pour récupérer une citation depuis l'API ou le cache
  const fetchQuote = async () => {
    try {
      let quoteData;

      // Si des citations sont en cache, utilise-les
      if (cachedQuotes.value.length > 0) {
        quoteData = cachedQuotes.value.pop();
      } else {
        // Sinon, fais un appel API
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();
        quoteData = validateQuoteData(data); // Valide les données
        cachedQuotes.value.push(quoteData);
        localStorage.setItem(
          "cachedQuotes",
          JSON.stringify(cachedQuotes.value)
        );
      }

      currentQuote.value = quoteData.content;
      currentAuthor.value = quoteData.author;

      // Récupère l'image et la biographie de l'auteur
      const { imageUrl, bio } = await fetchAuthorInfo(quoteData.author);
      currentImage.value = imageUrl;
      currentBio.value = bio;

      // Ferme la section des informations sur l'auteur
      showAuthorInfo.value = false; // Réinitialise l'état à false
    } catch (error) {
      console.error("Erreur lors de la récupération de la citation :", error);
      currentQuote.value =
        "Impossible de charger la citation. Veuillez réessayer.";
      currentAuthor.value = "";
      currentImage.value = "/default-avatar.png";
      currentBio.value = "Aucune information biographique disponible.";
    }
  };

  // Fonction pour récupérer l'image et la biographie de l'auteur
  const fetchAuthorInfo = async (author) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages|pageterms|extracts&piprop=original&exintro=true&explaintext=true&titles=${encodeURIComponent(
          author
        )}&origin=*`
      );
      const data = await response.json();
      const page = data.query.pages[0];

      // Valide les données de la page
      if (!page || !page.title) {
        throw new Error("Auteur non trouvé sur Wikipedia.");
      }

      // Récupère l'image et l'extrait
      const imageUrl = page.original
        ? page.original.source
        : "/default-avatar.png";

      // Valide et redimensionne l'URL de l'image
      const validatedImageUrl = validateImageUrl(imageUrl);
      const resizedImageUrl = resizeImageUrl(validatedImageUrl, 200); // Redimensionne à 200px

      const bio = page.extract
        ? page.extract
        : "Aucune information biographique disponible.";

      return { imageUrl: resizedImageUrl, bio };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de l'auteur :",
        error
      );
      return {
        imageUrl: "/default-avatar.png",
        bio: "Aucune information biographique disponible.",
      };
    }
  };
  
  // Fonction pour afficher ou masquer les informations sur l'auteur
  const toggleAuthorInfo = () => {
    showAuthorInfo.value = !showAuthorInfo.value;
  };

  // Récupère une citation au chargement de la page et précharge des données
  onMounted(async () => {
    await fetchQuote(); // Charge la première citation

    // Précharge 3 citations supplémentaires
    for (let i = 0; i < 3; i++) {
      try {
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();
        const quoteData = validateQuoteData(data); // Valide les données
        cachedQuotes.value.push(quoteData);
        localStorage.setItem(
          "cachedQuotes",
          JSON.stringify(cachedQuotes.value)
        );

        // Précharge l'image de l'auteur
        if (!cachedImages.value[quoteData.author]) {
          const { imageUrl } = await fetchAuthorInfo(quoteData.author);
          cachedImages.value[quoteData.author] =
            imageUrl || "/default-avatar.png";
          localStorage.setItem(
            "cachedImages",
            JSON.stringify(cachedImages.value)
          );
        }
      } catch (error) {
        console.error("Erreur lors du préchargement des données :", error);
      }
    }
  });

  return {
    currentQuote,
    currentAuthor,
    currentImage,
    currentBio,
    showAuthorInfo,
    fetchQuote,
    toggleAuthorInfo,
  };
}
