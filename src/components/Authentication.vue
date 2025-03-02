<template>
    <ul class="navbar-nav ms-auto">
        <li class="nav-item dropdown" v-if="user">
            <a class="nav-link" href="#" id="credentials" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle ms-1"></i>
                {{ user.name }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="credentials">
                <li><a class="dropdown-item" href="#" @click.prevent="openPasswordChange">パスワード変更</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="signout">サインアウト</a></li>
            </ul>
        </li>
        <li class="nav-item" v-if="!user">
            <a class="nav-link" href="#" @click.prevent="openSignin">サインイン</a>
        </li>
    </ul>
    <Signin :isOpen="isOpenSignin" @close="closeSignin" />
    <PasswordChange :isOpen="isOpenPasswordChange" @close="closePasswordChange" />
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import useOpenClose from '@/composables/useOpenClose';
import Signin from '@/components/modals/Signin';
import PasswordChange from '@/components/modals/PasswordChange';

const store = useStore();
const { isOpen: isOpenSignin, open: openSignin, close: closeSignin } = useOpenClose();
const { isOpen: isOpenPasswordChange, open: openPasswordChange, close: closePasswordChange } = useOpenClose();

const user = computed(() => {
    return store.getters.user;
});

const signout = () => {
    if (confirm('サインアウトしますか？')) {
        store.dispatch('signout');
    }
};
</script>