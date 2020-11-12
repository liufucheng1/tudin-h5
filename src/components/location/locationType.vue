<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">定位模式</p>
        </div>
        <van-radio-group v-model="form.locate_mode" checked-color="#FDD100">
            <van-cell-group>
                <van-cell title="省电模式" clickable @click="setLocate(1)" label="仅打开APP时定位，无安全区域通知，电量消耗小">
                    <van-radio slot="right-icon" :name="1" />
                </van-cell>
                <van-cell title="普通模式" clickable @click="setLocate(2)" label="普通频率自动定位，电量消耗适中">
                    <van-radio slot="right-icon" :name="2" />
                </van-cell>
                <van-cell title="性能模式" clickable @click="setLocate(3)" label="高频率自动定位，电量消耗大">
                    <van-radio slot="right-icon" :name="3" />
                </van-cell>
            </van-cell-group>
        </van-radio-group>
    </div>
</template>
<script>
import db from '../../plugins/db'
export default {
    name:'LocationType',
    data() {
        return {
            loading:null,
            form:{
                locate_mode:'',
                imei_sn:''
            }
        }
    },
    created() {
        this.getLocation();
    },
    computed: {
        deviceInfo(){
            this.$store.dispatch('getDeviceInfo');
            return this.$store.state.deviceInfo;
        }
    },
    methods: {
        // 返回按钮
        back(){
            this.$router.back();
        },
        // 获取定位类型
        getLocation(){
            this.form.locate_mode = parseInt(db.get('locate_mode'))
        },
        setLocate(type){
            this.form.locate_mode = type;
            this.form.imei_sn = this.deviceInfo.imei_sn;
            this.loading = this.$Toast.loading({
                duration:0,//不自动消失
                message:'加载中...',
                forbidClick: true,//加载的时候禁止其他屏幕操作
                loadingType: 'spinner'
            })
            this.$axios.put('/device/locatemode',this.form).then(res => {
                this.loading.clear();
                this.loading = null;
                this.$Toast(res.message);
            })
        }
    },
}
</script>
<style scoped>
</style>