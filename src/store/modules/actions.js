import axios from 'axios';
import config from '@/config.js'

export default {
  GET_SEARCH_VALUE_TO_VUEX({
    commit,
  }, value) {
    commit('SET_SEARCH_VALUE_TO_VUEX', value);
  },
  ADD_TO_CART({
    commit,
  }, product) {
    commit('SET_CART', product);
  },
  DELITE_FROM_CART({
    commit,
  }, index) {
    commit('REMOVE_FROM_CART', index);
  },
  GET_PRODUCTS_FROM_API({
    commit,
  }) {
    return axios(`${config.url}/products`, {
      headers: {
        "authorization": $cookies.get('authorization')
      },
      method: 'GET',
    })
      .then((products) => {
        commit('SET_PRODUCTS_TO_STATE', products.data);
        return products;
      })
      .catch((error) => {
        console.log(error);
        console.log(config.url);
        return error;
      });
  },
  GET_PRICES_FROM_API({
    commit,
  }) {
    return axios(`${config.url}/prices`, {
      method: 'GET',
      headers: {
        "authorization": $cookies.get('authorization')
      },
    })
      .then((prices) => {
        commit('SET_PRICES_TO_STATE', prices.data);
        return prices;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  },
  GET_CATEGORY_FROM_API({
    commit,
  }) {
    return axios(`${config.url}/categories`, {
      headers: {
        "authorization": $cookies.get('authorization')
      },
      method: 'GET',
    })
      .then((category) => {
        commit('SET_CATEGORY_TO_STATE', category.data);
        return category;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  },
  GET_DELIVERY_POINTS_FROM_API({
    commit,
  }) {
    return axios(`${config.url}/pickpoints`, {
      method: 'GET',
      headers: {
        "authorization": $cookies.get('authorization')
      },
    })
      .then((pickpoints) => {
        commit('SET_DELIVERY_POINTS_FROM_API', pickpoints.data);
        return pickpoints;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  },
  GET_ORDERS_FROM_API({
    commit,
  }) {
    return axios(`${config.url}/orders/content`, {
      method: 'GET',
      headers: {
        "authorization": $cookies.get('authorization')
      },
    })
      .then((orders) => {
        commit('SET_ORDERS_FROM_API', orders.data);
        return orders;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  },
  GET_STORAGES_FROM_API({
    commit,
  }) {
    return axios(`${config.url}/storages`, {
      method: 'GET',
      headers: {
        "authorization": $cookies.get('authorization')
      },
    })
      .then((storages) => {
        commit('SET_STORAGES_TO_STATE', storages.data);
        return storages;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  },
  GET_CONTENTS_FROM_API({
    commit,
  }) {
    return axios(`${config.url}/contents`, {
      method: 'GET',
      headers: {
        "authorization": $cookies.get('authorization')
      },
    })
      .then((contents) => {
        commit('SET_CONTENTS_TO_STATE', contents.data);
        return contents;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }, 
  GET_ORDERS_USERS_FROM_API({
    commit,
  }) {
    return axios(`${config.url}/users/orders`, {
      method: 'GET',
      headers: {
        "authorization": $cookies.get('authorization')
      },
    })
      .then((ordersUsers) => {
        commit('SET_ORDERS_USERS_TO_STATE', ordersUsers.data);
        return ordersUsers;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  },
  GET_USERS_FROM_API({
    commit,
  }) {
    return axios(`${config.url}/users`, {
      method: 'GET',
      headers: {
        "authorization": $cookies.get('authorization')
      },
    })
      .then((users) => {
        commit('SET_USERS_TO_STATE', users.data);
        return users;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    }
};
