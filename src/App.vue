<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
    <!-- En-tête -->
    <Header />

    <!-- Contenu principal -->
    <main
      class="flex-grow flex items-center justify-center p-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQgMTQ0Ij48cGF0aCBmaWxsPSIjZTBmN2ZhIiBkPSJNMCAwSDE0NFYxNDRIMHoiLz48cGF0aCBmaWxsPSIjYjJlYmYyIiBkPSJNMTQ0IDB2MTQ0Yy0yNC0xMC00OC0yMC03Mi0zMGMtMjQtMTAtNDgtMjAtNzItMzB2LTE0NGgxNDR6Ii8+PC9zdmc+')]">

      <QuoteCard :currentQuote="currentQuote" :currentAuthor="currentAuthor" :currentImage="currentImage"
        :currentBio="currentBio" :showAuthorInfo="showAuthorInfo" @fetch-quote="fetchQuote"
        @toggle-author-info="toggleAuthorInfo" />
    </main>

    <!-- Pied de page -->
    <Footer />
  </div>
</template>

<script setup>
import { useQuote } from './composables/useQuote'; // Importez le composable
import Header from './components/Header.vue';
import QuoteCard from './components/QuoteCard.vue';
import Footer from './components/Footer.vue';

// Utilisation du composable useQuote
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

<!-- <main
      class="flex-grow flex items-center justify-center p-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQgMTQ0Ij48cGF0aCBmaWxsPSIjZTBmN2ZhIiBkPSJNMCAwSDE0NFYxNDRIMHoiLz48cGF0aCBmaWxsPSIjYjJlYmYyIiBkPSJNMTQ0IDB2MTQ0Yy0yNC0xMC00OC0yMC03Mi0zMGMtMjQtMTAtNDgtMjAtNzItMzB2LTE0NGgxNDR6Ii8+PC9zdmc+')]"></main> -->