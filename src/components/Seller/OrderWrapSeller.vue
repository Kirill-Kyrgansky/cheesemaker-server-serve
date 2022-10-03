<template xmlns="">
  <section class="section">
    <div class="container wrap-cheesemaker-order">
      <OrderElementSeller
          v-for="order in orders"
          :key="order.id"
          :order="order"
      />
    </div>
    <paginate
        v-model="page"
        :page-range="2"
        :page-count="pagesCount"
        :click-handler="cangePage"
        :prev-text="'Назад'"
        :next-text="'Вперед'"
        :container-class="'pagination'"
        :page-class="'btn-pagination center'"
    >
    </paginate>
  </section>
</template>
<script>
import OrderElementSeller from './OrderElementSeller.vue';

import axios from "axios";
import config from "@/config";

export default {
  name: 'OrderWrap',
  data() {
    return {
      ordersCount: 0,
      limit: 20,
      offset: 0,
      orders: 0,
      perPage: 3,
      page: 1,
    }
  },
  components: {
    OrderElementSeller,
  },
  mounted() {
    this.getOrdersCount();
    this.getOrders();
  },
  computed: {
    pagesCount() {
      return Math.ceil(this.ordersCount / this.perPage);
    }
  },
  methods: {
    cangePage(pageNum) {
      this.page = pageNum;
      this.offset = (this.perPage * pageNum) - this.perPage;
      this.getOrders();
      window.scrollTo(0, 0);
    },
    getOrdersCount() {
      axios({
        method: 'GET',
        url: `${config.url}/orders/count`,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((res) => {
            this.ordersCount = res.data.orders_count
          })
          .catch((error) => {
            this.order.status = 'в обработке'
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },
    getOrders() {
      axios({
        method: 'GET',
        url: `${config.url}/orders/content?limit=${this.perPage}&offset=${this.offset}`,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((res) => {
            console.log(res)
            this.orders = res.data
          })
          .catch((error) => {
            this.order.status = 'в обработке'
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    }
  },
};
</script>
