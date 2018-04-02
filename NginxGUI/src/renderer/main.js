import Vue from 'vue';
import axios from 'axios';

import App from './App';
import store from './store';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
// 每次加载, 应该先读取已有的配置, 将值传递给组件


/* eslint-disable no-new */
new Vue({
    components: { App },
    store,
    template: '<App/>'
}).$mount('#app');
