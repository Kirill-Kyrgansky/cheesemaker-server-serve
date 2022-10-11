import {
    createRouter,
    createWebHistory,
} from 'vue-router';
import ElementWrap from '../components/ElementProduct/ElementWrap.vue';
import CartWrap from '../components/Cart/CartWrap.vue';
import DeliveryPoint from '../components/Delivery/DeliveryPoint.vue';
import ElementWrapAdmin from '../components/Admin/ElementWrapAdmin.vue';
import ElementWrapCheesemaker from '../components/Cheesemaker/ElementWrapCheesemaker.vue';
import HomePageWrap from '../components/HomePageWrap.vue';
import OrderWrap from '../components/Cheesemaker/OrderWrap.vue';
import OrderWrapSeller from '../components/Seller/OrderWrapSeller.vue';
import PageNotFound from '../components/Page/PageNotFound.vue'
import WarehouseWrap from "@/components/Cheesemaker/Warehouse/WarehouseWrap";
import UsersWrap from "@/components/Admin/Users/UsersWrap";

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            component: PageNotFound
        },
        {
            path: '/',
            name: 'home',
            component: HomePageWrap,
        },
        {
            path: '/products',
            component: ElementWrap,
            name: 'product',
            meta: {
                user: true,
                cheesemaker: true,
                adminLogin: true,
            },
        },
        {
            path: '/cart',
            component: CartWrap,
            name: 'cart',
            meta: {
                user: true,
                cheesemaker: true,
                adminLogin: true,
            },
        },
        {
            path: '/delivery',
            component: DeliveryPoint,
            name: 'delivery',
            meta: {
                user: true,
                cheesemaker: true,
                adminLogin: true,
            },
        },
        {
            path: '/admin',
            component: ElementWrapAdmin,
            name: 'admin',
            meta: {
                adminLogin: true,
            },
        },
        {
            path: '/users',
            component: UsersWrap,
            name: 'users',
            meta: {
                adminLogin: true,
            },
        },
        {
            path: '/cheesemaker',
            component: ElementWrapCheesemaker,
            name: 'cheesemaker',
            meta: {
                cheesemaker: true,
            },
        },
        {
            path: '/cheesemaker-orders',
            component: OrderWrap,
            name: 'cheesemaker-orders',
            meta: {
                cheesemaker: true,
                adminLogin: true,
            },
        },
        {
            path: '/warehouse',
            component: WarehouseWrap,
            name: 'warehouse',
            meta: {
                cheesemaker: true,
                adminLogin: true,
            },
        },
        {
            path: '/seller-orders',
            component: OrderWrapSeller,
            name: 'seller-orders',
            meta: {
                cheesemaker: true,
                adminLogin: true,
                seller: true,
            },
        },
    ],
});

router.beforeEach((to, from, next) => {
    if (
        ($cookies.get('role') === 'Покупатель') |
        ($cookies.get('role') === 'Сыровар') &&
        to.name === 'admin'
    ) {
        alert('Пожалуйста, авторизуйтесь!');
    } else {
        next();
    }
});

router.beforeEach((to, from, next) => {
    if (!($cookies.get('role') === 'Сыровар') && to.name === 'cheesemaker') {
        alert('Пожалуйста, авторизуйтесь!');
    } else {
        next();
    }
});

router.beforeEach((to, from, next) => {
    if (
        $cookies.get('role') === 'Покупатель' &&
        to.name === 'cheesemaker-orders'
    ) {
        alert('Пожалуйста, авторизуйтесь!');
    } else {
        next();
    }
});

router.beforeEach((to, from, next) => {
    if (!$cookies.get('role') && to.name === 'cart') {
        alert('Пожалуйста, авторизуйтесь!');
    } else {
        next();
    }
});

router.beforeEach((to, from, next) => {
    if (
        $cookies.get('role') === 'Покупатель' &&
        to.name === 'warehouse'
    ) {
        alert('Пожалуйста, авторизуйтесь!');
    } else {
        next();
    }
});

router.beforeEach((to, from, next) => {
    if (
        ($cookies.get('role') === 'Покупатель') |
        ($cookies.get('role') === 'Сыровар') &&
        to.name === 'users'
    ) {
        alert('Пожалуйста, авторизуйтесь!');
    } else {
        next();
    }
});

export default router;
