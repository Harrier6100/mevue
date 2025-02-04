import { ref, computed } from 'vue';

const useFilter = (tableData) => {
    const filterValue = ref('');

    const filteredData = computed(() => {
        return tableData.value.filter(data => {
            return Object.values(data).some(value => {
                return value && value.toString().toLowerCase().includes(filterValue.value.toLowerCase())
            });
        });
    });

    return {
        filterValue,
        filteredData,
    };
};

export default useFilter;