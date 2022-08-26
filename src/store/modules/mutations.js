export default {

  SET_SEARCH_VALUE_TO_VUEX: (state, value) => {
    state.searchValue = value;
  },
  SET_CART: (state, product) => {
    if (state.cart.length) {
      let isProductExist = false;
      state.cart.map((item) => {
        if (item.id === product.id) {
          isProductExist = true;
          item.quantity++;
        }
      });
      if (!isProductExist) {
        state.cart.push(product);
      }
    } else {
      state.cart.push(product);
    }
  },
  SET_PRODUCTS_TO_STATE: (state, products) => {
    state.products = products;
  },
  SET_CATEGORIES_TO_STATE: (state, categories) => {
    state.categories = categories;
  },
  SET_DELIVERY_POINTS_FROM_API: (state, deliveryPoints) => {
    state.deliveryPoints = deliveryPoints;
  },
  REMOVE_FROM_CART(state, index) {
    state.cart.splice(index, 1);
  },
  SET_ORDERS_FROM_API: (state, orders) => {
    state.orders = orders;
  },
  SET_FACT_WEIGHT_AND_PRICE: (state, factWeight, factPrice) => {
    state.orders.factWeight = factWeight;
    state.orders.factPrice = factPrice;
  },
};
