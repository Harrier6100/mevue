const UserRoutes = [
    {
        path: '/users',
        name: 'UserList',
        component: () => import('@/views/UserList'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/users/add',
        name: 'UserAdd',
        component: () => import('@/views/UserEdit'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/users/:id',
        name: 'UserEdit',
        component: () => import('@/views/UserEdit'),
        meta: {
            requiresAuth: true,
        },
    },
];

export default UserRoutes;