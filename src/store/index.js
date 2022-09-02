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
    isAdmin: true,
    isSuperAdmin: true,
    searchValue: '',
    products: [],
    category: [],
    pickpoints: [],
    cart: [],
    orders: [],
    prices: [],
  },
  getters,
});

export default store;
