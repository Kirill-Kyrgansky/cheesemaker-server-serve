<template>
<CreateDeliveryPoint v-if="ISADMIN"/>
  <section class="section" >
    <div class="container pickpoint-map-container">
      <div class="map" v-for="pickpoint in DELIVERY_POINTS" :key="pickpoint.id">
        <div class="map-border" v-if="pickpoint.active == 1 || ISADMIN">
          <input
            type="checkbox"
            true-value="1"
            false-value="0"
            @click="сhangeVisibilityPickpoint(pickpoint.active, pickpoint)"
            v-model="pickpoint.active"
            v-if="ISADMIN"
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
              v-if="ISADMIN"
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
                v-if="ISADMIN"
              ></textarea>
              <a href="tel:+79912105757" class="title-3 margin-10-0">
                {{ pickpoint.phone }}
              </a>
              <input
                type="text"
                id="name"
                class="pickpoint-input"
                v-model="pickpoint.phone"
                placeholder="Телефон"
                required
                v-if="ISADMIN"
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
              v-if="ISADMIN"
            />
          </div>
          <button class="btn" @click="changePickpoint(pickpoint)" v-if="ISADMIN">
            Изменить
          </button>
           <div v-if="ISSUPERADMIN">
          <p class="title-3">link_point</p>
          <textarea
                placeholder="Описание"
                type="text"
                class="pickpoint-input margin-10-0"
                v-model="pickpoint.link_point"
                required
                v-if="ISADMIN"
              ></textarea>
                        <p class="title-3">link_yandex</p>
              <textarea
                placeholder="Описание"
                type="text"
                class="pickpoint-input margin-10-0"
                v-model="pickpoint.link_yandex"
                required
                v-if="ISADMIN"
              ></textarea>
                        <p class="title-3">map_frame</p>
              <textarea
                placeholder="Описание"
                type="text"
                class="pickpoint-input margin-10-0"
                v-model="pickpoint.map_frame"
                required
                v-if="ISADMIN"
              ></textarea>
              </div>
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
import CreateDeliveryPoint from './CreateDeliveryPoint.vue'


export default {
  name: 'DeliveryPoint',
  components: {
    CreateDeliveryPoint
},
  computed: {
    ...mapGetters(['DELIVERY_POINTS', 'ISADMIN', 'ISSUPERADMIN']),
  },
  mounted() {
    this.GET_DELIVERY_POINTS_FROM_API();
  },
  methods: {
    changePickpoint(pickpoint) {
      axios
        .patch(`http://172.16.0.179/api/pickpoints/${pickpoint.id}`, pickpoint)
        .then((res) => {
          location.reload(res);
          console.log(res);
        })
        .catch((error) => {
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
          console.log(error);
        });
    },
    ...mapActions(['GET_DELIVERY_POINTS_FROM_API']),
    сhangeVisibilityPickpoint(isActive, pickpoint) {
      pickpoint.active = Number(!isActive),
      axios
        .patch(`http://172.16.0.179/api/pickpoints/${pickpoint.id}`, pickpoint)
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
