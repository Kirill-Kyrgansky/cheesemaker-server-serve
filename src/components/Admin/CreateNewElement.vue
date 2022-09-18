<template>
  <div class="catalog-items" id="admin">
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
        <select class="input" name="list" v-model="form.unit">
          <option v-for="unit in units" :value="unit.name" :key="unit.id">
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
      <select class="input" name="list" v-model="form.category_id">
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
import config from '@/config.js'

export default {
  name: 'CreateNewElement',
  props: {
    adminLogin: {
      // opens access to the administrator
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
        { id: 1, name: 'шт' },
        { id: 2, name: 'л' },
        { id: 3, name: 'кг' },
      ],
      form: {
        name: '',
        active: '',
        image: '',
        category_id: '5',
        comment: 'Введите описание',
        description: '',
        author_id: '1',
        image: '',
        ext: '',
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
    submitForm(index) {
      const formArray = Object.values(this.form);
      if (formArray.includes('') === true) {
        // Checks that all fields are filled in
        alert('Заполните пожалуйста все поля.');
      } else {
        if (this.form.category === 'Вся продукция') {
          // Сhecks for the selected category
          return alert('Выберите категорию!');
        }
        axios({
          method: 'PUT',
          url: `${config.url}/products/${index}`,
          data: this.form,
          headers: {
            authorization: this.$cookies.get('authorization'),
          },
        })
          .then((res) => {
            location.reload(res);
          })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
      }
    },
  },
};
</script>
