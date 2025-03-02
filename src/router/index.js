import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from 'vuex';
import UserRoutes from './modules/userRoutes';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home'),
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: '/auth/error',
        name: 'AuthError',
        component: () => import('@/views/AuthError'),
        meta: {
            requiresAuth: false,
        },
    },
    ...UserRoutes,
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const store = useStore();

    // 認証されていない場合、サインインを試行
    if (!store.getters.isAuth) {
        await store.dispatch('autoSignin');
    }

    // 認証が必要なページ
    if (to.meta.requiresAuth) {
        // 認証されていない場合、エラー
        if (!store.getters.isAuth) {
            return next('/auth/error');
        }
    }

    next();
});

export default router;