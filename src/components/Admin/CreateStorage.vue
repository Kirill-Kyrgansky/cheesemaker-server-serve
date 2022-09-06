<template>
  <div class="create-storage">
    <div v-if="!storage">
      <div class="options-admin">
        <h3 class="title-3 text-centered">Активные склады</h3>
        <div v-for="storage in STORAGES" :key="storage.id">
          <div class="input search" v-if="storage.active">
            <p href="#" class="paragraph" >
              {{storage.name}} <br><span class="paragraph-small">комментарий:</span> <br>{{storage.comment}}
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
          <div class="input search" v-if="!storage.active">
            <p href="#" class="paragraph" >
              {{storage.name}} <br><span class="paragraph-small">комментарий:</span> <br>{{storage.comment}}
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
      <button class="btn" @click="storage = !storage"  v-if="!storage">
        Закрыть управление складами
      </button>
    </div>
    <button class="btn" @click="storage = !storage"  v-if="storage">
        Открыть управление складами
      </button>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      createStorage: {},
      storage: true
    };
  },
  computed: {
    ...mapGetters(['STORAGES'])
  },
  methods: {
    сhangeVisibility(storage) {
            storage.active = !storage.active
            axios
                .patch(`http://172.16.0.179/api/storages/${storage.id}`, storage)
                .then((res) => {
                location.reload(res);
                if (res == 404) {
                    alert("Ошибка в работе сервера. Перезагрузите страницу");
                }
            })
                .catch((error) => {
                alert("Ошибка в работе приложения. Обратитесь к администратору.");
                console.log(error);
            });
        },
        
    changeCategory(storage) {
            let newName = prompt("Введите новое имя категории.", storage.name);
            if (newName != null) {
              let newComment = prompt("Введите новый комментарий.", storage.comment);
              storage.comment = newComment
              storage.name = newName
                axios
                    .patch(`http://172.16.0.179/api/storages/${storage.id}`, storage)
                    .then((res) => {
                    location.reload(res);
                    if (res == 404) {
                        alert("Ошибка в работе сервера. Перезагрузите страницу");
                    }
                })
                    .catch((error) => {
                    alert("Ошибка в работе приложения. Обратитесь к администратору.");
                    console.log(error);
                });
              };
        },
        changeComment(storage) {
            let newComment = prompt("Введите новый комментарий.", storage.comment);
              storage.comment = newComment
                axios
                    .patch(`http://172.16.0.179/api/storages/${storage.id}`, storage)
                    .then((res) => {
                      console.log(storage);
                })
                    .catch((error) => {
                    alert("Ошибка в работе приложения. Обратитесь к администратору.");
                    console.log(error);
                });
        },
    createNewStorage() {
      this.createStorage.author_id = 1
      console.log(this.createStorage);
      axios
      .post('http://172.16.0.179/api/storages/', this.createStorage)
      .then((res) => {
        console.log('good');
      })
      .catch((error) => {
        alert("Ошибка в работе приложения. Обратитесь к администратору.");
        console.log(error);
      })
    },
  },
};
</script>
