<template>
    <teleport to="body">
        <div class="base" v-show="isOpen">
            <div class="overlay" v-show="isOpen" @click="close"></div>
            <div class="content" v-show="isOpen">
                <div class="mb-3">
                    <form @submit.prevent>
                        <div class="mb-3">
                            <input class="form-control" type="password" v-model="password" placeholder="新しいパスワード">
                            <div class="form-text text-danger" v-if="validateMessage.password">{{ validateMessage.password }}</div>
                        </div>
                        <div class="mb-3">
                            <input class="form-control" type="password" v-model="passwordConfirm" placeholder="新しいパスワード（再入力）">
                            <div class="form-text text-danger" v-if="validateMessage.passwordConfirm">{{ validateMessage.passwordConfirm }}</div>
                        </div>
                        <button @click="save" :disabled="isLoading">保存</button>
                    </form>
                    <div class="form-text text-danger">{{ errorMessage }}</div>
                </div>
            </div>
        </div>
    </teleport>
    <Alert :alerts="alerts" @removeAlert="removeAlert" />
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useStore } from 'vuex';
import useLoading from '@/composables/useLoading';
import useAlert from '@/composables/useAlert';
import api from '@/services/api';
import Alert from '@/components/Alert';

defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['close']);
const store = useStore();
const { isLoading } = useLoading();
const { alerts, addAlert, removeAlert } = useAlert();

const password = ref('');
const passwordConfirm = ref('');
const validateMessage = ref({});
const errorMessage = ref('');

const Validate = {
    run() {
        return ([
            this.password(),
            this.passwordConfirm(),
        ]).every(check => check);
    },
    password() {
        validateMessage.value.password = '';
        if (!password.value) {
            validateMessage.value.password = '新しいパスワードを入力してください。';
            return false;
        }
        return true;
    },
    passwordConfirm() {
        validateMessage.value.passwordConfirm = '';
        if (!passwordConfirm.value) {
            validateMessage.value.passwordConfirm = '新しいパスワード（再入力）を入力してください。';
            return false;
        } else {
            if (password.value !== passwordConfirm.value) {
                validateMessage.value.passwordConfirm = '入力されたパスワードが一致しません。';
                return false;
            }
        }
        return true;
    },
};

const save = () => {
    errorMessage.value = '';
    if (Validate.run()) {
        store.commit('startLoading');
        api.put('/api/password', {
            password: password.value,
            passwordConfirm: passwordConfirm.value,
        })
        .then(() => {
            addAlert('パスワードを変更しました。', 'success');
            close();
        })
        .catch(error => {
            errorMessage.value = error.message;
        })
        .finally(() => {
            store.commit('stopLoading');
        });
    }
};

const close = () => {
    password.value = '';
    passwordConfirm.value = '';
    validateMessage.value = {};
    errorMessage.value = '';
    emit('close');
};
</script>

<style scoped>
.content {
  width: 40%;
}

@media (max-width: 1024px) {
    .content {
        width: 50%;
    }
}

@media (max-width: 768px) {
    .content {
        width: 80%;
    }
}

@media (max-width: 480px) {
    .content {
        width: 95%;
    }
}
</style>