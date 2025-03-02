<template>
    <teleport to="body">
        <div class="base" v-show="props.isOpen">
            <div class="overlay" v-show="props.isOpen" @click="close"></div>
            <div class="content" v-show="props.isOpen">
                <div class="mb-3">
                    <form @submit.prevent>
                        <div class="mb-3">
                            <input class="form-control" v-model="credentials.id" @input="Validate.id()" placeholder="ID">
                            <div class="form-text text-danger" v-if="validateMessage.id">{{ validateMessage.id }}</div>
                        </div>
                        <div class="mb-3">
                            <input class="form-control" type="password" v-model="credentials.password" @input="Validate.password()" placeholder="Password">
                            <div class="form-text text-danger" v-if="validateMessage.password">{{ validateMessage.password }}</div>
                        </div>
                        <button @click="onSignin" :disabled="isLoading">サインイン</button>
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
import useLoading from '@/composables/useLoading';

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close']);
const store = useStore();
const { isLoading } = useLoading();

const credentials = ref({
    id: '',
    password: '',
});
const validateMessage = ref({});
const errorMessage = ref('');

const Validate = {
    run() {
        return ([
            this.id(),
            this.password(),
        ]).every(boolean => boolean);
    },
    id() {
        validateMessage.value.id = '';
        if (!credentials.value.id) {
            validateMessage.value.id = 'IDを入力してください。';
            return false;
        }
        return true;
    },
    password() {
        validateMessage.value.password = '';
        if (!credentials.value.password) {
            validateMessage.value.password = 'パスワードを入力してください。';
            return false;
        }
        return true;
    },
};

const onSignin = () => {
    errorMessage.value = '';
    if (Validate.run()) {
        store.commit('startLoading');
        store.dispatch('signin', credentials.value)
        .then(() => {
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
    credentials.value.id = '';
    credentials.value.password = '';
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