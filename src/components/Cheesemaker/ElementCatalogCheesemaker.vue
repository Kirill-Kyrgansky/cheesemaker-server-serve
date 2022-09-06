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
      </div>
      <p class="paragraph-small margin-10-0 text-centered">
        Введите кол-во приготовленного продукта:
      </p>
      <input class="input" type="number" v-model="form.amount" step="0.01" />
      <select class="input" v-model="form.item_measure">
        <option>кг</option>
        <option>л</option>
        <option>шт</option>
      </select>
      <select class="input" v-model="selectStore">
        <option disabled>Выбрать склад</option>
        <option
          v-for="storage in STORAGES"
          :key="storage.id"
          :value="storage.id"
        >
          {{ storage.name }}
        </option>
      </select>
      <input type="date" class="input" v-model="form.date" />
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
      units: [
        { value: 0, text: 'шт' },
        { value: 1, text: 'кг' },
        { value: 2, text: 'л' },
      ],
      form: {
        amount: 0.01,
        manufacturer_id: 1,
        item_measure: 'кг',
        operation: 'приход',
        author_id: 1,
      },
      selectStore: 'Выбрать склад'
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
    ...mapGetters(['PRODUCTS', 'CATEGORY', 'STORAGES']),
  },
  methods: {
    addProductProduced() {
      if (this.selectStore == 'Выбрать склад') {
        alert('Выберете склад!')
      }
        this.form.product_id = this.product.id;
        this.form.store = this.selectStore
        console.log(this.form);
        
        // axios
        //   .post('http://172.16.0.179/api/productions', this.form)
        //   .then((res) => {
        //     alert('Продукт добавлен');
        //   })
        //   .catch((error) => {
        //     alert('Ошибка в работе приложения. Обратитесь к администратору.');
        //     console.log(error);
        //   });
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
