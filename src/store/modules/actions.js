import axios from 'axios';
// let URL = 'http://172.16.0.179:3000'
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
    return axios(`${URL}/products`, {
      method: 'GET',
    })
      .then((products) => {
        commit('SET_PRODUCTS_TO_STATE', products.data);
        console.log(products.data);
        return products;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  },
  GET_CATEGORIES_FROM_API({
    commit,
  }) {
    return axios(`${URL}/categories`, {
      method: 'GET',
    })
      .then((categories) => {
        commit('SET_CATEGORIES_TO_STATE', categories.data);
        return categories;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  },
  GET_DELIVERY_POINTS_FROM_API({
    commit,
  }) {
    return axios(`${URL}/pickpoints`, {
      method: 'GET',
    })
      .then((deliveryPoints) => {
        commit('SET_DELIVERY_POINTS_FROM_API', deliveryPoints.data);
        return deliveryPoints;
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
