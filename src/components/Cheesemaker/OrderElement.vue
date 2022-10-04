<template>
  <div class="order-element">
    <div class="order-title">
      <div class="order-info">
        <div>
          <p class="title-2">Номер заказа: {{ order.id }}</p>
          <p class="title-2">Дата заказа: {{ date }}</p>
          <p class="title-2">Статус: {{ order.status }}</p>
        </div>
        <div class="margin-10-0">
          <p class="title-3"><span class="bold">Ф.И.О.</span> {{ order.author.fio }}</p>
          <p class="title-3">
            <span class="bold">E-mail:</span> {{ order.author.email }}
          </p>
          <p class="title-3">
            <span class="bold">Телефон:</span> {{ order.author.phone }}
          </p>
          <div v-for="pickpoint in DELIVERY_POINTS" :key="pickpoint.id">
            <p class="title-3">
              <span class="bold">Адрес доставки:</span>
              {{ pickpoint.name }}
            </p>
          </div>
        </div>
      </div>
      <!--      <p class="cancellation bold centered-horizontally" v-if="order.status === 'отменен пользователем'">-->
      <!--        Заказ отменен пользователем!-->
      <!--      </p>-->
      <!--      <p class="cancellation bold centered-horizontally" v-if="order.status === 'отменен'">-->
      <!--        Заказ отменен сыроваром! Причина: {{ order.comment }}-->
      <!--      </p>-->
      <div class="border-line"></div>
    </div>
    <div>
      <ProductOrderElement
          v-for="(content, index) in order.content"
          :key="content.id"
          ref="ProductOrderElement"
          :content="content"
          :index="index" :order="order"
      />
    </div>
    <div class="button-right">
      <button @click="orderSentToThePoint" type="button" class="btn centered" v-if="order.status === 'в обработке'">
        Отправить заказ на точку
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-right"
             viewBox="0 0 16 16">
          <path fill-rule="evenodd"
                d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"/>
        </svg>
      </button>
      <button @click="orderCheckToThePoint" type="button" class="btn centered" v-if="order.status === 'в обработке'">
        Подготовить заказ для отправки
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-right"
             viewBox="0 0 16 16">
          <path fill-rule="evenodd"
                d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"/>
        </svg>
      </button>
      <button @click="orderStopToThePoint" v-if="order.status === 'в обработке'" type="button"
              class="cancellation centered-horizontally btn-text">
        Отменить заказ
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-right"
             viewBox="0 0 16 16">
          <path fill-rule="evenodd"
                d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"/>
        </svg>
      </button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import {mapActions, mapGetters} from 'vuex';
import ProductOrderElement from './ProductOrderElement.vue';
import config from '@/config.js';

export default {
  name: 'OrderElement',
  data() {
    return {
      newOrder: {},
      orderRun: false,
      comment: '',
      products: {},
      usersInfo: {},
      content: {},
    };
  },
  props: {
    order: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    ProductOrderElement,
  },
  computed: {
    ...mapGetters(['CONTENTS', 'USERS', 'DELIVERY_POINTS']),
    date() {
      let date = this.order.order_date.split('T')[0].split('-');
      return date[2] + '-' + date[1] + '-' + date[0];
    },
  },
  mounted() {
    this.GET_DELIVERY_POINTS_FROM_API();
  },
  methods: {
    ...mapActions(['GET_DELIVERY_POINTS_FROM_API']),
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
    orderCheckToThePoint() {
      let contentsLength = Object.keys(this.order.content).length;
      for (let i = 0; i < contentsLength; i++) {
        this.$refs.ProductOrderElement[i].productCheck();
      }
    },
    orderSentToThePoint() {
      let staffed = []
      let notStaffed = []
      let cancelled = []
      for (let value of Object.values(this.order.content)) {
        if ((value.order_id === this.order.id)) {
          if (value.status === 'подготовлен к отправке') {
            staffed.push(value)
          } else if (value.status === 'отменен') {
            cancelled.push(value)
          } else {
            notStaffed.push(value)
          }
        }
      }
      if (notStaffed.length === 0) {
        let date = new Date();
        let order = {}
        let nowDate = this.currentDate(date)
        order.delivery_date = this.order.delivery_date.split('T')[0]
        order.comment = this.order.comment
        order.date = this.order.date
        order.payment_type = this.order.payment_type
        order.pickpoint_id = this.order.pickpoint.id
        order.user_id = this.order.user_id
        order.author_id = this.order.author.id
        order.date = nowDate
        order.status = 'отправлен на точку'
        this.order.status = 'отправлен на точку'
        axios({
          method: 'PATCH',
          url: `${config.url}/orders/${this.order.id}`,
          data: order,
          headers: {
            authorization: this.$cookies.get('authorization'),
          },
        })
            .catch((error) => {
              this.order.status = 'в обработке'
              console.log(error);
              alert('Ошибка в работе приложения. Обратитесь к администратору.');
            });
      }
    },
    deliveryDay(date) {
      let result = new Date(date);
      result.setDate(result.getDate() + 1);
      result.setMonth(result.getMonth() + 1)
      return result;
    },
    orderStopToThePoint() {
      let date = new Date();
      let deliveryDate = this.order.delivery_date.split('T')[0]
      let comment = prompt('Введите причину отмены.');
      if (comment === '') {
        alert('Вы не ввели причину отмены. Пожалуйста, повторите попытку.');
      } else if (comment == null) {
        return
      } else {
        let contents = this.order.content
        for (let value of Object.values(contents)) {
          let content = {};
          content.date = this.currentDate(date);
          content.status = 'отменен';
          content.comment = comment;
          content.operation = 3
          content.amount = value.amount
          content.manufacturer_id = value.manufacturer.id
          content.price_id = value.price.id
          content.order_id = value.order_id
          content.author_id = value.author_id
          content.storage_id = value.storage.id
          content.product_id = value.product.id
          axios({
            method: 'PATCH',
            url: `${config.url}/contents/${value.id}`,
            data: content,
            headers: {
              authorization: this.$cookies.get('authorization'),
            },
          })
              .then(() => {
                return value.status = 'отменен'
              })
              .catch((error) => {
                console.log(error);
                alert('Ошибка в работе приложения. Обратитесь к администратору.');
              });
        }
      }
      let sendOrder = {}
      sendOrder.date = this.currentDate(date);
      sendOrder.status = 'отменен';
      this.order.status = 'отменен'
      sendOrder.comment = comment
      sendOrder.delivery_date = deliveryDate
      sendOrder.id = this.order.id
      sendOrder.payment_type = this.order.payment_type
      sendOrder.user_id = this.order.user_id
      sendOrder.pickpoint_id = this.order.pickpoint.id
      sendOrder.author_id = this.$cookies.get('id')
      axios({
        method: 'PATCH',
        url: `${config.url}/orders/${this.order.id}`,
        data: sendOrder,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },
  },
};
</script>
