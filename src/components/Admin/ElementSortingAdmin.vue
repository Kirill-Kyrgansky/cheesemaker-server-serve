<template>
  <div class="border-surround filter admin-panel">
    <h3 class="title-3 text-centered">Найти</h3>
    <div class="v-select">
      <p class="input">{{ selected }}</p>
      <div class="options-admin">
        <p
          href="#"
          class="paragraph input search"
          v-for="option in CATEGORIES"
          :key="option.id"
          @click="selectOption(option)"
        >
          {{ option.text }}
          <span @click="deliteCategory(option.id)">X</span>
        </p>
      </div>
    </div>
    <div class="admin-panel margin-10-0">
      <p class="paragraph-small">{{ searchValue }}</p>
        <p class="paragraph-small margin-10-0">Добавить категорию:</p>
        <input
          class="input"
          type="text"
          v-model="formCategories.text"
        />
        <button
          class="btn"
          v-on:click="addCategories()"
          >Создать
        </button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  name: 'ElementSortingAdmin',
  data() {
    return {
      areOptionsVisible: false,
      searchValue: '',
      formCategories: {
        text: '',
      },
    };
  },
  props: {
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    selected: {
      type: String,
      default: '',
    },
    adminLogin: {},
    product: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(['CATEGORIES', 'SEARCH_VALUE']),
  },
  methods: {
    deliteCategory(index) {
      const isTrue = confirm('Вы уверены?');
      if (isTrue === true) {
        axios
          .delete(`http://localhost:3000/categories/${index}`)
          .then((res) => {
            location.reload(res);
          })
          .catch((error) => {
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
            console.log(error);
          });
      }
    },
    addCategories() {
      if (this.formCategories.text.length === 0) {
        alert('Ошибка, пустая строка. Введите название новой категории');
      } else {
        axios
          .post('http://localhost:3000/categories', this.formCategories)
          .then((res) => {
            location.reload(res);
          })
          .catch((error) => {
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
            console.log(error);
          });
      }
    },
    ...mapActions(['GET_SEARCH_VALUE_TO_VUEX']),
    search(value) {
      this.GET_SEARCH_VALUE_TO_VUEX(value);
    },
    hideShow() {
      if (this.areOptionsVisible == true) {
        this.areOptionsVisible == false;
      } else {
        this.areOptionsVisible == true;
      }
    },
    selectOption(option) {
      this.$emit('select', option);
      this.areOptionsVisible = false;
    },
    hideSelect() {
      this.areOptionsVisible = false;
    },
  },
  mounted() {
    document.addEventListener('click', this.hideSelect.bind(this), true);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.hideSelect);
  },
};
</script>
