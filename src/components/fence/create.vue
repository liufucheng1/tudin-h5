<template>
    <div class="create-fence-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25"/>
            </p>
            <p class="globe-title">新增电子围栏</p>
        </div>
        <div class="fence-search" @click="searchAddress">
            <img src="https://store.cdn.xu5g.com/shh5_search_fence_icon.png" alt="">
            <span>搜索</span>
        </div>
        <baidu-map id="nodeBox" :center="center" @click="mapClick" :zoom="zoom" :scroll-wheel-zoom="true"
                   @ready="handler" class="bm-view" ak="nanjjlqp7WO7kQHw2lizclrdBcKWL5EI">
            <template v-if="center.lat">
                <self-overlay
                        class="self-overlay"
                        :position="center"
                        markerColor="#FDD100"
                ></self-overlay>
            </template>
            <template v-if="show">
                <bm-circle @lineupdate="lineupdate" :strokeWeight="2" strokeColor="#FDD100" :radius="radius"
                           :center="center" fillColor="#FDD100" :fillOpacity="0.15"></bm-circle>
            </template>
        </baidu-map>
        <div class="fence-info">
            <div class="fence-info-top">
                <span class="on-submit" @click="onSubmit()">完成</span>
                <p>
                    <span class="add-tit">
                        {{ addressTitle }}
                    </span>
                    <span class="is-device-address-tool" v-show="isDeviceAddress">
                        您的当前位置
                    </span>
                </p>
            </div>
            <p class="address-info">
                {{ address }}
            </p>
            <div class="inp">
                <span>围栏名称</span>
                <input v-model="fenceName" maxlength="8" type="text" placeholder="必填，最多八个汉字">
            </div>
            <div class="radius">
                <span>半径</span>
                <div class="slider">
                    <van-slider
                            :min="200"
                            :max="1000"
                            v-model="value"
                            bar-height="4px"
                            @change="valueChange"
                            active-color="#FDD100"/>
                </div>
                <span>{{ value }}米</span>
            </div>
        </div>
    </div>
</template>
<script>
    import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
    import BmCircle from 'vue-baidu-map/components/overlays/Circle.vue'
    import SelfOverlay from '../../components/myOverlay/selfCenter'
    import html2canvas from 'html2canvas'

    export default {
        components: {BaiduMap, BmCircle, SelfOverlay},
        name: 'FenceCreate',
        data() {
            return {
                value: 200,
                show: true,
                loading: null,
                map: null,
                center: {
                    lng: 116.404,
                    lat: 39.915
                },
                zoom: 17,
                radius: 200,
                fenceName: '',
                address: '',
                addressTitle: '',
                isDeviceAddress: false
            }
        },
        created() {

        },
        methods: {
            setLoading(mes) {
                this.loading = this.$toast.loading({
                    duration: 0,//不自动消失
                    message: mes,
                    forbidClick: true,//加载的时候禁止其他屏幕操作
                    loadingType: 'spinner'
                })
            },
            clearLoading() {
                this.loading.clear();
                this.loading = null;
            },
            back() {
                this.$router.push({path: '/fence'});
            },
            valueChange(val) {
                this.show = false;
                this.radius = val;
                setTimeout(() => {
                    this.show = true
                }, 100)
            },
            // 百度地图初始化
            handler({BMap, map}) {
                this.map = BMap;
                this.zoom = 17;
                this.getLocation();
            },
            // 获取位置
            getLocation() {
                let point = this.$route.query.point;
                if (point) {
                    this.center = point;
                    this.addressTitle = this.$route.query.title;
                    this.address = this.$route.query.address;
                    this.isDeviceAddress = false;
                } else {
                    this.getSelfLocation();
                    this.isDeviceAddress = true
                }
            },
            // 定位
            getSelfLocation() {
                this.setLoading('加载中...');
                var that = this
                var geolocation = new this.map.Geolocation();
                geolocation.enableSDKLocation()
                geolocation.getCurrentPosition(function (r) {
                    that.center.lat = r.latitude;
                    that.center.lng = r.longitude;
                    that.getAddress(that.center)
                    that.clearLoading();
                    that.isDeviceAddress = false
                }, {enableHighAccuracy: true});
            },
            // 点击地图
            mapClick(type) {
                this.center = type.point
                this.show = false;
                setTimeout(() => {
                    this.show = true
                }, 100)
                this.getAddress(this.center)
            },
            lineupdate(data) {

            },
            // 通过坐标反解析
            getAddress(center) {
                var that = this
                var geo = new that.map.Geocoder()
                geo.getLocation(new that.map.Point(center.lng, center.lat), function (point) {
                    that.address = point.address;
                    that.addressTitle = point.addressComponents.province
                        + point.addressComponents.city
                        + point.addressComponents.district
                        + point.addressComponents.street
                })
            },
            // 点击搜索框
            searchAddress() {
                this.$router.push({
                    path: '/fence/searchAddress'
                })
            },
            onSubmit() {
                if (!this.fenceName) {
                    this.$toast('请输入围栏名称')
                    return
                }
                this.setLoading('提交中...');
                this.$store.dispatch('getDeviceInfo')
                var imei_sn = this.$store.state.deviceInfo.imei_sn;
                var form = {
                    imei_sn,
                    truename: this.fenceName,
                    cover: 'https://store.cdn.xu5g.com/yUHMByfQtMEdVjSFYnRcGmrNRXuncuhe.jpg',
                    lat: this.center.lat,
                    lng: this.center.lng,
                    address: this.address,
                    radius: this.radius
                }
                this.setLoading('提交中...')
                this.$axios.post('/fence', form).then(res => {
                    this.clearLoading();
                    this.$toast(res.message);
                    if (res.status == 200) {
                        this.$router.push({
                            path: '/fence'
                        })
                    }
                })
            },
        },
    }
</script>
<style scoped>
    .create-fence-wrap {
        position: relative;
        width: 100%;
        height: 100vh;
    }

    .fence-search {
        position: fixed;
        padding: 8px;
        background: #ffffff;
        border-radius: 16px;
        width: 320px;
        top: 54px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        box-shadow: 0px 1px 5px 0px rgba(215, 215, 215, 0.5);;
    }

    .fence-search > img {
        width: 24px;
        vertical-align: middle;
    }

    .fence-search > span {
        font-size: 14px;
        color: #999999;
        margin-left: 5px;
    }

    .bm-view {
        width: 100%;
        height: 100%;
    }

    .radius {
        height: 36px;
        border-radius: 18px;
        padding: 0 10px;
        background: #ffffff;
        position: absolute;
        top: -56px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 14px;
    }

    .slider {
        width: 170px;
    }

    .fence-info {
        padding: 15px;
        position: absolute;
        bottom: 0;
        left: 0;
        background: #ffffff;
        width: 100%;
        border-radius: 20px 20px 0 0;
        /* overflow: hidden; */
    }

    .fence-info-top {
        overflow: hidden;
    }

    .on-submit {
        float: right;
    }

    .is-device-address-tool {
        margin-left: 10px;
        background: #FFF8D5;
        font-size: 14px;
        padding: 2px 5px;
    }

    .address-info {
        font-size: 14px;
        color: #333333;
        margin-top: 8px;
    }

    .inp {
        color: #666666;
        padding: 11px;
        margin-top: 5px;
        background: #EFEFEF;
    }

    .inp > input {
        font-size: 15px;
        padding-left: 5px;
        background: #EFEFEF;
        border: none;
    }
</style>
