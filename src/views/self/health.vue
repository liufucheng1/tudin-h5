<template>
    <div>
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">健康管家</p>
        </div>
        <div class="health-content">
            <!-- 今日最体温展示 -->
            <div  class="health-top">
                <div :style=" { backgroundImage: 'url(' + topBg + ')' } " >
                    <div v-if="JSON.stringify(health.latest_temperature) != '{}'">
                        <p>今日体温</p>
                        <p><span class="today-health-num">{{ health.latest_temperature.temperature }}</span><span>℃</span></p>
                        <p class="top-tool" :class="warning?'is-warning':'no-warning'">
                            {{ warning?'异常':'正常' }}
                        </p>
                    </div>
                    <p v-else>
                        今天还没有测量体温哟～
                    </p>
                </div>
            </div>
            <div class="health-bottom">
                <ul class="health-list-wrap">
                    <li class="health-list border-1px" @click="healthDetail(health.day_temperature.date)"  v-if="health.day_temperature && health.day_temperature.status">
                        <p class="health-list-left">
                            <span>
                                {{ health.day_temperature.date | formatDate }}
                            </span>
                            <span :class="{ 'list-is-warning' : health.day_temperature.status == 2 }">
                                {{ health.day_temperature.status == 1 ? '体温正常' : (health.day_temperature.status == 0 ? '暂无数据' : '体温异常') }}
                            </span>
                        </p>
                        <p class="health-list-right" :class="{ 'no-health' : health.day_temperature.number == 0 }">
                            {{ '测量' + health.day_temperature.number + '次' }}
                        </p>
                    </li>
                    <li v-for="(item,index) in health.list" :key="index" class="health-list border-1px" @click="healthDetail(item.date)">
                        <p class="health-list-left">
                            <span>
                                {{ item.date | formatDate }}
                            </span>
                            <span :class="{ 'list-is-warning' : item.status == 2 }">
                                {{ item.status == 1 ? '体温正常' : (item.status == 0 ? '暂无数据' : '体温异常') }}
                            </span>
                        </p>
                        <p class="health-list-right" :class="{ 'no-health' : item.number == 0 }">
                            {{ '测量' + item.number + '次' }}
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Health',
    data() {
        return {
            warning:false,
            health:{
                list:[],
                latest_temperature:{}
            },
        }
    },
    computed: {
        // 判断背景图片
        topBg:function(){
            if(this.warning){
                return 'https://store.cdn.xu5g.com/health_unusual_bg.png'
                
            }else {
                return 'https://store.cdn.xu5g.com/health_normal_bg.png'
            }
        }
    },
    created(){
        this.getData()
        
    },
    methods: {
        // 设置loading
        setLoading(){
            this.loading = this.$toast.loading({
                duration:0,//不自动消失
                message:'加载中...',
                forbidClick: true,//加载的时候禁止其他屏幕操作
                loadingType: 'spinner'
            })
        },
        // 清楚loading
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
        healthDetail(date){
            this.$store.dispatch('getDeviceInfo');
            let imei_sn = this.$store.state.deviceInfo.imei_sn;
            this.$router.push({
                path:'/health/detail',
                query:{
                    date,
                    imei_sn
                }
            })
        },
        getData(){
            this.setLoading();
            this.$store.dispatch('getDeviceInfo');
            let imei_sn = this.$store.state.deviceInfo.imei_sn;
            this.$axios.get('/temperature/statistic', { imei_sn }).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.health = res.data;
                    console.log(this.health)
                    if(this.health.latest_temperature.measuring_time){
                        if(this.health.latest_temperature.status == 1){
                            this.warning = false
                        }else {
                            this.warning = true
                        }
                    }else {
                        this.warning = false
                    }
                }else {
                    this.$toast(res.message)
                }
            })
        }
    },
    filters: {
        formatDate: function(value){
            let newVal = value.split('-');
            let nowYear = new Date().getFullYear()
            if(newVal[0] == nowYear){
                return newVal[1] + '-' + newVal[2]
            }else {
                return value
            }
        }
    }
}
</script>
<style scoepd>
    .health-content {
        padding-top: 44px;
    }
    .health-top {
        background: #ffffff;
        padding: 20px;
    }
    .health-top > div {
        font-size: 14px;
        color: #ffffff;
        height: 196px;
        width: 196px;
        background-size: 100% 100%;
        background-position: center;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .health-top > div > p {
        padding:  0 40px;
        text-align: center;
    }
    .health-top > div > div {
        padding: 40px 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }
    .today-health-num {
        font-size: 32px;
    }
    .top-tool {
        padding: 4px 15px;
        font-size: 12px;
        border-radius: 12px;
        
    }
    .is-warning {
        background: #FDE8E6;
        color: #F25F57;
    }
    .no-warning {
        background: #FEF0CC;
        color: #E47A0E;
    }


    .health-bottom {
        margin-top: 10px;
        padding: 0 10px;
        font-size: 14px;
    }
    .health-list-wrap {
        background: #ffffff;
        border-radius: 6px;
    }
    .health-list {
        padding: 20px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .health-list-left > span:nth-child(1) {
        padding-right: 10px;
        border-right: 1px solid #F4F4F4;
        margin-right: 10px;
    }
    .health-list-right {
        padding: 4px 15px;
        background: #F9F9F9;
        border-radius: 12px;
        font-size: 12px;
    }
    .no-health {
        color: #999999;
    }
    .list-is-warning {
        color: #E11D1D;
    }
</style>