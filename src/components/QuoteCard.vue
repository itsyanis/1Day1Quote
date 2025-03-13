<template>
    <div class="text-center bg-white rounded-xl shadow-lg p-8 max-w-lg w-full relative border border-gray-100">
        <!-- Information button -->
        <button @click="toggleAuthorInfo" class="absolute top-4 right-4 p-2  " title="Informations sur l'auteur">
            ℹ️
        </button>


        <!-- Author image -->
        <div class="flex justify-center mb-6">
            <div class="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-sm">
                <img :src="currentImage" alt="Auteur de la citation"
                    class="w-full h-full object-cover transition-opacity ease-in-out" loading="lazy" v-if="currentImage"
                    @error="(e) => e.target.src = '/default-avatar.png'" />
                <div v-else class="w-full h-full bg-gray-200 animate-pulse"></div>
            </div>
        </div>

        <!-- Quote -->
        <blockquote class="text-center">
            <svg class="w-10 h-10 mx-auto text-black mb-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="currentColor" viewBox="0 0 18 14">
                <path
                    d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
            </svg>
            <p class="text-2xl font-serif italic text-gray-800 leading-tight">"{{ currentQuote }}"</p>
        </blockquote>

        <!-- Author -->
        <p class="text-base text-gray-600 mt-3 font-medium">- {{ currentAuthor }}</p>

        <!--Generate new Quote -->
        <button @click="fetchQuote"
            class="mt-6 bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition duration-300 ">
            New quote
        </button>

        <!-- Author's information -->
        <div v-if="showAuthorInfo" class="mt-4 p-4 bg-gray-50 rounded-lg text-left max-h-48 overflow-y-auto">
            <p class="text-base font-semibold text-gray-800">About the author:</p>
            <p class="text-gray-700 mt-1 text-sm">{{ currentBio }}</p>
        </div>
    </div>
</template>

<script setup>
import { useHead } from '@vueuse/head';
import { computed } from 'vue';

const props = defineProps({
    currentQuote: String,
    currentAuthor: String,
    currentImage: String,
    currentBio: String,
    showAuthorInfo: Boolean,
});

const emit = defineEmits(['fetch-quote', 'toggle-author-info']);

const fetchQuote = () => {
    emit('fetch-quote');
};

const toggleAuthorInfo = () => {
    emit('toggle-author-info');
};

// ✅ Dynamic SEO: Updating title and description based on quote & author
useHead(computed(() => ({
    title: props.currentAuthor
        ? `1Day1Quote - Quote by ${props.currentAuthor}`
        : "1Day1Quote - Inspiring Quote of the Day",
    meta: [
        {
            name: "description",
            content: props.currentQuote
                ? `"${props.currentQuote}" - ${props.currentAuthor}`
                : "Discover a new inspiring quote every day."
        },
        // Open Graph (for Facebook, LinkedIn sharing)
        {
            property: "og:title", content: props.currentAuthor
                ? `Quote by ${props.currentAuthor} - 1Day1Quote`
                : "1Day1Quote - Inspiring Quotes"
        },
        {
            property: "og:description", content: props.currentQuote
                ? `"${props.currentQuote}" - ${props.currentAuthor}`
                : "Find daily inspiration with a new quote."
        },
        { property: "og:image", content: props.currentImage || "/default-image.jpg" },
        { property: "og:type", content: "website" },

        // Twitter Card (for Twitter sharing)
        { name: "twitter:card", content: "summary_large_image" },
        {
            name: "twitter:title", content: props.currentAuthor
                ? `Quote by ${props.currentAuthor} - 1Day1Quote`
                : "1Day1Quote - Inspiring Quotes"
        },
        {
            name: "twitter:description", content: props.currentQuote
                ? `"${props.currentQuote}" - ${props.currentAuthor}`
                : "Get inspired with a new quote every day."
        },
        { name: "twitter:image", content: props.currentImage || "/default-image.jpg" }
    ]
})));
</script>

<style scoped>
blockquote p,
p,
button,
div {
    font-family: 'Neuton', serif;
}
</style>


<style scoped>
blockquote p,
p,
button,
div {
    font-family: 'Neuton', serif;
}
</style>