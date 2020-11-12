<template>
    <div class="login-home-register">
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
        <div class="agreenment">
            <van-checkbox v-model="checked" checked-color="#F2C81F">
                我已阅读并同意<span @click="showGo">《兔盯守护协议及隐私政策》</span>
            </van-checkbox>
        </div>
        <td-button style="margin-top:20px" text="注 册" @click="onSubmit"></td-button>
        <span class="jump-login" @click="junpLogin">已有帐号，去登陆</span>
        <van-dialog
          @cancel="cancel"
          showCancelButton
          confirmButtonText="同意"
          cancelButtonText="不同意并退出"
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
export default {
    name:'LoginRegister',
    data() {
        return {
            checked:false,
            btnText:'发送验证码',
            vCodeBtn:true,
            go:false,
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
        cancel(){
            this.checked = false;
        },
        // 跳转到条款详情
        jumpGo(){
            this.$router.push({path:'/agreenMent'})
        },
        // 显示条款弹框
        showGo(){
            this.go  = true;
        },
        register(){
            this.$router.push({path:'/login/register'})
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
            this.$axios.post('/passport/vcode',{is_username:0,username:this.form.username}).then(res => {
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
            if(!this.checked){
                this.$Toast('请阅读用户服务协议及隐私政策')
                return;
            }
            this.$axios.post('/user/register',this.form).then(res => {
                if(res.status == 200){
                    this.$Toast('注册成功');
                    this.$router.push('/login/index')
                }else {
                    this.$Toast(res.message)
                }
            })
        },
        junpLogin(){
            this.$router.push('/login/index')
        }
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
    .password,.v-code {
        margin-top: 20px;
    }
    .v-code-btn {
        padding-left: 8px;
        border-left: 1px solid #EBEEF5;
        font-size: 14px;
        color: #F2C81F;
    }
    .handle {
        margin-top:14px;
        font-size:12px;
        display: flex;
        justify-content: space-between;
    }
    .handle > span:nth-child(1) {
        color:#888888;
    }
    .handle > span:nth-child(2),.agreenment span {
        color:#F2C81F;
    }
    .agreenment {
        margin-top:15px;
        color: #888888;
        text-align: center;
        font-size: 13px;
        width: 100%;
    }
    .jump-login {
        float:right;
        margin-top:10px;
        color:#F2C81F;
        font-size:13px;
    }
</style>