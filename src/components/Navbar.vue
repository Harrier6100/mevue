<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-primary">
        <div class="container-fluid">
            <router-link to="/" class="navbar-brand">Brand</router-link>
            <div class="collapse navbar-collapse" id="menu">
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link" href="#" id="menu#1" role="button" data-bs-toggle="dropdown" aria-expanded="false">マスタ</a>
                        <ul class="dropdown-menu" aria-labelledby="menu#1">
                            <router-link class="dropdown-item" to="/users" v-if="hasReadPermission('UserList')">ユーザーマスタ</router-link>
                        </ul>
                    </li>
                </ul>
                <Authentication />
            </div>
        </div>
    </nav>
</template>

<script setup>
import usePermission from '@/hooks/usePermission';
import Authentication from '@/components/Authentication';
const { hasReadPermission } = usePermission();
</script>