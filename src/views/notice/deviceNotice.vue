<template>
    <div class="device-notice-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="jumpIndex">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">{{ title }}</p>
        </div>
        <van-swipe-cell class="notice-list-wrap" v-for="(item,index) in list" :key="index">
            <div class="notice-lists">
                <div class="notice-list-top">
                <div>
                    <span class="is-read" :style="{background:item.is_read?'#ffffff':'#D8D8D8'}"></span>
                    <span class="notice-title">{{ item.title }}</span>
                </div>
                <span class="notice-time">{{ noticeTime(item.notice_time) }}</span>
            </div>
            <p class="notice-content">
                {{ item.content }}
            </p>
            </div>
            <van-button
            slot="right"
            square
            text="删除"
            type="danger"
            @click="delNotice(item.id,index)"
            class="delete-button"
            />
        </van-swipe-cell>
        <p :style="{display: loading ? 'initial' : 'none',textAlign: 'center'}">
            <van-loading type="spinner" size="20">加载中...</van-loading>
        </p>
        <p v-if="allLoaded && !loading" class="all-loaded">
            {{ list.length?'已加载全部':'暂无消息' }}
        </p>
        <van-action-sheet
        @select="isDel"
        v-model="show"
        :actions="actions"
        description="确定要删除此信息吗？"
        cancel-text="取消">
        </van-action-sheet>
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
            title:'设备消息',
            list:[],
            notice_id:'',
            index:'',
            form:{
                imei_sn:'',
                warn_type:'',
                page:1,
                page_size:10,
                daterange:'all'
            },
            actions:[
                {
                    name:'删除',
                    color:"#C50B0F"
                }
            ]
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
        // 计算出列表中的消息时间并返回
        noticeTime(val){
            let notice_time = val.split(' ')
            let nowDate = new Date();
            let year = nowDate.getFullYear();
            let month = nowDate.getMonth() + 1;
            if (month < 10) {
                month = '0' + month;
            }
            let day = nowDate.getDate();
            if (day < 10) {
                day = '0' +day;
            }
            let nowTime = year + '-' + month + '-' + day
            if (nowTime == notice_time) {
                return notice_time[1]
            }else {
                return notice_time[0]
            }
        },
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
                    this.form.page ++;
                    this.list.splice(this.list.length, 0, ...res.data.list); // 将新获取到的数据连接到 this.list (vue 能检测到 splice() 函数
                    if (this.list.length === res.data.count) {
                        this.allLoaded = true;
                    }
                }else {
                    this.$Toast(res.message);
                }
            })
        },
        // 跳转到消息主页
        jumpIndex(){
            this.$router.push({
                path:'/notice'
            })
        },
        // 删除按钮
        delNotice(id,index){
            this.notice_id = id
            this.index = index;
            this.show = true
        },
        // 确认删除
        isDel(){
            this.$axios.delete('/warn',{id:this.notice_id,imei_sn:this.deviceInfo.imei_sn}).then(res => {
                if(res.status == 200){
                    this.list.splice(this.index,1);
                    this.show = false;
                    this.$Toast('操作成功')
                }else {
                    this.$Toast(res.message);
                }
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
    .notice-list-wrap {
        border-radius: 6px;
        overflow: hidden;
        width:-moz-calc(100% - 20px); 
        width:-webkit-calc(100% - 20px);
        width: calc(100% - 20px);
        background: #ffffff;
        margin: 0 auto;
        margin-top: 10px;
    }
    .notice-lists {
        padding: 8px;
    }
    .notice-list-top {
        overflow: hidden;
    }
    .notice-list-top > div {
        float: left;
        display: flex;
        align-items: center;
    }
    .is-read {
        width: 12px;
        height: 12px;
        background: #D8D8D8;
        border-radius: 50%;
    }
    .notice-title {
        font-size: 16px;
        margin-left: 5px;
    }
    .notice-time {
        float: right;
        font-size: 12px;
        color: #AAAAAA;
    }
    .notice-content {
        padding-left: 18px;
        font-size: 14px;
        color: #777777;
    }
    .delete-button {
  height: 100%;
} 
</style>