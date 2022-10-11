<template>
  <div class="users-editor">
    <p class="paragraph"
    >№: <span class="bold">{{ user.id }}</span>
    </p>
    <p class="paragraph"
    >Имя: <span class="bold">{{ user.fio }}</span>
    </p>
    <p class="paragraph"
    >E-mail: <span class="bold">{{ user.email }}</span>
    </p>
    <p class="paragraph"
    >Телефон: <span class="bold">{{ user.phone }}</span>
    </p>
    <div class="users-wrap-status">
      <p class="paragraph"
      >Статус: <span class="bold">{{ userStatus }}</span>
      </p>
      <input
          type="button"
          class="btn"
          @click="usersChangeActive(1)"
          value="Включить"
          v-if="!user.active"
      >
      <input
          type="button"
          class="btn"
          @click="usersChangeActive(0)"
          value="Отключить"
          v-if="user.active"
      >
    </div>
    <p class="paragraph"
    >Роль пользователя:
    </p>
    <div
        class="v-select width-200"
        v-click-outside="onClickOutside"
    >
      <p
          class="input"
          @click="areOptionsVisible = !areOptionsVisible"
      >
        {{ selectedRole }}
      </p>
      <div
          class="options-product"
          v-if="areOptionsVisible"
          v-click-outside="onClickOutside"
      >
        <div
            v-for="role in roles"
            :key="role.id"
        >
          <a
              class="input bold search"
              @click="selectOption(role)"
          >
            {{ role.title }}
          </a>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import config from "@/config";
import vClickOutside from 'click-outside-vue3';

export default {
  name: "UsersEditor",
  data() {
    return {
      areOptionsVisible: false,
    }
  },
  props: ['user', 'roles'],
  computed: {
    userStatus() {
      if (this.user.active === 1) {
        return 'Активен'
      } else {
        return 'Отключен'
      }
    },
    selectedRole() {
      return this.user.title
    }
  },
  methods: {
    selectOption(role) {
      this.areOptionsVisible = false;
      let choiceRole = {}
      choiceRole.title = role.title
      choiceRole.id = role.id
      this.usersChangeRole(choiceRole)
    },
    usersChangeRole(choiceRole) {
      let user = {}
      user.role_id = choiceRole.id
      user.phone = this.user.phone
      user.active = this.user.active
      user.id = this.user.id
      axios({
        method: 'PATCH',
        url: `${config.url}/users/${user.id}`,
        data: user,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((req) => {
            console.log(req);
            location.reload()
          })
          .catch((error) => {
            console.log(error);
            console.log('Ошибка! Обратитесь к администратору');
          });

    },
    onClickOutside() {
      this.areOptionsVisible = false;
    },
    usersChangeActive(active) {
      let user = {}
      user.role_id = this.user.role_id
      user.phone = this.user.phone
      user.active = active
      user.id = this.user.id
      this.userStatus = active
      console.log(user);
      axios({
        method: 'PATCH',
        url: `${config.url}/users/${user.id}`,
        data: user,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((req) => {
            console.log(req);
            location.reload()
          })
          .catch((error) => {
            console.log(error);
            console.log('Ошибка! Обратитесь к администратору');
          });
    }
  }
}
</script>
