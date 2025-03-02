<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-primary">
        <div class="container-fluid">
            <router-link to="/" class="navbar-brand">Brand</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu" aria-controls="menu" aria-expanded="false">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="menu">
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link" href="#" id="menu#1" role="button" data-bs-toggle="dropdown" aria-expanded="false">マスタ</a>
                        <ul class="dropdown-menu" aria-labelledby="menu#1">
                            <router-link class="dropdown-item" to="/users">Users</router-link>
                        </ul>
                    </li>
                </ul>
                <Authentication />
            </div>
        </div>
    </nav>
</template>

<script setup>
import Authentication from '@/components/Authentication';
</script>