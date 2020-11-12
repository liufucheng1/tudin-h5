<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">计步</p>
        </div>
        <div class="step_num">
            <img src="https://store.cdn.xu5g.com/tdsh_h5_step_bg.png" alt="">
            <div>
                <p>今日步数</p>
                <p>
                    {{ day_step }}
                </p>
            </div>
        </div>
        <div class="echarts">
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
            day_step:0,
            data:'',
            days:[]
        }
    },
    created() {
        for( let i = 0;i < 7;i++ ){
            this.days.push(fun.getDay(i,'MM-dd'))
        }
        this.days.reverse();
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
            this.$axios.get('/device/step',{ imei_sn }).then(res => {
                this.clearLoading();
                if (res.status == 200) {
                    // 设置今日步数
                    if(res.data.length > 0){
                        let nowDate = fun.format_date(new Date());
                        if(nowDate.split(' ')[0] == res.data[0].create_time.split(' ')[0]){
                            /**如果返回的有今天的步数 */
                            this.day_step = res.data[0].step_rate
                        }else {
                            // 如果没有则赋值为0
                            this.day_step = 0
                        }
                    }
                    // 创建x轴数组，y轴数组，并初始化；
                    let xAxis = [];
                    xAxis = this.days;
                    let secondY = [0,0,0,0,0,0,0];
                    let yAxis = []
                    // 处理时间以及补充时间并添加到x轴数组里面,
                    for(let i = 0;i < res.data.length; i++){
                        let arr_date = res.data[i].create_time.split(' ')[0].split('-')
                        let str_date = arr_date[1] + '-' + arr_date[2];
                        if(xAxis.indexOf(str_date) >=0){
                            secondY[xAxis.indexOf(str_date)] = res.data[i].step_rate;
                        }
                    }
                    yAxis.push(secondY);
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
        min-height: 100vh;
        background: #ffffff;
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
    .step_num > div > p:nth-child(2) {
        text-align: center;
        color: #fdd100;
        font-size: 30px;
        font-weight: 500;
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