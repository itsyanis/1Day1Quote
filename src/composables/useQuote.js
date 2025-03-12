import { ref, onMounted } from "vue";

export function useQuote() {
  // States
  const currentQuote = ref("Loading...");
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

  // Validate quote data
  const validateQuoteData = (data) => {
    if (typeof data.content !== "string" || typeof data.author !== "string") {
      throw new Error("Invalid quote data.");
    }

    // Prevents XSS injection via HTML
    const htmlRegex = /<[^>]*>/;
    if (htmlRegex.test(data.content) || htmlRegex.test(data.author)) {
      throw new Error("Quote contains unauthorized HTML.");
    }

    return data;
  };

  // Validate and secure image URLs
  const validateImageUrl = (url) => {
    if (!url) return "/default-avatar.png";
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const isSecure = url.startsWith("https://");
    const hasValidExtension = allowedExtensions.some((ext) =>
      url.endsWith(ext)
    );

    return isSecure && hasValidExtension ? url : "/default-avatar.png";
  };

  // Resize Wikipedia images dynamically
  const resizeImageUrl = (url, width = 200) => {
    if (!url) return "/default-avatar.png";

    const wikipediaImageRegex =
      /\/commons\/thumb\/([a-f0-9]\/[a-f0-9]{2}\/)?([^\/]+)\/(\d+)px-([^\/]+)/;

    if (wikipediaImageRegex.test(url)) {
      return url.replace(/(\d+)px-/, `${width}px-`);
    }

    return url;
  };

  // Fetch and cache quotes
  const fetchQuote = async () => {
    try {
      let quoteData;

      if (cachedQuotes.value.length > 0) {
        quoteData = cachedQuotes.value.pop();
      } else {
        const response = await fetch("https://api.quotable.io/random", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        quoteData = validateQuoteData(data);
      }

      currentQuote.value = quoteData.content;
      currentAuthor.value = quoteData.author;

      const { imageUrl, bio } = await fetchAuthorInfo(quoteData.author);
      currentImage.value = imageUrl;
      currentBio.value = bio;

      showAuthorInfo.value = false;

      if (cachedQuotes.value.length === 0) {
        await preloadQuotes();
      }
    } catch (error) {
      console.error("Error retrieving the quote:", error);
      currentQuote.value = "Unable to load the quote. Please try again.";
      currentAuthor.value = "";
      currentImage.value = "/default-avatar.png";
      currentBio.value = "No biographical information available.";
    }
  };

  // Fetch author info & optimize images
  const fetchAuthorInfo = async (author) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages|pageterms|extracts&piprop=original&exintro=true&explaintext=true&titles=${encodeURIComponent(
          author
        )}&origin=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Origin: window.location.origin,
          },
        }
      );
      const data = await response.json();
      const page = data.query.pages[0];

      if (!page || !page.title) {
        throw new Error("Author not found on Wikipedia.");
      }

      const imageUrl = page.original
        ? page.original.source
        : "/default-avatar.png";
      const validatedImageUrl = validateImageUrl(imageUrl);
      const resizedImageUrl = resizeImageUrl(validatedImageUrl, 200);

      cachedImages.value[author] = resizedImageUrl;
      localStorage.setItem("cachedImages", JSON.stringify(cachedImages.value));

      const bio = page.extract || "No biographical information available.";
      return { imageUrl: resizedImageUrl, bio };
    } catch (error) {
      console.error("Error retrieving author information:", error);
      return {
        imageUrl: "/default-avatar.png",
        bio: "No biographical information available.",
      };
    }
  };

  // Preload quotes
  const preloadQuotes = async () => {
    const preloadQuotes = [];
    for (let i = 0; i < 3; i++) {
      preloadQuotes.push(fetch("https://api.quotable.io/random"));
    }

    try {
      const responses = await Promise.all(preloadQuotes);
      for (const response of responses) {
        const data = await response.json();
        const quoteData = validateQuoteData(data);
        cachedQuotes.value.push(quoteData);

        // Preload author images
        if (!cachedImages.value[quoteData.author]) {
          const { imageUrl } = await fetchAuthorInfo(quoteData.author);
          cachedImages.value[quoteData.author] =
            imageUrl || "/default-avatar.png";
        }
      }

      localStorage.setItem("cachedQuotes", JSON.stringify(cachedQuotes.value));
      localStorage.setItem("cachedImages", JSON.stringify(cachedImages.value));
    } catch (error) {
      console.error("Error preloading quotes:", error);
    }
  };

  const toggleAuthorInfo = () => {
    showAuthorInfo.value = !showAuthorInfo.value;
  };

  // Load initial quote and preload more quotes asynchronously
  onMounted(async () => {
    await fetchQuote();
    await preloadQuotes();
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
