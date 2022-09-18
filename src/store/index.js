import {
  createStore,
} from 'vuex';

import actions from './modules/actions';
import mutations from './modules/mutations';
import getters from './modules/getters';

const store = new createStore({
  actions,
  mutations,
  state: {
    isAuth: true,
    isAdmin: false,
    isSuperAdmin: false,
    searchValue: '',
    products: [],
    category: [],
    pickpoints: [],
    cart: [],
    orders: [],
    prices: [],
    storages: [],
    contents:[],
    ordersUsers:[],
    users: [],
  },
  getters,
});

export default store;
