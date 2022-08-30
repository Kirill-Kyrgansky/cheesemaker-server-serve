<template>
  <div class="border-surround filter admin-panel">
    <h3 class="title-3 text-centered">Найти</h3>
    <div class="v-select">
      <p class="input">{{ selected }}</p>
      <div class="options-admin">
        <div v-for="option in CATEGORY" :key="option.ID">
          <div class="input search" v-if="option.ACTIVE">
            <p href="#" class="paragraph" @click="selectOption(option)">
              {{ option.NAME }}
            </p>
            <div class="centered">
              <img
                @click="deliteCategory(option.ID)"
                src="/allImage/Icons/cross.svg"
                class="img-question"
              />
              <input
                type="checkbox"
                @click="сhangeVisibility(option.ID, option.ACTIVE)"
                v-model="option.ACTIVE"
                v-if="option.ID != 1"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="options-admin margin-10-0">
        <div v-for="option in CATEGORY" :key="option.ID">
          <div class="input search" v-if="!option.ACTIVE">
            <p href="#" class="paragraph" @click="selectOption(option)">
              {{ option.NAME }}
            </p>
            <div class="centered">
              <img
                @click="deliteCategory(option.ID)"
                src="/allImage/Icons/cross.svg"
                class="img-question"
              />
              <input
                type="checkbox"
                @click="сhangeVisibility(option.ID, option.ACTIVE)"
                v-model="option.ACTIVE"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="admin-panel margin-10-0">
      <p class="paragraph-small">{{ searchValue }}</p>
      <p class="paragraph-small margin-10-0">Добавить категорию:</p>
      <input class="input" type="text" v-model="formCategories.NAME" />
      <button class="btn" v-on:click="addCategories()">Создать</button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  NAME: 'ElementSortingAdmin',
  data() {
    return {
      areOptionsVisible: false,
      searchValue: '',
      formCategories: { ACTIVE: true, COMMENT: 'NoComment' },
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
        ACTIVE: !isActive,
      };
      axios
        .patch(`http://172.16.0.179/api/categories/${index}`, active)
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
          .delete(`http://172.16.0.179/api/categories/${index}`)
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
      if (this.formCategories.NAME.length === 0) {
        this.formCategories.AUTHOR_ID
        alert('Ошибка, пустая строка. Введите название новой категории');
      } else {
        axios
          .post('http://172.16.0.179/api/categories', this.formCategories)
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
