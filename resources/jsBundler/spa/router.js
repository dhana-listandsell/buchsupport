import { createRouter, createWebHistory } from 'vue-router'
import guestAdmin from "@/middleware/guest-admin";
import authAdmin from "@/middleware/auth-admin";
import ziggyRoute from "@/libraries/utils/ZiggyRoute";
import ResourceFinder from "@/middleware/finder-resource";
import guestCustomer from "@/middleware/guest-customer";
import authCustomer from "@/middleware/auth-customer";
import {useAuthStore} from "@/storage/store/auth";
import {useLoadingStore} from "@/storage/store/loading";
import {useApiFetch} from "@/composables/useApiFetch";

const routes = [

    // Customer Routes
    {
        path: '/login',
        beforeEnter: [guestCustomer],
        component: () => import('./pages/login.vue'),
    },
    {
        path: '/customer',
        beforeEnter: [authCustomer],
        component: () => import('./layouts/customer-panel.vue'),
        redirect: '/customer/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'customer_dashboard',
                meta: { title: 'Admin Dashboard' },
                component: () => import('./pages/customer/dashboard.vue'),
            },
            {
                path: 'profile',
                name: 'customer_profile',
                props: route => ({ data: route.meta.data }),
                component: () => import('./pages/customer/profile.vue'),
                beforeEnter: [async (route) => {
                    useLoadingStore().setLoading();
                    const { error, data } = await useApiFetch(ziggyRoute('customer.profile.get_detail', {user_id: useAuthStore().getAuthId()}) );
                    useLoadingStore().removeLoading();
                    route.meta.data = data.value
                }],
            },
        ],
    },


    // Admin Routes
    {
        path: '/admin/login',
        beforeEnter: [guestAdmin],
        component: () => import('./pages/admin/login.vue'),
    },
    {
        path: '/admin',
        name: 'admin_section',
        beforeEnter: [authAdmin],
        component: () => import('./layouts/admin-panel.vue'),
        redirect: '/admin/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'admin_dashboard',
                component: () => import('./pages/admin/dashboard.vue'),
            },
            {
                path: 'administrators',
                name: 'administrator_list',
                component: () => import('./pages/admin/administrators/index.vue'),
            },
            {
                path: 'administrators/create',
                name: 'administrator_create',
                component: () => import('./pages/admin/administrators/create.vue'),
            },
            {
                path: 'administrators/:id',
                name: 'administrator_edit',
                props: route => ({ data: route.meta.data }),
                beforeEnter: [(route) => ResourceFinder(ziggyRoute('admin.admins.show', {id: route.params.id}), route)],
                component: () => import('./pages/admin/administrators/[id].vue'),
            },


            {
                path: 'roles',
                name: 'admin_roles',
                component: () => import('./pages/admin/roles/index.vue'),
            },
            {
                path: 'roles/create',
                name: 'admin_role_create',
                component: () => import('./pages/admin/roles/create.vue'),
            },
            {
                path: 'roles/:id',
                name: 'admin_role_edit',
                props: route => ({ data: route.meta.data }),
                beforeEnter: (route) => ResourceFinder(ziggyRoute('admin.roles.show', {id: route.params.id}), route),
                component: () => import('./pages/admin/roles/[id].vue'),
            },

            {
                path: 'settings',
                name: 'admin_settings',
                component: () => import('./pages/admin/settings/index.vue'),
            },


            {
                path: 'mail-management',
                name: 'admin_mail_list',
                component: () => import('./pages/admin/mail-management/index.vue'),
            },
            {
                path: 'mail-management/:id',
                name: 'admin_mail_edit',
                props: route => ({ data: route.meta.data }),
                beforeEnter: (route) => ResourceFinder(ziggyRoute('admin.mails.show', {id: route.params.id}), route),
                component: () => import('./pages/admin/mail-management/[id].vue'),
            },


            {
                path: 'notifications',
                name: 'admin_notifications',
                component: () => import('./pages/admin/notifications/index.vue'),
            },
            {
                path: 'comments',
                name: 'admin_comments',
                component: () => import('./pages/admin/comments/index.vue'),
            },
            {
                path: 'inquiries',
                name: 'admin_inquiries',
                component: () => import('./pages/admin/inquiries/index.vue'),
            },

            {
                path: 'product-categories',
                name: 'admin_product_categories',
                component: () => import('./pages/admin/product-categories/index.vue'),
            },
            {
                path: 'product-categories/create',
                name: 'admin_product_category_create',
                component: () => import('./pages/admin/product-categories/create.vue'),
            },
            {
                path: 'product-categories/:id',
                name: 'admin_product_category_edit',
                props: route => ({ data: route.meta.data }),
                beforeEnter: (route) => ResourceFinder(ziggyRoute('admin.product_categories.show', {id: route.params.id}), route),
                component: () => import('./pages/admin/product-categories/[id].vue'),
            },

            {
                path: 'products',
                name: 'admin_products',
                component: () => import('./pages/admin/products/index.vue'),
            },
            {
                path: 'products/create',
                name: 'admin_product_create',
                component: () => import('./pages/admin/products/create.vue'),
            },
            {
                path: 'products/:id',
                name: 'admin_product_edit',
                props: route => ({ data: route.meta.data }),
                beforeEnter: (route) => ResourceFinder(ziggyRoute('admin.products.show', {id: route.params.id}), route),
                component: () => import('./pages/admin/products/[id].vue'),
            },

            {
                path: 'customers',
                name: 'admin_customer_list',
                component: () => import('./pages/admin/customers/index.vue'),
            },
            {
                path: 'customers/create',
                name: 'admin_customer_create',
                component: () => import('./pages/admin/customers/create.vue'),
            },
            {
                path: 'customers/:id',
                name: 'admin_customer_edit',
                props: route => ({ data: route.meta.data }),
                beforeEnter: (route) => ResourceFinder(ziggyRoute('admin.customers.show', {id: route.params.id}), route),
                component: () => import('./pages/admin/customers/[id].vue'),
            },
            {
                path: 'customers/pipeline',
                name: 'admin_customer_pipeline',
                component: () => import('./pages/admin/customers/pipeline.vue'),
            },


            {
                path: 'birthday-calendar',
                name: 'admin_birthday_calendar',
                component: () => import('./pages/admin/birthday-calendar/index.vue'),
            },

            {
                path: 'leads',
                name: 'admin_leads',
                component: () => import('./pages/admin/leads/index.vue'),
            },
            {
                path: 'leads/:id',
                name: 'admin_lead_detail',
                props: route => ({ data: route.meta.data }),
                beforeEnter: (route) => ResourceFinder(ziggyRoute('admin.leads.show', {id: route.params.id}), route),
                component: () => import('./pages/admin/leads/[id].vue'),
            },

            {
                path: 'invoices',
                name: 'admin_invoices',
                component: () => import('./pages/admin/invoices/index.vue'),
            },
            {
                path: 'invoices/create',
                name: 'admin_invoice_create',
                component: () => import('./pages/admin/invoices/create.vue'),
            },
            {
                path: 'invoices/:id',
                name: 'admin_invoice_edit',
                props: route => ({ data: route.meta.data }),
                beforeEnter: (route) => ResourceFinder(ziggyRoute('admin.invoices.show', {id: route.params.id}), route),
                component: () => import('./pages/admin/invoices/[id].vue'),
            },
        ],
    },
    {   path: "/admin/:pathMatch(.*)*",
        name: 'NotFound',
        component: () => import('./pages/error-404.vue'),
    },

];

const router = createRouter({
    routes,
    history: createWebHistory()
});

router.beforeEach((to, from, next) => {
    if (useAuthStore().hasAuth()) {
        useAuthStore().refreshAuthCookie();
    }

    next();
});

export default router;