<template>
  <div class="product-order-element">
    <div class="margin-10-0">
      <p class="paragraph-small">
        <span class="title-3 bold"> № </span>
        {{ index + 1 }}
      </p>
      <p class="paragraph-small">
        <span class="title-3 bold"> Название: </span>
        {{ name }}
      </p>
      <div >
        <p class="paragraph">
          <span class="title-3 bold"> Комментарий: </span>
        </p>
        <p class="paragraph-small">{{ contents.comment }}</p>
      </div>
      <p class="paragraph-small">
        <span class="title-3 bold"> Кол-во: </span>
        {{  }}
        {{  }}
      </p>
      <p class="paragraph-small">
        <span class="title-3 bold"> Цена: </span>
        {{  }} ₽
      </p>
      <div class="order-title" >
        <div class="order-element margin-10-0"></div>
        <p class="paragraph">
          <span class="title-3 bold"> Фактический вес: </span>
          {{  }}
          кг
        </p>
        <p class="paragraph-small">
          <span class="title-3 bold"> Фактическая цена: </span>
          {{  }} ₽
        </p>
        <input
          type="number"
          class="input"
          step="0.01"
          placeholder="Фактический вес"
        />
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'ProductOrderElement',
  data() {
    return {
      factWeight: 0.01,
      factPrice: 0,
      name: '1'
    };
  },
  props: ['contents', 'index'],
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
  mounted() {
    this.getProductName()
  },
  methods: {
    getProductName() {
      axios
        .get (`http://172.16.0.179/api/products/${this.contents.product_id}`)
        .then((product) => {
          return this.name = product.data.name
        })
        .catch((error) => {
          alert(error)
        })
    }
  },
    computed: {
    ...mapGetters(['ORDERS']),
    
    // computedFactPrice() {
    //   if (NaN) {
    //     return '0';
    //   }
    //   return (this.product.price * this.factWeight).toFixed(2);
    // },
  },
};
</script>
