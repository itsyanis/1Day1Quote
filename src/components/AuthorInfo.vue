<template>
    <div class="mt-8 p-6 bg-gray-100 rounded-lg text-left max-h-64 overflow-y-auto">
        <p class="text-lg font-semibold text-gray-800">À propos de l'auteur :</p>
        <p class="text-gray-700 mt-2">{{ bio }}</p>
    </div>
</template>

<script setup>
defineProps({
    bio: String,
});
</script>