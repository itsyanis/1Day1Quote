<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Header -->
    <Header />

    <!-- Main content -->
    <main class="flex-grow flex items-center justify-center p-6">
      <QuoteCard :currentQuote="currentQuote" :currentAuthor="currentAuthor" :currentImage="currentImage"
        :currentBio="currentBio" :showAuthorInfo="showAuthorInfo" @fetch-quote="fetchQuote"
        @toggle-author-info="toggleAuthorInfo" />
    </main>

    <StorageInfoBanner />
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>

import { useHead } from '@vueuse/head';
import { useQuote } from './composables/useQuote';
import Header from './components/Header.vue';
import QuoteCard from './components/QuoteCard.vue';
import Footer from './components/Footer.vue';
import StorageInfoBanner from "./components/StorageInfoBanner.vue";

useHead({
  title: "1Day1Quote",
  meta: [
    { name: "description", content: "Discover a new inspirational quote every day with 1Day1Quote." },

    // SEO
    { property: "og:title", content: "1Day1Quote" },
    { property: "og:description", content: "Find an inspirational quote every day and discover its author." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://1day1quote.vercel.app" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "1Day1Quote" },
    { name: "twitter:description", content: "One quote a day for inspiration." },
  ]
});

const {
  currentQuote,
  currentAuthor,
  currentImage,
  currentBio,
  showAuthorInfo,
  fetchQuote,
  toggleAuthorInfo,
} = useQuote();


</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Neuton:wght@400;700&display=swap');

body {
  font-family: 'Neuton', sans-serif;
}
</style>
