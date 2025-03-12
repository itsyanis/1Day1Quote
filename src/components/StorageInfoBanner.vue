<template>
    <div v-if="showStorageInfo" class="storage-info">
        <p>
            We use your browser's local storage to save quotes and improve your experience.
            experience.
            <button @click="closeBanner">OK</button>
        </p>
    </div>
</template>

<script setup>
import { ref } from "vue";

// Display the banner only if the user has not already seen it
const showStorageInfo = ref(!localStorage.getItem("storageInfoSeen"));

// Close the banner and register that the user has seen it
const closeBanner = () => {
    localStorage.setItem("storageInfoSeen", "true");
    showStorageInfo.value = false;
};
</script>

<style scoped>
.storage-info {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f8f9fa;
    padding: 1rem;
    text-align: center;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.storage-info p {
    margin: 0;
    font-size: 0.9rem;
    color: #333;
}

.storage-info button {
    margin-left: 1rem;
    padding: 0.25rem 0.5rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.storage-info button:hover {
    background: #0056b3;
}
</style>