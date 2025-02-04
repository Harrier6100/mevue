<template>
    <teleport to="body">
        <div class="base" v-show="props.isOpen">
            <div class="overlay" v-show="props.isOpen" @click="close"></div>
            <div class="content" v-show="props.isOpen">
                <div class="mb-3">
                    <form @submit.prevent>
                        <div class="mb-3">
                            <input class="form-control" v-model="credential.userId" @input="Validate.userId()" placeholder="ID">
                            <div class="form-text text-danger" v-if="validateMessage.userId">{{ validateMessage.userId }}</div>
                        </div>
                        <div class="mb-3">
                            <input class="form-control" type="password" v-model="credential.password" @input="Validate.password()" placeholder="パスワード">
                            <div class="form-text text-danger" v-if="validateMessage.password">{{ validateMessage.password }}</div>
                        </div>
                        <button @click.prevent="onSignIn" :disabled="isLoading">サインイン</button>
                    </form>
                    <div class="form-text text-danger">{{ errorMessage }}</div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useStore } from 'vuex';
import useLoading from '@/hooks/useLoading';

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close']);
const store = useStore();
const { isLoading } = useLoading();

const credential = ref({
    userId: '',
    password: '',
});
const validateMessage = ref({});
const errorMessage = ref('');

const Validate = {
    run() {
        return ([
            this.userId(),
            this.password(),
        ]).every(check => check);
    },
    userId() {
        validateMessage.value.userId = '';
        if (!credential.value.userId) {
            validateMessage.value.userId = 'IDを入力してください。';
            return false;
        }
        return true;
    },
    password() {
        validateMessage.value.password = '';
        if (!credential.value.password) {
            validateMessage.value.password = 'パスワードを入力してください。';
            return false;
        }
        return true;
    },
};

const onSignIn = () => {
    errorMessage.value = '';
    if (Validate.run()) {
        store.commit('startLoading');
        store.dispatch('signin', credential.value)
        .then(() => {
            close()
        })
        .catch(error => {
            errorMessage.value = error.message
        })
        .finally(() => {
            store.commit('stopLoading')
        });
    }
};

const close = () => {
    credential.value.userId = '';
    credential.value.password = '';
    validateMessage.value = {};
    errorMessage.value = '';
    emit('close');
};
</script>

<style scoped>
.content {
    width: 30%;
}
</style>