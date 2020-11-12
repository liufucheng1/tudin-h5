<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">SIM卡信息</p>
        </div>
        <ul>
            <li class="options">
                <p class="option-icon">
                    {{ deviceInfo.business }}
                </p>
                <p>运营商</p>
            </li>
            <li class="options">
                <p class="option-icon">
                    {{ deviceInfo.device_mobile }}
                </p>
                <p>手机号码</p>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name:'SIMInfo',
    data() {
        return {
            deviceInfo:{
                device_mobile:'',
                business:''
            }
        }
    },
    created() {
        this.$store.dispatch('getDeviceInfo')
        this.deviceInfo = this.$store.state.deviceInfo
    },
    methods: {
        back() {
            this.$router.push({
                path:'/equipment'
            })
        }
    },
}
</script>
<style scoped>
</style>