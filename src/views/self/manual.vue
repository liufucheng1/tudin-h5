<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">使用手册</p>
        </div>
        <div id="content">

        </div>
    </div>
</template>
<script>
export default {
    name:'SelfManual',
    data() {
        return {
            loading:null,
        }
    },
    created() {
        this.getData();
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
            this.loading.clear();
            this.loading = null;
        },
        // 后退
        back(){
            this.$router.push({
                path:'/self'
            })
        },
        getData(){
            this.setLoading();
            this.$axios.get('/index/manual/user').then(res => {
                var content = document.getElementById('content');
                content.innerHTML = res;
                this.clearLoading();
            })
        }
    },
}
</script>
<style scoped>
    
</style>