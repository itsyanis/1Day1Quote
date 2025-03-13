import { ref, onMounted } from "vue";

export function useQuote() {
  // State variables
  const currentQuote = ref("Loading...");
  const currentAuthor = ref("");
  const currentImage = ref("");
  const currentBio = ref("");
  const showAuthorInfo = ref(false);

  // Caching for quotes and author images
  const cachedQuotes = ref(
    JSON.parse(localStorage.getItem("cachedQuotes")) || []
  );
  const cachedImages = ref(
    JSON.parse(localStorage.getItem("cachedImages")) || {}
  );
  const cachedAuthors = ref(
    JSON.parse(localStorage.getItem("cachedAuthors")) || {}
  );

  // API Key (loaded from environment variables)
  const API_KEY = import.meta.env.VITE_API_KEY;
  const QUOTE_API_URL = "https://api.api-ninjas.com/v1/quotes";
  const MIN_CACHE_SIZE = 3; // Minimum cache size before preloading new quotes

  // Function to validate the quote data before using it
  const validateQuoteData = (data) => {
    if (typeof data.quote !== "string" || typeof data.author !== "string") {
      throw new Error("Invalid quote data.");
    }

    // Prevents XSS injection via HTML
    const htmlRegex = /<[^>]*>/;
    if (htmlRegex.test(data.quote) || htmlRegex.test(data.author)) {
      throw new Error("Quote contains unauthorized HTML.");
    }

    return data;
  };

  // Function to validate image URLs and prevent invalid or insecure sources
  const validateImageUrl = (url) => {
    if (!url) return "/default-avatar.png";
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    return url.startsWith("https://") &&
      allowedExtensions.some((ext) => url.endsWith(ext))
      ? url
      : "/default-avatar.png";
  };

  // Dynamically resizes Wikipedia images if applicable
  const resizeImageUrl = (url, width = 200) => {
    return url?.replace(/(\d+)px-/, `${width}px-`) || "/default-avatar.png";
  };

  // Fetches a new quote from API or cache
  const fetchQuote = async () => {
    try {
      let quoteData;

      // If quotes are available in cache, use them first
      if (cachedQuotes.value.length > 0) {
        quoteData = cachedQuotes.value.pop();
      } else {
        // Otherwise, fetch a new quote from the API
        const response = await fetch(QUOTE_API_URL, {
          headers: { "X-Api-Key": API_KEY },
        });

        if (!response.ok) throw new Error("Network response was not ok.");

        const data = await response.json();
        quoteData = validateQuoteData(data[0]);
      }

      // Update the UI with the new quote
      currentQuote.value = quoteData.quote;
      currentAuthor.value = quoteData.author;

      // Fetch author information (with caching)
      const { imageUrl, bio } = await fetchAuthorInfo(quoteData.author);
      currentImage.value = imageUrl;
      currentBio.value = bio;

      showAuthorInfo.value = false;

      // If cache is low, preload additional quotes
      if (cachedQuotes.value.length < MIN_CACHE_SIZE) {
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

  // Fetches author information from Wikipedia API with caching
  const fetchAuthorInfo = async (author) => {
    // Check if author info is already cached
    if (cachedAuthors.value[author]) {
      return cachedAuthors.value[author];
    }

    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages|pageterms|extracts&piprop=original&exintro=true&explaintext=true&titles=${encodeURIComponent(
          author
        )}&origin=*`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        }
      );

      if (!response.ok) throw new Error("Network response was not ok.");

      const data = await response.json();
      const page = data.query.pages[0];

      if (!page || !page.title)
        throw new Error("Author not found on Wikipedia.");

      const imageUrl = page.original
        ? page.original.source
        : "/default-avatar.png";
      const validatedImageUrl = validateImageUrl(imageUrl);
      const resizedImageUrl = resizeImageUrl(validatedImageUrl, 200);
      const bio = page.extract || "No biographical information available.";

      // Store author info in cache and localStorage
      cachedAuthors.value[author] = { imageUrl: resizedImageUrl, bio };
      localStorage.setItem(
        "cachedAuthors",
        JSON.stringify(cachedAuthors.value)
      );

      return { imageUrl: resizedImageUrl, bio };
    } catch (error) {
      console.error("Error retrieving author information:", error);
      return {
        imageUrl: "/default-avatar.png",
        bio: "No biographical information available.",
      };
    }
  };

  // Preloads a batch of quotes to reduce API calls
  const preloadQuotes = async () => {
    if (cachedQuotes.value.length >= 2) return;

    try {
      const batchSize = 3;
      const responses = await Promise.all(
        Array.from({ length: batchSize }, () =>
          fetch(QUOTE_API_URL, { headers: { "X-Api-Key": API_KEY } })
        )
      );

      for (const response of responses) {
        if (!response.ok) throw new Error("Network response was not ok.");

        const data = await response.json();
        const quoteData = validateQuoteData(data[0]);

        // check we don't add duplicate
        if (!cachedQuotes.value.find((q) => q.quote === quoteData.quote)) {
          cachedQuotes.value.push(quoteData);
        }
      }

      // Save
      localStorage.setItem("cachedQuotes", JSON.stringify(cachedQuotes.value));
    } catch (error) {
      console.error("Error preloading quotes:", error);
    }
  };

  // Toggles the visibility of author information
  const toggleAuthorInfo = () => {
    showAuthorInfo.value = !showAuthorInfo.value;
  };

  // Load initial quote and preload additional quotes on component mount
  onMounted(async () => {
    await fetchQuote(); // Load the first quote
    await preloadQuotes(); // Preload additional quotes
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
