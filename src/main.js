import {
  createApp,
} from 'vue';
import App from './App.vue';
import router from './router';
import './styles/styles.scss';
import './styles/variables.scss';
import 'material-symbols';
import store from './store';
import vClickOutside from 'click-outside-vue3'
import VueCookies from 'vue-cookies';

const app = createApp(App);

app.use(store);
app.use(vClickOutside);
app.use(router);
app.use(VueCookies)

app.mount('#app');
