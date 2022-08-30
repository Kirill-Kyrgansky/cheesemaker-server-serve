<template>
  <div class="catalog-items-admin">
    <div class="catalog-element">
      <input type="checkbox" v-if="ISADMIN" />
      <img
        :src="product.image"
        :alt="product.name"
        class="catalog-element-img"
      />
      <div class="text-align-right">
        <h3 class="title-3 text-centered">{{ product.name }}</h3>
        <p class="paragraph text-centered">{{ product.description }}</p>
        <p class="paragraph-tiny bold margin-10-0 text-centered">
          {{ product.price }}&nbsp;₽&nbsp;/&nbsp;1 {{ product.unit }}.
        </p>
      </div>
      <AdminPanel :product="product" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AdminPanel from './AdminPanel.vue';

export default {
  name: 'ElementCatalogAdmin',
  data() {
    return {
      productAmount: '',
      productАvailability: false,
      productId: '',
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
  methods: {
    сhangeVisibility(index, isActive) {
      let active = {
        active: !isActive,
      };
      axios
        .patch(`http://localhost:3000/pickpoint/${index}`, active)
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
  },
  components: {
    AdminPanel,
  },
  computed: {
    ...mapGetters(['PRODUCTS', 'CATEGORY', 'ISADMIN']),
  },
};
</script>
