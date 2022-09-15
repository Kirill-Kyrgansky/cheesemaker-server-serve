<template>
  <div>
    <div class="cart-element-wrap catalog-element-wrap">
      <img
        @click="deliteFromCart"
        src="/allImage/Icons/cross.svg"
        class="header-link-icon pointer"
      />
      <div class="cart-element">
        <img
          :src="
            'http://shop-dev.zdmail.ru' + cart_item_data.image_path.slice('2')
          "
          class="cart-img"
          :alt="cart_item_data.name"
        />
      </div>
      <div class="cart-element">
        <p class="title-3">{{ cart_item_data.name }}</p>
      </div>
      <div class="cart-element">
        <p class="title-3">
          {{ price }}
          <!-- {{ cart_item_data.price }}&nbsp;₽&nbsp;1 {{ cart_item_data.unit }}. -->
        </p>
      </div>
      <div class="cart-element">
        <p class="title-3">{{ cart_item_data.amount }}</p>
      </div>
      <textarea
        type="text"
        class="input input-cart width-200"
        placeholder="Комментарии"
        v-model="computedProperty.comment"
      ></textarea>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'CartElement',
  data() {
    return {
      price: {},
    };
  },
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
      set(comment) {
        this.CART.comment = comment;
      },
    },
  },
  methods: {
    getPrice() {
      console.log(this.cart_item_data.price_id);
      axios
        .get(
          `http://shop-dev.zdmail.ru/api/prices/${this.cart_item_data.price_id}`,
          {
            headers: {
              authorization: this.$cookies.get('authorization'),
            },
          }
        )
        .then((res) => {
          this.price = res.data.item_price + ' ₽ 1' + res.data.item_measure;
          console.log(res);
        })
        .catch((error) => {
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
          console.log(error);
        });
    },
    updateMessage(val) {
      this.CART.commit('updateMessage', val.comment);
    },
    deliteFromCart() {
      this.$emit('deliteFromCart');
    },
  },
  mounted() {
    this.getPrice();
    this.$emit('comment', this.cart_item_data.comment);
  },
};
</script>
