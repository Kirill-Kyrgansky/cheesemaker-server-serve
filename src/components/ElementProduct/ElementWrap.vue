<template>
  <div class="section wrap-cheesemaker">
    <ElementSorting
      :selected="selected"
      :options="CATEGORY"
      @select="sortByCategories"
    />
    <div class="container">
      <div class="catalog-items">
        <ElementCatalog
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @addToCart="addToCart"
        />
      </div>
      <transition name="fade">
        <div class="successfully" v-if="isVisible">
          <p class="title-3 text-centered">Товар успешно добавлен в корзину!</p>
        </div>
      </transition>
    </div>
  </div>
  <div class="arrow-bottom-container">
    <img
      src="/allImage/Icons/arrow.png"
      class="arrow-bottom button-on"
      @click="scrollTop"
    />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import ElementCatalog from './ElementCatalog.vue';
import ElementSorting from '../Filter/ElementSorting.vue';

export default {
  name: 'ElementWrap',
  data() {
    return {
      selected: 'Вся продукция',
      sortedProducts: [],
      isVisible: false,
    };
  },
  props: {
    adminLogin: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    ElementCatalog,
    ElementSorting,
  },
  methods: {
    scrollTop() {
      window.scrollTo(top, 0);
    },
    sortByCategories(category) {
      this.sortedProducts = [];
      const vm = this;
      this.PRODUCTS.map((item) => {
        if (item.category === category.name) {
          vm.sortedProducts.push(item);
        }
      });
      this.selected = category.name;
    },
    ...mapActions([
      'GET_PRODUCTS_FROM_API',
      'ADD_TO_CART',
      'GET_PRICES_FROM_API',
    ]),
    addToCart(data, selected) {
      this.isVisible = !this.isVisible;
      setTimeout(() => {
        this.isVisible = !this.isVisible;
      }, 2000);
      data.price_id = selected.id
      this.ADD_TO_CART(data);
      // console.log(data);
    },
    optionSelect(CATEGORY) {
      this.selected = CATEGORY.name;
    },
    sortedProductsBySearchValue(value) {
      if (value) {
        this.sortedProducts = this.sortedProducts.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        this.sortedProducts = this.PRODUCTS;
      }
    },
  },
  mounted() {
    this.GET_PRODUCTS_FROM_API();
    this.GET_PRICES_FROM_API();
  },
  computed: {
    ...mapGetters(['PRODUCTS', 'CATEGORY', 'SEARCH_VALUE']),
    filteredProducts() {
      if (this.sortedProducts.length) {
        return this.sortedProducts;
      }
      return this.PRODUCTS;
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
