<template>
    <span v-if="type">
        <span  v-if="type == 1">
            <img v-if="isOnline" class="td-power-icon" src="https://store.cdn.xu5g.com/wifi_icon%20copy@3x%20%282%29.png" />
            <img v-else class="td-power-icon" src="https://store.cdn.xu5g.com/un_gps_icon.png" alt="">
            <span class="td-locate-span">
                GPS
            </span>
        </span>
        <span  v-if="type == 2">
            <img v-if="isOnline" class="td-power-icon" src="https://store.cdn.xu5g.com/wifi_icon%20copy@3x.png"/>
            <img v-else class="td-power-icon" src="https://store.cdn.xu5g.com/un_gps_icon.png" alt="">
            <span class="td-locate-span">
                基站
            </span>
        </span>
        <span  v-if="type == 3">
            <img v-if="isOnline" class="td-power-icon" src="https://store.cdn.xu5g.com/wifi_icon%20copy@3x%20%284%29.png"/>
            <img v-else class="td-power-icon" src="https://store.cdn.xu5g.com/un_wifi_icon.png" alt="">
            <span class="td-locate-span">
                WIFI
            </span>
        </span>
    </span>
</template>

<script>
    export default {
        name:'DeviceLocatetype',
        props:{
            type:{
                type:Number,
                default:0
            },
            isOnline:{
                type:Number,
                default:1
            }
        }
    }
</script>

<style>
    .td-power-icon{
        width:14px;
        vertical-align: middle;
    }
    .td-locate-span {
        font-size: 12px;
        vertical-align: middle;
    }
</style>