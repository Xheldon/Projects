<template>
    <div id="app">
        <div id="control">
            <button v-for="(v, k) in buttonList" v-if="v.showWhenNginxRunning" :key="v.name" @click="click(v.action)">{{v.name}}</button>
            <button @click="add" id="loadNewConfig">添加新的常用配置</button>
        </div>
        <div id="config">
            <div>切换接口环境:</div>
            <select v-model="current">
                <option disabled value="">请选择</option>
                <option v-for="(v, k) in list" :value="v.value">{{v.label || '未命名'}}</option>
            </select>
        </div>
        <modal v-show="inputModalShow" @ok="modalOperate('pw','ok')" @no="modalOperate('pw','no')" :options="modalOptions">
            <input type="text" v-model="pw">
        </modal>
        <modal v-show="inputModalShow" @ok="modalOperate('add','ok')" @no="modalOperate('add','no')" :options="modalOptions">
            <label>名称:<input type="text" v-model="add.label"></label>
            <label>值:<input type="text" v-model="add.value"></label>
        </modal>
    </div>
</template>

<script>
    import { NginxConfFile } from 'nginx-conf';
    import { mapState } from 'vuex';
    import { exec } from 'child_process';
    import modal from './components/modal'

    export default {
        name: 'Nginx-GUI',
        components: {
            modal
        },
        data () {
            return {
                current: this.$store.state.config.current.value,
                pw: '',
                inputModalShow: false,
                willDo: '',
                modalOptions: {
                    title: '请输入管理员密码:',
                    ok: '确认',
                    no: '取消'
                }
            }
        },
        watch: {
            current (n, o) {
                console.log(n, o);
            }
        },
        computed: {
            ...mapState({
                list: state => state.config.selectedList,
                status: state => state.config.running
            }),
            buttonList () {
                let status = this.status;
                return [{
                    name: '启动',
                    action: 'start',
                    showWhenNginxRunning: !status
                }, {
                    name: '重启',
                    action: 'reload',
                    showWhenNginxRunning: status
                }, {
                    name: '退出',
                    action: 'stop',
                    showWhenNginxRunning: status
                }];
            }
        },
        methods: {
            _operate (obj, cb) {
                exec(`echo '${this.$store.state.config.pw}' | sudo -S nginx ${obj.cmd !== 'start' ? '-s ' + obj.cmd : ''}`, (err, stdout, stderr) => {
                    if (err) {
                        if (err.message.includes('Password')) {
                            // 如果是密码输入错误才执行失败的, 重新输入密码:
                            this.modalOptions.title = '密码输入错误, 要不再试试?';
                            this.inputModalShow = true;

                        }
                        return;
                    }
                    // err out 为空代表操作成功, 否则为失败
                    console.log('out:', stdout, ';err:', stderr);
                    if (!stdout.trim()) {
                        console.log('操作 nginx 成功:', stdout);
                        this.$store.commit('SET_NGINX_STATUS', obj.cmd !== 'stop');
                    }
                    if (stderr) {
                        console.log('操作 nginx 失败:', stderr);
                    }
                });
            },
            click (action) {
                if (!this.$store.state.config.pw) {
                    // TODO: 弹框输入用户密码
                    this.inputModalShow = true;
                    // 缓存起来将要做的操作以供输入密码之后直接操作
                    this.willDo = action;
                } else {
                    this._operate({
                        cmd: action
                    });
                }
            },
            modalOperate (type, action) {
                switch (action) {
                    case 'ok':
                        let pw = this.pw;
                        if (!pw) {
                            alert('你这啥也没输入啊, 你密码在内存里, 退出就没了, 放心吧');
                            return;
                        } else {
                            alert('pw:' + this.pw);
                            this.$store.commit('SET_USER_PW', this.pw);
                            this.inputModalShow = false;
                            this._operate({
                                cmd: this.willDo
                            });
                        }
                        break;
                    case 'no':
                        this.pw = '';
                        this.inputModalShow = false;
                        break;
                    default:
                        break;

                }
            },
            add () {

            }
        }
    }
</script>

<style>
    /* CSS */
</style>
