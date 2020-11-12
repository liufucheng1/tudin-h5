<template>
    <div class="self-wrap">
        <!-- 个人信息 -->
        <div class="self-index-head">
            <img src="https://store.cdn.xu5g.com/tdsh_h5_me_bg.png" alt="">
            <p class="self-setting">
                <van-icon class="globe-header-icon" name="setting" size="25" @click="jumpOther('setting')"/>
            </p>
            <div class="self-info">
                <div class="avatar">
                    <img :src="userInfo.avatar?userInfo.avatar:'https://store.cdn.xu5g.com/avatar.png'" alt="">
                </div>
                <div>
                    <p class="user-truename" v-if="userInfo.truename" v-text="userInfo.truename"></p>

                    <p class="improve-data" v-if="!userInfo.avatar || !userInfo.truename || !userInfo.mobile"
                       @click="jumpOther(isLogin?'improve-data':'login')">{{ isLogin?'完善信息':'立即登录' }}</p>
                </div>
            </div>
        </div>
        <!-- 设备列表 -->
        <device-list v-if="showDeviceList"></device-list>
        <!-- 操作按钮 -->
        <div class="self-index-content" v-if="devices.len">
            <!-- 切换设备 -->
            <div class="self-device-info border-1px" v-if="deviceInfo" @click="cutDevice()">
                <div class="device-info-left">
                    <img :src="deviceInfo.avatar" alt="">
                </div>
                <div class="device-info-right">
                    <p class="device-name">{{ deviceInfo.nick }}</p>
                    <p class="device-mobile">{{ deviceInfo.device_mobile }}</p>
                </div>
                <div class="switch-device">
                    <img src="https://store.cdn.xu5g.com/shh5_device_switch_icon@2x.png" alt="">
                </div>
            </div>
            <!-- 设备相关的操作按钮 -->
            <ul class="facility">
                <li @click="handle('info')">
                    <img src="https://store.cdn.xu5g.com/h5_v2_self1.png" alt="">
                    <p>设备信息</p>
                </li>
                <li @click="handle('economy')">
                    <img src="https://store.cdn.xu5g.com/h5_v2_self3.png" alt="">
                    <p>省电优化</p>
                </li>
                <li @click="handle('equipment')">
                    <img src="https://store.cdn.xu5g.com/h5_v2_self4.png" alt="">
                    <p>设备管理</p>
                </li>
                <li @click="handle('search')">
                    <img :src="handleIcon('find')" alt="">
                    <p>寻找设备</p>
                </li>
                <li @click="handle('familys')">
                    <img src="https://store.cdn.xu5g.com/h5_v2_self6.png" alt="">
                    <p>家庭管理</p>
                </li>
                <li @click="handle('fence')">
                    <img src="https://store.cdn.xu5g.com/h5_v2_self7.png" alt="">
                    <p>电子围栏</p>
                </li>
                <li @click="handle('map')">
                    <img src="https://store.cdn.xu5g.com/h5_v2_self8.png" alt="">
                    <p>聚合地图</p>
                </li>
                <li @click="handle('health')">
                    <img src="https://store.cdn.xu5g.com/h5_v2_self9.png" alt="">
                    <p>健康管家</p>
                </li>
                <li @click="handle('step')">
                    <img :src="handleIcon('step')" alt="">
                    <p>计步</p>
                </li>
                <li @click="handle('heart')">
                    <img :src="handleIcon('heart')" alt="">
                    <p>心率</p>
                </li>
                <li @click="handle('blood')">
                    <img :src="handleIcon('blood')" alt="">
                    <p>血压</p>
                </li>
                <li @click="handle('warning')">
                    <img src="https://store.cdn.xu5g.com/h5_v2_self13.png" alt="">
                    <p>失踪预警</p>
                </li>
                <!-- <li @click="clearLocal()">
                    <img src="https://store.cdn.xu5g.com/tdsh_h5_self_blood.png" alt="">
                    <p>清除数据</p>
                </li> -->
            </ul>
        </div>
        <div class="self-no-device" v-else>
            <div @click="createDevice()">
                <img src="https://store.cdn.xu5g.com/shh5_add_admin.png" alt="">
                <span>绑定设备</span>
            </div>
            <div @click="joinFamily()">
                <img src="https://store.cdn.xu5g.com/shh5_add_admin.png" alt="">
                <span>加入家庭组</span>
            </div>
            <!-- <div @click="clearLocal()">
                <img src="https://store.cdn.xu5g.com/shh5_add_admin.png" alt="">
                <span>清除数据</span>
            </div> -->
        </div>
        <van-dialog v-model="codeDialog" title="请输入短信邀请码" @cancel="diaCancel('code')" @confirm="editConfirm('code')"
                    show-cancel-button width="285">
            <div class="inp">
                <input maxlength="4" v-model="form.vcode" type="text" placeholder="请输入4位邀请码" @blur="recover">
            </div>
        </van-dialog>
    </div>
</template>
<script>
    import DeviceList from '../../components/device/list'
    import db from '../../plugins/db'
    import fun from '../../plugins/functions'
    import { mapState } from 'vuex'

    export default {
        name: 'Self',
        components: {
            DeviceList
        },
        data() {
            return {
                userInfo: {
                    truename: '',
                    avatar: '',
                    mobile: ''
                },
                codeDialog: false,
                form: {
                    vcode: ''
                }
            }
        },
        computed: {
            // 设备列表
            devices() {
                return {list: this.$store.state.devices, len: this.$store.state.devices.length};
            },
            // 登录状态
            isLogin() {
                return this.$store.state.isLogin;
            },
            // 设备信息
            deviceInfo() {
                this.$store.dispatch('getDeviceInfo')
                return this.$store.state.deviceInfo;
            },
            showDeviceList() {
                return this.$store.state.showDeviceList;
            },
            deviceAuths(){
                return this.$store.state.modules;
            }
        },
        mounted() {
            this.userInfo = db.get('user');
            if (!this.userInfo) {
                this.userInfo = {
                    truename: '',
                    avatar: '',
                    mobile: ''
                }
            }
        },
        methods: {
            recover: function () {
                window.scrollTo(0, 0);
            },
            clearLocal() {
                localStorage.clear();
                alert('数据已清除，退出后重新进入即可')
            },
            joinFamily() {
                fun.addDeviceBtn().then(res => {
                    if (res) {
                        let user = db.get('user');
                        this.form.mobile = user.mobile;
                        this.codeDialog = true;
                    }
                })
            },
            // 邀请码弹框的取消按钮
            diaCancel(type) {
                if (type == 'code') {
                    this.form.vcode = ''
                }
            },
            // 邀请码弹框的确认按钮
            editConfirm(type) {
                if (type == 'code') {
                    let str = /^\d{4}$/
                    if (!str.test(this.form.vcode)) {
                        this.$toast('请输四位数字有效邀请码');
                        return;
                    }
                    this.$axios.post('/family/getinto', this.form).then(res => {
                        this.$toast(res.message);
                        if (res.status == 200) {
                            this.getDevices();
                        }
                    })
                }
            },
            // 获取设备列表
            getDevices() {
                this.$axios.get('/family/devices').then(res => {
                    if (res.status == 200) {
                        this.$store.dispatch('setDevices', res.data);
                        if (res.data.length > 1) {
                            return;
                        } else {
                            db.set('deviceInfo', res.data[0]);
                            this.$store.dispatch('getDeviceInfo');
                            this.getNoticeCount(res.data[0].imei_sn);
                            this.getModules(res.data[0].imei_sn)
                        }
                    } else {
                        this.$toast(res.message)
                    }
                })
            },
            // 获取设备的未读消息数
            getNoticeCount(imei_sn) {
                this.$axios.get('/warns/unread', {imei_sn}).then(res => {
                    if (res.status == 200) {
                        this.$store.dispatch('setUnread', res.data.unread)
                    } else {
                        this.$toast(res.message);
                    }
                })
            },
            // 获取设备所有有的权限列表
            getModules(imei_sn) {
                this.$axios.get('/device/models', {imei_sn}).then(res => {
                    if (res.status == 200) {
                        let modules = [];
                        for (let item of res.data.modules) {
                            modules.push(item.alias);
                        }
                        this.$store.dispatch('setModules', modules)
                    }
                })
            },
            // 添加设备的按钮
            createDevice() {
                fun.addDeviceBtn().then(res => {
                    if (res) {
                        let path = window.location.href.split('#')[1];
                        this.$router.push({
                            path: '/deviceCreate',
                            query: {
                                path
                            }
                        })
                    }
                })
            },
            // 是否显示是被列表的开关函数
            cutDevice() {
                this.$store.dispatch('setShowDeviceList', true)
            },
            // 跳转到登录界面
            jumpLogin() {
                let path = this.$route.fullPath;
                this.$router.push({
                    path: '/login',
                    query: {
                        path
                    }
                })
            },
            handle(type) {
                fun.isDevice().then(res => {
                    if (res) {
                        switch (type) {
                            case 'info' : {
                                this.$router.push({path: '/deviceInfo'})
                                break;
                            }
                            case 'economy' : {
                                this.$router.push({path: '/economy'})
                                break;
                            }
                            case 'equipment' : {
                                this.$router.push({path: '/equipment'})
                                break;
                            }
                            case 'search' : {
                                let isAuth = fun.isAuth('find')
                                if (!isAuth) {
                                    this.$toast('此设备暂不支持该功能')
                                }else {
                                    this.searchDevice();
                                }
                                break;
                            }
                            case 'familys' : {
                                this.$router.push({path: '/familys'});
                                break;
                            }
                            case 'fence' : {
                                this.$router.push({path: '/fence'});
                                break;
                            }
                            case 'map' : {
                                this.$router.push({path: '/map'});
                                break;
                            }
                            case 'step' : {
                                let isAuth = fun.isAuth(type)
                                if (!isAuth) {
                                    this.$toast('此设备暂不支持该功能')
                                } else {
                                    this.$router.push({path: '/step'});
                                }
                                break;
                            }
                            case 'heart' : {
                                let isAuth = fun.isAuth(type)
                                if (!isAuth) {
                                    this.$toast('此设备暂不支持该功能')
                                } else {
                                    this.$router.push({path: '/heart'});
                                }
                                break;
                            }
                            case 'blood' : {
                                let isAuth = fun.isAuth(type)
                                if (!isAuth) {
                                    this.$toast('此设备暂不支持该功能')
                                } else {
                                    this.$router.push({path: '/blood'});
                                }
                                break;
                            }
                            case 'setting' : {
                                this.$router.push({
                                    path: '/setting'
                                })
                                break;
                            }
                            case 'warning' : {
                                this.$router.push({
                                    path: '/warning_page'
                                })
                                break;
                            }
                            case 'health' : {
                                this.$router.push({
                                    path: '/health'
                                })
                                break;
                            }
                            default : {
                                console.log('错误指令')
                                break;
                            }
                        }
                    }
                })
            },
            jumpOther(type) {
                switch (type) {
                    case 'manual' : {
                        this.$router.push({path: '/manual'});
                        break;
                    }
                    case 'about' : {
                        this.$router.push({path: '/about'});
                        break;
                    }
                    case 'iCard' : {
                        window.location.href = 'http://test.www.tudingapp.com/openCard/';
                        break;
                    }
                    case 'market' : {
                        window.location.href = 'http://test.www.tudingapp.com/mall/#/index';
                        break;
                    }
                    case 'improve-data' : {
                        let user = db.get('user')
                        if (user.mobile) {
                            this.$router.push({
                                path: '/setting'
                            })
                        } else {
                            this.$router.push({
                                path: '/improve_data'
                            })
                        }
                        break;
                    }
                    case 'login' : {
                        this.$router.push({
                            path: '/login'
                        })
                    }
                    case 'setting' : {
                        if (!this.isLogin) {
                            this.$toast('请先登录')
                            return;
                        }
                        this.$router.push({
                            path: '/setting'
                        })
                        break;
                    }
                    default : {
                        break;
                    }
                }
            },
            searchDevice() {
                this.$dialog.alert({
                    width: '284px',
                    title: '寻找设备',
                    message: '开始寻找设备？',
                    showCancelButton: true,
                    confirmButtonColor: '#C50B0F'
                }).then(() => {
                    this.$store.dispatch('getDeviceInfo');
                    let imei_sn = this.$store.state.deviceInfo.imei_sn;
                    this.$axios.get('/device/sendfind', {imei_sn}).then(res => {
                        if (res.status == 200) {
                            this.$dialog.alert({
                                title: '温馨提示',
                                width: '284px',
                                message: res.message,
                                confirmButtonText: '我知道了',
                                confirmButtonColor: '#999999'
                            })
                        } else {
                            this.$toast(res.message);
                        }
                    })
                }).catch(() => {

                })
                this.$store.dispatch('getDeviceInfo');
            },
            handleIcon(type){
                let isAuth = fun.isAuth(type);
                let url = ''
                if(isAuth){
                    switch (type) {
                        case 'step':
                            url = 'https://store.cdn.xu5g.com/h5_v2_self10.png';
                            break;
                        case 'heart':
                            url = 'https://store.cdn.xu5g.com/h5_v2_self11.png';
                            break;
                        case 'blood':
                            url = 'https://store.cdn.xu5g.com/h5_v2_self12.png';
                            break;
                        case 'find':
                            url = 'https://store.cdn.xu5g.com/h5_v2_self5.png';
                            break;
                        default:
                            url = 'https://store.cdn.xu5g.com/avatar.png';
                            break;
                    }
                }else {
                    switch (type) {
                        case 'step':
                            url = 'https://store.cdn.xu5g.com/h5_v2_self10_unauth.png';
                            break;
                        case 'heart':
                            url = 'https://store.cdn.xu5g.com/h5_v2_self11_unauth.png';
                            break;
                        case 'blood':
                            url = 'https://store.cdn.xu5g.com/h5_v2_self12_unauth.png';
                            break;
                        case 'find':
                            url = 'https://store.cdn.xu5g.com/h5_v2_self5_unauth.png'
                            break;
                        default:
                            url = 'https://store.cdn.xu5g.com/avatar.png';
                            break;
                    }
                }
                return url;
            }
        },
        watch: {
            isLogin: function () {
                if (this.isLogin) {
                    this.userInfo = db.get('user')
                }
            }
        },
    }
</script>
<style scoped>
    .self-wrap {
        min-height: -moz-calc(100vh - 50px);
        min-height: -webkit-calc(100vh - 50px);
        min-height: calc(100vh - 50px);
        background: #F9F9F9;
    }

    /* 上面的个人信息 */
    .self-index-head {
        width: 100%;
        position: relative;
    }

    .self-index-head > img {
        width: 100%;
    }

    /* 设置按钮 */
    .self-setting {
        color: #ffffff;
        position: absolute;
        top: 15px;
        right: 15px;
    }

    /* 个人信息 */
    .self-info {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translate(-50%, -30px);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .self-info > .avatar {
        border-radius: 50%;
        width: 60px;
        height: 60px;
        box-shadow: 0px 2px 5px 0px rgba(217, 217, 217, 0.5);
        border: 2px solid rgba(255, 255, 255, 1);
        overflow: hidden;
    }

    .self-info > div:nth-child(2) {
        text-align: center;
        margin-top: 5px;
    }

    .self-info > div:nth-child(2) > p {
        margin-bottom: 5px;
    }

    .self-info > .avatar > img {
        width: 100%;
    }

    /* 个人昵称右侧的border   只有完善按钮出现的时候这个class才生效 */
    .self-info .truename-border {
        padding-right: 8px;
        margin-right: 8px;
        border-right: 1px solid #E6E6E6;
    }

    /* 完善信息按钮 */
    .self-info .improve-data {
        padding: 3px 8px;
        font-size: 14px;
        color: #333333;
        border-radius: 4px;
        background: #FDD100;
    }

    /* 内容部分 */
    .self-index-content {
        margin-top: 60px;
        padding: 20px;
    }

    .self-no-device {
        margin-top: 85px;
        padding: 20px;
    }

    /* 设备信息 头像 手机号  nick */

    .self-device-info {
        padding: 8px 15px;
        background: #ffffff;
        border-radius: 6px 6px 0 0;
    }

    .self-device-info > div {
        display: inline-block;
        vertical-align: middle;
    }

    .self-device-info > .device-info-left {
        width: 45px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 8px;
    }

    .self-device-info > .device-info-left > img {
        width: 100%;
        height: 100%;
        vertical-align: top;
    }

    .device-info-right > .device-name {
        font-size: 15px;
        color: #333333;
        margin-top: 5px;
    }

    .device-info-right > .device-mobile {
        color: #777777;
        font-size: 14px;
    }

    .switch-device {
        width: 33px;
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
    }

    .switch-device > img {
        width: 100%;
    }

    /* 操作按钮 */
    .facility {
        padding: 8px 0;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        background: #ffffff;
        border-radius: 0 0 6px 6px;
    }

    .self_center {
        margin: 15px 0;
    }

    .facility > li {
        margin: 15px 0;
        text-align: center;
        width: 25%;

    }

    .facility > li > img {
        width: 26px;
    }

    .facility > li > p {
        font-size: 14px;
        margin-top: 5px;
        color: #333333;
    }

    /* 添加设备 */

    .self-no-device {
        padding: 15px;
    }

    .self-no-device > div {
        margin-bottom: 15px;
        padding: 20px 15px;
        background: #ffffff;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .self-no-device > div > img {
        width: 30px;
    }

    .self-no-device > div > span {
        font-size: 14px;
        color: #000000;
        margin-left: 15px;
    }

    .inp > input {
        background: #EFEFEF;
        width: 100%;
        font-size: 16px;
        border: none;
    }

    .inp {
        border-radius: 8px;
        overflow: hidden;
        padding: 10px;
        background: #EFEFEF;
        margin: 15px auto;
        width: 241px;
    }

    .warning-dialog {
        padding: 20px;
        font-size: 14px;
        letter-spacing: 1px;
    }

    .warning-dialog span {
        color: #FDD100;
    }
</style>
