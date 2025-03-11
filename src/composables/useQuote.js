import { ref, onMounted } from "vue";

export function useQuote() {
  // States
  const currentQuote = ref("Chargement...");
  const currentAuthor = ref("");
  const currentImage = ref("");
  const currentBio = ref("");
  const showAuthorInfo = ref(false);

  // Cache for quotes and images
  const cachedQuotes = ref(
    JSON.parse(localStorage.getItem("cachedQuotes")) || []
  );
  const cachedImages = ref(
    JSON.parse(localStorage.getItem("cachedImages")) || {}
  );

  const validateQuoteData = (data) => {
    if (typeof data.content !== "string" || typeof data.author !== "string") {
      throw new Error("Invalid quote data.");
    }

    // Checks for absence of HTML tags or scripts
    const htmlRegex = /<[^>]*>/;
    if (htmlRegex.test(data.content) || htmlRegex.test(data.author)) {
      throw new Error("Quote data contains unauthorized HTML.");
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
      // Resizes URL by replacing width
      return url.replace(/(\d+)px-/, `${width}px-`);
    }

    return url;
  };

  // Function to retrieve a quote from the API or cache
  const fetchQuote = async () => {
    try {
      let quoteData;

      if (cachedQuotes.value.length > 0) {
        quoteData = cachedQuotes.value.pop();
      } else {
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();
        quoteData = validateQuoteData(data);
        cachedQuotes.value.push(quoteData);
        localStorage.setItem(
          "cachedQuotes",
          JSON.stringify(cachedQuotes.value)
        );
      }

      currentQuote.value = quoteData.content;
      currentAuthor.value = quoteData.author;

      const { imageUrl, bio } = await fetchAuthorInfo(quoteData.author);
      currentImage.value = imageUrl;
      currentBio.value = bio;

      showAuthorInfo.value = false;
    } catch (error) {
      console.error("Error while retrieving the quote:", error);
      currentQuote.value = "Unable to load the quote. Please try again.";
      currentAuthor.value = "";
      currentImage.value = "/default-avatar.png";
      currentBio.value = "No biographical information available.";
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
        throw new Error("Author not found on Wikipedia.");
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
        : "No biographical information available.";

      return { imageUrl: resizedImageUrl, bio };
    } catch (error) {
      console.error("Error retrieving author information :", error);
      return {
        imageUrl: "/default-avatar.png",
        bio: "No biographical information available.",
      };
    }
  };

  const toggleAuthorInfo = () => {
    showAuthorInfo.value = !showAuthorInfo.value;
  };

  // Retrieves a quote on page load and preloads data
  onMounted(async () => {
    await fetchQuote(); // Charge la première citation

    // Preload 3 more quotes
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
        console.error("Error when preloading data :", error);
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
