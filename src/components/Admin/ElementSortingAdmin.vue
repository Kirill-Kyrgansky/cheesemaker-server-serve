<template>
  <div class="border-surround filter admin-panel">
    <h3 class="title-3 text-centered">Найти</h3>
    <div class="v-select">
      <p class="input">{{ selected }}</p>
      <div class="options-admin">
        <div v-for="option in CATEGORY" :key="option.id" >
          <div class="input search" v-if="option.active">
            <p href="#" class="paragraph" @click="selectOption(option)">
              {{ option.name }}
            </p>
            <div class="centered">
            <img
              @click="deliteCategory(option.id)"
              src="/allImage/Icons/cross.svg"
              class="img-question"
            />
            <input
              type="checkbox"
              @click="сhangeVisibility(option.id, option.active)"
              v-model="option.active"
              v-if="option.id != 1"
            />
            </div>
          </div>
        </div>
      </div>
      <div class="options-admin margin-10-0" >
        <div v-for="option in CATEGORY" :key="option.id" >
          <div class="input search" v-if="!option.active">
            <p href="#" class="paragraph" @click="selectOption(option)">
              {{ option.name }}
            </p>
            <div class="centered">
            <img
              @click="deliteCategory(option.id)"
              src="/allImage/Icons/cross.svg"
              class="img-question"
            />
            <input
              type="checkbox"
              @click="сhangeVisibility(option.id, option.active)"
              v-model="option.active"
            />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="admin-panel margin-10-0">
      <p class="paragraph-small">{{ searchValue }}</p>
      <p class="paragraph-small margin-10-0">Добавить категорию:</p>
      <input class="input" type="text" v-model="formCategories.name" />
      <button class="btn" v-on:click="addCategories()">Создать</button>
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
    ...mapGetters(['CATEGORY', 'SEARCH_VALUE']),
  },
  methods: {
    сhangeVisibility(index, isActive) {
      let active = {
        active: !isActive,
      };
      axios
        .patch(`http://localhost:3000/category/${index}`, active)
        .then((res) => {
          location.reload(res);
          if (res == 404) {
            alert('Ошибка в работе сервера. Перезагрузите страницу');
          }
          console.log(res);
        })
        .catch((error) => {
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
          console.log(error);
        });
    },
    deliteCategory(index) {
      const isTrue = confirm('Вы уверены?');
      if (isTrue === true) {
        axios
          .delete(`http://localhost:3000/category/${index}`)
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
      if (this.formCategories.name.length === 0) {
        alert('Ошибка, пустая строка. Введите название новой категории');
      } else {
        axios
          .post('http://localhost:3000/category', this.formCategories)
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
