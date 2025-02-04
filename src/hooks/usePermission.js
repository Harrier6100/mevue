import { useStore } from 'vuex';

const usePermission = (routeName) => {
    const store = useStore();

    const hasPermission = (action) => {
        const permission = store.getters.permissions(routeName);
        return permission[action];
    };

    const hasReadPermission = (routeName) => {
        const permission = store.getters.permissions(routeName);
        return permission.read;
    };

    return {
        hasPermission,
        hasReadPermission,
    };
};

export default usePermission;