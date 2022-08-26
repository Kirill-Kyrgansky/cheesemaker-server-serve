<template>
  <div class="product-order-element">
    <div class="margin-10-0">
      <p class="paragraph-small">
        <span class="title-3 bold"> № </span>
        {{ index + 1 }}
      </p>
      <p class="paragraph-small">
        <span class="title-3 bold"> Название: </span>
        {{ product.name }}
      </p>
      <div v-if="product.commentForProduct">
        <p class="paragraph">
          <span class="title-3 bold"> Комментарий: </span>
        </p>
        <p class="paragraph-small">{{ product.commentForProduct }}</p>
      </div>
      <p class="paragraph-small">
        <span class="title-3 bold"> Кол-во: </span>
        {{ product.quantity }}
        {{ product.unit }}
      </p>
      <p class="paragraph-small">
        <span class="title-3 bold"> Цена: </span>
        {{ product.price }} ₽
      </p>
      <div class="order-title" v-if="product.unit == 'кг'">
        <div class="order-element margin-10-0"></div>
        <p class="paragraph">
          <span class="title-3 bold"> Фактический вес: </span>
          {{ factWeight }}
          кг
        </p>
        <p class="paragraph-small">
          <span class="title-3 bold"> Фактическая цена: </span>
          {{ computedFactPrice }} ₽
        </p>
        <input
          type="number"
          class="input"
          step="0.01"
          placeholder="Фактический вес"
          v-model="factWeight"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ProductOrderElement',
  data() {
    return {
      factWeight: 0.01,
      factPrice: 0,
    };
  },
  props: ['product', 'index'],
  // props: {
  //   product: {
  //     type: Object,
  //     default() {
  //       return {};
  //     },
  //   },
  //   index: {
  //     type: Number
  //   }
  // },
  computed: {
    ...mapGetters(['ORDERS']),
    computedFactPrice() {
      if (NaN) {
        return '0';
      }
      return (this.product.price * this.factWeight).toFixed(2);
    },
  },
};
</script>
