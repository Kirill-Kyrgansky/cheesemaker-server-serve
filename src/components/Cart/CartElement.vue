<template>
  <div>
    <div class="cart-element-wrap catalog-element-wrap">
      <div
        @click="deliteFromCart"
        class="cart-element first-cart-element pointer"
      >
        <p class="title-1">Х</p>
      </div>
      <div class="cart-element">
        <img
          :src="cart_item_data.image"
          class="cart-img"
          :alt="cart_item_data.name"
        />
      </div>
      <div class="cart-element">
        <p class="title-3">{{ cart_item_data.name }}</p>
      </div>
      <div class="cart-element">
        <p class="title-3">
          {{ cart_item_data.price }}&nbsp;₽&nbsp;1 {{ cart_item_data.unit }}.
        </p>
      </div>
      <div class="cart-element">
        <p class="title-3">{{ cart_item_data.quantity }}</p>
      </div>
      <textarea
        type="text"
        class="input input-cart"
        placeholder="Комментарии"
        v-model="computedProperty.commentForProduct"
      ></textarea>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CartElement',
  props: {
    cart_item_data: {
      type: Object,
      default() {
        return {};
      },
    },
    index: {
      type: String,
      default() {
        return '';
      },
    },
  },
  computed: {
    ...mapGetters(['CART']),
    computedProperty: {
      // input transfer to store
      get() {
        return this.CART[this.index];
      },
      set(commentForProduct) {
        this.CART.commentForProduct = commentForProduct;
      },
    },
  },
  methods: {
    updateMessage(val) {
      this.CART.commit('updateMessage', val.commentForProduct);
    },
    deliteFromCart() {
      this.$emit('deliteFromCart');
    },
  },
  mounted() {
    this.$emit('commentForProduct', this.cart_item_data.commentForProduct);
  },
};
</script>
