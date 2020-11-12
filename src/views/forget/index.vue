<template>
    <div class="login-home-register">
        <div class="globe-header">
            <p class="globe-back" @click="jumpLogin">
                <van-icon name="arrow-left" size="25" />
            </p>
            <p class="globe-title">
                忘记密码
            </p>
        </div>
        <div class="username">
            <van-field left-icon="contact" type="number" clearable class="inpf" v-model="form.username" placeholder="请输入手机号" />
        </div>
        <div class="v-code">
            <van-field  left-icon="passed" clearable class="inpf" type="number" v-model="form.vcode" placeholder="请输入验证码" >
                <span @click="sendCode" class="v-code-btn" slot="button"> {{ btnText }} </span>
            </van-field>
        </div>
        <div class="password">
            <van-field  left-icon="comment-o" clearable class="inpf" type="password" v-model="form.password" placeholder="输入6-16位数字或字母" />
        </div>
        <div class="password">
            <van-field  left-icon="comment-o" clearable class="inpf" type="password" v-model="form.confirm_password" placeholder="请确认密码" />
        </div>
        <td-button style="margin-top:20px" text="提 交" @click="onSubmit"></td-button>
    </div>
</template>
<script>
import fun from '../../plugins/functions'
export default {
    name:'LoginRegister',
    data() {
        return {
            btnText:'发送验证码',
            vCodeBtn:true,
            tiemr:null,//发下验证码的定时器
            codeLoading:null,
            form:{
                username:'',
                vcode:'',
                password:'',
                confirm_password:''
            }
        }
    },
    created() {
        
    },
    methods: {
        jumpLogin(){
            this.$router.push({
                path:'/login'
            })
        },
        // 发送验证码
        sendCode(){
            //检测是否为已发送状态
            if(!this.vCodeBtn){
                return;
            }
            if(this.form.username == ''){
                this.$Toast('请输入手机号');
                return;
            }
            //请求
            this.codeLoading = this.$Toast.loading({
                duration:0,//不自动消失
                message:'发送中...',
                forbidClick: true,//加载的时候禁止其他屏幕操作
                loadingType: 'spinner'
            })
            this.$axios.post('/passport/vcode',{is_username:1,username:this.form.username}).then(res => {
                this.codeLoading.clear();
                this.codeLoading = null;
                var count = 60
                if(res.status == 200){
                    this.$Toast('发送成功');
                    //启动计时器
                    this.timer = setInterval(() => {
                        this.vCodeBtn = false;
                        count--;
                        this.btnText  = count + 's'
                        // 满足条件关闭计时器
                        if(count < 0 || count == 0){
                            this.btnText = '重新发送';
                            this.vCodeBtn = true;
                            clearInterval(this.timer);
                            this.timer = null;
                        }
                    },1000)
                }else {
                    this.$Toast(res.message);
                }
            })
        },
        onSubmit(){
            if(this.form.username == ''){
                this.$Toast('请输入手机号')
                return;
            }
            if(!fun.isMobile(this.form.username)){
                this.$Toast('请输入正确的手机号');
                return;
            }
            if(this.form.vcode == ''){
                this.$Toast('请输入验证码');
                return;
            }
            if(this.form.password == ''){
                this.$Toast('请输入密码')
                return;
            }
            if(this.form.password.length < 6){
                this.$Toast('密码最少6位')
                return;
            }
            if(this.form.confirm_password != this.form.password){
                this.$Toast('两次输入密码不一致')
                return;
            }
            this.$axios.put('/passport/forgetpwd',this.form).then(res => {
                if(res.status == 200){
                    this.$Toast('修改成功');
                    this.$router.push('/login/index')
                }else {
                    this.$Toast(res.message)
                }
            })
        },
    },
    beforeDestroy() {
        //清除定时器
        clearInterval(this.timer);
        this.tiemr = null
    },
}
</script>
<style scoped>
    .login-home-register {
        width:80.27vw;
        margin:0 auto;
        padding-bottom:15px;
        overflow:hidden;
    }
    .username,.password,.v-code {
        overflow: hidden;
        border-radius: 8px;
        border: 1px solid rgba(239,239,244,1);
    }
    .username {
        margin-top:50px;
    }
    .password,.v-code {
        margin-top: 20px;
    }
    .v-code-btn {
        padding-left: 8px;
        border-left: 1px solid #EBEEF5;
        font-size: 14px;
        color: #F2C81F;
    }
</style>