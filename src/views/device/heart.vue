<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">心率</p>
        </div>
        <div class="step_num">
            <img src="https://store.cdn.xu5g.com/tdsh_h5_heart_bg.png" alt="">
            <div>
                <p>心率</p>
                <div class="heart-rate">
                    {{ heart_num }}
                    <span class="unit">
                        /分钟
                    </span>
                </div>
            </div>
        </div>
        <div class="echarts">
            <p class="no-data-tool" v-if="noDataTool">今日暂无心率数据</p>
            <step-num v-if="data" :data="data" ></step-num>
        </div>
        <p class="health-tool">
            健康相关信息具有强领域专业性，本产品仅适用于日常检测参考，不可用于疾病的自我诊断，更不可作为用药的依据。如身体不适或检测结果长期不正常请到正规医疗机构做全面的身体检查，并遵循医嘱。
        </p>
    </div>
</template>
<script>
import StepNum from '../../components/echaers/index'
import fun from '../../plugins/functions'
export default {
    components:{ StepNum },
    name:'DeviceStep',
    data() {
        return {
            heart_num:0,
            data:'',
            noDataTool:false,
        }
    },
    created() {
        this.getData();
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
        // 获取数据
        getData(){
            this.setLoading();
            this.$store.dispatch('getDeviceInfo');
            let imei_sn = this.$store.state.deviceInfo.imei_sn;
            let start_time = fun.getLocaltime(1)[1]
            this.$axios.get('/device/hearts',{ imei_sn, start_time }).then(res => {
                this.clearLoading();
                if (res.status == 200) {
                    console.log(res.data)
                    if(res.data.length > 0){
                        this.heart_num = res.data[res.data.length - 1].heart_rate;
                    }else {
                        this.noDataTool = true;
                    }
                    let xAxis = [];
                    let secondY = [];
                    let yAxis = [];
                    for(let item of res.data){
                        let arr_date = item.create_time.split(' ')[1].split(':')
                        let str_date = arr_date[0] + ':' + arr_date[1];
                        xAxis.push(str_date);
                        secondY.push(item.heart_rate);
                    }
                    yAxis.push(secondY)
                    this.data = {
                        xAxis,
                        yAxis
                    }
                }else {
                    this.$toast(res.message);
                }
            })
        },
        // 后退
        back(){
            this.$router.back();
        }
    },
}
</script>
<style scoped>
    .globe-wrap {
        padding-top: 74px;
    }
    .step_num {
        width: 224px;
        position: relative;
        margin: 0 auto;
    }
    .step_num > img {
        width: 100%;
    }
    .step_num > div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .step_num > div > p:nth-child(1) {
        font-size: 14px;
        text-align: center;
    }
    .heart-rate {
        text-align: center;
        color: #fdd100;
        font-size: 30px;
        font-weight: 500;
        position: relative;
    }
    .unit {
        position: absolute;
        bottom: 8px;
        right: -35px;
        font-size: 14px;
        color: #999999;
    }
    .one-minute-ago {
        font-size: 14px;
        color: #999999;
    }
    .echarts {
        width: 300px;
        margin: 25px auto 0;
        position: relative;
    }
    .no-data-tool {
        position: absolute;
        top: 30%;;
        left: 50%;
        transform: translate(-50%,-50%);
        font-size: 14px;
    }
    .health-tool {
        width: 300px;
        margin: 0 auto;
        font-size: 12px;
        color: #999999;
        letter-spacing: 1px;
        line-height: 15px;
    }
</style>