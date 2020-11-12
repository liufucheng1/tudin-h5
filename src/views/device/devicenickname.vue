<template>
    <div>
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">昵称设置</p>
        </div>
        <div class="user-nickname-wrap">
            <p>请输入设备昵称：</p>
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
            deviceInfo:'',
            loading:null
        }
    },
    created() {
        this.getDeviceInfo();
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
            this.deviceInfo.nick = this.nickname;
            this.setLoading();
            this.$axios.put('/device/info',this.deviceInfo).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.$Toast('修改成功')
                    let device = db.get('deviceInfo')
                    device.nick = this.deviceInfo.nick;
                    db.set('deviceInfo',device);
                    this.$store.dispatch('getDeviceInfo')
                    // 信息修改成功之后
                    this.getDevices();
                    this.back();
                }else {
                    this.$Toast(res.message);
                    this.getDeviceInfo();
                }
            })
        },
        getDevices(){
            this.$axios.get('/family/devices').then(res => {
                if(res.status == 200){
                    this.$store.dispatch('setDevices',res.data)
                }else {
                    this.$toast(res.message)
                }
            })
        },
        getDeviceInfo(){
            this.$store.dispatch('getDeviceInfo');
            this.deviceInfo = {
                imei_sn:this.$store.state.deviceInfo.imei_sn,
                avatar:this.$store.state.deviceInfo.avatar,
                ship:this.$store.state.deviceInfo.relation,
                nick:this.$store.state.deviceInfo.nick,
                device_mobile:this.$store.state.deviceInfo.device_mobile
            }
        },
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