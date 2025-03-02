<template>
    <div class="mb-3">
        <Navbar />
    </div>
    <router-view />
</template>

<script>
import Navbar from '@/components/Navbar';

export default {
    name: 'App',
    components: {
        Navbar,
    },
};
</script>