<template>
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
        <!-- Header -->
        <Header />

        <!-- Main content -->
        <main class="flex-grow flex flex-col items-center p-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">My favorite quotes</h1>
            <div class="grid gap-6 w-full max-w-4xl">
                <div v-for="(quote, index) in likedQuotes" :key="index"
                    class="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div class="flex justify-center mb-6">
                        <div class="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-sm">
                            <img :src="quote.image" alt="Auteur de la citation" class="w-full h-full object-cover" />
                        </div>
                    </div>
                    <blockquote class="text-center">
                        <p class="text-2xl font-serif italic text-gray-800 leading-tight">"{{ quote.content }}"</p>
                    </blockquote>
                    <p class="text-base text-gray-600 mt-3 font-medium">- {{ quote.author }}</p>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <Footer />
    </div>
</template>

<script setup>
import { useQuote } from '../composables/useQuote';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const { likedQuotes } = useQuote();
</script>