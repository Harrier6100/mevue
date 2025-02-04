import { ref, computed } from 'vue';

const usePagination = (tableData, pageSize) => {
    const page = ref(1);

    const pageTotal = computed(() => {
        return Math.ceil(tableData.value.length / pageSize);
    });

    const paginatedData = computed(() => {
        const startIndex = (page.value - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return tableData.value.slice(startIndex, endIndex);
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

    return {
        page,
        pageTotal,
        paginatedData,
        prevPage,
        nextPage,
    };
};

export default usePagination;