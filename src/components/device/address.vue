<template>
    <span class="address">
        {{ value }}
    </span>
</template>
<script>
export default {
    name:'DeviceAddress',
    props:{
        position:{
            type:Object,
            default:{}
        },
        map:{
            type:Object,
            default:() => {

            }
        }
    },
    data() {
        return {
            value:''
        }
    },
    created() {
        this.getLocation(this.position)
    },
    methods: {
        getLocation(center){
            var _this = this
            var geo = new _this.map.Geocoder()
            geo.getLocation(new _this.map.Point(center.lng,center.lat),function(rs){
                var addComp = rs.addressComponents;
                _this.value = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
            })
        },
    },
}
</script>
<style scoped>
    .address {
        word-wrap:break-word;
        word-break:break-all;
        overflow: hidden;
        font-size: 14px;
        color: #333333;
        /* vertical-align: middle; */
    }
</style>
