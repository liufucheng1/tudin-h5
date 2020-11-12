<template>
    <div>
        <van-search
        v-model="value"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        background="#FDD100"
        >
            <div slot="action" @click="onSearch">搜索</div>
            <div slot="left">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" @click="back()" />
            </div>
        </van-search>
        <baidu-map :center="center" :zoom="16" @ready="handler" class="bm-view" ak="nanjjlqp7WO7kQHw2lizclrdBcKWL5EI">
        </baidu-map>
        <ul>
            <li v-for="(item,index) in addressList" :key="index" class="address-list" @click="jumpCreat(item)">
                <p class="address-title">{{ item.title }}</p>
                <p class="address-info">
                    <span v-if="item.province">{{ item.province }}</span>
                    <span v-if="item.city">{{ item.city }}</span>
                    <span v-if="item.address">{{ item.address }}</span>
                    <!-- {{ item.province + '-' + item.city + '-' + item.address }} -->
                </p>
            </li>
        </ul>
    </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmLocalSearch from 'vue-baidu-map/components/search/LocalSearch'
export default {
    name:'SearchAddress',
    components:{ BaiduMap,BmLocalSearch },
    data() {
        return {
            loading:null,
            value:'',
            BMap:null,
            map: null,
            keyword:'',
            zoom:17,
            center:{
                lat:34.761096,
                lng:113.77403
            },
            addressList:[],
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
            this.$toast.clear();
            this.loading = null;
        },
        onSearch(){
            if (!this.value) {
                this.$Toast('请先输入关键词')
                return
            }
            this.setLoading();
            var _this = this
            let local = new _this.BMap.LocalSearch(_this.map, {
                renderOptions: { map: _this.map },
                onMarkersSet: function (arr) {
                    _this.addressList = arr
                    _this.clearLoading();
                }
            })
            local.search(_this.value, { forceLocal: false })
        },
        back(){
            this.$router.back();
        },
        // 百度地图初始化
        handler ({BMap, map}) {
            this.BMap = BMap;
            this.map = map
        },
        jumpCreat(item){
            this.$router.push({
                path:'/fence/create',
                query:{
                    point:item.point,
                    title:item.title,
                    address:item.address
                }
            })
        },
    },
}
</script>
<style scoped>
    .globe-header-icon {
        color: #ffffff;
    }
    .address-list {
        background: #ffffff;
        border-bottom: 1px solid #EBEEF5;
        padding: 8px;
    }
    .address-title {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 15px;
        font-weight: 500;
    }
    .address-info {
        font-size: 14px;
        color: #999999;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-top: 5px;
    }
</style>
