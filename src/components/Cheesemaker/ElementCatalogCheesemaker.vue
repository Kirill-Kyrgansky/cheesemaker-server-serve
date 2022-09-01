<template>
  <div class="catalog-items">
    <div class="catalog-element">
      <img
        :src="'http://172.16.0.179' + product.image_path.slice('2')"
        :alt="product.name"
        class="catalog-element-img"
      />
      <div class="text-align-right">
        <h3 class="title-3 text-centered">{{ product.name }}</h3>
        <p class="paragraph-tiny bold margin-10-0 text-centered">
          1 {{ product.unit }}.
        </p>
      </div>
      <p class="paragraph-small margin-10-0 text-centered">
        Введите кол-во приготовленного продукта:
      </p>
      <input
        class="input"
        type="number"
        v-model="form.producedByCheesemaker"
        step="0.01"
      />
      <button class="btn" @click="addProductProduced()">Добавить</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'ElementCatalogCheesemaker',
  data() {
    return {
      productAmount: '',
      productАvailability: false,
      units: [
        { value: 0, text: 'шт' },
        { value: 1, text: 'кг' },
        { value: 2, text: 'л' },
      ],
      productId: '',
      form: {
        producedByCheesemaker: 0.01,
        productId: '',
      },
    };
  },
  props: {
    adminLogin: {
      type: Object,
      default() {
        return {};
      },
    },
    product: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(['PRODUCTS', 'CATEGORY']),
  },
  methods: {
    addProductProduced() {
      if (this.form.producedByCheesemaker <= 0) {
        alert('Значение не может быть меньше либо равно нулю.');
      } else {
        this.form.productId = this.product.id;
        axios
          .post('http://localhost:3000/garbage', this.form)
          .then((res) => {
            location.reload(res);
            alert('Продукт добавлен');
          })
          .catch((error) => {
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
            console.log(error);
          });
      }
    },
    isEmpty() {
      if (this.product.inStock == 0) {
        return false;
      }
      return true;
    },
  },
};
</script>
