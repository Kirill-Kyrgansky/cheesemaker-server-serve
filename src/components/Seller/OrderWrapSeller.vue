<template>
  <section class="section">
    <div class="container wrap-cheesemaker-order">
      <OrderElementSeller
          v-for="order in ORDERS"
          :key="order.id"
          :order="order"
      />
    </div>
  </section>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import OrderElementSeller from './OrderElementSeller.vue';

export default {
  name: 'OrderWrapSeller',
  components: {
    OrderElementSeller,
  },
  methods: {
    ...mapActions([
      'GET_ORDERS_FROM_API',
      // 'GET_CONTENTS_FROM_API',
      // 'GET_PRODUCTS_FROM_API',
      // 'GET_USERS_FROM_API',
    ]),
  },
  mounted() {
    this.GET_ORDERS_FROM_API();
    // this.GET_CONTENTS_FROM_API();
    // this.GET_PRODUCTS_FROM_API();
    // this.GET_USERS_FROM_API();
  },
  computed: {
    ...mapGetters(['DELIVERY_POINTS', 'ORDERS', 'PRODUCTS', 'USERS']),
  },
};
</script>
