<template>
    <div>
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">测量数据</p>
        </div>
        <div class="health-detail-content" v-if="data.length > 0">
            <div>
                <div class="health-detail-list" v-for="(item,index) in data" :key="index">
                    <div class="health-detail-data">
                        <p class="health-detail-data-lift">
                            <span class="line-dot" :class="{ 'is-warning-dot' : item.status == 2 }"></span>
                            <span class="health-detail-time">
                                {{ item.measuring_time | formatTime }}
                            </span>
                            <span class="health-detail-number"  :class="{ 'is-warning-text' : item.status == 2 }">
                                {{ item.temperature + '℃' }}
                            </span>
                        </p>
                        <p class="health-detail-data-right"  :class="{ 'is-warning-text' : item.status == 2 }">
                            {{ item.status == 1?'正常':'异常' }}
                        </p>
                    </div>
                    <div class="health-line" v-if="index != data.length - 1"></div>
                </div>
            </div>
        </div>
        <div class="no-data" v-if="isData">
            <img src="https://store.cdn.xu5g.com/no_warnings.png">
            <p>当日暂无体温数据</p>
        </div>
    </div>
</template>
<script>
export default {
    name:'HealthDetail',
    data() {
        return {
            data:[],
            isData:false
        }
    },
    created() {
        this.getData();
    },
    methods: {
        back(){
            this.$router.go(-1)
        },
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
        getData(){
            this.setLoading();
            let imei_sn = this.$route.query.imei_sn;
            let date = this.$route.query.date;
            this.$axios.get('/temperature/day',{ imei_sn, date }).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.data = res.data;
                    if(this.data.length > 0){
                        this.isData = false
                    }else {
                        this.isData = true
                    }
                }else {
                    this.$toast(res.message)
                }
            })
        }
    },
    filters: {
        // 格式化时间
        formatTime: function(value) {
            let newValue = value.split(' ')[1]
            let newArr = newValue.split(':');
            return newArr[0] + ':' + newArr[1]
        }
    }
}
</script>
<style scoped>
    .health-detail-content {
        padding: 44px 10px 0;
        font-size: 14px;
    }
    .health-detail-content > div {
        margin-top: 10px;
        border-radius: 6px;
        background: #ffffff;
        padding: 15px;
    }
    .health-detail-data {
        display: flex;
        justify-content: space-between;
    }
    .health-detail-data-lift {
        display: flex;
        align-items: center;
    }
    .health-detail-time {
        margin-left: 8px;
    }
    .health-detail-number {
        margin-left: 20px;
    }
    .line-dot {
        display: inline-block;
        width: 15px;
        height: 15px;
        background: #A8A8A8;
        border: 3px solid #F3F3F3;
        border-radius: 50%;
    }
    .health-line {
        height: 38px;
        margin-left: 7px;
        border-left: 1px solid #EFEFEF;
    }
    .is-warning-dot {
        background: #E11D1D;
        border-color: #FFDBDB;
    }
    .is-warning-text {
        color: #E11D1D;
    }


    .no-data {
        padding-top: 59px;
        text-align: center;
    }
    .no-data > img {
        width: 246px;
        margin-bottom: 30px;
    }
    .no-data > p {
        color: #666666;
        font-size: 14px;
    }
</style>