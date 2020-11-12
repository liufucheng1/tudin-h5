<template>
    <div class="device-list__wrap">
        <div class="device-list">
            <p class="device-list-title">
                <span>切换设备</span>
                <span @click="closeDeviceList">关闭</span>
            </p>
            <van-radio-group v-model="imei_sn" checked-color="#FDD100">
                <van-cell-group>
                    <van-cell clickable v-for="(item,index) in devices" :key="index" @click="setDevice(item)">
                        <div class="device-list-info">
                            <img :src="item.avatar" alt="">
                            <span v-text="item.nick"></span>
                        </div>
                        <van-radio slot="right-icon" :name="item.imei_sn" />
                    </van-cell>
                    <van-cell clickable @click="addDevice()">
                        <div class="create-device">
                            <div>
                                <img src="https://store.cdn.xu5g.com/shh5_add_contacts_icon@2x.png" alt="">
                                <span>添加设备</span>
                            </div>
                            <div>
                                <img src="https://store.cdn.xu5g.com/shh5_add_admin.png" alt="">
                            </div>
                        </div>
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
        </div>
    </div>
</template>
<script>
import db from '../../plugins/db.js'
export default {
    name:'DeviceList',
    data() {
        return {
           imei_sn:''
        }
    },
    computed: {
        devices(){
            return this.$store.state.devices
        }
    },
    created() {
        if(this.$store.state.deviceInfo){
            this.imei_sn = this.$store.state.deviceInfo.imei_sn;
        }
    },
    methods: {
        // 点击选框之后
        setDevice(item) {
            if(this.$store.state.deviceInfo.imei_sn != item.imei_sn){
                this.imei_sn = item.imei_sn
                db.set('deviceInfo',item)
                this.$store.dispatch('getDeviceInfo');
                this.$emit('on-success')
                this.getModules(item.imei_sn)
            }
            this.closeDeviceList();
        },
        // 获取权限列表
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
        // 关闭设备列表
        closeDeviceList(){
            this.$store.dispatch('setShowDeviceList',false);
        },
        addDevice(){
            this.closeDeviceList();
            this.$router.push({
                path:'/deviceCreate'
            })
        },
    },
}
</script>
<style socped>
    .device-list__wrap {
        width: 100%;
        height: 100vh;
        position: fixed;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 5;
    }
    .device-list {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
    }
    .device-list-title {
        width: 100%;
        padding: 16px;
        background: #F4F4F4;
        display: flex;
        justify-content: space-between;
    }
    .device-list-title > span:nth-child(1) {
        font-size: 14px;
        color: #666666;
    }
    .device-list-title > span:nth-child(2) {
        font-size: 14px;
        color: #333333;
    }
    .device-list-info,.create-device > div:nth-child(1) {
        display: flex;
        align-items: center;
    }
    .device-list-info > img,.create-device > div:nth-child(1) > img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 8px;
    }
    .create-device {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .create-device > div:nth-child(2){
        width: 25px;
        height: 25px;
    }
    .create-device > div:nth-child(2) > img {
        width: 100%;
        height: 100%;
    }
</style>