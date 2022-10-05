<template>
  <div class="create-storage">
    <div class="admin-panel" v-if="!storage">
      <div class="options-admin">
        <h3 class="title-3 text-centered">Активные склады</h3>
        <div v-for="storage in STORAGES" :key="storage.id">
          <div class="input search" v-if="storage.active || storage.id !== 0">
            <p href="#" class="paragraph">
              {{ storage.name }} 
              <br v-if="storage.comment" /><span v-if="storage.comment" class="paragraph-small"
                >Комментарий:</span
              >
              <br v-if="storage.comment" />{{ storage.comment }}
              Адрес:
              <br /> {{ storage.address }}
            </p>
            <div class="centered">
              <img
                src="/allImage/Icons/Edit.svg"
                class="img-question"
                @click="changeCategory(storage)"
              />
              <input
                true-value="1"
                false-value="0"
                type="checkbox"
                v-model="storage.active"
                @click="сhangeVisibility(storage)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="options-admin margin-10-0">
        <h3 class="title-3 text-centered">Неактивные склады</h3>
        <div v-for="storage in STORAGES" :key="storage.id">
          <div class="input search" v-if="!storage.active && storage.id !== 0">
            <p href="#" class="paragraph">
              {{ storage.name }} <br /><span class="paragraph-small"
                >комментарий:</span
              >
              <br />{{ storage.comment }}
            </p>
            <div class="centered">
              <img
                src="/allImage/Icons/Edit.svg"
                class="img-question"
                @click="changeCategory(storage)"
              />
              <input
                true-value="1"
                false-value="0"
                type="checkbox"
                v-model="storage.active"
                @click="сhangeVisibility(storage)"
              />
            </div>
          </div>
        </div>
      </div>
      <h3 class="title-3 text-centered">Создание склада</h3>
      <p class="paragraph">Название:</p>
      <input
        class="input"
        type="text"
        placeholder="Введите название склада"
        v-model="createStorage.name"
        required
      />
      <p class="paragraph">Адрес:</p>
      <input
        class="input"
        type="text"
        placeholder="Введите адрес склада"
        v-model="createStorage.address"
        required
      />
      <p class="paragraph">Комментарии: <br />(если требуется)</p>
      <input
        class="input"
        type="text"
        placeholder="Введите адрес склада"
        v-model="createStorage.comment"
        required
      />
      <button class="btn" @click="createNewStorage()">
        Создать новый склад
      </button>

    </div>
    
  </div>
  <button class="btn" @click="openStorages" v-if="storage">
      Открыть управление складами
    </button>
    <button class="btn" @click="openStorages" v-if="!storage">
        Закрыть управление складами
      </button>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import config from '@/config.js'

export default {
  data() {
    return {
      createStorage: {
        name: '',
        address: ''
      },
      storage: true,
    };
  },
  computed: {
    ...mapGetters(['STORAGES']),
  },
  methods: {
    openStorages() {
      window.scrollTo(top, 140);
      this.storage = !this.storage
    },
    сhangeVisibility(storage) {
      storage.active = !storage.active;
      axios      ({
          method: 'PATCH',
          url: `${config.url}/storages/${storage.id}`,
				  data: storage,
          headers: { 
					    "authorization":  this.$cookies.get('authorization')
          }
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

    changeCategory(storage) {
      let newName = prompt('Введите новое имя категории.', storage.name);
      if (newName != null) {
        let newComment = prompt('Введите новый комментарий.', storage.comment);
        if (newComment != null) {
        let newAddress = prompt('Введите новый адрес.', storage.address);
        storage.address = newAddress
        storage.comment = newComment;
        storage.name = newName;
        axios({
          method: 'PATCH',
          url: `${config.url}/storages/${storage.id}`,
          data: storage,
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
        }
        
      }
    },
    changeComment(storage) {
      let newComment = prompt('Введите новый комментарий.', storage.comment);
      storage.comment = newComment;
      axios({
        method: 'PATCH',
        url: `${config.url}/storages/${storage.id}`,
        data: storage,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
        .then((res) => {
        })
        .catch((error) => {
          console.log(error);
          alert('Ошибка в работе приложения. Обратитесь к администратору.');
        });
    },
    createNewStorage() {
      if (this.createStorage.name == '' && this.createStorage.address == ''){
        alert('Заполните пожалуйста все поля')
      } else {
      this.createStorage.author_id = $cookies.get('id');
      axios({
        method: 'POST',
        url: `${config.url}/storages/`,
        data: this.createStorage,
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
      }
    },
  },
};
</script>
