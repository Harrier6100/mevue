<template>
    <div class="container-fluid">
        <div class="mb-3">
            <h6>Users</h6>
        </div>
        <div class="mb-3">
            <div class="mb-3 row">
                <div class="col-auto">
                    <input class="form-control" v-model="filterValue" placeholder="検索">
                </div>
                <div class="col-auto ms-auto">
                    <button class="btn btn-outline-primary" @click.prevent="addUser" :disabled="isLoading" v-if="hasPermission('create')">新規追加</button>
                </div>
            </div>
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th :class="orderBy('userId')" @click="sortBy('userId')">ID</th>
                        <th :class="orderBy('userName')" @click="sortBy('userName')">名前</th>
                        <th :class="orderBy('email')" @click="sortBy('email')">メールアドレス</th>
                        <th :class="orderBy('isAdmin')" @click="sortBy('isAdmin')">管理者</th>
                        <th :class="orderBy('isGuest')" @click="sortBy('isGuest')">ゲスト</th>
                        <th :class="orderBy('expiryDate')" @click="sortBy('expiryDate')">有効期限</th>
                        <th :class="orderBy('createdAt')" @click="sortBy('createdAt')">作成日時</th>
                        <th :class="orderBy('createdBy')" @click="sortBy('createdBy')">作成者</th>
                        <th :class="orderBy('updatedAt')" @click="sortBy('updatedAt')">更新日時</th>
                        <th :class="orderBy('updatedBy')" @click="sortBy('updatedBy')">更新者</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) of paginatedData" :key="index">
                        <td class="text-start">{{ user.userId }}</td>
                        <td class="text-start">{{ user.userName }}</td>
                        <td class="text-start">{{ user.email }}</td>
                        <td class="text-center">{{ user.isAdmin ? '◯' : '' }}</td>
                        <td class="text-center">{{ user.isGuest ? '◯' : '' }}</td>
                        <td class="text-start">{{ user.expiryDate ? formatDate(user.expiryDate) : '' }}</td>
                        <td class="text-start">{{ formatAt(user.createdAt) }}</td>
                        <td class="text-start">{{ user.createdBy }}</td>
                        <td class="text-start">{{ formatAt(user.updatedAt) }}</td>
                        <td class="text-start">{{ user.updatedBy }}</td>
                        <td class="text-center">
                            <a class="mx-2" href="#" @click.prevent="updateUser(user._id)" v-if="hasPermission('update')">編集</a>
                            <a class="mx-2" href="#" @click.prevent="removeUser(user._id)" v-if="hasPermission('delete')">削除</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination v-bind="{ page, pageTotal }" @prevPage="prevPage" @nextPage="nextPage" />
        </div>
    </div>
    <Alert :alerts="alerts" @removeAlert="removeAlert" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import usePermission from '@/hooks/usePermission';
import useLoading from '@/hooks/useLoading';
import useAlert from '@/hooks/useAlert';
import useFilter from '@/hooks/useFilterWithQuery';
import useSort from '@/hooks/useSortWithQuery';
import usePagination from '@/hooks/usePaginationWithQuery';
import api from '@/services/api';
import { formatDate, formatAt } from '@/utils/formatDateTime';
import Alert from '@/components/Alert';
import Pagination from '@/components/Pagination';

const store = useStore();
const route = useRoute();
const router = useRouter();
const { hasPermission } = usePermission(route.name);
const { isLoading } = useLoading();
const { alerts, addAlert, removeAlert } = useAlert();

const users = ref([]);
const { filterValue, filteredData } = useFilter(users);
const { sortedData, orderBy, sortBy } = useSort(filteredData);
const { page, pageTotal, paginatedData, prevPage, nextPage } = usePagination(sortedData, 10);

onMounted(() => {
    fetchUsers();
    watch(filterValue, () => {
        page.value = 1;
    });
});

const fetchUsers = async () => {
    try {
        store.commit('startLoading');
        const response = await api.get('/api/users');
        users.value = response;
    } catch (error) {
        addAlert(error.message, 'error');
    } finally {
        store.commit('stopLoading');
    }
};

const addUser = () => {
    store.commit('setQuery', route.query);
    router.push({
        name: 'UserAdd',
    });
};

const updateUser = (id) => {
    store.commit('setQuery', route.query);
    router.push({
        name: 'UserEdit',
        params: { id },
    });
};

const removeUser = async (id) => {
    if (confirm('削除しますか？')) {
        try {
            store.commit('startLoading');
            const response = await api.delete(`/api/users/${id}`);
            users.value = users.value.filter(user => user._id !== response._id);
        } catch (error) {
            addAlert(error.message, 'error');
        } finally {
            store.commit('stopLoading');
        }
    }
};
</script>