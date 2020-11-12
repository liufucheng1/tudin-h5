<template>
    <div>
        <!-- 登陆状态未绑定设备的提示信息 -->
        <p class="no-device" v-show="!devices.len && isLogin && noDevice">
            <span>
                <img @click="closeNoDevice" src="https://store.cdn.xu5g.com/shh5_close_icon.png" />
                &nbsp;
            </span>
            <span>检测到该账号未添加任何智能设备，部分功能无法使用</span>
            <span><span @click="deviceCreate()">添加</span></span>
        </p>
    </div>
</template>
<script>
import fun from '../../plugins/functions'
export default {
    name:'NoDevice',
    data() {
        return {
            noDevice:true,//未绑定设备的提示信息开关
        }
    },
    computed: {
        // 设备列表
        devices(){
            return {list:this.$store.state.devices,len:this.$store.state.devices.length};
        },
        // 是否为登陆状态
        isLogin(){
            return this.$store.state.isLogin;
        },
    },
    created() {
        
    },
    methods: {
        // 管理没有设备提示信息
        closeNoDevice(){
            this.noDevice = false;
        },
        deviceCreate(){
            fun.addDeviceBtn().then(res => {
                if(res){
                    let path = window.location.href.split('#')[1];
                    this.$router.push({
                        path:'/deviceCreate',
                        query:{
                            path
                        }
                    })
                }
            })
        }
    },
}
</script>
<style scoped>
    /* 未绑定设备提示信息 */
    .no-device {
        padding: 8px;
        position: fixed;
        width: 100%;
        left: 0;
        top: 44px;
        color: #F88F17;
        background:rgba(255,239,211,0.89);
        z-index:1;
        font-size:12px;
        overflow: hidden;
    }
    .no-device > span {
        display: inline-block;
        vertical-align: middle;
    }
    .no-device > span > img {
        vertical-align: middle;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
    .no-device > span:nth-child(1) {
        position: relative;
        width: 20px;/*写给不支持calc()的浏览器*/ 
    }
    .no-device > span:nth-child(2) {
        margin-right: 5px;
        width: 75px;/*写给不支持calc()的浏览器*/ 
        width:-moz-calc(100% - 70px); 
        width:-webkit-calc(100% - 70px);
        width: calc(100% - 70px);
    }
    .no-device > span:nth-child(3) {
        padding: 3px 10px;
        color: #333333;
        background: #FDD100;
        border-radius: 4px;
    }
</style>