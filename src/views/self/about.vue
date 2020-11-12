<template>
    <div class="about-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">关于</p>
        </div>
        <div class="logo">
            <img src="https://store.cdn.xu5g.com/shh5_logo.png" alt="">
            <p>版本号1.0.2</p>
        </div>
        <ul>
            <li class="options" @click="handle('versions')">
                <van-icon class="option-icon" name="arrow" size="17" />
                <p>版本说明</p>
            </li>
            <li class="options" @click="handle('agreenMent')">
                <van-icon class="option-icon" name="arrow" size="17" />
                <p>服务条款</p>
            </li>
            <li class="options" @click="handle('tel')">
                <van-icon class="option-icon" name="arrow" size="17" />
                <p>热线电话</p>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name:'SelfAbout',
    data() {
        return {
            
        }
    },
    created() {
        
    },
    methods: {
        back(){
            this.$router.push({
                path:'/self'
            })
        },
        // 热线电话
        callUp(){
            this.$dialog.alert({
                width:'284px',
                title:'热线电话',
                message:'0371-58575333',
                showCancelButton:true,
                confirmButtonColor:'#c50b0f'
            }).then(() => {
                // 创建a标签
                var a = document.createElement('a');
                // 给a标签添加属性，tel
                a.setAttribute('href', 'tel:0371-58575333');
                // 给a标签添加id
                a.setAttribute('id', 'js_a');
                //防止反复添加
                if(document.getElementById('js_a')) {
                    document.body.removeChild(document.getElementById('js_a'));
                }
                document.body.appendChild(a);
                a.click();
            }).catch(() => {

            })
            
        },
        handle(type){
            switch(type) {
                case 'versions' : {
                    this.$router.push({
                        path:'/versions'
                    })
                    break;
                }
                case 'agreenMent' : {
                    this.$router.push({
                        path:'/agreenMent'
                    })
                    break;
                }
                case 'tel' : {
                    this.callUp();
                    break;
                }
                default:{
                    break;
                }
            }
        }
    },
}
</script>
<style scoped>
    .about-wrap {
        padding-top: 74px;
        min-height: 100vh;
    }
    .logo {
        text-align: center;
        margin-bottom: 15px;
    }
    .logo > img {
        width: 64px;
    }
    .logo > p {
        font-size: 13px;
        color: #999999;
        margin-top: 5px;
    }
</style>