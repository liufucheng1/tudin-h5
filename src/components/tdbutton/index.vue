<template>
    <div>
        <van-button :disabled="disabled" class="tdbtn" @click="handleClick">{{ text }}</van-button>
    </div>
</template>
<script>
export default {
    props:{
        text:{
            type:String,
            default:''
        },
        disabled:{
            type:Boolean,
            defaule:false
        }
    },
    name:'TdButton',
    data() {
        return {
            backGround:'#F9E48F'
        }
    },
    created() {
        
    },
    methods: {
        handleClick:function(){
            // 按钮操作处理函数
            this.$emit('click', {})
        }
    },
}
</script>
<style scoped>
    .tdbtn {
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 6px;
        color: #ffffff;
        font-size: 18px;
        background: #F3CB20;
        width: 100%;
    } 
</style>
