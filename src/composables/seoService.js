import { useHead } from "@vueuse/head";

export function useSEOMetaTags(title, description, image, lang = "en") {
  useHead({
    title: title || "1Day1Quote - Inspiring Quote of the Day",
    htmlAttrs: {
      lang: lang,
    },
    meta: [
      {
        name: "description",
        content: description || "Discover a new inspiring quote every day.",
      },
      {
        property: "og:title",
        content: title || "1Day1Quote - Inspiring Quotes",
      },
      {
        property: "og:description",
        content: description || "Find daily inspiration with a new quote.",
      },
      {
        property: "og:image",
        content: image || "/default-image.jpg",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: title || "1Day1Quote - Inspiring Quotes",
      },
      {
        name: "twitter:description",
        content: description || "Get inspired with a new quote every day.",
      },
      {
        name: "twitter:image",
        content: image || "/default-image.jpg",
      },
    ],
  });
}
