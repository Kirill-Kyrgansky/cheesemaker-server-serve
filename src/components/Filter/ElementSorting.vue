<template><div style="position:absolute; height: 100%; z-index: 999; left: -20px; width: 300px;">
  <div class="border-surround" style="border-top-right-radius: 0px">
    <div class="filter">
      <h3 class="title-3 text-centered">Найти</h3>
      <div class="v-select">
        <p class="input" @click="areOptionsVisible = !areOptionsVisible">
          {{ selected }}
        </p>
        <div class="options" v-if="areOptionsVisible">
          <a
            class="input bold search"
            v-for="option in CATEGORY"
            :key="option.id"
            @click="selectOption(option)"
          >
            {{ option.name }}
          </a>
        </div>
      </div>
    </div>
    <img src="/allImage/Icons/arrowquad.png" class="img-filter"/>
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
