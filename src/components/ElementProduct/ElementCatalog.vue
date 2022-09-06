<template>
  <div class="catalog-items-products" >
    <!--product quantity checked-->
    <div class="catalog-element products">
      <div class="catalog-items-products-img">
        <img
          :src="'http://172.16.0.179' + product.image_path.slice('2')"
          :alt="product.name"
          class="catalog-element-img"
        />
      </div>
      <p class="paragraph bold text-centered">{{ product.name }}</p>
      <img
        src="/allImage/Icons/que.svg"
        alt="Описание продукта"
        class="img-question"
        @mouseover="description = !description"
      />
      <div class="v-select width-200" v-click-outside="onClickOutside">
        <p class="input" @click="areOptionsVisible = !areOptionsVisible">
          {{ selected }}
        </p>
        <div class="options" v-if="areOptionsVisible">
          <div v-for="price in PRICES" :key="price.id">
            <a
              class="input bold search"
              v-if="price.product_id == product.id && (price.active = 1)"
              @click="selectOption(price)"
            >
              {{ price.item_price }}&nbsp;₽ | 1 &nbsp;{{ price.item_measure }}
            </a>
          </div>
        </div>
      </div>
      <button type="submit" @click="addToCart" class="btn centered">
        В корзину
        <img
          src="/allImage/Icons/buybuttone.png"
          class="element-catalog-bottom-img-cart"
        />
      </button>
    </div>
    <transition name="description">
      <div
        class="products description pointer"
        v-if="description"
        @mouseleave="description = false"
      >
        <div class="description-text">
          <div>
            <p class="paragraph-small text-centered bold">
              {{ product.description }}
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ElementCatalog',
  data() {
    return {
      productAmount: '',
      productАvailability: false,
      units: [
        { value: 0, text: 'шт' },
        { value: 1, text: 'кг' },
        { value: 2, text: 'л' },
      ],
      productId: '',
      inStockQuantity: '',
      productInStock: false,
      description: false,
      choice: false,
      areOptionsVisible: false,
      selected: 'Выбрать вес',
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
    ...mapGetters(['PRODUCTS', 'CATEGORIES', 'PRICES']),
  },
  methods: {
    onClickOutside() {
      this.areOptionsVisible = false;
    },
    selectOption(PRICES) {
      this.areOptionsVisible = false;
      this.selected = PRICES.item_price + ' ₽ | 1 ' + PRICES.item_measure;
      this.selectedMeasure = PRICES.item_measure;
    },
    quantityProduct() {
      this.inStockQuantity = this.product.inStockQuantity;
      return this.inStockQuantity;
    },
    isEmpty() {
      if (this.product.inStock == 0) {
        return false;
      }
      return true;
    },
    addToCart() {
      if (this.selected == 'Выбрать вес') {
        alert('error')
      }
      this.$emit('addToCart', this.product);
    },
  },
};
</script>
<style>
.description-enter-active,
.description-leave-active {
  transition: opacity 0.5s ease;
}

.description-enter-from,
.description-leave-to {
  opacity: 0;
}
</style>
