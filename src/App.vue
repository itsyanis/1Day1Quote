<!-- src/App.vue -->
<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- En-tête -->
    <Header />

    <!-- Contenu principal -->
    <main class="flex-grow flex items-center justify-center p-6">
      <QuoteCard :currentQuote="currentQuote" :currentAuthor="currentAuthor" :currentImage="currentImage"
        :currentBio="currentBio" :showAuthorInfo="showAuthorInfo" @fetch-quote="fetchQuote"
        @toggle-author-info="toggleAuthorInfo" />
    </main>

    <!-- Pied de page -->
    <Footer />
  </div>
</template>

<script setup>
import { useQuote } from './composables/useQuote';
import Header from './components/Header.vue';
import QuoteCard from './components/QuoteCard.vue';
import Footer from './components/Footer.vue';

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