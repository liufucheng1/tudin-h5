<template>
    <div>
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">{{ title }}</p>
            <p class="globe-right" @click="submit()">确认</p>
        </div>
        <div class="bd-map-wrap">
            <baidu-map :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler" @click="mapClick" class="bm-view" ak="nanjjlqp7WO7kQHw2lizclrdBcKWL5EI">
                <bm-marker :position="markerPoint" :dragging="true">
                    <bm-label :content="content" :labelStyle="labelStyle" :offset="{height:-28}"/>
                </bm-marker>
            </baidu-map>
        </div>
    </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow.vue'
import BmLabel from 'vue-baidu-map/components/overlays/Label'
import fun from '../../plugins/functions.js'
export default {
    name:'SendWarningAddress',
    components:{
        BaiduMap,
        BmMarker,
        BmInfoWindow,
        BmLabel
    },
    data() {
        return {
            // 地图的中心点
            center:{
                lng:'',
                lat:''
            },
            // marker的中心点
            markerPoint:{
                lat:'',
                lng:''
            },
            // 地图缩放比例
            zoom:13,
            map:null,
            // 是否显示地图info窗口
            show:true,
            content:'',
            labelStyle:{
                color:'#333333',
                fontSize:'14px',
                backgroundColor:'#ffffff',
                borderRadius:'4px',
                padding:'3px 8px',
                border: '1px solid #333333',
                transform: 'translateX(-45%)'
            },
            title:'',
            type:'',
            closeForm:{
                aid:'',
                close_type:1,
                child_found_lon:'',
                child_found_lat:'',
                child_found_addr:''
            }
        }
    },
    created() {
        let query = this.$route.query;
        if(query.type){
            this.type = query.type
            if(this.type == 'send'){
                this.title = '点击地图选择位置'
            }else if(this.type == 'close'){
                this.title = "选择找到位置"
                this.closeForm.aid = query.aid
            }
        }
    },
    methods: {
        // 设置加载动画
        setLoading(){
            this.loading = this.$toast.loading({
                duration:0,//不自动消失
                message:'加载中...',
                forbidClick: true,//加载的时候禁止其他屏幕操作
                loadingType: 'spinner'
            })
        },
        // 清除加载动画
        clearLoading(){
            this.loading.clear();
            this.loading = null;
        },
        // 后退
        back(){
            let path = '';
            if(this.type == 'send'){
                path = '/warning/send'
            }else if(this.type == 'close'){
                path = '/warning'
            }
            this.$router.push({
                path,
                query:{
                    type: 'nothing'
                }
            })
        },
        // 百度地图初始化
        handler ({BMap, map}) {
            this.map = BMap;
            this.center.lng = 116.404
            this.center.lat = 39.915
            this.zoom = 13
            this.getLocation();
        },
        // 自己定位
        getLocation(isc){
            if(!this.map) return false
            this.setLoading();
            var that = this
            var geolocation = new this.map.Geolocation();
            geolocation.enableSDKLocation()
            geolocation.getCurrentPosition(function(r){
                that.center.lat = r.latitude;
                that.center.lng = r.longitude;
                that.markerPoint = that.center;
                that.clearLoading();
                that.getAddress(that.center)
            },{enableHighAccuracy:true});
        },
        // 点击地图选位置
        mapClick(type){
            console.log(type)
            this.show = true
            this.markerPoint = type.point;
            this.getAddress(this.markerPoint)
        },
        // 坐标反解析
        // 通过坐标反解析
        getAddress(center){
            if(!this.map) return false
            this.setLoading();
            var that = this
            var geo = new that.map.Geocoder()
            geo.getLocation(new that.map.Point(center.lng,center.lat),function(point){
                that.content = point.addressComponents.province
                    + point.addressComponents.city
                    + point.addressComponents.district
                    + point.addressComponents.street
                that.clearLoading();
            })
        },
        // 确认按钮
        submit(){
            // 坐标转换，将百度地图坐标转换为GCJ-02标准坐标
            let GCJ2Point = fun.bdToGcj2(this.markerPoint.lat,this.markerPoint.lng);
            if(this.type == 'send'){
                this.$router.push({
                    path:'/warning/send',
                    query:{
                        type:'address',
                        addressContent:this.content,
                        lat:GCJ2Point.lat,
                        lng:GCJ2Point.lng
                    }
                })
            }else if(this.type == 'close'){
                this.closeForm.child_found_lon = GCJ2Point.lng;
                this.closeForm.child_found_lat = GCJ2Point.lat;
                this.closeForm.child_found_addr = this.content;
                this.setLoading();
                this.$axios.put('/early/close', this.closeForm).then(res => {
                    this.clearLoading();
                    this.$toast(res.message)
                    if(res.status == 200){
                        this.back();
                    }
                })
            }
        }
    },
}
</script>
<style scoped>
    .bd-map-wrap {
        height: 100vh;
        width: 100%;
    }
    .bm-view {
        width: 100%;
        height: 100%;
    }
</style>