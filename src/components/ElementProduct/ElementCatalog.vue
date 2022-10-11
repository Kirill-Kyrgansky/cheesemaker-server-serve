<template>
  <div
      class="catalog-items-products"
      v-if="product.active === 1"
  >
    <div class="catalog-element products">
      <transition name="fade">
        <div
            class="error-mesage"
            v-if="isVisible"
        >
          <p class="title-3 text-centered">
            Укажите пожалуйста цену и вес товара
          </p>
        </div>
      </transition>
      <div class="catalog-items-products-img">
        <img
            :src="'http://shop-dev.zdmail.ru' + product.image_path.slice('2')"
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
      <div
          class="v-select width-200"
          v-click-outside="onClickOutside"
      >
        <p
            class="input"
            @click="areOptionsVisible = !areOptionsVisible"
        >
          {{ selected.name }}
        </p>
        <div
            class="options-product"
            v-if="areOptionsVisible"
            v-click-outside="onClickOutside"
        >
          <div
              v-for="price in PRICES"
              :key="price.id"
          >
            <a
                class="input bold search"
                v-if="(price.product_id == product.id) && (price.active == 1)"
                @click="selectOption(price)"
            >
              {{ price.item_price }}&nbsp;₽ | 1 &nbsp;{{ price.item_measure }}
            </a>
          </div>
        </div>
      </div>
      <div class="cart-element">
        <input
            type="button"
            class="btn margin-0-10"
            @click="minusAmount"
            value="-"
        />
        <input
            type="number"
            v-model="filteredAmount"
            class="input max-width-50"
            min="1"
            @keydown="
            if (['+', '-', 'e'].includes($event.key)) $event.preventDefault();
          "
        />
        <input
            type="button"
            class="btn margin-0-10"
            @click="summAmount"
            value="+"
        />
      </div>
      <button type="submit" @click="addToCart" class="btn centered" v-if="isVisibleButtonCart">
        В корзину
        <img
            alt="Иконка корзины"
            src="/allImage/Icons/buybuttone.png"
            class="element-catalog-bottom-img-cart"
        />
      </button>
<!--      <button type="submit" @click="deleteFromCart(index)" class="btn centered" v-if="!isVisibleButtonCart">-->
<!--        Удалить из корзины-->
<!--        <img-->
<!--            alt="Иконка корзины"-->
<!--            src="/allImage/Icons/buybuttone.png"-->
<!--            class="element-catalog-bottom-img-cart"-->
<!--        />-->
<!--      </button>-->
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
import {mapGetters, mapActions} from 'vuex';

export default {
  name: 'ElementCatalog',
  data() {
    return {
      productAmount: '',
      productAvailability: false,
      units: [
        {value: 0, text: 'шт'},
        {value: 1, text: 'кг'},
        {value: 2, text: 'л'},
      ],
      productId: '',
      inStockQuantity: '',
      productInStock: false,
      description: false,
      choice: false,
      areOptionsVisible: false,
      selected: {name: 'Выбрать упаковку'},
      isVisible: false,
      amount: 1,
      cartPrise: [],
      isVisibleButtonCart: true
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
    ...mapGetters(['PRODUCTS', 'CATEGORIES', 'PRICES', 'CART']),
    filteredAmount() {
      let mounted = this.selected.name
      if (mounted.toLowerCase().indexOf('кг') !== -1 || mounted.toLowerCase().indexOf('л') !== -1  ){
        return this.amount.toFixed(1)
      } else {
        return this.amount
      }
    }
  },
  // mounted() {
  //   this.test1()
  // },
  methods: {
    // ...mapActions([
    //   'DELITE_FROM_CART',
    // ]),
    // deleteFromCart(index) {
    //   this.DELITE_FROM_CART(index)
    // },
    // test1() {
    //   if (this.cartPrise.includes(this.selected.id)) {
    //     console.log('good')
    //     console.log(this.cartPrise)
    //   } else if (this.cartPrise.length === 0) {
    //     console.log('empty')
    //   }{
    //     this.cartPrise.push(this.selected.id)
    //     this.isVisibleButtonCart = false
    //   }
    //   // console.log(this.CART);
    //   // let data = this.CART
    //   // let cutySearch = this.product.price_id;
    //   //
    //   // let cityId = data.filter(function(val) {
    //   //   return val.price_id === cutySearch;
    //   // });
    //   //
    //   // return console.log(!!cityId)
    // },
    summAmount() {
      let mounted = this.selected.name
      if (mounted.toLowerCase().indexOf('кг') !== -1 || mounted.toLowerCase().indexOf('л') !== -1  ){
        let summ = parseFloat(this.amount + 0.1)
        this.amount = Math.round(summ * 10) /10
        this.product.amount = Math.round(summ * 10) /10
      } else {
        this.amount++
        this.product.amount = this.amount
      }
    },
    minusAmount() {
      let mounted = this.selected.name
      if (mounted.toLowerCase().indexOf('кг') !== -1 || mounted.toLowerCase().indexOf('л') !== -1  ){
        if (this.amount === 0.1) {
          this.amount = 0.1
        } else  {
          let minus = parseFloat(this.amount - 0.1)
          this.amount = Math.round(minus * 10) /10
          this.product.amount = Math.round(minus * 10) /10
        }
      } else {
        this.amount--
        this.product.amount = this.amount
        this.amount.toFixed(1)
        if (this.amount === 0) {
          this.amount = 1
          this.product.amount = this.amount
        }
        this.product.amount = this.amount
      }
    },
    onClickOutside() {
      this.areOptionsVisible = false;
    },
    selectOption(PRICES) {
      this.areOptionsVisible = false;
      this.selected.name = PRICES.item_price + ' ₽ | 1 ' + PRICES.item_measure;
      this.selected.id = PRICES.id
      this.selectedMeasure = PRICES.item_measure;
    },
    quantityProduct() {
      this.inStockQuantity = this.product.inStockQuantity;
      return this.inStockQuantity;
    },
    isEmpty() {
      return this.product.inStock !== 0;
    },
    addToCart() {
      if (this.selected.name === 'Выбрать упаковку') {
        setTimeout(() => {
          this.isVisible = !this.isVisible;
        }, 2000);
        return (this.isVisible = !this.isVisible);
      }
      // this.test1()
      this.product.amount = this.amount
      this.$emit('addToCart', this.product, this.selected);
    },
  },
};
</script>
