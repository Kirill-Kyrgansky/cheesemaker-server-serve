import axios from 'axios';
let testURL = 'http://shop-dev.zdmail.ru/api'
let URL = 'http://localhost:3000'
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
    return axios(`${testURL}/products`, {
      method: 'GET',
    })
      .then((products) => {
        commit('SET_PRODUCTS_TO_STATE', products.data);
        return products;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  },
  GET_PRICES_FROM_API({
    commit,
  }) {
    return axios(`${testURL}/prices`, {
      method: 'GET',
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
    return axios(`${testURL}/categories`, {
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
    return axios(`${testURL}/pickpoints`, {
      method: 'GET',
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
    return axios(`${testURL}/orders`, {
      method: 'GET',
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
    return axios(`${testURL}/storages`, {
      method: 'GET',
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
    return axios(`${testURL}/contents`, {
      method: 'GET',
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
};
