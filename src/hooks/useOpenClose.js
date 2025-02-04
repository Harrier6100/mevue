import { ref } from 'vue';

const useOpenClose = () => {
    const isOpen = ref(false);

    const open = () => {
        isOpen.value = true;
    };

    const close = () => {
        isOpen.value = false;
    };

    return {
        isOpen,
        open,
        close,
    };
};

export default useOpenClose;