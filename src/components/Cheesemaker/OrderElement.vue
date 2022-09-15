<template>
  <div class="order-element" >
    <div class="order-title">
      <p class="title-2">Дата заказа: {{date}}</p>
      <p class="title-2">Номер заказа: {{ order.id }}</p>
      <p class="cancellation bold centered-horizontally" v-if="order.status == 'отменен'">
        Заказ отменен пользователем!
      </p>
      <p class="cancellation bold centered-horizontally" v-if="order.status == 'проблемы'">
        Заказ отменен сыроваром! Причина: {{order.comment}}
      </p>
      <div class="border-line"></div>
    </div>
    <div v-for="content, index in CONTENTS" :key="content.id">
    <ProductOrderElement
      :content="content"
      v-if="(content.order_id == order.id)  "
      :index="index"
      :orderRun="orderRun"

      />
    </div>
    <p class="title-3">
      <span class="bold">Адрес доставки:</span> {{ order.pickpoint_id + ' pickpoint' }}
    </p>
    <p class="title-3">
      <span class="bold">Ф.И.О.</span> {{ order.author_id + ' имя' }}
    </p>
    <p class="title-3">
      <span class="bold">Телефон:</span> {{ 'взять из API' }}
    </p>
    <div class="button-right">
      <button v-if="order.status == 'в обработке'" @click="orderSentToThePoint" type="button" class="btn centered" >
        Заказ отправлен
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-bar-right"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"
          />
        </svg>
      </button>
      <button  @click="orderStopToThePoint" v-if="order.status == 'в обработке'" type="button" class="cancellation centered-horizontally btn-text" >
        Отменить заказ
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-bar-right"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"
          />
        </svg>
      </button>
      
    </div>
    <p v-if="order.status == 'отправлен'" class="btn bold centered-horizontally">
        Заказ успешно отправлен на точку!
      </p>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import ProductOrderElement from './ProductOrderElement.vue';

export default {
  name: 'OrderElement',
  data() {
    return {
      newOrder: {},
      orderRun: false,
      comment: '',
      products: {}
    };
  },
  props: {
    order: {
      type: Object,
      default() {
        return {};
      },
    },    
    // products: {
    //   type: Object,
    //   default() {
    //     return {};
    //   },
    // },
    index: {
      type: Number,
    },
  },
  components: {
    ProductOrderElement,
  },
  computed: {
    ...mapGetters(['CONTENTS']),
    date () {
      let date = this.order.order_date.split('T')[0].split('-')
      return date[2] + '-' + date[1] + '-' + date[0]
    },
    cont() {
      this.content.order_id == this.order.id
      return test = this.content.order_id
    },
  },
  methods: {    
    currentDate(date) {
      var dd = date.getDate();
      if (dd < 10) dd = '0' + dd;
      var mm = date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;
      var yyyy = date.getFullYear();
      if (yyyy < 10) yyyy = '0' + yyyy;
      return yyyy + '-' + mm + '-' + dd;
    },
    orderSentToThePoint() {
      let date = new Date();
      this.orderRun = true
      this.order.status = 'отправлен'
      this.order.date = this.currentDate(date)
      this.order.delivery_date = this.currentDate(date)
      console.log(this.order);
      axios
      .patch(`http://shop-dev.zdmail.ru/api/orders/${this.order.id}`, this.order)
      .then((order) => {
        console.log('good');
        console.log(order);
      })
      .catch((error) => {
        alert('Ошибка в работе приложения. Обратитесь к администратору.');
            console.log(error);
      })
    },    orderStopToThePoint() {
      let comment = prompt('Введите причину отмены')
      let date = new Date();
      this.order.status = 'проблемы'
      this.order.comment = comment
      this.order.date = this.currentDate(date)
      this.order.delivery_date = this.currentDate(date)
      console.log(this.order);
      axios
      .patch(`http://shop-dev.zdmail.ru/api/orders/${this.order.id}`, this.order)
      .then((order) => {
        console.log('good');
        console.log(order);
      })
      .catch((error) => {
        alert('Ошибка в работе приложения. Обратитесь к администратору.');
            console.log(error);
      })
    },
    isPositive(data) {
      console.log(data);
    },
  },
};
</script>
