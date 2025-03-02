<template>
    <div class="container-fluid">
        <div class="mb-3">
            <h6>Users</h6>
        </div>
        <div class="mb-3">
            <div class="mb-3 row">
                <div class="col-auto">
                    <input class="form-control" v-model="search" placeholder="検索">
                </div>
                <div class="col-auto ms-auto">
                    <button class="btn btn-primary" @click.prevent="addUser" :disabled="isLoading">新規作成</button>
                </div>
            </div>
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th :class="orderBy('id')" @click="sortBy('id')">ID</th>
                        <th :class="orderBy('name')" @click="sortBy('name')">名前</th>
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
                    <tr v-for="user in paginatedData" :key="user.id">
                        <td class="text-start">{{ user.id }}</td>
                        <td class="text-start">{{ user.name }}</td>
                        <td class="text-start">{{ user.email }}</td>
                        <td class="text-start">{{ user.isAdmin ? '✔' : '✖' }}</td>
                        <td class="text-start">{{ user.isGuest ? '✔' : '✖' }}</td>
                        <td class="text-start">{{ user.expiryDate ? formatDate(user.expiryDate) : '' }}</td>
                        <td class="text-start">{{ formatAt(user.createdAt) }}</td>
                        <td class="text-start">{{ user.createdBy }}</td>
                        <td class="text-start">{{ formatAt(user.updatedAt) }}</td>
                        <td class="text-start">{{ user.updatedBy }}</td>
                        <td class="text-center">
                            <button class="btn btn-link py-0" type="button" @click="updateUser(user.id)">編集</button>
                            <button class="btn btn-link py-0" type="button" @click="removeUser(user.id)">削除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination v-bind="{ page, pageSize }" @prevPage="prevPage" @nextPage="nextPage" />
        </div>
    </div>
    <Alert v-bind="{ alerts }" @removeAlert="removeAlert" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import useLoading from '@/composables/useLoading';
import useAlert from '@/composables/useAlert';
import useFilter from '@/composables/useFilterWithQuery';
import useSort from '@/composables/useSortWithQuery';
import usePagination from '@/composables/usePaginationWithQuery';
import api from '@/services/api';
import { formatDate, formatAt } from '@/utils/formatDateTime';
import Alert from '@/components/Alert';
import Pagination from '@/components/Pagination';

const store = useStore();
const route = useRoute();
const router = useRouter();
const { isLoading } = useLoading();
const { alerts, addAlert, removeAlert } = useAlert();

const users = ref([]);
const { search, filteredData } = useFilter(users);
const { sortedData, sortBy, orderBy } = useSort(filteredData);
const { page, pageSize, paginatedData, prevPage, nextPage } = usePagination(sortedData, 10);

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
onMounted(fetchUsers);
watch(search, () => page.value = 1);

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
    if (!confirm('削除しますか？')) return;
    try {
        store.commit('startLoading');
        await api.delete(`/api/users/${id}`);
        users.value = users.value.filter(user => user.id !== id);
    } catch (error) {
        addAlert(error.message, 'error');
    } finally {
        store.commit('stopLoading');
    }
};
</script>