<template>
  <section class="section">
    <div class="cart-done" v-if="sucsess">
      <div class="cart cart-sucsess">
        <div class="order-title">
          <p class="title-1 close pointer button-on" @click="close">X</p>
        </div>
        <h2 class="title-2">Заказ успешно сформирован!</h2>
        <p class="paragraph">Письмо с информацией отправлено вам на почту.</p>
        <!-- <p class="paragraph">Отслеживать движение заказа вы можете в личном кабинете.</p> -->
        <p class="paragraph">Спасибо за заказ!</p>
      </div>
    </div>
    <div class="container cart" v-if="isVisible">
      <p class="title-2 text-centered margin-10-0" v-if="cart_data <= 1">
        Корзина пуста
      </p>
      <CartElement
        v-for="(item, index) in cart_data"
        :key="item.id"
        :cart_item_data="item"
        @deliteFromCart="deliteFromCart(index)"
        :index="index"
      />
      <div class="cart-footer" v-if="!(cart_data <= 1)">
        <div class="v-select">
          <p
            class="input delivery"
            @click="areOptionsVisible = !areOptionsVisible"
          >
            {{ selected }}
          </p>
          <div class="options cart-options" v-if="areOptionsVisible">
            <p
              class="paragraph input search-cart"
              v-for="deliveryPoint in DELIVERY_POINTS"
              :key="deliveryPoint.id"
              @click="selectOption(deliveryPoint)"
            >
              {{ deliveryPoint.name }}
            </p>
          </div>
        </div>
        <div class="cart-footer-element">
          <button class="btn" @click="orderUsers()">Заказать</button>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

import axios from 'axios';
import CartElement from './CartElement.vue';

export default {
  name: 'CartWrap',
  data() {
    return {
      areOptionsVisible: false,
      selected: 'Выберите адрес доставки',
      orderTime: '',
      cart: {},
      isVisible: true,
      sucsess: false,
    };
  },
  props: {
    cart_data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    CartElement,
  },
  methods: {
    close() {
      this.sucsess = !this.sucsess;
      this.$router.push('/');
      setTimeout(() => {
        location.reload();
      }, 0);
    },
    ...mapActions([
      'DELITE_FROM_CART',
      'INCREMENT_CART_ITEM',
      'DECREMENT_CART_ITEM',
      'GET_DELIVERY_POINTS_FROM_API',
    ]),
    orderUsers() {
      if (this.selected === 'Выберите адрес доставки') {
        alert('Выберите адрес доставки');
      } else {
        this.isVisible = !this.isVisible;
        const cart = this.cart_data; // created new object and deliite
        for (const i in cart) {
          delete cart[i].category;
          delete cart[i].description;
          delete cart[i].image;
          delete cart[i].inStockQuantity;
        }
        const props = { data: {}, cart };
        const date = new Date();
        props.data.order = date.toLocaleDateString('ru', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        props.data.adress = this.selected;
        props.data.fullName = 'Иванов Иван Иванович';
        props.data.phoneNumber = '8-999-232-22-21';
        axios
          .post('http://localhost:3000/orders', props)
          .then(() => {
            this.sucsess = !this.sucsess;
          })
          .catch((error) => {
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
            console.log(error);
          });
      }
    },
    deliteFromCart(index) {
      this.DELITE_FROM_CART(index);
    },
    hideShow() {
      if (this.areOptionsVisible == true) {
        this.areOptionsVisible == false;
      } else {
        this.areOptionsVisible == true;
      }
    },
    selectOption(deliveryPoint) {
      this.selected = deliveryPoint.name;
      this.areOptionsVisible = false;
    },
    hideSelect() {
      this.areOptionsVisible = false;
    },
  },
  mounted() {
    document.addEventListener('click', this.hideSelect.bind(this), true);
    this.GET_DELIVERY_POINTS_FROM_API();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.hideSelect);
  },
  computed: {
    ...mapGetters(['DELIVERY_POINTS', 'CART']),
    cartTotal() {
      let result = [];
      if (this.cart_data.lenght) {
        for (const item of this.cart_data) {
          result.push(item.quantity);
        }
        result = result.reduce((sum, el) => sum + el);
        return result;
      }
      return 0;
    },
  },
};
</script>
