import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { debounce } from 'lodash';

const useFilter = (filterData) => {
    const filterValue = ref('');
    const route = useRoute();
    const router = useRouter();

    const filteredData = computed(() => {
        return filterData.value.filter(data => {
            return Object.values(data).some(value => {
                return value && value.toString().toLowerCase().includes(filterValue.value.toLowerCase())
            })
        })
    });

    onMounted(() => {
        if (route.query.filter) {
            filterValue.value = route.query.filter;
        }
    });

    const updateQuery = debounce(() => {
        router.replace({
            query: {
                ...route.query,
                filter: filterValue.value,
            },
        });
    }, 500);
    watch(filterValue, updateQuery);

    return {
        filterValue,
        filteredData,
    };
};

export default useFilter;