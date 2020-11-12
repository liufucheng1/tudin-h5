<template>
    <span v-if="isOnline">
        <img class="td-power-icon" :src="'https://store.cdn.xu5g.com/gsm_'+gsm+'.png'" />
    </span>
    <span v-else>
        <img class="td-power-icon" :src="'https://store.cdn.xu5g.com/un_gsm_'+gsm+'.png'" />
    </span>
</template>

<script>
    export default {
        name:'DeviceGsm',
        props:{
            value:{
                type:Number,
                default:0
            },
            isOnline:{
                type:Number,
                default:1
            }
        },
        computed:{
            gsm(){
                if(this.value > 80) {
                    return 5;
                }else if(this.value > 60){
                    return 4;
                }else if(this.value > 40){
                    return 3;
                }else if(this.value > 0){
                    return 2;
                }
                return 0;
            }
        }
    }
</script>

<style>
    .td-power-icon{
        width:20px;
    }
</style>
