<template>
  <section class="section">
    <div
        class="cart-done"
        v-if="sucsess"
    >
      <div class="cart cart-sucsess order-title">
        <div class="position-end">
          <img
              src="/allImage/Icons/cross.svg"
              class="header-link-icon pointer close"
              @click="close"
              alt="close"/>
        </div>
        <h2 class="title-2">Заказ успешно сформирован!</h2>
        <p class="paragraph">Письмо с информацией отправлено вам на почту.</p>
        <p class="paragraph">Спасибо за заказ!</p>
      </div>
    </div>
    <div
        class="container cart cart-container"
        v-if="isVisible"
    >
      <p
          class="title-2 text-centered margin-10-0"
          v-if="cart_data <= 1"
      >
        Корзина пуста
      </p>
      <CartElement
          v-for="(item, index) in cart_data"
          :key="item.id"
          :cart_item_data="item"
          @deleteFromCart="deleteFromCart(index)"
          :index="index"
      />
      <div
          class="cart-footer"
          v-if="!(cart_data <= 1)"
      >
        <div class="v-select">
          <p
              class="input delivery"
              @click="areOptionsVisible = !areOptionsVisible"
          >
            {{ selected }}
          </p>
          <div
              class="options cart-options"
              v-if="areOptionsVisible"
          >
            <p
                class="paragraph input search-cart"
                v-for="pickpoint in DELIVERY_POINTS"
                :key="pickpoint.id"
                @click="selectOption(pickpoint)"
            >
              {{ pickpoint.name }}
            </p>
          </div>
        </div>
        <div class="cart-footer-element">
          <button
              class="header-link"
              @click="orderUsers()"
          >
            Заказать
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
import axios from 'axios';
import CartElement from './CartElement.vue';
import config from '@/config.js'

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
      pickpoint_id: '',
      orderNumber: ''
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
    currentDate(date) {
      let dd = date.getDate();
      if (dd < 10) dd = '0' + dd;
      let mm = date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;
      let yyyy = date.getFullYear();
      if (yyyy < 10) yyyy = '0' + yyyy;
      let hour = date.getHours()
      if (hour < 10) hour = '0' + hour
      let minutes = date.getMinutes()
      if (minutes < 10) minutes = '0' + minutes
      let sec = date.getSeconds()
      if (sec < 10) sec = '0' + sec
      return yyyy + '-' + mm + '-' + dd + ' ' + hour + ':' + minutes + ':' + sec;
    },
    deliveryDay(date) {
      let result = new Date(date);
      result.setDate(result.getDate() + 3);
      result.setMonth(result.getMonth() + 1)
      return result;
    },
    orderUsers() {
      if (this.selected === 'Выберите адрес доставки') {
        alert('Выберите адрес доставки');
      } else {
        let date = new Date();
        let dateDelivery = this.deliveryDay(date).getFullYear() + '-' + this.deliveryDay(date).getMonth() + '-' + this.deliveryDay(date).getDate()
        let order = {
          delivery_date: dateDelivery,
          payment_type: 1, //изменить
          status: 'в обработке',
          comment: '',
          author_id: this.$cookies.get('id'),
          user_id: this.$cookies.get('id'),
          pickpoint_id: this.pickpoint_id
        };
        order.date = this.currentDate(date);
        axios
        ({
          method: 'POST',
          url: `${config.url}/orders`,
          data: order,
          headers: {
            "authorization": this.$cookies.get('authorization')
          }
        })
            .then((order) => {

              let order_id = parseInt(order.data.detail.match(/\d+/));
              this.orderNumber = parseInt(order.data.detail.match(/\d+/));
              this.contentAdd(order_id);
              this.getRoles('admin')
              this.getRoles('cheesemaster')
            })
            .catch((error) => {
              console.log(error);
              alert('Ошибка в работе приложения. Обратитесь к администратору.');
            });
      }
    },
    sendEmail(role) {
      for (let i = 0; i < role.length; i++) {
        console.log(role[i].email)
        let sendMessage = {}
        sendMessage.address = role[i].email
        sendMessage.subject = `Новый заказ № ${this.orderNumber}`
        sendMessage.body = `Пользователь ${this.$cookies.get('fio')} сделал новый заказ`
        axios
        ({
          method: 'POST',
          url: `${config.url}/users/sendmail`,
          data: sendMessage,
          headers: {
            "authorization": this.$cookies.get('authorization')
          }
        })

            .catch((error) => {
              console.log(error);
              alert('Ошибка в работе приложения. Обратитесь к администратору.');
            });
      }
    },
    getRoles(roleName) {
      axios
      ({
        method: 'GET',
        url: `${config.url}/users/role/${roleName}`,
        headers: {
          "authorization": this.$cookies.get('authorization')
        }
      })
          .then((req) => {
            console.log(req.data)
            this.sendEmail(req.data)
          })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },
    contentAdd(order_id) {
      let date = new Date();
      let cart = this.cart_data;
      for (const i in cart) {
        cart[i].date = this.currentDate(date);
        cart[i].product_id = cart[i].id;
        cart[i].order_id = order_id;
        cart[i].author_id = this.$cookies.get('id')
        cart[i].status = 'в обработке';
        cart[i].manufacturer_id = 1; //изменить
        delete cart[i].active;
        delete cart[i].description;
        delete cart[i].image;
        delete cart[i].inStockQuantity;
        delete cart[i].name;
        delete cart[i].image_path;
        delete cart[i].id;
        this.sendForm(cart[i]);
      }
      this.sucsess = !this.sucsess;
    },
    sendForm(cartElement) {
      axios
      ({
        method: 'POST',
        url: `${config.url}/contents/`,
        data: cartElement,
        headers: {
          "authorization": this.$cookies.get('authorization')
        }
      })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },
    deleteFromCart(index) {
      this.DELITE_FROM_CART(index);
    },
    hideShow() {
      if (this.areOptionsVisible === true) {
        return this.areOptionsVisible === false;
      } else {
        return this.areOptionsVisible === true;
      }
    },
    selectOption(pickpoint) {
      this.selected = pickpoint.name;
      this.pickpoint_id = pickpoint.id
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
