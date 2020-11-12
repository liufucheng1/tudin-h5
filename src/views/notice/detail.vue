<template>
    <div class="notice-detail-wrap">
        <div class="globe-header">
            <p class="globe-back">
                <van-icon class="globe-header-icon" @click="jumpList" name="arrow-left" size="25" />
                <!-- <img v-if="deviceInfo" :src="deviceInfo.avatar + '-avatar.jpg'" alt="">
                <span v-if="deviceInfo">{{ deviceInfo.nick }}</span> -->
            </p>
            <p class="globe-title">通知详情</p>
        </div>
        <div v-show="data.title">
            <div class="notice-img">
                <img v-if="noticeSignal" :src="noticeSignal" alt="">
            </div>
            <p :class="is_wran?'is-warn':'no-warn'">{{ data.title }}</p>
            <p :class="is_wran?'content-is-wran':'content-no-wran'">
                {{ data.content }}
            </p>
            <p class="notice-time">
                时间：&nbsp; {{ data.notice_time }}
            </p>
            <baidu-map v-if="showMap" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler" class="bm-view" ak="rIv2CMtCyMC5brlW2mmzw5SiKI1BkDAH">
                <template v-if="center.lat && deviceInfo && showMap && map ">
                    <my-overlay
                    :position="{lat:center.lat,lng:center.lng}"
                    :avatar="deviceInfo.avatar + '-avatar.jpg'"
                    :active="active"
                    ></my-overlay>
            </template>
            </baidu-map>
            <div class="warn-address">
                <img src="https://store.cdn.xu5g.com/shh5_warn_address.png" alt="">
                <div>
                    <span>
                    {{ '告警位置:' + sosAddress }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import MyOverlay from '../../components/myOverlay/index'
export default {
    name:'NoticeDetail',
    components:{ BaiduMap, MyOverlay},
    data() {
        return {
            loading:null,
            id:'',
            noticeSignal:'',
            data:{
                title:''
            },
            is_wran:false,
            center: {lng: 0, lat: 0},
            zoom:17,
            active:true,
            map:null,
            showMap:false,
            sosAddress:''
        }
    },
    computed: {
        deviceInfo(){
            return this.$store.state.deviceInfo;
        }
    },
    created() {
        this.id = parseInt(sessionStorage.getItem('noticeId'));
        if(this.id > 0){
            this.getData();
        }
    },
    methods: {
        // 回退到通知列表界面
        jumpList(){
            this.$router.push({
                path:'/noticeList'
            })
        },
        // 获取通知详情
        getData(){
            this.loading = this.$Toast.loading({
                duration:0,
                message:'加载中...',
                forbidClick: false,
                loadingType: 'spinner'
            })
            this.showMap = false
            this.$axios.get('/warn',{id:this.id}).then(res => {
                if(res.status == 200){
                    this.data = res.data;
                    if(res.data.extras){
                        this.center.lat = res.data.extras.lat;
                        this.center.lng = res.data.extras.lng;
                    }
                    let signal = 'https://store.cdn.xu5g.com/notice_detail_warning.png';
                    let signalCopy = 'https://store.cdn.xu5g.com/notice_detail_signal.png';
                    switch (res.data.warn_type){
                        case 1 : this.noticeSignal = signal; this.is_wran = true; break;
                        case 5 : this.noticeSignal = signal; this.is_wran = true; break;
                        case 4 : this.noticeSignal = signal; this.is_wran = true; break;
                        case 2 : this.noticeSignal = signalCopy; this.is_wran = false; break;
                        case 3 : this.noticeSignal = signalCopy; this.is_wran = false; break;
                        default : break;
                    }
                }else {
                    this.$Toast(res.message)
                }
                this.loading.clear();
                this.loading = false;
                this.showMap = true
            })
        },
        // 百度地图初始化
        handler ({BMap, map}) {
            this.map = BMap;
            this.zoom = 16;
            if(this.center.lat){
                this.getLocation(this.center)
            }
        },
        getLocation(center){
            var _this = this
            var geo = new _this.map.Geocoder()
            geo.getLocation(new _this.map.Point(center.lng,center.lat),function(rs){
                var addComp = rs.addressComponents;
                _this.sosAddress = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
            })
        },
    },
}
</script>
<style scoped> 
    .notice-detail-wrap {
        padding-top: 59px;
        min-height: 100vh;
        background: #ffffff;
    }
    .globe-back {
        height: 100%;
        display: flex;
        align-items: center;
    }
    /* .globe-back > img {
        margin-left: 8px;
        width: 30px;
        border-radius: 50%;
    }
    .globe-back > span {
        font-size: 14px;
        margin-left: 5px;
        color: #333333;
    } */
    .notice-img {
        width: 65px;
        margin: 0 auto 0;
    }
    .notice-img > img {
        width: 100%;
    }
    .is-warn, .no-warn {
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        margin-top: 2px;
    }
    .is-warn {
        color: #C50B0F;
    }
    .no-warn {
        color: #02BE23;
    }
    .content-is-wran, .content-no-wran {
        margin-top: 8px;
        width: 100%;
        padding: 8px 15px;
        text-align: center;
    }
    .content-is-wran {
        background:linear-gradient(90deg,rgba(255,224,225,0) 0%,rgb(253, 231, 231) 51%,rgba(255,224,225,0) 100%);
    }
    .content-no-wran {
        background:linear-gradient(90deg,rgba(255,224,225,0) 0%,#E9FEEC 51%,rgba(255,224,225,0) 100%);
    }
    .notice-time {
        text-align: center;
        color: #666666;
        font-size: 12px;
        margin-top: 8px;
    }
    .bm-view {
        margin-top: 8px;
        height: 200px;
    }
     .warn-address {
        padding-top: 12px;
        padding-left: 12px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: left;
        font-size: 14px;
    }
    .warn-address > img {
        margin-right: 5px;
        width: 22px;
        height: 22px;
    }
    .warn-address > div {
        display: flex;
        align-items: center;
        justify-content: left;
    }
</style>