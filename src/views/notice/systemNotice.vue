<template>
    <div class="device-notice-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="jumpIndex">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">{{ title }}</p>
        </div>
        <ul>
            <li v-for="(item,index) in list" :key="index" class="notice-list">
                <p>
                    <span>{{ item.notice_time }}</span>
                </p>
                <div>
                    <p class="notice-title">{{ item.title }}</p>
                    <p class="notice-content">{{ item.content }}</p>
                </div>
            </li>
        </ul>
        <p :style="{display: loading ? 'initial' : 'none',textAlign: 'center'}">
            <van-loading type="spinner" size="20">加载中...</van-loading>
        </p>
        <p v-if="allLoaded && !loading" class="all-loaded">
            {{ list.length?'已加载全部':'暂无消息' }}
        </p>
    </div>
</template>
<script>
import db from '../../plugins/db'
export default {
    name:'DeviceNotice',
    data() {
        return {
            loading:false,
            allLoaded: false,  // 数据已经全部加载
            show:false,
            title:'系统消息',
            list:[],
            form:{
                imei_sn:'',
                warn_type:'',
                page:1,
                page_size:10,
                daterange:'all'
            },
        }
    },
    computed: {
        deviceInfo(){
            return this.$store.state.deviceInfo
        },
    },
    created() {
        this.form.warn_type = parseInt(db.get('noticeType'));
        // 绑定滚动事件
        window.addEventListener('scroll', this.onScroll);
        if (this.deviceInfo) {
            this.getData();
        }
    },
    methods: {
        // 滚动事件 方法
        onScroll(e){
            if (this.loading || this.allLoaded) return;
            let top = document.documentElement.scrollTop || document.body.scrollTop; // 滚动条在Y轴上的滚动距离
            let vh = document.compatMode == 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight; // 浏览器视口的高度
            let height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); // 文档的总高度
            if (top + vh >= height) { // 滚动到底部
                this.getData(); // 如果已经滚到底了 获取数据
            }
        },
        // 获取数据
        getData(){
            this.loading = true; // 显示加载中的标识
            this.form.imei_sn = this.deviceInfo.imei_sn;
            this.$axios.get('/warns',this.form).then(res => {
                this.loading = false
                if (res.status == 200) {
                    this.form.page++;
                    this.list.splice(this.list.length, 0, ...res.data.list); // 将新获取到的数据连接到 this.list (vue 能检测到 splice() 函数
                    if (this.list.length === res.data.count) {
                        this.allLoaded = true;
                    }
                }else {
                    this.$Toast(res.message);
                }
            })
        },
        jumpIndex(){
            this.$router.push({
                path:'/notice'
            })
        },
    },
    // 组件销毁前去除滑动事件
    destroyed () {
        window.removeEventListener('scroll', this.onScroll);
    },
    watch: {
        deviceInfo:function(){
            if (this.deviceInfo) {
                this.getData();
            }
        }
    },
}
</script>
<style scoped>
    .device-notice-wrap {
        padding-top: 44px;
    }
    .all-loaded {
        color: #999999;
        font-size: 14px;
        margin: 8px 0;
        text-align: center;
    } 
    .notice-list > p {
        text-align: center;
        margin: 15px auto;
    }
    .notice-list > p > span {
        font-size: 14px;
        display: inline-block;
        padding: 2px 5px;
        background: #D2D1D1;
        color: #ffffff;
        border-radius: 4px;
    }
    .notice-list > div {
        width:-moz-calc(100% - 20px); 
        width:-webkit-calc(100% - 20px);
        width: calc(100% - 20px);
        background: #ffffff;
        margin: 0 auto;
        padding: 10px 15px;
        border-radius: 6px;
    }
    .notice-title {
        font-size: 16px;
        font-weight: 500;
    }
    .notice-content {
        margin-top: 5px;
        color: #777777;
        font-size: 14px;
    }
</style>