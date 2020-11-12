<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">家庭管理</p>
        </div>
        <ul>
            <li v-for="(item,index) in list" :key="index" class="manage-list" @click="manageInfo(item)">
                <a class="call" :href="'tel:' + item.mobile">
                    <img src="https://store.cdn.xu5g.com/shh5_call_phone.png" alt="">
                </a>
                <div class="avatar">
                    <img :src="item.avatar" alt="">
                </div>
                <div class="info">
                    <p class="info-top">
                        <span class="treuname">{{ item.truename }}</span>
                        <span class="is-admin" v-if="item.group == 1">管理员</span>
                        <span class="is-admin" v-else-if="item.group == 2">通话成员</span>
                        <span class="is-admin" v-else-if="item.group == 3">普通成员</span>
                    </p>
                    <p class="info-bottom">
                        {{item.mobile}}
                    </p>
                </div>
            </li>
            <li class="manage-list" @click="add">
                <div class="call">
                    <img src="https://store.cdn.xu5g.com/shh5_add_admin.png" alt="">
                </div>
                <div class="avatar">
                    <img src="https://store.cdn.xu5g.com/shh5_add_contacts.png" alt="">
                </div>
                <div class="info">
                    <p class="info-top">
                        <span class="treuname">邀请加入</span>
                    </p>
                </div>
            </li>
            <li class="manage-list" @click="joinFamilies()">
                <div class="call">
                    <img src="https://store.cdn.xu5g.com/shh5_add_admin.png" alt="">
                </div>
                <div class="avatar">
                    <img src="https://store.cdn.xu5g.com/shh5_add_contacts.png" alt="">
                </div>
                <div class="info">
                    <p class="info-top">
                        <span class="treuname">加入家庭组</span>
                    </p>
                </div>
            </li>
        </ul>
        <van-dialog v-model="codeDialog" title="请输入短信邀请码" @cancel="diaCancel('code')" @confirm="editConfirm('code')" show-cancel-button width="285">
            <div class="inp">
                <input maxlength="4" v-model="form.vcode" type="text" placeholder="请输入4位邀请码"  @blur="recover">
            </div>
        </van-dialog>
    </div>
</template>
<script>
import fun from '@/plugins/functions.js'
import db from '@/plugins/db.js'
export default {
    data() {
        return {
            codeDialog:false,
            loading:null,
            list:[],
            form:{
                vcode:'',
                mobile:''
            }
        }
    },
    created() {
        this.getData();
    },
    methods: {
        recover: function() {
            window.scrollTo(0, 0);
        },
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
        // 后退
        back(){
            this.$router.push({
                path:'/self'
            })
        },
        joinFamilies(){
            fun.addDeviceBtn().then(res => {
                if(res){
                    let user = db.get('user');
                    this.form.mobile = user.mobile;
                    this.codeDialog = true;
                }
            })
        },
        // 邀请码弹框的取消按钮
        diaCancel(type){
            if(type == 'code') {
                this.form.vcode = ''
            }
        },
        // 邀请码弹框的确认按钮
        editConfirm(type) {
            if(type == 'code'){
                let str = /^\d{4}$/
                if(!str.test(this.form.vcode)){
                    this.$toast('请输四位数字有效邀请码');
                    return;
                }
                this.setLoading();
                this.$axios.post('/family/getinto',this.form).then(res => {
                    this.clearLoading();
                    this.$toast(res.message);
                    if(res.status == 200){
                        this.getDevices();
                    }
                })
            }
        },
        // 获取设备列表
        getDevices(){
            this.$axios.get('/family/devices').then(res => {
                if(res.status == 200){
                    this.$store.dispatch('setDevices',res.data);
                    if(res.data.length > 1){
                        return;
                    }else {
                        db.set('deviceInfo',res.data[0]);
                        this.$store.dispatch('getDeviceInfo');
                        this.getNoticeCount(res.data[0].imei_sn);
                        this.getModules(res.data[0].imei_sn)
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
        // 获取设备设备的用户列表
        getData(){
            this.setLoading();
            this.$store.dispatch('getDeviceInfo');
            let imei_sn = this.$store.state.deviceInfo.imei_sn
            this.$axios.get('/device/members',{ imei_sn }).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.list = res.data
                }else {
                    this.$toast(res.message);
                }
            })
        },
        manageInfo(item){
            this.$store.dispatch('setRelativeInfo',item)
            this.$router.push({
                path:'/familys/edit',
            })
        },
        add(){
            this.$router.push({
                path:'/familys/create'
            })
        }
    },
}
</script>
<style scoped>
    .manage-list {
        position: relative;
        padding: 8px 15px;
        margin-bottom: 10px;
        overflow: hidden;
        background: #ffffff;
    }
    .call {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
    }
    .call > img {
        width: 28px;
    }
    .manage-list > div {
        display: inline-block;
        vertical-align: middle;
    }
    .avatar {
        margin-right: 15px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        overflow: hidden;
    }
    .avatar > img {
        width: 100%;
        height: 100%;
    }
    .treuname {
        font-size: 14px;
        font-weight: 500;
    }
    .is-admin {
        font-size: 12px ;
        color: #333333;
        margin-left: 20px;
        padding: 2px 8px;
        background: #FDD100;
    }
    .info-bottom {
        margin-top: 5px;
        font-size: 12px;
        color: #999999;
    }
    .inp > input {
        background: #EFEFEF;
        width: 100%;
        font-size: 16px;
        border: none;
    }
    .inp {
        border-radius: 8px;
        overflow: hidden;
        padding: 10px;
        background: #EFEFEF;
        margin: 15px auto;
        width: 241px;
    }
</style>