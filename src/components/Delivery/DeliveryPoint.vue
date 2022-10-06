<template>
  <CreateDeliveryPoint v-if="$cookies.get('role_id') == 1" />
  <section class="section">
    <div class="container pickpoint-map-container">
      <div
          class="map"
          v-for="pickpoint in DELIVERY_POINTS"
          :key="pickpoint.id"
      >
        <div
            class="map-border"
            v-if="pickpoint.active == 1 || $cookies.get('role_id') == 1"
        >
          <input
            type="checkbox"
            true-value="1"
            false-value="0"
            @click="changeVisibilityPickpoint(pickpoint.active, pickpoint)"
            v-model="pickpoint.active"
            v-if="$cookies.get('role_id') == 1"
          />
          <div class="map-cart-text">
            <h3 class="title-3">{{ pickpoint.name }}</h3>
            <input
              type="text"
              id="name"
              class="pickpoint-input"
              v-model="pickpoint.name"
              placeholder="Название точки"
              required
              v-if="$cookies.get('role_id') == 1"
            />
            <p class="paragraph margin-10-0">
              {{ pickpoint.address }}
            </p>
            <div class="column-centered">
              <textarea
                placeholder="Описание"
                type="text"
                class="pickpoint-input"
                v-model="pickpoint.address"
                required
                v-if="$cookies.get('role_id') == 1"
              ></textarea>
              <a
                  href="tel:+79912105757"
                  class="title-3 margin-10-0"
              >
                {{ pickpoint.phone }}
              </a>
              <input
                type="text"
                id="name"
                class="pickpoint-input"
                v-model="pickpoint.phone"
                placeholder="Телефон"
                required
                v-if="$cookies.get('role_id') == 1"
              />
            </div>
            <p class="paragraph margin-10-0">
              {{ pickpoint.workhours }}
            </p>
            <input
              type="text"
              id="name"
              class="pickpoint-input"
              placeholder="Время работы"
              v-model="pickpoint.workhours"
              required
              v-if="$cookies.get('role_id') == 1"
            />
          </div>
          <div v-if="$cookies.get('role_id') == 1">
            <p class="title-3">link_point</p>
            <textarea
              placeholder="Описание"
              type="text"
              class="pickpoint-input margin-10-0"
              v-model="pickpoint.link_point"
              required
            />
            <p class="title-3">link_yandex</p>
            <textarea
              placeholder="Описание"
              type="text"
              class="pickpoint-input margin-10-0"
              v-model="pickpoint.link_yandex"
              required
            />
            <p class="title-3">map_frame</p>
            <textarea
              placeholder="Описание"
              type="text"
              class="pickpoint-input margin-10-0"
              v-model="pickpoint.map_frame"
              required
            />
          </div>
          <button
            class="btn"
            @click="changePickpoint(pickpoint)"
            v-if="$cookies.get('role_id') == 1"
          >
            Изменить
          </button>
          <div
            style="position: relative; overflow: hidden; border-radius: 15px"
          >
            <a
              :href="pickpoint.link_yandex"
              style="color: #eee; font-size: 12px; position: absolute; top: 0px"
              >Славный сыровар</a
            ><a
              :href="pickpoint.link_point"
              style="
                color: #eee;
                font-size: 12px;
                position: absolute;
                top: 14px;
              "
              >Молочный магазин в Белгородской области</a
            ><iframe
              title="map"
              :src="pickpoint.map_frame"
              height="250"
              frameborder="0"
              allowfullscreen="true"
              style="position: relative"
              class="box-shadow"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';
import CreateDeliveryPoint from './CreateDeliveryPoint.vue';
import config from '@/config.js'

export default {
  name: 'DeliveryPoint',
  components: {
    CreateDeliveryPoint,
  },
  computed: {
    ...mapGetters(['DELIVERY_POINTS',]),
  },
  mounted() {
    this.GET_DELIVERY_POINTS_FROM_API();
  },
  methods: {
    changePickpoint(pickpoint) {
      axios({
        method: 'PATCH',
        url: `${config.url}/pickpoints/${pickpoint.id}`,
        data: pickpoint,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
        .then((res) => {
          location.reload(res);
        })
        .catch((error) => {
          console.log(error);
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
        });
    },
    ...mapActions(['GET_DELIVERY_POINTS_FROM_API']),
    changeVisibilityPickpoint(isActive, pickpoint) {
      pickpoint.active = Number(!isActive)
        axios({
          method: 'PATCH',
          url: `${config.url}/pickpoints/${pickpoint.id}`,
          data: pickpoint,
          headers: {
            authorization: this.$cookies.get('authorization'),
          },
        })
          .then((res) => {
            location.reload(res);
            if (res === 404) {
              alert('Ошибка в работе сервера. Перезагрузите страницу');
            }
          })
          .catch((error) => {
            console.log(error);
            alert('Ошибка в работе приложения. Обратитесь к администратору.');
          });
    },
  },
};
</script>
