<template>
    <div>
        <div style="padding-bottom:50px">
            <router-view />
        </div>
        <van-tabbar active-color="#FDD100" v-model="path">
            <van-tabbar-item
              :dot="unRead > 0 && item.alias == 'notice'"
              :name="item.url"
              v-for="(item,index) in tabbars"
              :key="index" replace
              :to="item.url">
                <span>{{ item.title }}</span>
                <img
                slot="icon"
                slot-scope="props"
                :src="props.active ? item.icon.active : item.icon.inactive"
                >
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script>
import db from '../../plugins/db.js'
import getDevice from '../../plugins/getDevice'
export default {
    name:'Home',
    data() {
        return {
            path:'',
            tabbars:[
                {
                    alias:'safety',
                    title:"安全",
                    url:'/safety',
                    icon:{
                        active:'https://store.cdn.xu5g.com/h5_v2_self141.png',
                        inactive:'https://store.cdn.xu5g.com/h5_v2_self142.png'
                    }
                },{
                    alias:'phone',
                    title:"通话",
                    url:'/phone',
                    icon:{
                        active:'https://store.cdn.xu5g.com/h5_v2_self151.png',
                        inactive:'https://store.cdn.xu5g.com/h5_v2_self152.png'
                    }
                },{
                    alias:'notice',
                    title:"消息",
                    url:'/notice',
                    icon:{
                        active:'https://store.cdn.xu5g.com/h5_v2_self161_2.png',
                        inactive:'https://store.cdn.xu5g.com/h5_v2_self162.png'
                    }
                },{
                    alias:'self',
                    title:"我的",
                    url:'/self',
                    icon:{
                        active:'https://store.cdn.xu5g.com/h5_v2_self171.png',
                        inactive:'https://store.cdn.xu5g.com/h5_v2_self172.png'
                    }
                }
            ]
        }
    },
    computed: {
        unRead(){
            return this.$store.state.unRead;
        },
        isLogin(){
            return this.$store.state.isLogin;
        },
    },
    created() {
        this.path = this.$route.path;
    },
    methods: {
    },
    watch: {
        path:function(){
            if(this.isLogin){
                getDevice.main();
            }
        },
        $route(to,from){
            this.path = to.fullPath
        }
    },
}
</script>