<template>
    <input ref="flatpickrInput" :value="modelValue">
</template>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
import flatpickr from 'flatpickr';
import { Japanese } from 'flatpickr/dist/l10n/ja.js';

const props = defineProps({
    modelValue: String,
    format: {
        type: String,
        default: 'Y-m-d',
    },
});
const emit = defineEmits('[update:modelValue]');
const flatpickrInput = ref(null);

onMounted(() => {
    const fp = flatpickr(flatpickrInput.value, {
        dateFormat: props.format,
        allowInput: true,
        locale: Japanese,
        onChange: (_, value) => {
            emit('update:modelValue', value);
        },
    });
    
    watch(() => props.modelValue, (newValue) => {
        if (fp.selectedDates[0]?.toISOString().split('T')[0] !== newValue) {
            fp.setDate(newValue, false);
        }
    });
});
</script>

<style>
.flatpickr-calendar {
    font-size: 1rem !important;
}

.flatpickr-calendar .flatpickr-innerContainer .flatpickr-weekdays .flatpickr-weekday:nth-child(7n + 1),
.flatpickr-calendar .flatpickr-innerContainer .flatpickr-days .flatpickr-day:not(.flatpickr-disabled):not(.prevMonthDay):not(.nextMonthDay):nth-child(7n + 1) {
    color: red;
}

.flatpickr-calendar .flatpickr-innerContainer .flatpickr-weekdays .flatpickr-weekday:nth-child(7),
.flatpickr-calendar .flatpickr-innerContainer .flatpickr-days .flatpickr-day:not(.flatpickr-disabled):not(.prevMonthDay):not(.nextMonthDay):nth-child(7n) {
    color: blue;
}
</style>