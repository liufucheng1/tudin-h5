<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">版本说明</p>
        </div>
        <div id="versions">

        </div>
    </div>
</template>
<script>
export default {
    name:'Versision',
    data() {
        return {
            
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
        back(){
            this.$router.back();
        },
        getData(){
            this.setLoading();
            this.$axios.get('/index/explain/user').then(res => {
                this.clearLoading();
                let verContent = document.getElementById('versions')
                verContent.innerHTML = res;
            })
        }
    },
}
</script>