<template>
    <input ref="flatpickrInput" :value="flatpickrValue" @input="inputValue">
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
const emit = defineEmits(['update:modelValue']);
const flatpickrInput = ref(null);
const flatpickrValue = ref(props.modelValue);

onMounted(() => {
    flatpickr(flatpickrInput.value, {
        dateFormat: props.format,
        allowInput: true,
        locale: Japanese,
        onChange: (selectedDate, value) => {
            flatpickrValue.value = value;
            emit('update:modelValue', value);
        },
    });
});

watch(() => props.modelValue, (newValue) => {
    if (flatpickrValue.value !== newValue) {
        flatpickrInput.value._flatpickr.setDate(newValue);
        flatpickrValue.value = newValue;
    }
});

const inputValue = (event) => {
    flatpickrValue.value = event.target.value;
    emit('update:modelValue', event.target.value);
};
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