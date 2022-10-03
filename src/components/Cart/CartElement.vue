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
          :src="'http://shop-dev.zdmail.ru' + cart_item_data.image_path.slice('2')"
          class="cart-img"
          :alt="cart_item_data.name"
        />
      </div>
      <div class="cart-element column-centered">
        <p class="title-3">{{ cart_item_data.name }}</p>
        {{ price.item_price + '&nbsp;₽&nbsp;1 ' + price.item_measure }}
      </div>
      <div class="cart-element">
        <p class="paragraph padding-0-10">{{ finalPrice() }} ₽</p>

        <p class="title-3">
          <!-- {{ cart_item_data.price }}&nbsp;₽&nbsp;1 {{ cart_item_data.unit }}. -->
        </p>
      </div>
      <div class="cart-element" v-if="price.item_measure != 'кг'">
        <input type="button" class="btn margin-0-10" @click="minus" value="-" />
        <p class="title-3">{{ cart_item_data.amount }}</p>
        <input
          type="button"
          class="btn margin-0-10"
          @click="cart_item_data.amount++"
          value="+"
        />
      </div>
      <div
        class="cart-element "
        v-if="price.item_measure === 'кг'"
      >
        <input type="button" class="btn margin-0-10" @click="minus" value="-" />
        <input
          type="number"
          v-model="cart_item_data.amount"
          class="input max-width-50"
          step="0.1"
          min="0.1"
          x-data="{}"
          @keydown="
            if (['+', '-', 'e'].includes($event.key)) $event.preventDefault();
          "
        />
        <input
          type="button"
          class="btn margin-0-10"
          @click="cart_item_data.amount++"
          value="+"
        />
      </div>
      <textarea
        type="text"
        class="input input-cart width-200"
        placeholder="Комментарий"
        title="Введите особые пожелания к заказу"
        v-model="computedProperty.comment"
      ></textarea>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import config from '@/config.js';

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
    finalPrice() {
      let price = this.price.item_price * this.cart_item_data.amount;
      if (isNaN(price)) {
        return 0;
      } else {
        return price.toFixed(2);
      }
    },
    amount() {
      if (this.cart_item_data.amount <= 0) {
        this.cart_item_data.amount = 0;
      }
    },
    minus() {
      if (this.cart_item_data.amount == 1) {
        let isDelite = confirm('Удалить товар из корзины?');
        if (isDelite == true) {
          this.deliteFromCart();
        }
        this.cart_item_data.amount == 1;
      } else {
        this.cart_item_data.amount--;
      }
    },
    getPrice() {
      axios({
        method: 'GET',
        url: `${config.url}/prices/${this.cart_item_data.price_id}`,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
        .then((res) => {
          this.price.item_price = res.data.item_price;
          this.price.item_measure = res.data.item_measure;
        })
        .catch((error) => {
          console.log(error);
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
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
    this.amount();
    this.getPrice();
    this.$emit('comment', this.cart_item_data.comment);
  },
};
</script>
