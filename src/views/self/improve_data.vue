<template>
    <div>
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">完善资料</p>
        </div>
        <div class="improve-data">
            <div class="field">
                <van-field maxlength="4" clearable class="inpf" v-model="form.truename" placeholder="请输入昵称(4字以内)" ></van-field>
            </div>
            <div class="field">
                <van-field maxlength="11" type="number" clearable class="inpf" v-model="form.mobile" placeholder="请输入手机号" ></van-field>
            </div>
            <div class="field">
                <van-field maxlength="4" class="inpf" type="number" v-model="form.vcode" placeholder="请输入验证码" >
                    <span @click="sendCode" class="v-code-btn" slot="button"> {{ btnText }} </span>
                </van-field>
            </div>
            <div class="submit">
                <td-button text="提 交" @click="onSubmit"></td-button>
            </div>
        </div>
    </div>
</template>
<script>
import db from '@/plugins/db.js'
import fun from '@/plugins/functions.js'
export default {
    name:'ImproveData',
    data() {
        return {
            form:{
                truename:'',
                mobile:'',
                vcode:''
            },
            btnText:'获取验证码',
            timer:null,
            isCode:false,
            loading:null
        }
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        setLoading(mes){
            this.loading = this.$toast.loading({
                duration:0,//不自动消失
                message:mes,
                forbidClick: true,//加载的时候禁止其他屏幕操作
                loadingType: 'spinner'
            })
        },
        clearLoading(){
            this.loading.clear();
            this.loading = null;
        },
        // 获取用户信息
        getUserInfo(){
            let userInfo = db.get('user');
            this.form.truename = userInfo.trurname;
            this.form.mobile = userInfo.mobile;
        },
        back(){
            //后退
            this.$router.back();
        },
        // 发送验证码
        sendCode(){
            if(this.isCode){
                return;
            }
            if(!fun.isMobile(this.form.mobile)){
                this.$toast.fail('请填写手机号')
                return
            }
            this.setLoading('发送中...')
            this.$axios.post('/sms/code',{ type:1,mobile:this.form.mobile }).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.$toast('发送成功')
                    this.sendCodeSuccess();
                }else {
                    this.$toast.fail(res.message)
                }
            })
            
        },
        // 验证码发送成功之后的处理  创建计时器
        sendCodeSuccess(){
            this.isCode = true;
            let count = 60;
            this.timer = setInterval(() => {
                count -- ;
                this.btnText = count + 's后重发'
                if(count <= 0){
                    this.btnText = '重新发送'
                    clearInterval(this.timer);
                    this.isCode = false;
                }
            },1000)
        },
        //提交
        onSubmit(){
            for(let item in this.form){
                if (!this.form[item]) {
                    this.$toast.fail('请先完善表单!');
                    return
                }
            }
            this.setLoading('修改中...')
            this.$axios.put('/member/perfectinfo',this.form).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.$toast.success('操作成功');
                    let user = db.get('user');
                    user.truename = this.form.truename;
                    user.mobile = this.form.mobile;
                    db.set('user',user);
                    this.$router.back();
                }else {
                    this.$toast.fail(res.message)
                }
            })
        }
    },
}
</script>
<style scoped>
    .improve-data {
        min-height: 100vh;
        padding: 55px 20px 0;
        background: #ffffff;
    }
    .field {
        margin-top: 20px;
        border-radius: 6px;
        overflow: hidden;
        background: #F8F8F8;
    }
    .inpf {
        background: #F8F8F8;
    }
    .v-code-btn {
        letter-spacing: 1px;
        padding: 0 8px 0 15px;
        border-left: 1px solid #EBEEF5;
        font-size: 14px;
        color: #F2C81F;
    }
    .submit {
        padding-top: 80px;
    }
</style>