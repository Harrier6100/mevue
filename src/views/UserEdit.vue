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
                                <input class="form-control" v-model="user.id">
                                <div class="form-text text-danger" v-if="validateMessage.id">{{ validateMessage.id }}</div>
                            </div>
                            <div class="mb-3">
                                <label>名前</label>
                                <input class="form-control" v-model="user.name">
                                <div class="form-text text-danger" v-if="validateMessage.name">{{ validateMessage.name }}</div>
                            </div>
                            <div class="mb-3">
                                <label>メールアドレス</label>
                                <input class="form-control" v-model="user.email">
                            </div>
                            <div class="mb-3">
                                <label>役職</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" id="admin" name="role" value="admin" v-model="user.role">
                                    <label class="form-check-label" for="admin">Admin</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" id="user" name="role" value="user" v-model="user.role">
                                    <label class="form-check-label" for="user">User</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" id="guest" name="role" value="guest" v-model="user.role">
                                    <label class="form-check-label" for="guest">Guest</label>
                                </div>
                            </div>
                            <div class="mb-3" v-if="user.role === 'guest'">
                                <label>有効期限</label>
                                <Flatpickr class="form-control" v-model="user.expiryDate" placeholder="YYYY-MM-DD" />
                                <div class="form-text text-danger" v-if="validateMessage.expiryDate">{{ validateMessage.expiryDate }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="me-2 float-end" type="button" @click="back">戻る</button>
                <button class="me-2 float-end" @click="save" :disabled="isLoading">保存</button>
            </form>
        </div>
    </div>
    <Alert :alerts="alerts" @removeAlert="removeAlert" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import useLoading from '@/composables/useLoading';
import useAlert from '@/composables/useAlert';
import api from '@/services/api';
import { formatDate } from '@/utils/formatDateTime';
import Alert from '@/components/Alert';
import Flatpickr from '@/components/Flatpickr';

const store = useStore();
const route = useRoute();
const router = useRouter();
const { isLoading } = useLoading();
const { alerts, addAlert, removeAlert } = useAlert();

const id = ref(route.params.id);
const user = ref({
    id: '',
    name: '',
    email: '',
    role: 'user',
    expiryDate: null,
});
const validateMessage = ref({});

onMounted(() => {
    if (id.value) {
        fetchUser(id.value);
    }
});

watch(() => user.value.role, (newValue) => {
    if (newValue !== 'guest') {
        user.value.expiryDate = '';
    }
});

const fetchUser = async (id) => {
    try {
        store.commit('startLoading');
        const response = await api.get(`/api/users/${id}`);
        user.value.id = response.id;
        user.value.name = response.name;
        user.value.email = response.email;
        user.value.role = response.role;
        user.value.expiryDate = response.expiryDate ? formatDate(response.expiryDate) : null;
    } catch (error) {
        addAlert(error.message, 'error');
    } finally {
        store.commit('stopLoading');
    }
};

const Validate = {
    run() {
        return ([
            this.id(),
            this.name(),
            this.expiryDate(),
        ]).every(check => check);
    },
    id() {
        validateMessage.value.id = '';
        if (!user.value.id) {
            validateMessage.value.id = 'IDを入力してください。';
            return false;
        }
        return true;
    },
    name() {
        validateMessage.value.name = '';
        if (!user.value.name) {
            validateMessage.value.name = '名前を入力してください。';
            return false;
        }
        return true;
    },
    expiryDate() {
        validateMessage.value.expiryDate = '';
        if (user.value.role === 'guest' && !user.value.expiryDate) {
            validateMessage.value.expiryDate = 'ゲストアカウントは有効期限が必須です。';
            return false;
        }
        return true;
    },
};

const save = async () => {
    if (!Validate.run()) return;
    try {
        store.commit('startLoading');
        if (id.value) {
            const response = await api.put(`/api/users/${id.value}`, user.value);
            addAlert(`id:${response.id}を更新しました。`, 'success');
        } else {
            const response = await api.post(`/api/users`, user.value);
            addAlert(`id:${response.id}を作成しました。`, 'success');
        }
    } catch (error) {
        addAlert(error.message, 'error');
    } finally {
        store.commit('stopLoading');
    }
};

const back = () => {
    router.push({
        name: 'UserList',
        query: store.getters.query,
    });
};
</script>