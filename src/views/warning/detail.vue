<template>
    <div>
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title" v-if="warningDetail.child_name">{{ warningDetail.child_name }}</p>
        </div>
        <div class="warning-detail" v-if="warningDetail">
            <div class="warning-detail-top border-1px">
                <div class="warning-detail-img" :style="{ backgroundImage:'url(' + warningDetail.child_pics[0] + ')' }" @click="showImages()">
                    <p>点击查看大图</p>
                </div>
                <div class="warning-detail-info">
                    <p>{{ '姓名：' + warningDetail.child_name }}</p>
                    <p>{{ '年龄：' + warningDetail.child_age + '周岁' }}</p>
                    <p>{{ '性别：' + (warningDetail.child_gender == 1?'男孩':'女孩') }}</p>
                    <!-- <p>{{ '籍贯：中国郑州' }}</p> -->
                </div>
            </div>
            <div class="warning-detail-bottom">
                <div class="child-lost-info">
                    <img src="https://store.cdn.xu5g.com/shh5_child_lost_time_icon.png" alt="">
                    <p v-text="lostDate(warningDetail.child_lost_time)"></p>
                </div>
                <div class="child-lost-info">
                    <img src="https://store.cdn.xu5g.com/shh5_child_lost_address_icon.png" alt="">
                    <p>{{ warningDetail.child_lost_address }}</p>
                </div>
                <div class="child-lost-info">
                    <img src="https://store.cdn.xu5g.com/shh5_child_lost_content_icon.png" alt="">
                    <p>{{ warningDetail.child_lost_info }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import db from '../../plugins/db'
import fun from '../../plugins/functions'
export default {
    name:'WarningDetail',
    data() {
        return {
            warningDetail:'',
        }
    },
    created() {
        let aid = this.$route.query.warning_aid
        if(aid){
            this.getDetail(aid)
        }
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
        // 后退
        back(){
            db.set('warning_detail',null)
            this.$router.back();
        },
        showImages(){
            this.$imagePreview({
                images: this.warningDetail.child_pics,
                closeable: true,
            })
        },
        getDetail(aid){
            this.setLoading();
            this.$axios.get('/early',{ aid }).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.warningDetail = res.data
                    console.log(res.data)
                }else {
                    this.$toast(res.message)
                }
            })
        },
        // 丢失时间计算
        lostDate(time){
            let date = new Date(parseInt(time)*1000)
            return fun.format_date(date,'yyyy-MM-dd')
        },
    },
}
</script>
<style scoped>
    .warning-detail {
        padding-top: 44px;
        min-height: 100vh;
        background: #ffffff;
    }
    .warning-detail-top,.warning-detail-bottom {
        padding: 20px;
        overflow: hidden;
    }
    .warning-detail-img {
        float: left;
        width: 106px;
        height: 150px;
        border-radius: 4px;
        overflow: hidden;
        background-size: cover;
        background-position: center;
        position: relative;
    }
    .warning-detail-img > p {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.4);
        font-size: 12px;
    }
    .warning-detail-info {
        margin-left: 121px;
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-size: 14px;
    }
    .child-lost-info {
        margin-bottom: 20px;
        overflow: hidden;
    }
    .child-lost-info > img {
        float: left;
        width: 16px;
    }
    .child-lost-info > p {
        font-size: 14px;
        color: #333333;
        margin-left: 20px;
        text-align: justify;
        -moz-text-align-last: left;
        text-align-last: left;
    }
</style>