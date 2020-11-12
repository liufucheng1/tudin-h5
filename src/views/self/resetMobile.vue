<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">绑定手机号</p>
        </div>
        <p class="discribe">
            {{ discribe }}
        </p>
        <div class="username" v-show="!isCode">
            <van-field maxlength="11" v-model="form.mobile" type="digit" placeholder='请输入手机号'/>
        </div>
        <div class="v-code" v-show="isCode"> 
            <van-field v-model="form.vcode" maxlength="4" type="digit" placeholder="请输入验证码"></van-field>
        </div>
        <div class="btn">
            <td-button :text="btnText" @click="onSubmit()"></td-button>
        </div>
        <p v-if="isCode" class="resend">
           <span @click="sendCode()">
                {{ resend }}
           </span>
        </p>
    </div>
</template>
<script>
import fun from '../../plugins/functions'
import db from '../../plugins/db'
export default {
    name:'MobileWrap',
    data() {
        return {
            isCode:false,
            discribe:'请输入要绑定的手机号',
            btnText:'下一步',
            resend:'60s后重新发送',
            sendBtn:false,
            timer:null,
            form:{
                mobile:'',
                vcode:''
            }
        }
    },
    created() {
        
    },
    methods: {
        setLoading(){
            this.loading = this.$toast.loading({
                duration:0,//不自动消失
                message:'加载中...',
                forbidClick: true,//加载的时候禁止其他屏幕操作
                loadingType: 'spinner'
            })
        },
        clearLoading(){
            this.loading.clear();
            this.loading = null;
        },
        back(){
            this.$router.back();
        },
        onSubmit(){
            if(!this.isCode){
                if(!this.form.mobile){
                    this.$toast('手机号不能为空');
                    return;
                }
                if(!fun.isMobile(this.form.mobile)) {
                    this.$toast('请输入正确的手机号码');
                    return;
                }
                this.getCode();
            }else {
                if(!this.form.vcode){
                    this.$toast('请输入验证码');
                    return;
                }
                this.setData();
            }
        },
        getCode(){
            this.setLoading();
            this.$axios.post('/sms/code',{mobile:this.form.mobile,type:1}).then(res => {
                this.clearLoading();
                this.$toast(res.message);
                if(res.status == 200){
                    this.isCode = true;
                    this.sendBtn =  false;
                    this.reCode();
                }
            })
        },
        sendCode(){
            if(!this.sendBtn){
                return
            }else {
                this.getCode();
            }
        },
        reCode(){
            var count = 59;
            this.timer = setInterval(() => {
                this.resend = count + 's后重新发送';
                count -- ;
                if(count < 0 || count == 0){
                    clearInterval(this.timer);
                    this.timer = null;
                    this.resend = '重新发送';
                    this.sendBtn = true;
                }
            },1000)
        },
        setData(){
            this.$axios.put('/member/bindmobile',this.form).then(res => {
                this.$toast(res.message)
                if(res.status == 200){
                    let user = db.get('user');
                    user.mobile = this.form.mobile;
                    db.set('user',user)
                    this.back();
                }
            })
        }
    },
    watch: {
        isCode:function(){
            if(this.isCode){
                this.discribe = '验证码已经发送至' + this.form.mobile + ' , 请查收'
                this.btnText = '完成'
            }else {
                this.discribe = '请输入手机号'
                this.btnText = '下一步'
            }
        }
    },
}
</script>
<style scoped>
    .discribe {
        padding: 15px;
        font-size: 14px;
    }
    .btn {
        padding: 0 30px;
        margin-top: 50px;
    }
    .resend {
        font-size: 14px;
        margin-top: 25px;
        color: #999999;
        text-align: center;
    }
</style>