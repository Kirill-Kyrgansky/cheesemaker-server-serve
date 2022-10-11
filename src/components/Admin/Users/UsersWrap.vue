<template>
  <div class="section ">
    <div class="container users-wrap">
      <UsersEditor
          v-for="user in users"
          :key="user.id"
          :user="user"
          :roles="roles"
      />

    </div>
  </div>
</template>

<script>
import UsersEditor from "@/components/Admin/Users/UsersEditor";
import axios from "axios";
import config from "@/config";
export default {
  name: "UsersWrap",
  components: {UsersEditor},
  data() {
    return {
      users: {},
      roles: {}
    }
  },
  mounted() {
    this.getUsers()
    this.getRoles()
  },
  methods: {
    getUsers() {
      axios({
        method: 'GET',
        url: `${config.url}/users`,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((req) => {
            this.users = req.data
          })
          .catch((error) => {
            console.log(error);
          });
    },
    getRoles() {
      axios({
        method: 'GET',
        url: `${config.url}/roles`,
        headers: {
          authorization: this.$cookies.get('authorization'),
        },
      })
          .then((req) => {
            this.roles = req.data
          })
          .catch((error) => {
            console.log(error);
          });
    }
  }
}
</script>

