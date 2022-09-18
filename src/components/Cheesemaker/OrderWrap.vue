<template>
  <section class="section">
    <div class="container wrap-cheesemaker-order">
      <OrderElement
        v-for="(order, index) in ORDERS"
        :key="order.id"
        :order="ORDERS[index]"
        :index="index"
        :products="PRODUCTS"
      />
    </div>
  </section>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import OrderElement from './OrderElement.vue';

export default {
  name: 'OrderWrap',
  components: {
    OrderElement,
  },
  methods: {
    ...mapActions([
      'GET_ORDERS_FROM_API',
      'GET_CONTENTS_FROM_API',
      'GET_PRODUCTS_FROM_API',
      'GET_USERS_FROM_API',
    ]),
  },
  mounted() {
    this.GET_ORDERS_FROM_API();
    this.GET_CONTENTS_FROM_API();
    this.GET_PRODUCTS_FROM_API();
    this.GET_USERS_FROM_API();
  },
  computed: {
    ...mapGetters(['DELIVERY_POINTS', 'ORDERS', 'PRODUCTS', 'USERS']),
  },
};
</script>
