<template>
    <div class="login-home-index">
        <div class="username">
            <van-field left-icon="contact" type="number" clearable class="inpf" v-model="form.username" placeholder="请输入手机号" />
        </div>
        <div class="password">
            <van-field  left-icon="comment-o" clearable class="inpf" type="password" v-model="form.password" placeholder="请输入密码" />
        </div>
        <td-button style="margin-top:20px" text="登 录" @click="onSubmit"></td-button>
        <div class="handle">
            <span @click="forget">忘记密码？</span>
            <span @click="register">新用户注册</span>
        </div>
        <div class="agreenment">
            登录即代表您同意<span @click="showGo">《兔盯守护协议及隐私政策》</span>
        </div>
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
import db from '../../plugins/db'
export default {
    name:'Loginindex',
    data() {
        return {
            path:'',
            go:false,
            form:{
                username:'',
                password:''
            },
            loginLoading:null
        }
    },
    created() {
        this.path = this.$route.query.path;
    },
    methods: {
        forget(){
            this.$router.push({path:'/forget'})
        },
        cancel(){
            this.$router.back();
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
        onSubmit(){
            if(this.form.username == ''){
                this.$Toast('请输入手机号')
                return;
            }
            if(!fun.isMobile(this.form.username)){
                this.$Toast('请输入正确的手机号');
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
            this.loginLoading = this.$Toast.loading({
                duration:0,//不自动消失
                message:'登陆中...',
                forbidClick: true,//加载的时候禁止其他屏幕操作
                loadingType: 'spinner'
            })
            this.$axios.post('/user/login',this.form).then(res => {
                this.loginLoading.clear();
                this.loginLoading = null;
                if(res.status == 200){
                    db.set('user',res.data);
                    db.set('token',res.data.token);
                    this.$Toast('登陆成功');
                    this.$store.dispatch('loginStatus',true);
                    if(this.path){
                        this.$router.push({
                            path:this.path
                        })
                    }else {
                        this.$router.push({path:'/safety'})
                    }
                }else {
                    this.$Toast(res.message)
                }
            })
        }
    },
}
</script>
<style scoped>
    .login-home-index {
        width:80.27vw;
        margin:0 auto;
    }
    .username,.password {
        overflow: hidden;
        border-radius: 8px;
        border: 1px solid rgba(239,239,244,1);
    }
    .password {
        margin-top: 20px;
    }
    .handle {
        margin-top:14px;
        font-size:13px;
        display: flex;
        justify-content: space-between;
    }
    .handle > span:nth-child(1) {
        color:#888888;
    }
    .handle > span:nth-child(2),.agreenment > span {
        color:#F2C81F;
    }
    .agreenment {
        color: #888888;
        text-align: center;
        font-size: 13px;
        position: fixed;
        bottom: 10px;
        left: 0;
        width: 100%;
    }
    
</style>