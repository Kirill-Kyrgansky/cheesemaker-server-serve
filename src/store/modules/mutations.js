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
          item.amount++;
        }
      });
      if (!isProductExist) {
        product.amount = 1;
        state.cart.push(product);
      }
    } else {
      product.amount = 1;
      state.cart.push(product);
    }
  },
  SET_PRICES_TO_STATE: (state, prices) => {
    state.prices = prices;
  },
  SET_PRODUCTS_TO_STATE: (state, products) => {
    state.products = products;
  },
  SET_CATEGORY_TO_STATE: (state, category) => {
    state.category = category;
  },
  SET_DELIVERY_POINTS_FROM_API: (state, pickpoints) => {
    state.pickpoints = pickpoints;
  },
  REMOVE_FROM_CART(state, index) {
    state.cart.splice(index, 1);
  },
  SET_ORDERS_FROM_API: (state, orders) => {
    state.orders = orders;
  },
  SET_STORAGES_TO_STATE: (state, storages) => {
    state.storages = storages;
  },  
  SET_CONTENTS_TO_STATE: (state, contents) => {
    state.contents = contents;
  },
  SET_ORDERS_USERS_TO_STATE: (state, ordersUsers) => {
    state.ordersUsers = ordersUsers;
  },
  SET_USERS_TO_STATE: (state, users) => {
    state.users = users;
  },
};
