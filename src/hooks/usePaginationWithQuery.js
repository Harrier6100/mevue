import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const usePagination = (paginationData, pageSize) => {
    const page = ref(1);
    const route = useRoute();
    const router = useRouter();

    const pageTotal = computed(() => {
        return Math.ceil(paginationData.value.length / pageSize);
    });

    const paginatedData = computed(() => {
        const startIndex = (page.value - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return paginationData.value.slice(startIndex, endIndex);
    });

    onMounted(() => {
        if (route.query.page) {
            page.value = route.query.page;
        }
    });

    const prevPage = () => {
        if (page.value > 1) {
            page.value--;
        }
    };

    const nextPage = () => {
        if (page.value < pageTotal.value) {
            page.value++;
        }
    };

    const updateQuery = async () => {
        router.replace({
            query: {
                ...route.query,
                page: page.value,
            },
        });
    };
    watch(page, updateQuery);

    return {
        page,
        pageTotal,
        paginatedData,
        prevPage,
        nextPage,
    };
};

export default usePagination;