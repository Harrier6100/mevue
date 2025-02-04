<template>
    <teleport to="body">
        <div class="base" v-show="props.isOpen">
            <div class="overlay" v-show="props.isOpen" @click="close"></div>
            <div class="content" v-show="props.isOpen">
                <div class="mb-3">
                    <div class="mb-3">
                        <input class="form-control" v-model="filterValue" placeholder="検索">
                    </div>
                    <table class="table table-bordered">
                        <thead>
                            <tr v-for="(route, index) of paginatedData" :key="index">
                                <td class="text-start align-middle">{{ route.routeName }}</td>
                                <td class="text-start align-middle">{{ route.routePath }}</td>
                                <td class="text-start align-middle">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="checkbox" v-model="route.permission.read" @change="updateRole(route)">
                                        <label class="form-check-label">参照</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="checkbox" v-model="route.permission.create" @change="updateRole(route)">
                                        <label class="form-check-label">作成</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="checkbox" v-model="route.permission.update" @change="updateRole(route)">
                                        <label class="form-check-label">編集</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="checkbox" v-model="route.permission.delete" @change="updateRole(route)">
                                        <label class="form-check-label">削除</label>
                                    </div>
                                </td>
                            </tr>
                        </thead>
                    </table>
                    <Pagination v-bind="{ page, pageTotal }" @prevPage="prevPage" @nextPage="nextPage" />
                    <div class="form-text text-danger">{{ errorMessage }}</div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import useFilter from '@/hooks/useFilter';
import usePagination from '@/hooks/usePagination';
import api from '@/services/api';
import Pagination from '@/components/Pagination';

const props = defineProps({ isOpen: Boolean, userId: String });
const emit = defineEmits(['close']);
const store = useStore();
const router = useRouter();

const routes = ref(
    router.getRoutes()
    .filter(route => route.meta.requiresAuth)
    .map(route => ({
        routeName: route.name,
        routePath: route.path,
        permission: {
            read: false,
            create: false,
            update: false,
            delete: false,
        },
    }))
    .sort((a, b) => a.routeName.localeCompare(b.routeName))
);
const { filterValue, filteredData } = useFilter(routes);
const { page, pageTotal, paginatedData, prevPage, nextPage } = usePagination(filteredData, 10);
const errorMessage = ref('');

watch(() => props.isOpen, (newValue) => {
    if (newValue) fetchRole();
});

const fetchRole = async () => {
    try {
        store.commit('startLoading');
        const response = await api.get(`/api/roles/${props.userId}`);
        const permissions = response.permissions;
        routes.value.forEach(route => {
            const permission = permissions[route.routeName] || {};
            route.permission.read = permission.read || false;
            route.permission.create = permission.create || false;
            route.permission.update = permission.update || false;
            route.permission.delete = permission.delete || false;
        });
    } catch (error) {
        console.log(error);
    } finally {
        store.commit('stopLoading');
    }
};

const updateRole = async (route) => {
    try {
        store.commit('startLoading');
        await api.put(`/api/roles/${props.userId}`, { route });
    } catch (error) {
        errorMessage.value = error.message;
    } finally {
        store.commit('stopLoading');
    }
};

const close = () => {
    errorMessage.value = '';
    emit('close');
};
</script>