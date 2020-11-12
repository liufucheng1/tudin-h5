<template>
    <div class="device-create-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">添加设备</p>
        </div>
        <div class="device-imei">
            <van-field type="number" max clearable class="inpf" v-model="form.imei_sn" placeholder="请输入设备IMEI号码" />
        </div>
        <div class="device-mobile">
            <van-field type="number" maxlength="11" clearable class="inpf" v-model="form.mobile" placeholder="请输入设备手机号" />
        </div>
        <div class="device-nick">
            <van-field type="text" maxlength="4" clearable class="inpf" v-model="form.truename" placeholder="请输入设备昵称（4字以内）" />
        </div>
        <td-button :disabled="disabled" text="添 加" @click="onSubmit"></td-button>
    </div>
</template>
<script>
import fun from '../../plugins/functions.js'
import db from '../../plugins/db.js'
export default {
    name:'DeviceCreate',
    data() {
        return {
            disabled:true,
            path:'',
            form:{
                imei_sn:'',
                mobile:'',
                truename:''
            },
            loading:null
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
            if(!fun.isMobile(this.form.mobile)){
                this.$Toast('请输入正确的手机号');
                return;
            }
            if(this.form.truename.length > 4){
                this.$Toast('设备昵称不能超过四个字符');
                return;
            }
            this.setLoading();
            this.$axios.post('/device/bind',this.form).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.$Toast('添加成功');
                    // 设备添加成功之后，获取设备列表
                    this.getDevices();
                    this.$router.back();
                }else {
                    this.$Toast(res.message);
                }
            })
        },
        getDevices(){
            this.$axios.get('/family/devices').then(res => {
                if(res.status == 200){
                    this.$store.dispatch('setDevices',res.data);
                    for(let item of res.data){
                        if(item.imei_sn == this.form.imei_sn){
                            db.set('deviceInfo',item);
                            this.$store.dispatch('getDeviceInfo')
                            this.getNoticeCount(item.imei_sn);
                            this.getModules(item.imei_sn)
                        }
                    }
                }else {
                    this.$toast(res.message)
                }
            })
        },
        // 获取设备的未读消息数
        getNoticeCount(imei_sn){
            this.$axios.get('/warns/unread',{ imei_sn }).then(res => {
                if (res.status == 200) {
                    this.$store.dispatch('setUnread',res.data.unread)
                }else {
                    this.$toast(res.message);
                }
            })
        },
        // 获取设备所有有的权限列表
        getModules(imei_sn) {
            this.$axios.get('/device/models',{ imei_sn }).then(res => {
                if(res.status == 200){
                    let modules = [];
                    for(let item of res.data.modules){
                        modules.push(item.alias);
                    }
                    this.$store.dispatch('setModules',modules)
                }
            })
        },
    },
    watch: {
        form: {
            handler(newVal, oldVal) {
                if(this.form.imei_sn != '' && this.form.mobile != '' && this.form.truename != ''){
                    this.disabled = false;
                }else {
                    this.disabled = true;
                };
            },
            deep: true
        }
    }
}
</script>
<style scoped>
    .device-create-wrap {
        background: #ffffff;
        height: 100vh;
        width: 100%;
        margin: 0 auto;
        box-sizing:border-box;
        padding: 59px 15px 0;
    }
    .device-imei, .device-mobile, .device-nick {
        margin-bottom:15px;
        background: #F8F8F8;
        overflow: hidden;
        border-radius: 8px;
        border: 1px solid rgba(239,239,244,1);
    }
    .inpf {
        background: #F8F8F8;
    }
</style>