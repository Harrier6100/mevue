import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const usePagination = (paginationData, perSize) => {
    const page = ref(1);
    const route = useRoute();
    const router = useRouter();

    onMounted(() => {
        if (route.query.page) {
            page.value = route.query.page;
        }
    });

    const updateQuery = () => {
        router.replace({
            query: {
                ...route.query,
                page: page.value,
            },
        });
    };
    watch([page], updateQuery);

    const pageSize = computed(() => {
        return Math.ceil(paginationData.value.length / perSize);
    });

    const paginatedData = computed(() => {
        const startIndex = (page.value - 1) * perSize;
        const endIndex = startIndex + perSize;
        return paginationData.value.slice(startIndex, endIndex);
    });

    const prevPage = () => {
        if (page.value > 1) {
            page.value--;
        }
    };

    const nextPage = () => {
        if (page.value < pageSize.value) {
            page.value++;
        }
    };

    return {
        page,
        pageSize,
        paginatedData,
        prevPage,
        nextPage,
    };
};

export default usePagination;