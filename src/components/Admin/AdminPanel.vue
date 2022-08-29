<template>
  <div class="admin-panel" id="admin">
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
          <label for="description">
            <input
              type="number"
              id="description"
              class="input small-index"
              @click="productPrice = ''"
              placeholder="Цена"
              v-model="form.price"
              required
            />
          </label>
          <select
          class="input"
          name="list"
          v-model="form.unit"
          > <!--unit-->
            <option
              v-for="unit in units"
              :value="unit.name"
              :key="unit.id"
            >
              {{ unit.name }}
            </option>
          </select>
        </div>
        <p class="paragraph">Кол-во произведенного продука:</p>
        <label for="production-quantity">
          <input
            type="number"
            id="production-quantity"
            v-model="form.inStockQuantity"
            class="input"
            placeholder="Кол-во"
            required
          />
        </label>
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
        <div class="text-centered">
          <button class="btn" @click="submitForm(product.id)">Изменить</button>
          <button class="btn" @click="deleteProduct(product.id)">Удалить</button>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'AdminPanel',
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
  data() {
    return {
      avatar: '',
      units: [
        {
          id: 1,
          name: 'шт',
        },
        {
          id: 2,
          name: 'л',
        },
        {
          id: 3,
          name: 'кг',
        },
      ],
      form:
      {
        id: '',
        image: '',
        name: '',
        description: '',
        price: '',
        unit: 'шт',
        inStockQuantity: '',
        category: '',
      },
      selectedUnit: 'шт',
    };
  },
  computed: {
    ...mapGetters(['CATEGORY']),
  },
  mounted() {
    this.form = this.product;
  },
  methods: {
    deleteProduct(index) {
      const isTrue = confirm('Вы уверены?');
      if (isTrue === true) {
        axios.delete(`http://localhost:3000/products/${index}`)
          .then((res) => {
            location.reload(res);
          })
          .catch((error) => {
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
            console.log(error);
          });
      }
    },
    submitForm(index) {
      const formArray = Object.values(this.form);
      if (formArray.includes('') === true) {
        alert('Заполните пожалуйста все поля.');
      } else {
        if (this.form.category === 'Вся продукция') {
          return alert('Выберите категорию!');
        }
        axios
          .put(`http://localhost:3000/products/${index}`, this.form)
          .then((res) => {
            location.reload(res);
          })
          .catch((error) => {
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
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
