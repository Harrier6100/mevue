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
        path: '/error',
        name: 'Error',
        component: () => import('@/views/Error'),
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

    // 認証されている場合、アクセス権限を取得
    if (store.getters.isAuth) {
        await store.dispatch('fetchPermissions');
    }

    // 認証が必要なページ
    if (to.meta.requiresAuth) {
        // 認証されていない場合、エラー
        if (!store.getters.isAuth) {
            return next('/error');
        }
        // アクセス権限を参照、管理者は通過
        const permission = store.getters.permissions(to.name);
        if (!permission.read && !store.getters.user.isAdmin) {
            return next('/error');
        }
    }

    next();
});

export default router;