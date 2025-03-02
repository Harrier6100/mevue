<template>
    <div class="alert-container">
        <div v-for="(alert, index) in alerts" :key="index" :class="['alert', alert.type]">
            {{ alert.message }}
            <button class="btn-close ms-2" @click="removeAlert(alert.id)"></button>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    alerts: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['removeAlert']);

const removeAlert = (id) => {
    emit('removeAlert', id);
};
</script>

<style scoped>
.alert-container {
    position: fixed;
    bottom: 10px;
    left: 20px;
    z-index: 1000;
}

.alert {
    background-color: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    opacity: 0.9;
}

.alert.info {
    color: #055160;
    background-color: #cff4fc;
    border-color: #b6effb;
}

.alert.error {
    color: #842029;
    background-color: #f8d7da;
    border-color: #f5c2c7;
}

.alert.success {
    color: #0f5132;
    background-color: #d1e7dd;
    border-color: #badbcc;
}
</style>