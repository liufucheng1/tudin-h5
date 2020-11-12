<template>
    <div>
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">昵称设置</p>
        </div>
        <div class="user-nickname-wrap">
            <p>请输入昵称：</p>
            <div class="nick-name">
                <van-field type="text" maxlength="4" clearable class="inpf" v-model="nickname" placeholder="最多四个汉字" />
            </div>
            <td-button :disabled="disabled" text="提 交" @click="onSubmit"></td-button>
        </div>
        
    </div>
</template>
<script>
import db from '../../plugins/db'
export default {
    name:'UserNickname',
    data() {
        return {
            disabled:true,
            nickname:'',
            userInfo:'',
            loading:null
        }
    },
    created() {
        this.userInfo = db.get('user')
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
            this.$router.go(-1)
        },
        onSubmit(){
            this.userInfo.truename = this.nickname;
            this.setLoading();
            this.setLoading();
            this.$axios.put('/member',this.userInfo).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.$toast.success('操作成功');
                    db.set('user',this.userInfo);
                    let appid = db.get('appid');
                    let newUserInfo = JSON.stringify(this.userInfo);
                    // console.log(newUserInfo)
                    localStorage.setItem('appid_' + appid + '_user',newUserInfo)
                    this.back();
                }else {
                    this.$toast.fail(res.message)
                }
            })
        }
    },
    watch: {
        nickname:function(){
            if(!this.nickname || this.nickname == ' ' || this.nickname == '  ' || this.nickname == '   ' || this.nickname == '    '){
                this.disabled = true;
            }else {
                this.disabled = false;
            }
        }
    },
}
</script>
<style scoped>
    .user-nickname-wrap {
        min-height: 100vh;
        background: #ffffff;
        padding: 59px 15px 0;
    }
    .nick-name {
        margin-bottom:30px;
        background: #F8F8F8;
        overflow: hidden;
        border-radius: 8px;
        border: 1px solid rgba(239,239,244,1);
    }
    .inpf {
        background: #F8F8F8;
    }
    .user-nickname-wrap > p {
        padding-bottom: 15px;
    }
</style>