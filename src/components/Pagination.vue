<template>
    <div class="pagination float-end">
        <div class="ms-2 me-3">{{ props.page }} - {{ props.pageTotal }}</div>
        <a class="me-2" href="#" @click.prevent="prevPage"><i class="bi bi-chevron-left"></i></a>
        <a class="me-2" href="#" @click.prevent="nextPage"><i class="bi bi-chevron-right"></i></a>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    page: {
        type: [Number, String],
        default: 1,
    },
    pageTotal: {
        type: [Number, String],
        default: 0,
    },
});
const emit = defineEmits(['prevPage', 'nextPage']);

const prevPage = () => {
    emit('prevPage');
};

const nextPage = () => {
    emit('nextPage');
};
</script>