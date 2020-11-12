<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">血压</p>
        </div>
        <div class="step_num">
            <img src="https://store.cdn.xu5g.com/tdsh_h5_heart_bg.png" alt="">
            <div>
                <p class="blood-title">血压</p>
                <p class="blood-rate">
                    {{ blood_rate.low + '~' + blood_rate.high }}
                </p>
                <p class="blood-tool">
                    <span>(最低)</span>
                    <span>(最高)</span>
                </p>
            </div>
        </div>
        <div class="echarts">
            <div class="echart-tool" v-show="data">
                <p>
                    <span class="high"></span>
                    <span>最高</span>
                </p>
                <p>
                    <span class="low"></span>
                    <span>最低</span>
                </p>
            </div>
            <p class="no-data-tool" v-if="noDataTool">今日暂无血压数据</p>
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
            blood_rate:{
                low:0,
                high:0
            },
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
            this.$axios.get('/device/bloods',{ imei_sn, start_time }).then(res => {
                this.clearLoading();
                if (res.status == 200) {
                    if(res.data.length > 0){
                        let rate = res.data[res.data.length - 1].blood_rate.split('-')
                        let obj = {
                            low:rate[0],
                            high:rate[1]
                        }
                        this.blood_rate = obj
                    }else {
                        this.noDataTool = true;
                    }
                    let xAxis = [];
                    let yAxis = [];
                    let low = [];
                    let high = [];
                    for(let item of res.data){
                        let arr_date = item.create_time.split(' ')[1].split(':')
                        let str_date = arr_date[0] + ':' + arr_date[1];
                        xAxis.push(str_date);
                        let yrate = item.blood_rate.split('-');
                        low.push(yrate[0]);
                        high.push(yrate[1])
                    }
                    yAxis.push(high);
                    yAxis.push(low)
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
        text-align: center;
    }
    .blood-title {
        font-size: 14px;
    }
    .blood-rate {
        color: #fdd100;
        font-size: 30px;
        font-weight: 500;
    }
    .blood-tool {
        width: 100%;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        color: #999999;
    }
    .echarts {
        width: 300px;
        margin: 25px auto 0;
        position: relative;
    }
    .echart-tool {
        position: absolute;
        top: -40px;
        right: 30px;
    }
    .echart-tool > p > span {
        vertical-align: middle;
        font-size: 12px;
    }
    .echart-tool > p > span:nth-child(1) {
        display: inline-block;
        height: 3px;
        width: 24px;
        border-radius: 1px;
        margin-right: 3px;
    }
    .low {
        background: #93D3F5;
    }
    .high {
        background: #FDD100;
    }
    .health-tool {
        width: 300px;
        margin: 0 auto;
        font-size: 12px;
        color: #999999;
        letter-spacing: 1px;
        line-height: 15px;
    }
    .no-data-tool {
        position: absolute;
        top: 30%;;
        left: 50%;
        transform: translate(-50%,-50%);
        font-size: 14px;
    }
</style>