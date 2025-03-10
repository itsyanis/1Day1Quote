<template>
    <header class="p-4 bg-white/80 backdrop-blur-md shadow-lg">
        <div class="container mx-auto flex justify-between items-center">
            <!-- Logo -->
            <div
                class="text-2xl font-pacifico bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent transform translate-y-2 pb-2">
                1Day1Quote
            </div>
            <!-- Liens -->
            <nav class="space-x-6">
                <a href="#"
                    class="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent font-medium hover:from-teal-600 hover:to-cyan-600 transition duration-300">Quotes
                    by category</a>
                <a href="#"
                    class="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent font-medium hover:from-teal-600 hover:to-cyan-600 transition duration-300">My
                    favourite
                    quotes</a>
                <a href="#"
                    class="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent font-medium hover:from-teal-600 hover:to-cyan-600 transition duration-300">Quiz
                </a>
            </nav>

        </div>
    </header>
</template>

<script setup>
// Pas de logique nécessaire ici pour l'instant
</script>

<style scoped>
/* Importation de la police Pacifico */
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

.font-pacifico {
    font-family: 'Pacifico', cursive;
}
</style>