<template>
    <div class="safety-wrap">
        <!-- 未绑定设备提示框 -->
        <div class="no-device-tool" v-show="!devices.len && showNoDevice && isLogin">
            <div class="no-device-tool-content">
                <img @click="closeNodeviceTool(false)" class="close-tool"
                     src="https://store.cdn.xu5g.com/no_device_close_icon@2x.png" alt="">
                <div class="no-device-bg">
                    <img src="https://store.cdn.xu5g.com/tdsh_h5_nothing.png" alt="">
                </div>
                <p class="no-device-p1">暂无绑定设备</p>
                <p class="no-device-p2">绑定设备即可查看位置信息</p>
                <p class="go-bind">
                    <span @click="bindDevice()">去绑定</span>
                </p>
            </div>
        </div>
        <!-- 百度地图 -->
        <baidu-map :mapType="mapType" :center="mapCenter" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler"
                   class="bm-view" ak="nanjjlqp7WO7kQHw2lizclrdBcKWL5EI">
            <!-- 设备定位 -->
            <template v-if="deviceAddressInfo">
                <my-overlay
                        :position="{lat:deviceAddressInfo.blat,lng:deviceAddressInfo.blng}"
                        :is_online="deviceAddressInfo.is_online"
                        :avatar="deviceInfo.avatar"
                        :active="active"
                ></my-overlay>
            </template>
            <!-- 用户定位 -->
            <template>
                <self-overlay
                        v-if="selfCenter.lat"
                        class="self-overlay"
                        :position="{lat:selfCenter.lat,lng:selfCenter.lng}"
                        markerColor="#FFFFFF"
                        markerBorder="#3085FF"
                ></self-overlay>
                <!-- <bm-marker :position="{lat:selfCenter.lat,lng:selfCenter.lng}"></bm-marker> -->
            </template>
            <template v-if="showFence">
                <bm-circle v-for="(item,index) in fences" :key="index" :strokeWeight="1" strokeColor="#FDD100"
                           :radius="item.radius" :center="{lat:item.lat,lng:item.lng}"></bm-circle>
            </template>
        </baidu-map>
        <!-- 右边的操作按钮 -->
        <!-- 切换设备，切换地图类型 -->
        <div class="map-handle">
            <p id="device-avatar" v-if="deviceInfo" @click="cutDevice()">
                <img :src="deviceInfo.avatar + '-avatar.jpg'" alt="">
            </p>
            <p @click="showTypeList">
                <img src="https://store.cdn.xu5g.com/tdsh_h5_map_icon.png" alt="">
            </p>
            <p @click="getLocation(true)">
                <img src="https://store.cdn.xu5g.com/tdsh_h5_safety_geo.png" alt="">
            </p>
            <p @click="isFence()">
                <img :src="showFence?'https://store.cdn.xu5g.com/tdsh_h5_safety_fence_active.png':'https://store.cdn.xu5g.com/tdsh_h5_safety_fence.png'"
                     alt="">
                <!-- https://store.cdn.xu5g.com/tdsh_h5_safety_fence_active.png -->
            </p>
        </div>
        <div class="device-info" v-if="devices.len && deviceAddressInfo">
            <div class="switch-device-info" @click="setSafetyInfoSwitch"></div>
            <div class="device-info-top flex justify-content_flex-justify flex-align-item-center">
                <div class="device-info-top-left flex flex-align-item-center">
                    <div class="device-avatar">
                        <img :src="deviceAddressInfo.avatar">
                    </div>
                    <div class="device-child-info">
                        <p class="child-name">{{ deviceAddressInfo.nickname }}</p>
                        <div>
                            <device-power :isOnline="deviceAddressInfo.is_online"
                                          :value="parseInt(deviceAddressInfo.power_rate)"></device-power>
                        </div>
                    </div>
                </div>
                <div class="device-info-top-right flex flex-align-item-center">
                    <div class="call-phone">
                        <img src="../../assets/imgs/call_icon@2x.png" @click="isCall = true;">
                    </div>
                    <div class="cross-line"></div>
                    <div class="refresh" @click="getDeviceAddress(0)" >
                        <img src="../../assets/imgs/refresh_icon@2x.png">
                        <p>刷新</p>
                    </div>
                </div>
            </div>
            <div class="device-info-bottom flex flex-align-item-center justify-content_flex-justify" v-show="safetyInfoSwitch">
                <div class="device-info-bottom-left">
                    <div>
                        <device-address v-if="map && deviceAddressInfo"
                                        :position="{lat:deviceAddressInfo.blat,lng:deviceAddressInfo.blng}"
                                        :map="map"></device-address>
                    </div>
                    <div class="flex flex-align-item-center">
                        <span class="locate-time">{{ deviceAddressInfo.locate_time | deviceLocationTime }}</span>
                        <device-localtype :isOnline="deviceAddressInfo.is_online"
                                          :type="deviceAddressInfo.locate_type"></device-localtype>
                    </div>
                </div>
                <div class="device-info-bottom-right" @click="deviceTrack">
                    <img src="../../assets/imgs/foot_icon@2x.png">
                    <p>足迹</p>
                </div>
            </div>
        </div>
        <div class="no-login-wrap" v-else-if="!isLogin">
            <div class="device-avatar">
                <img src="https://store.cdn.xu5g.com/avatar.png" alt="">
            </div>
            <div class="no-login-enter">
                <p @click="jumpLogin()">立即登录</p>
                <p>开启您的安全守护天使</p>
            </div>
        </div>
        <!-- 地图类型列表 -->
        <div class="map-type-list-wrap" v-if="isTypeList">
            <div>
                <p style="text-align:center">请选择地图类型</p>
                <van-icon @click="showTypeList" class="close-type-list" name="cross"/>
            </div>
            <ul class="map-type-list">
                <li v-for="(item,index) in mapTypeList" :key="index">
                    <img @click="setMapType(item.type)" :class="item.type == mapType?'is-map-type':''" :src="item.url"
                         alt="">
                    <p>{{ item.name }}</p>
                </li>
            </ul>
        </div>
        <van-dialog
                showCancelButton
                @confirm="callConfirm"
                confirmButtonText="呼叫"
                cancelButtonText="取消"
                confirmButtonColor="#F56C6C"
                widtph="200"
                v-model="isCall"
                title="即将呼叫">
            <p class="is-login-device-mobile" v-if="deviceInfo">{{ deviceInfo.device_mobile }}</p>
        </van-dialog>
        <device-list v-if="showDeviceList"></device-list>
    </div>
</template>
<script>
    import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
    import BmCircle from 'vue-baidu-map/components/overlays/Circle.vue'
    import DeviceAddress from '../../components/device/address.vue'
    import DeviceLocaltype from '../../components/device/locatetype.vue'
    import DeviceGms from '../../components/device/gsm.vue'
    import DevicePower from '../../components/device/power.vue'
    import MyOverlay from '../../components/myOverlay/index.vue'
    import SelfOverlay from '../../components/myOverlay/selfCenter'
    import fun from '../../plugins/functions.js'
    import DeviceList from '../../components/device/list'
    import {mapState, mapActions} from 'vuex'

    export default {
        components: {
            BaiduMap,
            DeviceAddress,
            DeviceLocaltype,
            DeviceGms,
            DevicePower,
            MyOverlay,
            SelfOverlay,
            BmCircle,
            DeviceList
        },
        name: 'Safety',
        data() {
            return {
                mapType: 'BMAP_NORMAL_MAP',//地图类型
                isTypeList: false,
                loading: null,
                showFence: false,
                fences: [],
                active: true,
                isDeivceList: false,//设备列表的开关
                center: {lng: 116.404, lat: 39.915},
                centerType: 2, //1代表设备，2代表本人，3代表默认
                selfCenter: {lng: 0, lat: 0},
                zoom: 3,
                map: null,
                deviceAddressInfo: null,
                isCall:false,
                deviceLocationTimer: null,
                mapTypeList: [
                    {
                        name: '2D平面地图',
                        url: 'https://store.cdn.xu5g.com/ARYwvVmIutVZKWHovewkPybXwofGoYly.png',
                        type: 'BMAP_NORMAL_MAP'
                    }, {
                        name: '卫星地图',
                        url: 'https://store.cdn.xu5g.com/EtSyTFvJVWLKHOkeMysPtUFRsRWkBnli.png',
                        type: 'BMAP_SATELLITE_MAP'
                    }
                ]
            }
        },
        computed: {
            // 设备列表
            devices() {
                return {list: this.$store.state.devices, len: this.$store.state.devices.length};
            },
            mapCenter() {
                if (this.deviceAddressInfo && this.deviceAddressInfo.blat > 0 && this.centerType == 1) {
                    return {lat: this.deviceAddressInfo.blat, lng: this.deviceAddressInfo.blng}
                } else if (this.selfCenter.lat && this.centerType == 2) {
                    return {lat: this.selfCenter.lat, lng: this.selfCenter.lng}
                } else {
                    return this.center
                }
            },
            ...mapState({
                isLogin: state => state.isLogin,
                deviceInfo: state => state.deviceInfo,
                showNoDevice: state => state.isNoDevice,
                showDeviceList: state => state.showDeviceList,
                safetyInfoSwitch: state => state.safetyInfoSwitch
            })
        },
        methods: {
            // 确认呼叫按钮
            callConfirm(){
                // 创建a标签
                var a = document.createElement('a');
                // 给a标签添加属性，tel
                a.setAttribute('href', 'tel:' + this.deviceInfo.device_mobile);
                // 给a标签添加id
                a.setAttribute('id', 'js_a');
                //防止反复添加
                if(document.getElementById('js_a')) {
                    document.body.removeChild(document.getElementById('js_a'));
                }
                document.body.appendChild(a);
                a.click();
            },
            setLoading() {
                this.loading = this.$Toast.loading({
                    duration: 0,//不自动消失
                    message: '加载中...',
                    forbidClick: true,//加载的时候禁止其他屏幕操作
                    loadingType: 'spinner'
                })
            },
            clearLoading() {
                this.$toast.clear();
                this.loading = null;
            },
            // 关闭无设备提示信息
            closeNodeviceTool(value) {
                this.$store.dispatch('setIsNoDevice', value)
            },
            // 无设备提示框中的去绑定按钮
            bindDevice() {
                fun.addDeviceBtn().then(res => {
                    if (res) {
                        this.$router.push({
                            path: '/deviceCreate'
                        })
                    }
                })
            },
            //切换地图类型窗口开关
            showTypeList() {
                this.isTypeList = !this.isTypeList
            },
            setMapType(type) {
                this.mapType = type;
                this.isTypeList = false;
            },
            // 查看围栏开关
            isFence() {
                fun.isDevice().then(res => {
                    if (res) {
                        this.showFence = !this.showFence;
                        if (this.showFence) {
                            this.centerType = 3
                            this.setLoading();
                            this.$axios.get('/device/location', {imei_sn: this.deviceInfo.imei_sn}).then(res => {
                                this.clearLoading();
                                if (res.status == 200) {
                                    this.fences = res.data.fences
                                    if (this.fences.length > 0) {
                                        this.getCenter(this.fences)
                                    } else {
                                        this.$toast('暂无围栏信息，请先新增围栏');
                                    }
                                } else {
                                    this.$Toast(res.message);
                                }
                            })
                        } else {
                            this.fences = []
                        }
                    }
                })
            },
            // 定位
            getLocation(isc) {
                this.setLoading();
                var _this = this
                var geolocation = new this.map.Geolocation();
                geolocation.enableSDKLocation()
                geolocation.getCurrentPosition(function (r) {
                    if (isc) {
                        _this.centerType = 2;
                        _this.center.lat = r.latitude;
                        _this.center.lng = r.longitude;
                    }
                    _this.selfCenter.lat = r.latitude;
                    _this.selfCenter.lng = r.longitude;
                    _this.clearLoading();
                }, {enableHighAccuracy: true});
            },
            // 是否显示是被列表的开关函数
            cutDevice() {
                this.$store.dispatch('setShowDeviceList', true);
            },
            // 百度地图初始化
            handler({BMap, map}) {
                this.map = BMap;
                this.center.lng = 116.404
                this.center.lat = 39.915
                this.zoom = 12
                // 获取设备最近一次定位的位置
                this.$nextTick(() => {
                    if (this.deviceInfo) {
                        this.getLocation(0);
                        this.getDeviceAddress(0);
                        this.deviceLocationTimer = setInterval(() => {
                            this.getDeviceAddress(1);
                        }, 10000)
                    } else {
                        this.getLocation(1);
                    }
                })
            },
            // 获取设备的位置
            getDeviceAddress(type) {
                fun.isDevice().then(res => {
                    if (res) {
                        if(!type){
                            this.setLoading();
                        }
                        this.$axios.get('/device/location', {imei_sn: this.deviceInfo.imei_sn}).then(res => {
                            if(!type){
                                this.clearLoading();
                            }
                            if (res.status == 200) {
                                if (res.data.device && res.data.device.blat) {
                                    this.deviceAddressInfo = res.data.device;
                                    this.centerType = 1;
                                    this.center.lat = res.data.device.blat;
                                    this.center.lng = res.data.device.blng;
                                } else {
                                    this.$Toast('暂无定位数据');
                                    this.centerType = 2;
                                }
                            } else {
                                this.deviceAddressInfo = null;
                                this.centerType = 2
                                this.$Toast(res.message);
                            }
                        })
                    }
                })
            },
            getModules(imei_sn) {
                this.$axios.get('/device/models', {imei_sn}).then(res => {
                    if (res.status == 200) {
                        let modules = [];
                        for (let item of res.data.modules) {
                            modules.push(item.alias);
                        }
                        this.$store.dispatch('setModules', modules)
                    }
                })
            },
            //根据定位坐标的分布来进行自适应地图缩放比例的大小以及居中显示（为了显示所有的定位点）
            getCenter(points) {
                if (points.length > 0) {
                    var maxLng = points[0].lng;
                    var minLng = points[0].lng;
                    var maxLat = points[0].lat;
                    var minLat = points[0].lat;
                    var res;
                    for (var i = points.length - 1; i >= 0; i--) {
                        res = points[i];
                        if (res.lng > maxLng) maxLng = res.lng;
                        if (res.lng < minLng) minLng = res.lng;
                        if (res.lat > maxLat) maxLat = res.lat;
                        if (res.lat < minLat) minLat = res.lat;
                    }
                    ;
                    var cenLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2;
                    var cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2;
                    this.center.lat = cenLat;
                    this.center.lng = cenLng;
                    if (points.length == 1) {
                        this.zoom = 17
                    } else {
                        this.zoom = this.getZoom(maxLng, minLng, maxLat, minLat);
                    }

                }
            },
            getZoom(maxLng, minLng, maxLat, minLat) {
                var zoom = ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"]//级别18到3。
                var map = new BMap.Map('');
                var pointA = new BMap.Point(maxLng, maxLat);  // 创建点坐标A
                var pointB = new BMap.Point(minLng, minLat);  // 创建点坐标B
                var distance = map.getDistance(pointA, pointB).toFixed(1);  //获取两点距离,保留小数点后两位
                for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
                    if (zoom[i] - distance > 0) {
                        return 18 - i + 3 - 1;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
                    }
                }
                ;
            },
            // 跳转到登录界面
            jumpLogin() {
                let historyPath = this.$route.path
                this.$router.push({
                    path: '/login',
                    query: {
                        path: historyPath
                    }
                })
            },
            // 跳转到足迹界面
            deviceTrack() {
                let historyPath = this.$route.path
                fun.isDevice().then(res => {
                    if (res) {
                        this.$router.push({
                            path: '/deviceTracks',
                            query: {
                                path: historyPath
                            }
                        })
                    }
                })
            },
            ...mapActions({
                setSafetyInfoSwitch: 'setSafetyInfoSwitch'
            })
        },
        beforeDestroy() {
            //组件销毁前  关闭定是请求
            clearInterval(this.deviceLocationTimer);
            this.deviceLocationTimer = null;
        },
        watch: {
            // 监控设备信息，如有变动，请求地址接口
            'deviceInfo': function (val, oldVal) {
                if (this.deviceInfo) {
                    if (!oldVal) {
                        this.getDeviceAddress(0);
                        this.showFence = false;
                    } else {
                        if (val.imei_sn != oldVal.imei_sn) {
                            this.fences = []
                            this.showFence = false;
                            this.getDeviceAddress(0)
                        }
                    }
                }
            }
        },
        filters: {
            // 用来格式化设备位置更新时间
            deviceLocationTime: function(value){
                let deviceTime = new  Date(value).getTime();
                let newTime = new Date().getTime()
                let minute = (newTime - deviceTime) / 1000 / 60
                if(minute < 1){
                    return '刚刚'
                }else if(Math.round(minute) < 20){
                    return `${Math.round(minute)}分钟前`
                }else {
                    var timeArr = value.split(' ');
                    var years = timeArr[0].split('-');
                    var newYear = years[1] + '-' + years[2];
                    let timers = timeArr[1].split(':');
                    var newMinute = timers[0] + ':' + timers[1];
                    return `更新于${newYear} ${newMinute}`
                }
            }
        }
    }
</script>
<style scoped>
    .no-device-tool {
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
    }

    .no-device-tool-content {
        width: 246px;
        padding: 15px;
        background: rgb(252, 251, 249);
        border-radius: 9px;
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .close-tool {
        width: 35px;
        position: absolute;
        top: -50px;
        right: 0;
    }

    .no-device-bg {
        width: 100%;
    }

    .no-device-bg > img {
        width: 100%;
    }

    .no-device-p1, .no-device-p2, .go-bind {
        text-align: center;
    }

    .no-device-p1 {
        font-size: 16px;
        font-weight: 600;
    }

    .no-device-p2 {
        margin-top: 15px;
        font-size: 16px;
        color: #666666;
        margin-bottom: 20px;
    }

    .go-bind > span {
        font-size: 16px;
        color: #FEC447;
    }

    .safety-wrap {
        height: -moz-calc(100vh - 50px);
        height: -webkit-calc(100vh - 50px);
        height: calc(100vh - 50px);
        position: relative;
    }

    .bm-view {
        width: 100%;
        height: 100%;
    }

    .map-handle {
        position: absolute;
        top: 80px;
        right: 5px;
    }

    .location-handle {
        position: absolute;
        right: 5px;
        bottom: 300px;
    }

    .location-handle > p, .map-handle > p {
        width: 40px;
        height: 40px;
        margin-top: 10px;
    }

    .location-handle > p > img, .map-handle > p > img {
        width: 100%;
        height: 100%;
        vertical-align: top;
    }

    #device-avatar {
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid #FFFFFF;
    }

    .device-info, .no-login-wrap {
        font-size: 12px;
        padding: 12px;
        background: #fff;
        width: 95%;
        border-radius: 6px;
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: 65px;
        overflow: hidden;
    }

    .switch-device-info {
        width: 50px;
        height: 15px;
        border-radius: 2px;
        border-top: 2px solid #D8D8D8;
        position: absolute;
        top: 3px;
        left: 50%;
        transform: translateX(-50%);
    }

    .device-child-info > .child-name {
        font-size: 14px;
        color: #000000;
        font-weight: 600;
        margin-bottom: 3px;
    }

    .call-phone {
        width: 35px;
    }

    .call-phone > img {
        width: 100%;
    }

    .cross-line {
        width: 1px;
        height: 20px;
        background-color: #DFDFDF;
        margin: 0 8px;
    }

    .refresh {
        width: 22px;
    }

    .refresh > img {
        width: 100%;
    }
    .refresh > p {
        width: 3rem;
        color: #999999;
    }

    .device-info-bottom {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid #dddddd;
    }

    .device-info-bottom-left {
        width: 80%;
        width: -webkit-calc(100% - 110px);
        width: calc(100% - 110px);
    }
    .device-info-bottom-right > img {
        width: 22px;
    }
    .device-info-bottom-right > p {
        font-size: 12px;
        color: #999999;
        margin-top: 5px;
    }

    .locate-time {
        padding: 2px 8px;
        display: inline-block;
        border-radius: 4px;
        background-color: #FFF1DD;
        color: #FFA10D;
        margin-right: 5px;
    }

    .no-login-wrap {
        display: flex;
        align-items: center;
    }

    .device-avatar {
        width: 51px;
        height: 51px;
        border: 1px solid #EBEEF5;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 8px;
    }

    .device-avatar > img {
        width: 100%;
        vertical-align: top;
    }

    .no-login-enter {
        font-size: 13px;
        margin-left: 5px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .no-login-enter > p:nth-child(1) {
        width: 75px;
        height: 22px;
        line-height: 22px;
        color: #333333;
        border-radius: 11px;
        text-align: center;
        background: #FDD100;
    }

    .no-login-enter > p:nth-child(2) {
        margin-top: 5px;
        color: #777777;
    }

    .self-overlay {
        z-index: 1;
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

    .map-type-list-wrap > div {
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
    .is-login-device-mobile {
        padding: 15px 8px;
        text-align: center;
        font-size: 16px;
        color: #C0C4CC;
    }
</style>
