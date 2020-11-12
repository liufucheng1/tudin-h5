<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">省电优化</p>
        </div>
        <ul>
            <li class="options" @click="jump('type')">
                <van-icon class="option-icon" name="arrow" size="17" />
                <p>定位模式</p>
            </li>
            <li class="options" @click="jump('time')">
                <van-icon class="option-icon" name="arrow" size="17" />
                <p>定位时间</p>
            </li>
        </ul>
    </div>
</template>
<script>
import db from '../../plugins/db'
export default {
    name:'DeviceEconomy',
    data() {
        return {
            deviceInfo:null,
            loading:null,
            isUdtime:false
        }
    },
    created() {
        this.$store.dispatch('getDeviceInfo');
        this.deviceInfo = this.$store.state.deviceInfo;
        this.getUdtime();
    },
    methods: {
        // 设置loading
        setLoading(mes){
            this.loading = this.$toast.loading({
                duration:0,//不自动消失
                message:mes,
                forbidClick: true,//加载的时候禁止其他屏幕操作
                loadingType: 'spinner'
            })
        },
        // 清除loading
        clearLoading(){
            this.loading.clear();
            this.loading = null;
        },
        // 后退到我的界面
        back(){
            this.$router.push({
                path:'/self',
            })
        },
        // 跳转  操作按钮
        jump(type){
            if(type == 'type'){
                this.$router.push({
                    path:'/locationType'
                })
            }else if(type == 'time') {
                if(!this.isUdtime){
                    this.$toast('对不起，此设备暂不支持该功能!');
                    return;
                }
                this.$router.push({
                    path:'/locationTime'
                })
            }
        },
        // 获取设备信息
        getUdtime(){
            this.setLoading('加载中...')
            this.$axios.get('/device',{ imei_sn:this.deviceInfo.imei_sn }).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    if(res.data.udtime){
                        this.isUdtime = true
                        let udtime = {
                            start:'',
                            end:''
                        }
                        udtime.start = res.data.udtime.start;
                        udtime.end = res.data.udtime.end;
                        db.set('udtime',udtime)
                    }else {
                        this.isUdtime = false
                    }
                    db.set('locate_mode',res.data.locate_mode)
                }else {
                    this.$toast.fail(res.message)
                }
            })
        }  
    },
}
</script>
<style scoped>
</style>