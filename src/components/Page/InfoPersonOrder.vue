<template>
  <button
      class="btn"
      @click="getInfoForProduct"
  >
    Просмотр заказа
  </button>
  <div v-if="isVisible">
    <div
        v-for="(product, index) in info.content"
        :key="product.id"
    >
      <p class="paragraph-small">
        <span class="title-3 bold"> № </span>
        {{ index + 1 }}
      </p>
      <p class="paragraph-small">
        <span class="title-3 bold"> Название: </span>
        {{ product.product.name }}
      </p>

      <p class="paragraph-small">
        <span class="title-3 bold"> Цена: </span>
        {{ product.price.item_price }} ₽ / {{ product.amount }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "@/config";

export default {
  name: "InfoPersonOrder",
  data() {
    return {
      isVisible: false,
      info: {},

    }
  },
  props: ['orders'],
  methods: {
    getInfoForProduct() {
      axios({
        method: 'GET',
        url: `${config.url}/orders/${this.orders.id}/content`,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((req) => {
            this.isVisible = true
            console.log(req.data)
            return this.info = req.data
          })
          .catch((error) => {
            console.log(error);
          });
    }
  }
}
</script>