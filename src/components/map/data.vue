<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">设备列表</p>
        </div>
        <baidu-map center="北京" :zoom="16" @ready="handler" ak="nanjjlqp7WO7kQHw2lizclrdBcKWL5EI"></baidu-map>
        <van-tabs v-model="activeName" color="#fdd100">
            <van-tab :title="'在线设备：' + onLineCount" name="a">
                <ul style="padding:10px">
                    <li class="map-device-list" v-for="(item,index) in onLineList" :key="index">
                        <div class="map-device-info">
                            <div class="map-device-img">
                                <img :src="item.avatar + '-avatar.jpg'" alt="">
                            </div>
                            <div class="map-device-name">
                                <p>{{ item.truename }}</p>
                                <p>{{ item.mobile }}</p>
                            </div>
                        </div>
                        <div class="device-address-info">
                            <p class="map-location-time">
                                <span>更新时间：</span>
                                <span>{{ item.locate_time }}</span>
                            </p>
                            <p class="map-location-address">
                                <span>定位地点：</span>
                                <device-address v-if="map" :map="map" :position="{lat:item.blat,lng:item.blng}" ></device-address>
                            </p>
                        </div>
                    </li>
                </ul>
            </van-tab>
            <van-tab :title="'离线设备：' + offLineCount" name="b">
                <ul style="padding:10px">
                    <li class="map-device-list" v-for="(item,index) in offLineList" :key="index">
                        <div class="map-device-info">
                            <div class="map-device-img">
                                <img :src="item.avatar + '-avatar.jpg'" alt="">
                            </div>
                            <div class="map-device-name">
                                <p>{{ item.truename }}</p>
                                <p>{{ item.mobile }}</p>
                            </div>
                        </div>
                        <div class="device-address-info">
                            <p class="map-location-time">
                                <span>更新时间：</span>
                                <span>{{ item.locate_time }}</span>
                            </p>
                            <p class="map-location-address">
                                <span>定位地点：</span>
                                <device-address v-if="map" :map="map" :position="{lat:item.blat,lng:item.blng}" ></device-address>
                            </p>
                        </div>
                    </li>
                </ul>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map'
import DeviceAddress from '../../components/device/address.vue'
export default {
    name:'MapData',
    components:{ DeviceAddress, BaiduMap },
    data() {
        return {
            map:null,
            devices:[],
            activeName:'',
            onLineCount:0,
            offLineCount:0,
            onLineList:[],
            offLineList:[]
        }
    },
    created() {
        this.getData();
    },
    methods: {
        back(){
            this.$router.back();
        },
        getData(){
            let devices = sessionStorage.getItem('mapDevices');
            this.devices = JSON.parse(devices);
            for(let item of this.devices){
                if(item.is_online){
                    this.onLineCount++;
                    this.onLineList.push(item);
                }else {
                    this.offLineCount++;
                    this.offLineList.push(item)
                }
            }
        },
        // 百度地图初始化
        handler ({BMap, map}) {
            this.map = BMap;
        },
    },
}
</script>
<style scoped>
    .map-device-list {
        border-radius: 8px;
        overflow: hidden;
        background: #ffffff;
        margin-bottom: 10px;
    }
    .map-device-info  {
        padding:10px;
        border-bottom: 1px solid #F4F1F4;
    }
    .map-device-info > div {
        display: inline-block;
        vertical-align: middle;
    }
    .map-device-img {
        width: 44px;
        height: 44px;
        margin-right: 10px;
        border-radius: 50%;
        overflow: hidden;
    }
    .map-device-img > img {
        width: 100%;
        height: 100%;
    }
    .map-device-name > p:nth-child(1) {
        color: #333333;
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 3px;
    }
    .map-device-name > p:nth-child(2) {
        color: #999999;
        font-size: 14px;
    }
    .device-address-info {
        padding: 10px;
    }
    .map-location-time {
        color: #333333;
        font-size: 14px;
        /* margin-top: 8px; */
    }
    .map-location-address {
        display: flex;
        justify-content: left;
        align-items: center;
        margin-top: 5px;
        font-size: 14px;
    }
</style>