<template>
    <div class="device-tracks-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25"/>
            </p>
            <p class="globe-title">{{ title }}</p>
        </div>
        <div class="track-time" @click="showDataTime">
            <img src="https://store.cdn.xu5g.com/tdsh_h5_track_date.png" alt="">
        </div>
        <baidu-map :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler" class="bm-view"
                   ak="nanjjlqp7WO7kQHw2lizclrdBcKWL5EI">
            <self-overlay
                    class="self-overlay"
                    v-for="(item,index) in tracks"
                    :key="index"
                    :position="{lat:item.lat,lng:item.lng}"
                    markerColor="#ffffff"
                    markerBorder="#3085FF"
            />
            <bm-polyline :path="tracks" strokeStyle="dashed" stroke-color="#999999" :stroke-weight="3"></bm-polyline>
        </baidu-map>
        <van-datetime-picker
                v-model="nowDate"
                class="data-time"
                type="date"
                @confirm="timeConfirm"
                @cancel="timeCancel"
                v-show="isShowTime"
        />
    </div>
</template>
<script>
    import BaiduMap from 'vue-baidu-map/components/map/Map'
    import BmPolyline from 'vue-baidu-map/components/overlays/Polyline'
    import SelfOverlay from '../../components/myOverlay/selfCenter'
    import fun from '../../plugins/functions'

    export default {
        components: {BaiduMap, SelfOverlay, BmPolyline},
        name: 'DeviceTracks',
        data() {
            return {
                loading: null,
                isShowTime: false,
                nowDate: new Date(),
                path: '',
                title: '设备足迹',
                map: null,
                center: {
                    lat: 0,
                    lng: 0
                },
                form: {
                    start_time: '',
                    end_time: '',
                    imei_sn: ''
                },
                zoom: 17,
                tracks: []
            }
        },
        created() {
            this.path = this.$route.query.path;
        },
        methods: {
            setLoading() {
                this.loading = this.$toast.loading({
                    duration: 0,//不自动消失
                    message: '加载中...',
                    forbidClick: true,//加载的时候禁止其他屏幕操作
                    loadingType: 'spinner'
                })
            },
            clearLoading() {
                this.loading.clear();
                this.loading = null;
            },
            // 获取当天的日期
            getToday() {
                let time = fun.getLocaltime(0);
                this.form.start_time = time[0] + ' ' + '00:00';
                this.form.end_time = time[0] + ' ' + '23:59';
                this.$store.dispatch('getDeviceInfo');
                this.form.imei_sn = this.$store.state.deviceInfo.imei_sn;
                this.getData();
            },
            // 百度地图初始化
            handler({BMap, map}) {
                this.map = BMap;
                this.center.lng = 116.404
                this.center.lat = 39.915
                this.getToday();
            },
            // 后退按钮
            back() {
                this.$router.push({
                    path: this.path
                })
            },
            // 获取轨迹信息
            getData() {
                this.setLoading();
                this.$axios.get('/device/tracks', this.form).then(res => {
                    this.clearLoading();
                    if (res.status == 200) {
                        if (res.data) {
                            this.tracks = res.data
                        } else {
                            this.tracks = []
                        }
                        this.getCenter(this.tracks);
                        if (!res.data) this.$Toast('所选时间没有足迹信息')
                    } else {
                        this.$Toast(res.message);
                    }
                })
            },
            // 点击日历按钮
            showDataTime() {
                this.isShowTime = !this.isShowTime;
            },
            timeConfirm(val) {
                let date = new Date(val);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                if (month < 10) month = '0' + month;
                let day = date.getDate();
                if (day < 10) day = '0' + day;
                this.form.start_time = year + '-' + month + '-' + day + ' ' + '00:00'
                this.form.end_time = year + '-' + month + '-' + day + ' ' + '23:59'
                this.getData();
                this.isShowTime = false;
            },
            timeCancel() {
                this.isShowTime = false;
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
                    this.zoom = this.getZoom(maxLng, minLng, maxLat, minLat);
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
                        return 18 - i + 3;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
                    }
                }
                ;
            },

        },
    }
</script>
<style scoped>
    .device-tracks-wrap {
        min-height: 100vh;
        overflow: hidden;
        position: relative;
    }

    .bm-view {
        width: 100%;
        height: 100vh;
    }

    .track-time {
        position: absolute;
        top: 59px;
        right: 10px;
        width: 46px;
        z-index: 1;
    }

    .track-time > img {
        width: 100%;
    }

    .data-time {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 1;
    }
</style>
