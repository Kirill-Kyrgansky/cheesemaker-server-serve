import {
  createRouter,
  createWebHashHistory,
} from 'vue-router';
import ElementWrap from '../components/ElementProduct/ElementWrap.vue';
import CartWrap from '../components/Cart/CartWrap.vue';
import DeliveryPoint from '../components/Delivery/DeliveryPoint.vue';
import ElementWrapAdmin from '../components/Admin/ElementWrapAdmin.vue';
import ElementWrapCheesemaker from '../components/Cheesemaker/ElementWrapCheesemaker.vue';
import HomePageWrap from '../components/HomePageWrap.vue';
import OrderWrap from '../components/Cheesemaker/OrderWrap.vue';
import store from '../store/index';



const router = createRouter({
  history: createWebHashHistory(),
  routes: [{
    path: '/',
    component: HomePageWrap,
    meta: {
      user: true,
    },
  }, {
    path: '/products',
    component: ElementWrap,
    name: 'product',
    meta: {
      user: true,
    },
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartWrap,
    meta: {
      user: true,
    },
  },
  {
    path: '/delivery',
    component: DeliveryPoint,
    meta: {
      user: true,
    },
  },
  {
    path: '/admin',
    component: ElementWrapAdmin,
    meta: {
      adminLogin: true,
    },
  },
  {
    path: '/cheesemaker',
    component: ElementWrapCheesemaker,
    meta: {
      cheesemaker: true,
    },
  },
  {
    path: '/cheesemaker-orders',
    component: OrderWrap,
    meta: {
      cheesemaker: true,
    },
  },
  ],

});

router.beforeEach((to, from, next) => {
  if (!store.state.isAuth && to.name === 'product' ) {
  }
  else {
    next()
  }
})

export default router
