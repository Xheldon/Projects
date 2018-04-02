<template>
    <div id="app">
        <div id="control">
            <button id="start">启动</button>
            <button id="raload">重启</button>
            <button id="stop">退出</button>
            <button id="loadEBConfig">载入 EB 配置</button>
            <button id="loadNewConfig">载入新的配置</button>
            <button id="show">显示配置</button>
        </div>
        <div id="config">
            <div>切换接口环境:</div>
            <select v-model="current">
                <option disabled value="">请选择</option>
                <option v-for="(v, k) in switchList">{{v.sw}}</option>
            </select>
        </div>
    </div>
</template>

<script>
    import { NginxConfFile } from 'nginx-conf';
    import configPath, { getConfList } from '@config/config.js';


    export default {
        name: 'Nginx-GUI',
        data () {
            return {
                switchList: [{
                    id: '1900-usdgk',
                    sw: 'http://1900-usdgk-sl-eb.hotel.test.sankuai.com/'
                }, {
                    id: '1900-ualbf',
                    sw: 'http://1900-ualbf-sl-eb.hotel.test.sankuai.com/'
                }],
                current: {}
            }
        },
        watch: {
            current (n, o) {
                console.log(n, o);
            }
        },
        methods: {
            show () {
                console.log(arr);
            }
        },
        mounted () {
            NginxConfFile.create('/usr/local/etc/nginx/nginx.conf', (err, conf) => {
                if (err) {
                    console.log('err:', err);
                    return;
                }
                console.log('conf:', conf);
                conf.nginx.http.server.forEach((v) => {
                    if (v.server_name && v.server_name._value.includes('release.eb.sankuai.com')) {
                        v.location.forEach((val)=> {
                            if (val._value === '/api/v1/ebooking') {
                                let value = val.proxy_pass._value;
                                this.current = {
                                    id: !value.indexOf('https') ? value.slice(0, 18) : value.slice(0, 17),
                                    sw: value
                                };
                                console.log('current:', this.current);
                                // 将配置写入文件:
                                getConfList((err, conf) => {
                                    if (err) {
                                        shelljs.touch(configPath);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    }
</script>

<style>
    /* CSS */
</style>
