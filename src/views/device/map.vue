<template>
    <div class="map-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">聚合地图</p>
        </div>
        <p class="device-data" @click="jumpMapInfo()"> 
            {{ deviceData.online + '(在线) / ' + deviceData.count + '(总数)' }}
            &nbsp;&gt;
        </p>
        <baidu-map :mapType="mapType" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler" class="bm-view" ak="nanjjlqp7WO7kQHw2lizclrdBcKWL5EI">
            <!-- 设备定位 -->
            <my-overlay
             v-for="(item,index) in devices"
             :key="index"
             :position="{lat:item.blat,lng:item.blng}"
             :is_online="item.is_online"
             :avatar="item.avatar"
             @touch="viewDetail(item)"
             ></my-overlay>
            <!-- 用户定位 -->
            <template v-if="selfCenter.lat">
                <self-overlay
                class="self-overlay"
                :position="{lat:selfCenter.lat,lng:selfCenter.lng}"
                markerColor="#FFFFFF"
                markerBorder="#3085FF"
                ></self-overlay>
            </template>
        </baidu-map>
        <!-- 右边的操作按钮 -->
        <div class="map-handle">
            <p  @click="showTypeList">
                <img src="https://store.cdn.xu5g.com/tdsh_h5_map_icon.png" alt="">
            </p>
        </div>
        <div class="location-handle">
            <p @click="getDevices()">
                <img src="https://store.cdn.xu5g.com/tdsh_h5_refresh.png" alt="">
            </p>
            <p @click="getSelfLocation(true)">
                <img src="https://store.cdn.xu5g.com/tdsh_h5_safety_geo.png" alt="">
            </p>
        </div>
        <div class="map-type-list-wrap" v-if="isTypeList">
            <p>
                <p style="text-align:center">请选择地图类型</p>
                <van-icon @click="showTypeList" class="close-type-list" name="cross" />
            </p>
            <ul class="map-type-list">
                <li v-for="(item,index) in mapTypeList" :key="index">
                    <img @click="setMapType(item.type)" :class="item.type == mapType?'is-map-type':''" :src="item.url" alt="">
                    <p>{{ item.name }}</p>
                </li>
            </ul>
        </div>
        <div class="device-detail" v-if="deviceDetail && showDetail">
            <van-icon name="cross" class="close-info" size="18" @click="closeInfo()" />
            <div class="device-avatar">
                <img :src="deviceDetail.avatar + '-avatar.jpg'" alt="">
            </div>
            <div class="device-info">
                <p class="device-nick">{{ deviceDetail.truename }}</p>
                <div>
                    <device-localtype :isOnline="deviceDetail.is_online" :type="deviceDetail.locate_type"></device-localtype>
                    <device-gms :isOnline="deviceDetail.is_online" class="device-gms" :value="deviceDetail.gsm_rate"></device-gms>
                    <device-power :isOnline="deviceDetail.is_online" :value="parseInt(deviceDetail.power_rate)"></device-power>
                </div>
                <p class="device-address">
                    <device-address v-if="map" :map="map" :position="{lat:deviceDetail.blat,lng:deviceDetail.blng}"></device-address>
                </p>
                <p class="device-time">
                    {{ '更新于' + deviceDetail.locate_time }}
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map'
import MyOverlay from '../../components/myOverlay/index.vue'
import SelfOverlay from '../../components/myOverlay/selfCenter'
import DeviceAddress from '../../components/device/address.vue'
import DeviceLocaltype from '../../components/device/locatetype.vue'
import DeviceGms from '../../components/device/gsm.vue'
import DevicePower from '../../components/device/power.vue'
import db from '../../plugins/db'
export default {
    name:'DeviceMap',
    components:{ BaiduMap, MyOverlay, SelfOverlay, DeviceGms, DevicePower,DeviceLocaltype, DeviceAddress  },
    data() {
        return {
            loading:null,
            isTypeList:false,
            showDetail:false,
            mapType:'BMAP_NORMAL_MAP',//地图类型
            mapTypeList:[
                {
                    name:'2D平面地图',
                    url:'https://store.cdn.xu5g.com/ARYwvVmIutVZKWHovewkPybXwofGoYly.png',
                    type:'BMAP_NORMAL_MAP'
                },{
                    name:'卫星地图',
                    url:'https://store.cdn.xu5g.com/EtSyTFvJVWLKHOkeMysPtUFRsRWkBnli.png',
                    type:'BMAP_SATELLITE_MAP'
                }
            ],
            center:{
                lat:0,
                kng:0
            },
            selfCenter:{
                lat:0,
                lng:0
            },
            zoom:0,
            devices:[],
            deviceData:{
                count:0,
                offline:0,
                online:0
            },
            deviceDetail:null,
            map:null,
        }
    },
    created() {
        
    },
    mounted() {
    },
    methods: {
        // 设置加载loading
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
        // 百度地图初始化
        handler ({BMap, map}) {
            this.map = BMap;
            this.center.lng = 116.404
            this.center.lat = 39.915
            this.zoom = 16;
            this.getDevices();
        },
        // 获取设备地图列表
        getDevices(){
            this.setLoading();
            this.$axios.get('/device/map').then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.devices = res.data;
                    this.deviceData.online = 0;
                    this.deviceData.offline = 0;
                    if(this.devices){
                        for(let item of this.devices){
                            if(item.is_online == 1){
                                this.deviceData.online++
                            }else {
                                this.deviceData.offline++
                            }
                        }
                        this.deviceData.count = this.devices.length;
                    }
                    this.getCenter(this.devices)
                }else {
                    this.$toast(res.message);
                }
            })
        },
        // 获取自己的位置
        getSelfLocation(isc){
            this.setLoading();
            var _this = this
            var geolocation = new this.map.Geolocation();
            geolocation.enableSDKLocation()
            geolocation.getCurrentPosition(function(r){
                // alert(this.getStatus())
                if(isc){
                    _this.center.lat = r.latitude;
                    _this.center.lng = r.longitude;
                }
                _this.selfCenter.lat = r.latitude;
                _this.selfCenter.lng = r.longitude;
                _this.clearLoading();
            },{enableHighAccuracy:true});
        },
        //切换地图类型窗口开关
        showTypeList(){
            this.isTypeList = !this.isTypeList
        },
        // 设置地图样式
        setMapType(type){
            this.mapType = type;
            this.isTypeList = false;
        },
        // 查看详情
        viewDetail(item){
            this.showDetail = true;
            this.deviceDetail = item;
            // console.log(this.deviceDetail)
        },
        // 关闭设备详情按钮
        closeInfo(){
            this.showDetail = false;
            this.deviceDetail = ''
        },
        //根据定位坐标的分布来进行自适应地图缩放比例的大小以及居中显示（为了显示所有的定位点）
		getCenter(points){
			if(points.length>0){
			var maxLng = points[0].blng;
			var minLng = points[0].blng;
			var maxLat = points[0].blat;
			var minLat = points[0].blat;
			var res;
			for (var i = points.length - 1; i >= 0; i--) {
				res = points[i];
				if(res.blng > maxLng) maxLng =res.blng;
				if(res.blng < minLng) minLng =res.blng;
				if(res.blat > maxLat) maxLat =res.blat;
				if(res.blat < minLat) minLat =res.blat;
			};
			var cenLng =(parseFloat(maxLng)+parseFloat(minLng))/2;
			var cenLat = (parseFloat(maxLat)+parseFloat(minLat))/2;
			this.center.lat = cenLat;
			this.center.lng = cenLng;
			this.zoom = this.getZoom(maxLng, minLng, maxLat, minLat);  
        }else{
			//没有坐标，显示全中国
			this.center.lng = 116.404
			this.center.lat = 39.915
			this.zoom = 13;
		} 
		},
		getZoom(maxLng, minLng, maxLat, minLat){
			var zoom = ["50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]//级别18到3。
			var map = new BMap.Map('');
			var pointA = new BMap.Point(maxLng,maxLat);  // 创建点坐标A
			var pointB = new BMap.Point(minLng,minLat);  // 创建点坐标B
			var distance = map.getDistance(pointA,pointB).toFixed(1);  //获取两点距离,保留小数点后两位
			for (var i = 0,zoomLen = zoom.length; i < zoomLen; i++) {
				if(zoom[i] - distance > 0){
					return 18-i+3;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
				}
			};
        },
        jumpMapInfo(){
            db.set('mapDevices',this.devices)
            this.$router.push({
                path:'/map/data',
            })
        }
    },
}
</script>
<style scoped>
    .map-wrap {
        position: relative;
        width: 100%;
        height: 100vh;
    }
    .bm-view {
        width: 100%;
        height: 100%;
    }
    .map-handle {
        position: absolute;
        top: 80px;
        right:5px;
    }
    .location-handle {
        position: absolute;
        right: 5px;
        bottom: 145px;
    }
    .location-handle > p, .map-handle > p {
        width: 40px; 
        margin-top: 10px;
    }
    .location-handle > p > img, .map-handle > p > img  {
        width: 100%;
    }
    .map-type-list-wrap {
        padding: 8px;
        width: 100%;
        background: #fff;
        z-index: 999;
        position: fixed;
        bottom: 0;
        left: 0;
        font-size: 14px;
    }
    .map-type-list-wrap > p {
        position: relative;
    }
    .close-type-list {
        position: absolute;
        top: 8px;
        right: 8px;
        font-size: 18px;
    }
    .map-type-list {
        box-sizing: border-box;
        width: 100%;
        padding: 15px;
        display: flex;
        justify-content: space-around;
    }
    .map-type-list > li {
        text-align: center;
        width: 25%;

    }
    .map-type-list > li > img {
        width: 100%;
        border-radius: 4px;
    }
    .is-map-type {
        border: 2px solid #3085FF;
    }

    .device-detail {
        font-size: 14px;
        background: #ffffff;
        padding: 10px;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
    }
    .device-gms {
        margin: 0 15px;
    }
    .device-avatar {
        width: 45px;
    }
    .device-avatar > img {
        width: 100%; 
        border-radius: 50%;
    }
    .device-info {
        width: -moz-calc(100% - 50px);
        width: -webkit-calc(100% - 50px);
        width: calc(100% - 50px);
        margin-left: 5px;
    }
    .device-nick {
        font-weight: 500;
    }
    .device-address {
        margin: 5px 0;
    }
    .device-time {
        color: #999999;
    }
    .close-info {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #999999;
    }



    .device-data {
        font-size: 12px;
        padding: 2px 10px;
        background: #fdd100;
        border-radius: 4px;
        position: absolute;
        top: 52px;
        left: 8px;
        z-index: 2;
    }
</style>