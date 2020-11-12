<template>
    <div class="phone-wrap">
        <div class="device-avatar">
            <img :src="deviceInfo?deviceInfo.avatar:'https://store.cdn.xu5g.com/avatar.png'" alt="">
        </div>
        <div v-if="deviceInfo">
            <p class="is-login">{{ deviceInfo.nick }}</p>
            <p class="is-login-device-mobile">{{ deviceInfo.device_mobile }}</p>
        </div>
        <div class="devision border-1px"></div>
        <ul class="phone-handle">
            <li @click="deviceListen()">
                <img src="https://store.cdn.xu5g.com/tdsh_h5_phone_listen.png" alt="">
                <p>聆听</p>
            </li>
            <li @click="deviceCall()">
                <img src="https://store.cdn.xu5g.com/tdsh_h5_phone_call.png" alt="">
                <p>呼叫</p>
            </li>
        </ul>
        <van-dialog
          showCancelButton
          @confirm="listenConfirm"
          confirmButtonText="聆听"
          cancelButtonText="取消"
          confirmButtonColor="#F56C6C"
          widtph="200"
          v-model="isListen"
          title="聆听">
            <div class="listen-word-wrap">
                <p class="listen-word">
                    聆听是为了让您更全面评估监护对象所在环境，为监护对象的安全护航。点击聆听后，设备会在静默状态下拨打您的号码，您可以听到设备所在的位置环境音，而您发出的声音不会被听到。受网络等环境影响，聆听会有几十秒延迟，请稍作等待。同时，在此郑重提醒您，请勿使用此功能进行不当通途，侵犯他人隐私权是违法行为。
                </p>
            <p class="device-mobile" v-if="deviceInfo">{{ deviceInfo.device_mobile }}</p>
            </div>
        </van-dialog>
        <van-dialog
          showCancelButton
          @confirm="callConfirm"
          confirmButtonText="呼叫"
          cancelButtonText="取消"
          confirmButtonColor="#F56C6C"
          widtph="200"
          v-model="isCall"
          title="即将呼叫">
          <p class="is-login-device-mobile" v-if="deviceInfo">{{ deviceInfo.device_mobile }}</p>
        </van-dialog>
    </div>
</template>
<script>
import fun from '../../plugins/functions'
export default {
    name:'Phone',
    data() {
        return {
            isListen:false,
            isCall:false
        }
    },
    computed: {

        // 登陆状态
        isLogin(){
            return this.$store.state.isLogin;
        },
        // 设备信息
        deviceInfo(){
            return this.$store.state.deviceInfo;
        }
    },
    methods: {
        // 确认呼叫按钮
        callConfirm(){
            // 创建a标签
            var a = document.createElement('a');
            // 给a标签添加属性，tel
            a.setAttribute('href', 'tel:' + this.deviceInfo.device_mobile);
            // 给a标签添加id
            a.setAttribute('id', 'js_a');
            //防止反复添加
            if(document.getElementById('js_a')) {
                document.body.removeChild(document.getElementById('js_a'));
            }
            document.body.appendChild(a);
            a.click();
        },
        // 确认聆听的按钮
        listenConfirm(){
            this.$axios.post('/device/monitor',{imei_sn:this.deviceInfo.imei_sn}).then(res => {
                if (res.status == 200) {
                    this.$Dialog.alert({
                        title:'聆听提示',
                        message:'发送聆听请求成功，请稍等片刻'
                    })
                }else {
                    this.$Toast(res.message);
                }
            })
        },
        // 弹出聆听确认弹框
        deviceListen(){
            fun.isDevice().then(res => {
                if (res) {
                    this.isListen = true;
                }
            })
        },
        // 弹出呼叫弹框
        deviceCall(){
            fun.isDevice().then(res => {
                if (res) {
                    this.isCall = true;
                }
            })
        },
        // 跳转登陆界面
        jumpLogin(){
            let historyPath = this.$route.path
            this.$router.push({
                path:'login',
                query:{
                    path:historyPath
                }
            })
        }
    },
}
</script>
<style scoped>
    .phone-wrap {
        background: #ffffff;
        overflow: hidden;
        height:-moz-calc(100vh - 50px);
        height:-webkit-calc(100vh - 50px);
        height: calc(100vh - 50px);
    }
    .device-avatar {
        width: 80px;
        margin: 100px auto 10px;
        border-radius: 50%;
        overflow: hidden;
    }
    .device-avatar > img {
        width: 100%;
    }
    .is-login {
        text-align: center;
        font-size:18px;
        font-weight:500;
        color:rgba(51,51,51,1);
    }
    .is-login-device-mobile {
        padding: 15px 8px;
        text-align: center;
        font-size: 16px;
        color: #C0C4CC;
    }
    .devision {
        padding-top: 35px;
        width: 100%;
    }
    .phone-handle {
        margin-top: 50px;
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .phone-handle > li {
        text-align: center;
        margin: 0 6%;
        width: 25%;
    }
    .phone-handle > li > img {
        width: 65%;
    }
    .listen-word-wrap {
        padding: 15px;
    }
    .listen-word {
        font-size: 16px;
        color: #909399;
        text-align: center;
        letter-spacing: 1.5px;
        line-height: 25px;
    }
    .device-mobile {
        padding: 10px 15px;
        font-size: 18px;
        font-weight: 500;
        background: #EBEEF5;
        border-radius: 6px;
        margin: 8px auto;
        text-align: center;
    }
</style>
