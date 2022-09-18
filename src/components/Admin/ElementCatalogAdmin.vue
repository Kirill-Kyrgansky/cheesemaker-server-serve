<template>
  <div class="catalog-items-admin" >
    <div class="catalog-element">
      <p class="title-2 cancellation" v-if="!product.active">Отключен</p>
      <img
        :src="'http://shop-dev.zdmail.ru' + product.image_path.slice('2')"
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
      axios({
        method: 'PATCH',
        url: `${config.url}/pickpoint/${index}`,
        data: active,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
        .then((res) => {
          location.reload(res);
          if (res == 404) {
            alert('Ошибка в работе сервера. Перезагрузите страницу');
          }
        })
        .catch((error) => {
          console.log(error);
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
        });
    },
  },
  components: {
    AdminPanel,
  },
  computed: {
    ...mapGetters(['PRODUCTS', 'CATEGORY', 'ISADMIN', 'ISSUPERADMIN']),
  },
};
</script>
