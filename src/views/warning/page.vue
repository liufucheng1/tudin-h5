<template>
    <div>
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">失踪预警</p>
        </div>
        <div class="warning-page-content">
            <img src="https://store.cdn.xu5g.com/h5_warning_pic_2.png" alt="" srcset="">
            <!-- 预警协议 -->
            <div class="auth-protocal">
                <van-checkbox icon-size="14px" v-model="checked" shape="square" checked-color="#fdd100">我已阅读并同意<span class="auto-protocal-tite" @click.stop="jumpProtocal">《CCSER用户隐私协议》</span></van-checkbox>
            </div>
             <!-- 提交 -->
            <div class="on-submit">
                <td-button text="立即进入" :disabled="disabled" @click="onSubmit"></td-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'WarningPage',
    data() {
        return {
            checked:false,
            disabled:true
        }
    },
    methods: {
        // 后退到我的界面
        back(){
            this.$router.push({
                path:'/self'
            })
        },
        // 隐私协议
        jumpProtocal(){
            this.$router.push({
                path:'/warning/privacy'
            })
        },
        // 立即进入
        onSubmit(){
            this.$router.push({
                path:'/warning'
            })
        }
    },
    watch: {
        checked:function(){
            if(this.checked){
                this.disabled = false;
            }else {
                this.disabled = true;
            }
        }
    },
}
</script>
<style scoped>
    .warning-page-content {
        min-height: 100vh;
        background-color: #FEF5C7;
        padding-top: 44px;
    }
    .warning-page-content > img {
        width: 100%;
    }
    .auto-protocal-tite {
        color: #FDD100;
    }
    .auth-protocal {
        font-size: 12px;
        padding: 10px 25px;
    }
    .on-submit {
        padding: 0 20px;
        margin-bottom: 30px;
    }
</style>