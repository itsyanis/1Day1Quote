<template>
    <div
        class="text-center bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 max-w-md w-full relative border border-gray-100">
        <!-- Bouton d'information à l'intérieur du conteneur -->
        <button @click="toggleAuthorInfo"
            class="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm hover:bg-gray-50 transition duration-300 text-gray-600 hover:text-gray-800"
            title="Informations sur l'auteur">
            ℹ️
        </button>

        <!-- Bulle avec l'image -->
        <div class="flex justify-center mb-6">
            <div class="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-sm">
                <img :src="currentImage" alt="Auteur de la citation" class="w-full h-full object-cover"
                    v-if="currentImage" />
                <div v-else class="w-full h-full bg-gray-200 animate-pulse"></div> <!-- Squelette de chargement -->
            </div>
        </div>

        <!-- Citation avec blockquote et SVG -->
        <blockquote class="text-center">
            <svg class="w-10 h-10 mx-auto text-gray-400 mb-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="currentColor" viewBox="0 0 18 14">
                <path
                    d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
            </svg>
            <p class="text-2xl font-serif italic text-gray-800 leading-tight">"{{ currentQuote }}"</p>
        </blockquote>

        <!-- Auteur -->
        <p class="text-base text-gray-600 mt-3 font-medium">- {{ currentAuthor }}</p>

        <!-- Bouton pour une nouvelle citation -->
        <button @click="fetchQuote"
            class="mt-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-5 py-2 rounded-full hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
            Nouvelle citation
        </button>

        <!-- Bouton "Like" (cœur) -->
        <button @click="toggleLike"
            class="absolute top-3 left-3 bg-white rounded-full p-2 shadow-sm hover:bg-gray-50 transition duration-300 text-gray-600 hover:text-red-500"
            title="J'aime cette citation">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>

        <!-- Informations sur l'auteur -->
        <div v-if="showAuthorInfo" class="mt-4 p-4 bg-gray-50 rounded-lg text-left max-h-48 overflow-y-auto">
            <p class="text-base font-semibold text-gray-800">À propos de l'auteur :</p>
            <p class="text-gray-700 mt-1 text-sm">{{ currentBio }}</p>
        </div>
    </div>
</template>

<script setup>
defineProps({
    currentQuote: String,
    currentAuthor: String,
    currentImage: String,
    currentBio: String,
    showAuthorInfo: Boolean,
});

const emit = defineEmits(['fetch-quote', 'toggle-author-info', 'toggle-like']);

const fetchQuote = () => {
    emit('fetch-quote'); // Émet l'événement pour générer une nouvelle citation
};

const toggleAuthorInfo = () => {
    emit('toggle-author-info'); // Émet l'événement pour basculer l'affichage des infos de l'auteur
};

const toggleLike = () => {
    emit('toggle-like'); // Émet l'événement pour liker la citation
};
</script>

<style scoped>
/* Styles supplémentaires si nécessaire */
</style>