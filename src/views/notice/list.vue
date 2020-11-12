<template>
    <div class="notice-list-wrap" :class="form.warn_type == 1?'is-sos':''">
        <div class="globe-header">
            <p class="globe-back" @click="jumpIndex">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">{{ title }}</p>
        </div>
        <van-tabs color="#FDD100" v-model="form.daterange" v-if="form.warn_type == 1" @click="tabClick">
            <van-tab title="当天" name="day" :dot="sosUnRead.day_unread_num > 0" ></van-tab>
            <van-tab title="本周" name="week" :dot="sosUnRead.week_unread_num > 0" ></van-tab>
            <van-tab title="本月" name="month" :dot="sosUnRead.month_unread_num > 0" ></van-tab>
            <van-tab title="全部" name="all" :dot="sosUnRead.all_unread_num > 0" ></van-tab>
        </van-tabs>
        <ul style="overflow: hidden;">
            <li @click="jumpDetail(item.id)" v-for="(item,index) in list" :key="index" class="notice-list">
                <div class="notice-list-avatar">
                    <img :src="item.avatar" alt="">
                </div>
                <div class="notice-list-content">
                    <p class="notice-list-content-top">
                        <span class="nick">
                            {{ item.title }}
                        </span>
                        <span v-if="item.is_read" class="is-read">
                            已读
                        </span>
                        <span v-else class="un-read">
                            未读
                        </span>
                    </p>
                    <p class="notice-list-content-bottom">
                        <span class="content" >
                            {{ item.content }}
                        </span>
                        <span class="notice-time">
                            {{ noticeTime(item.created) }}
                        </span>

                    </p>
                </div>
            </li>
            <li :style="{display: loading ? 'initial' : 'none',textAlign: 'center'}">
                <van-loading type="spinner" size="20">加载中...</van-loading>
            </li>
            <li v-if="allLoaded && !loading" class="all-loaded">
                {{ list.length?'已加载全部':'暂无消息' }}
            </li>
        </ul>
    </div>
</template>
<script>
import db from '../../plugins/db'
export default {
    name:'NoticeList',
    data() {
        return {
            loading:false,
            allLoaded: false,  // 数据已经全部加载
            title:'消息',
            list:[],
            form:{
                imei_sn:'',
                warn_type:'',
                page:1,
                page_size:10,
                daterange:'all'
            },
            sosUnRead:{
                day_unread_num:0,
                week_unread_num:0,
                month_unread_num:0,
                all_unread_num:0
            }
        }
    },
    computed: {
        deviceInfo(){
            return this.$store.state.deviceInfo
        },
    },
    created() {
        this.setTitle();
        if(this.form.warn_type == 1){
            let daterange = sessionStorage.getItem('daterange');
            if(daterange){
                this.form.daterange = daterange
            }else {
                this.form.daterange = 'day';
            }
            if (this.deviceInfo) {
                this.getSosNum();
            }
        }else {
            if (this.deviceInfo) {
                this.getData();
            }
        }
        // 绑定滚动事件
        window.addEventListener('scroll', this.onScroll);
    },
    methods: {
        // 点击标签栏
        tabClick(name,title){
            this.list = [];
            this.form.page = 1;
            this.getData();
        },
        // GET获取sos 当天,本周 当月 全部, 未读情况
        getSosNum(){
            let sosLoading = this.$Toast.loading({
                duration:0,
                message:'加载中...',
                forbidClick: false,
                loadingType: 'spinner'
            })
            this.$axios.get('/warn/sosunread',{imei_sn:this.deviceInfo.imei_sn}).then(res => {
                sosLoading.clear();
                sosLoading = null;
                // console.log(res.data)
                if (res.status == 200) {
                    this.sosUnRead = res.data
                    this.getData();
                }else {
                    this.$Toast(res.message)
                }
            })
        },
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
        // 设置标题
        setTitle(){
            this.form.warn_type = parseInt(db.get('noticeType'));
            switch (this.form.warn_type) {
                case 1 : {
                    this.title = 'SOS告警';
                    break;
                }
                case 2 : {
                    this.title = '设备消息';
                    break;
                }
                case 6 : {
                    this.title = '围栏消息';
                    break;
                }
                case 5 : {
                    this.title = '电量动态';
                    break;
                }
                default : {
                    break;
                }
            };
        },
        // 后退到消息主界面
        jumpIndex(){
            db.set('daterange',null)
            this.$router.push({
                path:'/notice'
            })
        },
        jumpDetail(id){
            db.set('noticeId',id)
            db.set('daterange',this.form.daterange)
            this.$router.push({
                path:'/noticeDetail',
            })
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
                    this.form.page++;
                    this.list.splice(this.list.length, 0, ...res.data.list); // 将新获取到的数据连接到 this.list (vue 能检测到 splice() 函数
                    if (this.list.length === res.data.count) {
                        this.allLoaded = true;
                    }
                }else {
                    this.$Toast(res.message);
                }
            })
        }
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
    .notice-list-wrap {
        padding-top: 44px;
        
    }
    #loading-bottom {
        font-size: 16px;
        color: #C0C4CC;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .notice-list {
        width:-moz-calc(100% - 20px); 
        width:-webkit-calc(100% - 20px);
        width: calc(100% - 20px);
        margin: 0 auto;
        margin-top: 10px;
        padding: 8px;
        overflow: hidden;
        background: #ffffff;
        border-radius: 6px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .notice-list-avatar {
        width: 40px;
        border-radius: 6px;
        overflow: hidden;
    }
    .notice-list-avatar > img {
        width: 100%;
    }
    .notice-list-content {
        width:-moz-calc(100% - 45px); 
        width:-webkit-calc(100% - 45px);
        width: calc(100% - 45px);
    }
    .notice-list-content-top, .notice-list-content-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .nick {
        font-size: 16px;
        font-weight: 500;
    }
    .is-read, .un-read {
        text-align: center;
        width: 2.5rem;
        height: 1.2rem;
        line-height: 1.2rem;
        font-size: 12px;
        background: #EFEFEF;
        border-radius: 2px;
        display: inline-block;
    }
    .is-read {
        color: #596E95;
    }
    .un-read {
        color: #F65E03;
    }
    .notice-time {
        font-size: 14px;
        text-align: right;
        display: inline-block;
        width: 100px;
        color: #999999;
    }
    .content {
        color: #999999;
        font-size: 14px;
        width:-moz-calc(100% - 100px); 
        width:-webkit-calc(100% - 100px);
        width: calc(100% - 100px);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .all-loaded {
        color: #999999;
        font-size: 14px;
        margin: 8px 0;
        text-align: center;
    }
</style>