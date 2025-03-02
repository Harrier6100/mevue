import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { debounce } from 'lodash';

const useFilter = (filterData) => {
    const search = ref('');
    const route = useRoute();
    const router = useRouter();

    onMounted(() => {
        if (route.query.search) {
            search.value = route.query.search;
        }
    });

    const updateQuery = debounce(() => {
        router.replace({
            query: {
                ...route.query,
                search: search.value,
            },
        });
    }, 500);
    watch([search], updateQuery);

    const filteredData = computed(() => {
        return filterData.value.filter(data => {
            return Object.values(data).some(value => {
                return value && value.toString().toLowerCase().includes(search.value.toLowerCase())
            })
        })
    });

    return {
        search,
        filteredData,
    };
};

export default useFilter;