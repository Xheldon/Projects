import Vue from 'vue';
import axios from 'axios';
import path from 'path';
import App from './App';
import store from './store';
import shelljs from 'shelljs';
/** shelljs 没办法在 electron 中执行命令, 因此使用原生 exec 方法
 * https://github.com/shelljs/shelljs/wiki/Electron-compatibility
 * shelljs.config.execPath 无效
 */
import { execSync } from 'child_process';
import { NginxConfFile } from 'nginx-conf';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
// 每次加载, 应该先读取已有的配置, 将值传递给组件
let config;
try {
    config = JSON.parse(shelljs.cat(path.join(__dirname, '../../config/config.json')));
} catch (err) {
    if (err) alert('err:', err);
}

function init (cb) {
    // 读取 nginx 配置文件
    NginxConfFile.create(config.nginxConfigPath, (err, conf) => {
        if (err) {
            // TODO: nginx 配置文件找不到
            console.log('err:', err);
            return;
        }
        // 检测 nginx 是否运行
        let isNginxRunning = execSync('ps -ef | grep nginx').toString().includes('nginx: master process');
        // 读取配置
        conf.nginx.http.server.forEach((v) => {
            if (v.server_name && v.server_name._value.includes('release.eb.sankuai.com')) {
                v.location.forEach((val)=> {
                    if (val._value === '/api/v1/ebooking') {
                        let current = {}, isAlreadyInList, callback;
                        // 读取当前 nginx 配置, 如果当前域名不在列表中, 则写入配置文件
                        isAlreadyInList = config.commonInterfaceList.some((value) => {
                            current = value;
                            return value.value === val.proxy_pass._value
                        });
                        if (!isAlreadyInList) {
                            // 将已有 nginx 配置写入配置文件
                            config.current = current = {
                                label: val.proxy_pass._value,
                                value: val.proxy_pass._value
                            };
                            config.commonInterfaceList.push(current);
                            shelljs.ShellString(JSON.stringify(config)).to(path.join(__dirname, '../../config/config.json'));
                        }
                        cb(config.commonInterfaceList, current, isNginxRunning);
                    }
                });
            }
        });
    });
}
init((list, current, isRunning) => {
    /* eslint-disable no-new */
    new Vue({
        components: { App },
        store,
        template: '<App />',
        created () {
            this.$store.commit('SET_SELECTED_LIST', list);
            this.$store.commit('SET_CURRENT', current);
            this.$store.commit('SET_NGINX_STATUS', isRunning);
        }
    }).$mount('#app');
});
