import {
  createApp,
} from 'vue';
import App from './App.vue';
import router from './router';
import './styles/styles.scss';
import './styles/variables.scss';
import 'material-symbols';
import store from './store';
import vClickOutside from 'click-outside-vue3';

const app = createApp(App);

app.use(store);
app.use(vClickOutside);
app.use(router);

app.mount('#app');
