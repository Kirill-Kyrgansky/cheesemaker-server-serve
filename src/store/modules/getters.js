export default {

  SEARCH_VALUE(state) {
    return state.searchValue;
  },
  PRODUCTS(state) {
    return state.products;
  },
  PRICES(state) {
    return state.prices;
  },
  CATEGORY(state) {
    return state.category;
  },
  DELIVERY_POINTS(state) {
    return state.pickpoints;
  },
  CART(state) {
    return state.cart;
  },
  ORDERS(state) {
    return state.orders;
  },
  ISADMIN(state) {
    return state.isAdmin
  }, 
  ISSUPERADMIN(state) {
    return state.isSuperAdmin
  },
  STORAGES(state) {
    return state.storages
  },
  CONTENTS(state) {
    return state.contents
  },
  ORDERS_USERS(state) {
    return state.ordersUsers
  },
  USERS(state) {
    return state.users
  }
};
