<template>
  <div class="catalog-element" id="admin">
    <div class="catalog-element-wrap text-centered">
        <label class="text-reader">
          <input type="file" @change="loadTextFromFile" />
        </label>
        <div class="catalog-element-text">
          <label for="name">
            <input
              type="text"
              id="name"
              v-model="form.name"
              class="input"
              placeholder="Название"
              required
            />
          </label>
          <textarea
            placeholder="Описание"
            type="text"
            class="input"
            v-model="form.description"
            required
          ></textarea>
        </div>
        <div class="centered centered-vertical">
            <input
              type="number"
              id="description"
              class="input small-index"
              @click="productPrice = ''"
              v-model="form.price"
              placeholder="Цена"
              required
            />
          <select  class="input" name="list"  v-model="form.unit"> 
          <option v-for="unit in units" :value="unit.name" :key="unit.id"
          >
            {{ unit.name }}
          </option>
        </select>
        </div>
        <p class="paragraph">Кол-во произведенного продука:</p>
        <label for="production-quantity">
          <input
            type="number"
            @click="productQuantity = ''"
            id="production-quantity"
            v-model="form.inStockQuantity"
            class="input"
            placeholder="Кол-во"
            required
          />
        </label>
        <div >
        <select
          class="input"
          name="list"
          v-model="form.category"
          >
          <option
          v-for="category in CATEGORY"
          :value="category.name"
          :key="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        </div>
        <div class="text-centered">
          <button class="btn" @click="submitForm()">Создать</button>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'CreateElementCatalog',
  data() {
    return {
      avatar: '',
      form:
      {
        image: 'test',
        name: '',
        description: '',
        price: '',
        unit: 'шт',
        inStockQuantity: '',
        category: '',
      },
      units: [
        { id: 1, name: 'шт' },
        { id: 2, name: 'л' },
        { id: 3, name: 'кг' },
      ],
    };
  },
  props: {
    adminLogin: {},
    product: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(['CATEGORY']),
  },
  methods: {
    submitForm() {
      const formArray = Object.values(this.form);
      if (formArray.includes('') === true) {
        alert('Заполните пожалуйста все поля.');
        console.log(formArray);
      } else if (this.form.category === 'Вся продукция') {
        alert('Выберите категорию.');
      } else {
        axios
          .post('http://localhost:3000/products', this.form)
          .then((res) => {
            location.reload(res);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.$emit('load', e.target.result);
      reader.readAsText(file);
    },
  },
};
</script>
