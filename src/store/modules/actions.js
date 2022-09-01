import axios from 'axios';
let testURL = 'http://172.16.0.179/api'
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
  GET_CATEGORY_FROM_API({
    commit,
  }) {
    return axios(`${testURL}/categories`, {
      method: 'GET',
    })
      .then((category) => {
        commit('SET_CATEGORY_TO_STATE', category.data);
        console.log(category);
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
    return axios(`${URL}/orders`, {
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
};
