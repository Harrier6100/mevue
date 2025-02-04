import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const useSort = (sortData) => {
    const sort = ref(null);
    const order = ref(null);
    const route = useRoute();
    const router = useRouter();

    const sortedData = computed(() => {
        return sortData.value.slice().sort((a, b) => {
            const aValue = a[sort.value];
            const bValue = b[sort.value];
            const set = order.value === 'asc' ? 1 : -1;

            if (aValue === null && bValue !== null) return set *  1;
            if (aValue !== null && bValue === null) return set * -1;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return set * aValue.localeCompare(bValue, 'ja', { sensitivity: 'base' });
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return set * (aValue - bValue);
            }

            const aNumber = Number(aValue);
            const bNumber = Number(bValue);
            if (!isNaN(aNumber) && !isNaN(bNumber)) {
                return set * (aNumber - bNumber);
            }

            if (aValue < bValue) return set * -1;
            if (aValue > bValue) return set *  1;
            return 0;
        });
    });

    onMounted(() => {
        if (route.query.sort && route.query.order) {
            sort.value = route.query.sort;
            order.value = route.query.order;
        }
    });

    const orderBy = (key) => {
        return {
            asc: sort.value === key && order.value === 'asc',
            desc: sort.value === key && order.value === 'desc',
        };
    };

    const sortBy = (key) => {
        if (sort.value === key) {
            order.value = order.value === 'asc' ? 'desc' : 'asc';
        } else {
            sort.value = key;
            order.value = 'asc';
        }
    };

    const updateQuery = () => {
        router.replace({
            query: {
                ...route.query,
                sort: sort.value,
                order: order.value,
            },
        });
    };
    watch([sort, order], updateQuery);

    return {
        sortedData,
        orderBy,
        sortBy,
    };
};

export default useSort;