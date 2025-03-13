import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';
//import localize from '@/localize';


const routes = [{
        path: '/',
        redirect: '/data-grids'
    }, {
        path: '/data-grids',
        name: 'DataGrids',
        component: () => import('@/views/DataGrids.vue'),
        meta: {
            title: 'DataGrids',
            layout: 'empty-layout',
            isPublicPage: true
        }
    }, {
        path: '/tree-view',
        name: 'TreeView',
        component: () => import('@/views/TreeView.vue'),
        meta: {
            title: 'TreeView',
            layout: 'empty-layout',
            isPublicPage: true
        }
    }, {
        path: '/components',
        name: 'Components',
        component: () => import('@/views/Components.vue'),
        meta: {
            title: 'Components',
            layout: 'empty-layout',
            isPublicPage: true
        }
    }
    /*, {
        path: '*',
        component: NotFoundComponent
    }*/
];

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const system = store.getters.getSystem;
    if (system) {
        document.title = to.meta.title + " | " + system.Title;
    }
    next();
});


export default router;