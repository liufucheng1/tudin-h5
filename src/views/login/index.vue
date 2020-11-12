<template>
    <div class="login-home-index">
        <p class="login-back">
            <van-icon @click="back()" name="arrow-left" size="25" />
        </p>
        <div class="login-index-content" v-show="!isSendCode" >
            <p class="login-index-title">请输入手机号</p>
            <div class="input-box border-1px">
                <span>+86</span>
                <input
                @input="telInput()"
                v-model="form.mobile"
                maxlength="11"
                ref="tel"
                type="number"
                placeholder="请输入手机号">
            </div>
            <p class="sendCode" :style="{ backgroundColor:backGround }" @click="sendCode">
                获取验证码
            </p>
        </div>
        <div class="login-index-content" v-show="isSendCode">
            <p class="login-index-code-title">{{ '验证码已发送至 +86 ' + form.mobile + ',请查收' }}</p>
            <div class="input-box border-1px code-box">
                <input type="number" maxlength="4" v-model="form.vcode" placeholder="请输入验证码" @input="vcodeInput()">
                <p :style="{ backgroundColor:isSend?'#FDD100':'#f5f5f5' }" @click="sendCode()"> {{ codeBtn }} </p>
            </div>
            <p class="sendCode" :style="{ backgroundColor:form.vcode.length == 4?'#FDD100':'#C8C8C8' }" @click="onSubmit">
                完成
            </p>
        </div>
        <div class="agreenment">
            登录即代表您同意<span @click="showGo">《兔盯守护协议及隐私政策》</span>
        </div>
        <van-dialog
          confirmButtonText="确认"
          confirmButtonColor="#FE8125"
          width="280"
          v-model="go"
          title="用户隐私保护政策">
            <div class="go">
                感谢您信任并使用兔盯守护！<br/>
                我们非常重视您的个人信息和隐私保护。为了更好地保障您的个人权益，在您使用我们的产品前，
                请务必审慎阅读 <span @click="jumpGo">《用户服务协议及隐私政策》</span> 内的所有条款，尤其是：<br/>
                1.我们对您的个人信息的收集/使用/对外提供/保护等规则条款，以及您的用户权力等条款。<br/>
                2.约定我们的限制责任，免责条款。<br/>
                3.其他以颜色或加粗进行的表示重要条款。
            </div>
        </van-dialog>
    </div>
</template>
<script>
import fun from '../../plugins/functions'
import db from '../../plugins/db'
import getDevice from '../../plugins/getDevice'
export default {
    name:'Loginindex',
    data() {
        return {
            go:false,
            // 用来判断是否已经输入过手机号并且发送过一次验证码
            isSendCode:false,
            // 目前状态是否可以发送验证码
            isSend:true,
            form:{
                username:'',
                vcode:''
            },
            backGround:'#C8C8C8',
            codeBtn:'重新发送60s',
            timer:null,
            count:60
        }
    },
    created() {

    },
    methods: {
        setLoading(mes){
            this.loading = this.$Toast.loading({
                duration:0,//不自动消失
                message:mes,
                forbidClick: true,//加载的时候禁止其他屏幕操作
                loadingType: 'spinner'
            })
        },
        clearLoading(){
            this.$toast.clear();
            this.loading = null;
        },
        // 后退
        back(){
            this.$router.go(-1);
        },
        // 跳转到条款详情
        jumpGo(){
            this.$router.push({path:'/agreenMent'})
        },
        // 显示条款弹框
        showGo(){
            this.go  = true;
        },
        // 验证手机号输入框
        telInput(){
            if(this.form.mobile.length > 11) this.form.mobile=this.form.mobile.slice(0,11)
            if(this.form.mobile.length >= 11){
                this.backGround = "#FDD100"
            }else {
                this.backGround = "#c8c8c8"
            }
        },
        vcodeInput(){
            if(this.form.vcode.length > 4) this.form.vcode = this.form.vcode.slice(0,4)
        },
        // 发送验证码
        sendCode(){
            if(!fun.isMobile(this.form.mobile)){
                this.$toast('请输入正确的手机号')
                return;
            }
            if(!this.isSend){
                return
            }
            this.setLoading('发送中...');
            this.$axios.post('/sms/code',{ mobile: this.form.mobile }).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.$toast.success('发送成功');
                    this.isSendCode = true;
                    this.isSend = false;
                    this.sendSuccess();
                }else {
                    this.$toast.fail(res.message)
                }
            })
        },
        sendSuccess(){
            this.count = 60;
            this.timer = setInterval(() => {
                if(this.count <= 0){
                    clearInterval(this.timer);
                    this.isSend = true;
                    this.codeBtn = '重新发送';
                    this.count = 60
                    return
                }
                this.count -- ;
                this.codeBtn = '重新发送' + this.count + 's'
            },1000)
        },
        onSubmit(){
            let app_id = db.get('appid');
            let sign = db.get('sign');
            this.setLoading('登录中...')
            this.$axios.post('/mobile/login',{ app_id, sign, mobile: this.form.mobile, vcode: this.form.vcode }).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    db.set('user',res.data)
                    localStorage.setItem( 'appid_'  + app_id + '_token',res.data.token);
                    let user = JSON.stringify(res.data);
                    localStorage.setItem( 'appid_' + app_id + '_user',user)
                    db.set('token',res.data.token)
                    this.$store.dispatch('loginStatus',true)
                    this.$store.dispatch('setToken',res.data.token);
                    getDevice.main();
                    this.back();
                }else {
                    this.$toast(res.message)
                }
            })
        }
    },
    mounted() {
        // 自动聚焦到输入框
        this.$refs.tel.focus();
    },
}
</script>
<style scoped>
    .login-home-index {
        width: 100%;
        min-height: 100vh;
        position: relative;
        background: #ffffff;
    }
    .login-back {
        padding: 12px;
    }
    .agreenment {
        color: #888888;
        text-align: center;
        font-size: 13px;
        position: absolute;
        bottom: 10px;
        left: 0;
        width: 100%;
    }
    .agreenment > span {
        color: #FDD100;
    }
    .login-index-content {
        padding: 26px 38px 38px;
    }
    .login-index-title {
        font-family:PingFangSC-Medium,PingFang SC;
        font-size: 22px;
        color: #333333;
        font-weight: 500;
    }
    .input-box {
        padding: 15px 0;
        margin: 30px 0;
    }
    .input-box > span {
        padding-right: 12px;
        margin-right: 12px;
    }
    .input-box > input {
        border: none;
    }
    .sendCode {
        padding: 10px;
        background: #c8c8c8;
        color: #ffffff;
        font-size: 14px;
        text-align: center;
        border-radius: 6px;
    }
    .login-index-code-title {
        font-size: 14px;
        color: #333333;
    }

    .code-box {
        display: flex;
        justify-content: space-between;
    }
    .code-box > p {
        font-size: 12px;
        padding: 5px 10px;
        border-radius: 12px;
        float: right;
    }
    .code-box > input {
        width: 150px;
    }
</style>