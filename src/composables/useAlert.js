import { ref } from 'vue';

const useAlert = () => {
    const alerts = ref([]);

    const addAlert = (message, type = 'info', duration = 7000) => {
        const id = Date.now();
        alerts.value.push({ id, message, type });
        setTimeout(() => removeAlert(id), duration);
    };

    const removeAlert = (id) => {
        alerts.value = alerts.value.filter(alert => alert.id !== id);
    };

    return {
        alerts,
        addAlert,
        removeAlert,
    };
};

export default useAlert;