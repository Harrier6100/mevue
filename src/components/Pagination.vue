<template>
    <div class="pagination float-end">
        <button class="btn btn-link py-0" @click="emit('prevPage')" :disabled="page <= 1">
            <i class="bi bi-chevron-left"></i>
        </button>
        <div class="mx-2">{{ page }} - {{ pageSize }}</div>
        <button class="btn btn-link py-0" @click="emit('nextPage')">
            <i class="bi bi-chevron-right"></i>
        </button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    page: {
        type: Number,
        default: 1,
    },
    pageSize: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(['prevPage', 'nextPage']);
</script>