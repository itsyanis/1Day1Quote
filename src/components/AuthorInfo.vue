<template>
    <div class="mt-4 p-4 bg-gray-50 rounded-lg text-left max-h-48 overflow-y-auto">
        <p class="text-base font-semibold text-gray-800">About the author:</p>
        <p class="text-gray-700 mt-1 text-sm">{{ bio }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    bio: String
});
</script>
