<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">设备管理</p>
        </div>
        <ul>
            <li class="options" @click="handle('shutdown')">
                <van-icon class="option-icon" name="arrow" size="17" />
                <p>关机</p>
            </li>
            <li class="options" @click="handle('reset')">
                <van-icon class="option-icon" name="arrow" size="17" />
                <p>重启</p>
            </li>
        </ul>
        <ul style="margin-top:8px">
            <li class="options" @click="handle('undisturb')">
                <van-icon class="option-icon" name="arrow" size="17" />
                <p>免打扰时段</p>
            </li>
            <li class="options" @click="handle('sim')">
                <van-icon class="option-icon" name="arrow" size="17" />
                <p>SIM卡信息</p>
            </li>
            <li class="options">
                <span class="option-icon">
                    {{ deviceInfo.imei_sn }}
                </span>
                <p>设备IMEI号</p>
            </li>
            <li class="options" @click="handle('unbundle')">
                <van-icon class="option-icon" name="arrow" size="17" />
                <p>解绑当前设备</p>
            </li>
        </ul>
    </div>
</template>
<script>
import db from '../../plugins/db'
export default {
    name:'Equipment',
    data() {
        return {
            
        }
    },
    computed: {
        deviceInfo(){
            this.$store.dispatch('getDeviceInfo');
            return this.$store.state.deviceInfo
        }
    },
    created() {
        
    },
    methods: {
        // 后退
        back(){
            this.$router.push({
                path:'/self'
            })
        },
        // 操作选项
        handle(type){
            switch(type){
                case 'shutdown' : {
                    this.toolTip('shutdown');
                    break;
                }
                case 'reset' : {
                    this.toolTip('reset');
                    break;
                }
                case 'unbundle' : {
                    this.toolTip('unbundle');
                    break;
                }
                case 'undisturb' : {
                    this.$router.push({
                        path:'/undisturb'
                    })
                    break;
                }
                case 'sim' : {
                    this.$router.push({
                        path:'/simInfo'
                    })
                }
                default : {
                    break;
                }
            }
        },
        toolTip(type){
            let tool;
            switch(type){
                case 'shutdown' : {
                    tool = '确认关机？'
                    break;
                }
                case 'reset' : {
                    tool = '确认重启？'
                    break;
                }
                case 'unbundle' : {
                    tool = '确定解绑设备？'
                    break;
                }
                default : {
                    break;
                }
            }
            this.$dialog.alert({
                width:'284px',
                title:'提示',
                message:tool,
                showCancelButton:true,
                confirmButtonColor:'#C50B0F'
            }).then(() => {
                this.deviceHandle(type);
            }).catch(() => {

            })
        },
        deviceHandle(type){
            let url;
            switch(type){
                case 'shutdown' : {
                    url = '/device/poweroff'
                    break;
                }
                case 'reset' : {
                    url = '/device/sestart'
                    break;
                }
                case 'unbundle' : {
                    url = '/device/unbind'
                    break;
                }
                default : {
                    break;
                }
            }
            let imei_sn;
            this.$store.dispatch('getDeviceInfo');
            imei_sn = this.$store.state.deviceInfo.imei_sn;
            /**解绑设备 */
            if(type == 'unbundle'){
                this.$axios.put(url,{ imei_sn }).then(res => {
                    this.$toast(res.message);
                    if(res.status == 200){
                        this.getDevices();
                        this.$router.push({
                            path:'/self'
                        })
                    }
                })
            
            }else if(type == 'shutdown' || type == 'reset') {
                /**重启或关机 */
                this.$axios.get(url,{ imei_sn }).then(res => {
                    this.$toast(res.message);
                })
            }
        },
        // 解绑设备后获取设备列表
        getDevices(){
            this.$axios.get('/family/devices').then(res => {
                if(res.status == 200){
                    this.$store.dispatch('setDevices',res.data);
                    // 如果设备数量大于零
                    if(res.data.length > 0){
                        // 设置当前设备
                        db.set('deviceInfo',res.data[0]);
                        // 获取当前设备的未读消息树
                        this.getNoticeCount(res.data[0].imei_sn);
                        // 获取当前设备的权限列表
                        this.getModules(res.data[0].imei_sn)
                    }else {
                        db.set('deviceInfo','')
                    }
                    this.$store.dispatch('getDeviceInfo')
                }else {
                    this.$toast(res.message)
                }
            })
        },
        // 获取设备的未读消息数
        getNoticeCount(imei_sn){
            this.$axios.get('/warns/unread',{ imei_sn }).then(res => {
                if (res.status == 200) {
                    this.$store.dispatch('setUnread',res.data.unread)
                }else {
                    this.$toast(res.message);
                }
            })
        },
        // 获取设备所有有的权限列表
        getModules(imei_sn) {
            this.$axios.get('/device/models',{ imei_sn }).then(res => {
                if(res.status == 200){
                    let modules = [];
                    for(let item of res.data.modules){
                        modules.push(item.alias);
                    }
                    this.$store.dispatch('setModules',modules)
                }
            })
        },
    },
}
</script>
<style scoped>
</style>