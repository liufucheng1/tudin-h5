<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">定位时间</p>
        </div>
        <ul>
            <li class="options" @click="selectTime('start')">
                <p class="option-icon">
                    <span>{{ form.start }}</span>
                    &nbsp;
                    <van-icon class="icon" name="arrow" size="17" />
                </p>
                <p>开始时间</p>
            </li>
            <li class="options" @click="selectTime('end')">
                <p class="option-icon">
                    <span>{{ form.end }}</span>
                    &nbsp;
                    <van-icon class="icon" name="arrow" size="17" />
                </p>
                <p>结束时间</p>
            </li>
        </ul>
        <p class="tooltip">{{ '设备在' + form.start + '到' + form.end + '主动上报定位，其余时间为休眠时间' }}</p>
        <div class="on-submit">
            <td-button :disabled="false" text="确定" @click="setTime()"></td-button>
        </div>
        <div class="time-picker" v-show="showTimePicker">
            <van-datetime-picker
            @confirm="confirm"
            @cancel="cancel"
            class="van-time"
            v-model="currentTime"
            type="time"/>
        </div>
    </div>
</template>
<script>
import db from '../../plugins/db'
export default {
    name:'LocationTime',
    data() {
        return {
            type:'',
            showTimePicker:false,
            currentTime:'12:00',
            loading:'',
            form:{
                imei_sn:'',
                start:'',
                end:''
            }
        }
    },
    computed: {
        deviceInfo(){
            this.$store.dispatch('getDeviceInfo');
            return this.$store.state.deviceInfo
        }
    },
    created() {
        this.getTime();
    },
    methods: {
        // 返回按钮
        back(){
            this.$router.back();
        },
        // 获取开始时间以及结束时间
        getTime(){
            let udtime = db.get('udtime');
            this.form.start = udtime.start;
            this.form.end = udtime.end
        },
        // 选择时间按钮
        selectTime(type){
            this.showTimePicker = true;
            this.type = type;
            if(type == 'start'){
                this.currentTime = this.form.start;
            }else if(type == 'end'){
                this.currentTime = this.form.end
            }
        },
        // 日期选择器的确定按钮
        confirm(val){
            if(this.type == 'start'){
                this.form.start = val
            }else if(this.type == 'end'){
                this.form.end = val
            }
            this.showTimePicker = false;
        },
        cancel(){
            this.showTimePicker = false;
        },
        setTime(){
            this.form.imei_sn = this.deviceInfo.imei_sn;
            this.loading = this.$Toast.loading({
                duration:0,//不自动消失
                message:'加载中...',
                forbidClick: true,//加载的时候禁止其他屏幕操作
                loadingType: 'spinner'
            })
            this.$axios.put('/device/udtime',this.form).then(res => {
                this.loading.clear();
                this.loading = null;
                this.$Toast(res.message);
            })
        }
    },
}
</script>
<style scoped>
    .option-icon > span {
        vertical-align: middle;
    }
    .icon {
        vertical-align: middle;
    }
    .tooltip {
        margin-top: 15px;
        /* text-align: center; */
        color: #999999;
        font-size: 14px;
    }
    .on-submit {
        margin-top: 30px;
        padding: 30px;
    }
    .time-picker {
        position: fixed;
        bottom: 0;
        left: 0;
        height:100vh;
        width: 100%;
        background: rgba(0, 0, 0, 0.4);
    }
    .van-time {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
    }
</style>