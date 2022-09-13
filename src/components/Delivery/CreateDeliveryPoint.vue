<template>
  <section class="section" >
    <div class="container pickpoint-map-container">
      <div class="map">
        <div class="map-border">
          <input
            type="checkbox"
            true-value="1"
            false-value="0"
            v-model="pickpoint.active"
          />
          <div class="map-cart-text">
            <input
              type="text"
              id="name"
              class="pickpoint-input margin-10-0"
              v-model="pickpoint.name"
              placeholder="Название точки"
              required
            />
            <div class="column-centered">
              <textarea
                placeholder="Описание"
                type="text"
                class="pickpoint-input margin-10-0"
                v-model="pickpoint.address"
                required
              ></textarea>
              <input
                type="text"
                id="name"
                class="pickpoint-input margin-10-0"
                v-model="pickpoint.phone"
                placeholder="Телефон"
                required
              />
            </div>
            <input
              type="text"
              id="name"
              class="pickpoint-input margin-10-0"
              placeholder="Время работы"
              v-model="pickpoint.workhours"
              required
            />
          </div>
          <button
            class="btn"
            @click="createPickpoint(pickpoint)"
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'DeliveryPoint',
  data() {
    return {
      pickpoint: {
        name: '',
        address: '',
        workhours: '',
        phone: '',
        active: 1,
        comment: 'None',
        author_id: 1,
      },
    };
  },
  computed: {
    ...mapGetters(['ISSUPERADMIN']),
  },
  methods: {
    createPickpoint(pickpoint) {
      axios
        .post(
          `http://shop-dev.zdmail.ru/api/pickpoints`,
          pickpoint
        )
        .then((res) => {
          location.reload(res);
          if (res == 404) {
            alert('Ошибка в работе сервера. Перезагрузите страницу');
          }
        })
        .catch((error) => {
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
          console.log(error);
        });
    },
  },
};
</script>
