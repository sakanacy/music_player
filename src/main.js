import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'amfe-flexible'
import 'amfe-flexible/index'
import { Form,Field,NavBar,Tabbar, TabbarItem,Swipe, SwipeItem,Lazyload,Button,Search,Icon,Image as VanImage,Cell, CellGroup,Col, Row } from 'vant';


Vue.use(Form);
Vue.use(Field);
Vue.use(NavBar);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);
Vue.use(Button);
Vue.use(Search);
Vue.use(NavBar);
Vue.use(Icon);
Vue.use(VanImage);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Col);
Vue.use(Row);

Vue.config.productionTip = false
Vue.prototype.axios=axios


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
