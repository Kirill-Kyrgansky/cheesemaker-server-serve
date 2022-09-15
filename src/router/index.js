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
  }, {
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
  ],

});

router.beforeEach((to, from, next) => {
  if (($cookies.get('role_id') == '3') | ($cookies.get('role_id') == '2') && to.name === ('admin')) {
    alert('Пожалуйста, авторизуйтесь!')
  }
  else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  if (!($cookies.get('role_id') == '2') && to.name === ('cheesemaker')) {
    alert('Пожалуйста, авторизуйтесь!')
  }
  else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  if (($cookies.get('role_id') == '3') && to.name === ('cheesemaker-orders')) {
    alert('Пожалуйста, авторизуйтесь!')
  }
  else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  if (!$cookies.get('role_id') && to.name === ('cart')) {
    alert('Пожалуйста, авторизуйтесь!')
  }
  else {
    next()
  }
})


export default router
