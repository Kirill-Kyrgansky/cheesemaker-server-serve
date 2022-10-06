<template>
  <div class="element-sorting" v-if="false">
    <div class="element-sorting-wrap">
      <img
        src="/allImage/Icons/arrowquad.png"
        @click="showSorting"
        class="img-filter pointer"
      />
      <div style="border-top-right-radius: 0px" v-if="show">
        <div class="filter" v-click-outside="onClickOutsideLogin">
          <h3 class="title-3 text-centered">Найти</h3>
          <div class="v-select">
            <p class="input" @click="areOptionsVisible = !areOptionsVisible">
              {{ selected }}
            </p>
            <div class="options" v-if="areOptionsVisible">
              <div v-for="option in CATEGORY" :key="option.id">
                <a
                  class="input bold search"
                  v-if="option.active"
                  @click="selectOption(option)"
                >
                  {{ option.name }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ElementSorting',
  data() {
    return {
      areOptionsVisible: false,
      searchValue: '',
      show: false,
      show1: false,
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
    ...mapGetters(['CATEGORY', 'SEARCH_VALUE']),
  },
  methods: {
    onClickOutsideLogin() {
      if (this.show == true) {
        this.show = !this.show;
      }
    },
    showSorting() {
      this.show = !this.show;      
      window.scrollTo(top, 0);
    },
    ...mapActions(['GET_SEARCH_VALUE_TO_VUEX', 'GET_CATEGORY_FROM_API']),
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
      window.scrollTo(top, 0);
      this.$emit('select', option);
      this.areOptionsVisible = false;
      this.show = !this.show;
    },
    hideSelect() {
      this.areOptionsVisible = false;
    },
    scrollTop() {
      window.scrollTo(top, 0);
    },
  },
  mounted() {
    document.addEventListener('click', this.hideSelect.bind(this), true);
    this.GET_CATEGORY_FROM_API();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.hideSelect);
  },
};
</script>
