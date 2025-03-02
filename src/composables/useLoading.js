import { computed } from 'vue';
import { useStore } from 'vuex';

const useLoading = () => {
    const store = useStore();

    const isLoading = computed(() => {
        return store.getters.isLoading;
    });

    return {
        isLoading,
    };
};

export default useLoading;