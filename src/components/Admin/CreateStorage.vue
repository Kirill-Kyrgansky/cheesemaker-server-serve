<template>
  <div class="create-storage">
    <div
        class="admin-panel"
        v-if="!storage"
    >
      <div class="create-storage-flex">
      <div class="options-admin">
        <h3 class="title-3 text-centered">Активные склады</h3>
        <div
            v-for="storage in STORAGES"
            :key="storage.id"
        >
          <div
              class="input search"
              v-if="storage.active && storage.id !== 0"
          >
            <p href="#" class="paragraph">
              {{ storage.name }}
              <br
                  v-if="storage.comment"/>
              <span v-if="storage.comment"
                    class="paragraph-small"
              >Комментарий:</span
              >
              <br v-if="storage.comment"/>{{ storage.comment }} <br/>
              Адрес:
              <br/> {{ storage.address }}
            </p>
            <div class="centered">
              <img
                  src="/allImage/Icons/Edit.svg"
                  class="img-change"
                  @click="changeCategory(storage)"
                  :title="changeCategoryTitle"
              />
              <input
                  true-value="1"
                  false-value="0"
                  type="checkbox"
                  v-model="storage.active"
                  @click="changeVisibility(storage)"
                  class="pointer"
                  :title="changeVisibleTitle"
              />
              <p class="paragraph">Активный</p>
            </div>
          </div>
        </div>
      </div>
      <div class="options-admin">
        <h3 class="title-3 text-centered">Неактивные склады</h3>
        <div
            v-for="storage in STORAGES"
            :key="storage.id"
        >
          <div
              class="input search"
              v-if="!storage.active && storage.id !== 0"
          >
            <p href="#" class="paragraph">
              {{ storage.name }} <br/>
              <span v-if="storage.comment !== undefined" class="paragraph-small"
              >комментарий:</span
              >
              {{ storage.comment }}
            </p>
            <div class="centered">

              <input
                  true-value="1"
                  false-value="0"
                  type="checkbox"
                  v-model="storage.active"
                  @click="changeVisibility(storage)"
                  class="pointer"
                  :title="changeVisibleTitle"

              />
              <img
                  src="/allImage/Icons/Edit.svg"
                  class="img-change"
                  @click="changeCategory(storage)"
                  :title="changeCategoryTitle"
              />
              <p class="paragraph">Неактивный</p>
            </div>
          </div>
        </div>
      </div>
        <div class="options-admin">
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
          <p class="paragraph">Комментарии: <br/>(если требуется)</p>
          <div class="column">
          <input
              class="input"
              type="text"
              placeholder="Введите адрес склада"
              v-model="createStorage.comment"
              required
          />
          <button
              class="btn"
              @click="createNewStorage()"
          >
            Создать новый склад
          </button>
          </div>
        </div>
      </div>

    </div>

  </div>
  <button
      class="btn"
      @click="openStorages"
      v-if="storage"
  >
    Открыть управление складами
  </button>
  <button
      class="btn"
      @click="openStorages"
      v-if="!storage"
  >
    Закрыть управление складами
  </button>
</template>

<script>
import axios from 'axios';
import {mapGetters} from 'vuex';
import config from '@/config.js'

export default {
  data() {
    return {
      createStorage: {
        name: '',
        address: '',
      },
      storage: true,
      changeCategoryTitle: 'Изменить категорию',
      changeVisibleTitle: 'Изменить видимость склада'
    };
  },
  computed: {
    ...mapGetters(['STORAGES']),
  },
  methods: {
    openStorages() { //действие при открытии управление складами
      window.scrollTo(top, 0);
      this.storage = !this.storage
    },
    changeVisibility(storage) { //изменить видимость складов
      storage.active = !storage.active;
      axios({
        method: 'PATCH',
        url: `${config.url}/storages/${storage.id}`,
        data: storage,
        headers: {
          "authorization": this.$cookies.get('authorization')
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
    changeCategory(storage) { //изменение существующей категории
      let newName = prompt('Введите новое имя категории.', storage.name);
      if (newName != null) {
        let newComment = prompt('Введите новый комментарий.', storage.comment);
        if (newComment != null) {
          storage.address = prompt('Введите новый адрес.', storage.address)
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
                if (res === 404) {
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
    createNewStorage() { //создать новый склад
      if (this.createStorage.name == '' && this.createStorage.address == '') {
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
