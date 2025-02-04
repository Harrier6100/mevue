<template>
    <div class="container-fluid">
        <div class="mb-3">
            <h6>Users</h6>
        </div>
        <div class="mb-3">
            <form @submit.prevent>
                <div class="mb-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="mb-3">
                                <label>ID</label>
                                <input class="form-control" v-model="user.userId">
                                <div class="form-text text-danger" v-if="validateMessage.userId">{{ validateMessage.userId }}</div>
                            </div>
                            <div class="mb-3">
                                <label>名前</label>
                                <input class="form-control" v-model="user.userName">
                                <div class="form-text text-danger" v-if="validateMessage.userName">{{ validateMessage.userName }}</div>
                            </div>
                            <div class="mb-3">
                                <label>メールアドレス</label>
                                <input class="form-control" v-model="user.email">
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="isAdmin" v-model="user.isAdmin" @change="checkboxChange(1)">
                                    <label class="form-check-label" for="isAdmin">管理者</label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="isGuest" v-model="user.isGuest" @change="checkboxChange(2)">
                                    <label class="form-check-label" for="isGuest">ゲスト</label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label>有効期限</label>
                                <Flatpickr class="form-control" v-model="user.expiryDate" placeholder="YYYY-MM-DD" :disabled="!user.isGuest" />
                                <div class="form-text text-danger" v-if="validateMessage.expiryDate">{{ validateMessage.expiryDate }}</div>
                            </div>
                            <div class="mb-3">
                                <a href="#" @click.prevent="openRoleControl">アクセス権限の設定</a>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="me-2 float-end" type="button" @click="back" :disabled="isLoading">戻る</button>
                <button class="me-2 float-end" @click.prevent="onSave" :disabled="isLoading">保存</button>
            </form>
        </div>
    </div>
    <Alert :alerts="alerts" @removeAlert="removeAlert" />
    <RoleControl :userId="user.userId" :isOpen="isOpenRoleControl" @close="closeRoleControl" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import useLoading from '@/hooks/useLoading';
import useAlert from '@/hooks/useAlert';
import useOpenClose from '@/hooks/useOpenClose';
import api from '@/services/api';
import { formatDate } from '@/utils/formatDateTime';
import Alert from '@/components/Alert';
import Flatpickr from '@/components/Flatpickr';
import RoleControl from '@/components/modals/RoleControl';

const store = useStore();
const route = useRoute();
const router = useRouter();
const { isLoading } = useLoading();
const { alerts, addAlert, removeAlert } = useAlert();
const { isOpen: isOpenRoleControl, open: openRoleControl, close: closeRoleControl } = useOpenClose();

const id = ref(route.params.id);
const user = ref({
    userId: '',
    userName: '',
    email: '',
    isAdmin: false,
    isGuest: false,
    expiryDate: null,
});
const validateMessage = ref({});

onMounted(() => {
    if (id.value) {
        fetchUser(id.value);
    }
});

watch(() => user.value.isGuest, (newValue) => {
    if (!newValue) user.value.expiryDate = '';
});

const checkboxChange = (index) => {
    if (index === 1 && user.value.isAdmin) user.value.isGuest = false;
    if (index === 2 && user.value.isGuest) user.value.isAdmin = false;
};

const fetchUser = async (id) => {
    try {
        store.commit('startLoading');
        const response = await api.get(`/api/users/${id}`);
        user.value.userId = response.userId;
        user.value.userName = response.userName;
        user.value.email = response.email;
        user.value.isAdmin = response.isAdmin;
        user.value.isGuest = response.isGuest;
        user.value.expiryDate = response.expiryDate ? formatDate(response.expiryDate) : null;
    } catch (error) {
        addAlert(error.message, 'error');
    } finally {
        store.commit('stopLoading');
    }
};

const createUser = async () => {
    try {
        store.commit('startLoading');
        const response = await api.post('/api/users', user.value);
        addAlert(`ID:${response._id}を作成しました。`, 'success');
    } catch (error) {
        addAlert(error.message, 'error');
    } finally {
        store.commit('stopLoading');
    }
};

const updateUser = async (id) => {
    try {
        store.commit('startLoading');
        const response = await api.put(`/api/users/${id}`, user.value);
        addAlert(`ID:${response._id}を更新しました。`, 'success');
    } catch (error) {
        addAlert(error.message, 'error');
    } finally {
        store.commit('stopLoading');
    }
};

const Validate = {
    run() {
        return ([
            this.userId(),
            this.userName(),
            this.expiryDate(),
        ]).every(check => check);
    },
    userId() {
        validateMessage.value.userId = '';
        if (!user.value.userId) {
            validateMessage.value.userId = 'IDを入力してください。';
            return false;
        }
        return true;
    },
    userName() {
        validateMessage.value.userName = '';
        if (!user.value.userName) {
            validateMessage.value.userName = '名前を入力してください。';
            return false;
        }
        return true;
    },
    expiryDate() {
        validateMessage.value.expiryDate = '';
        if (user.value.isGuest && !user.value.expiryDate) {
            validateMessage.value.expiryDate = 'ゲストアカウントは有効期限が必須です。';
            return false;
        }
        return true;
    },
};

const onSave = () => {
    if (Validate.run()) {
        if (id.value) updateUser(id.value);
        else createUser();
    }
};

const back = () => {
    router.push({
        name: 'UserList',
        query: store.getters.getQuery,
    });
};
</script>