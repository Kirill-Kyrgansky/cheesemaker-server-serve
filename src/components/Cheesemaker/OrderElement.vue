<template>
  <div class="order-element">
    <div class="order-title">
      <p class="title-2">Дата заказа: {{date}}</p>
      <p class="title-2">Номер заказа: {{ order.id }}</p>
      <p class="cancellation bold centered-horizontally">
        Заказ отменен пользователем!
      </p>
      <div class="border-line"></div>
    </div>
    <ProductOrderElement
      v-for="contents, index in CONTENTS"
      :key="contents.id"
      :contents="contents"
      :index="index"
      :products="products"
    />
    <!-- :product="item"
      :index="index" -->
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
      <button type="button" class="btn centered">
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
      <button type="button" class="cancellation centered-horizontally btn-text">
        Заказ отменен
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import ProductOrderElement from './ProductOrderElement.vue';

export default {
  name: 'OrderElement',
  data() {
    return {
      newOrder: {},
    };
  },
  props: {
    order: {
      type: Object,
      default() {
        return {};
      },
    },    
    products: {
      type: Object,
      default() {
        return {};
      },
    },
    index: {
      type: Number,
    },
  },
  components: {
    ProductOrderElement,
  },
  mounted() {
  },
  computed: {
    ...mapGetters(['NEWORDERS','CONTENTS']),
    date () {
      let date = this.order.order_date.split('T')[0].split('-')
      return date[2] + '-' + date[1] + '-' + date[0]
    },
  },
  metods: {
    isPositive(data) {
      console.log(data);
    },
  },
};
</script>
