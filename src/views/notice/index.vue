<template>
    <div>
        <ul class="notice-wrap">
            <!-- sos警告 -->
            <li class="notice-list border-1px" @click="jumpList(unReadTypes.sos.type)">
                <div class="notice-list-img">
                    <img src="https://store.cdn.xu5g.com/notice_list_sos.png" alt="">
                </div>
                <div class="notice-list-content">
                    <p class="notice-list-content-top">
                        <span>SOS告警通知</span>
                        <span v-show="unReadTypes.sos.notice_time">{{ unReadTypes.sos.notice_time }}</span>
                    </p>
                    <p class="notice-list-content-bottom">
                        <span v-if="unReadTypes.sos.content">{{ unReadTypes.sos.content }}</span>
                        <span v-else>暂无消息</span>
                        <span class="notice-dot" v-show="unReadTypes.sos.unread_num">
                            {{ unReadTypes.sos.unread_num }}
                        </span>
                    </p>
                </div>
            </li>
            <!-- 设备信息 -->
            <li class="notice-list border-1px" @click="jumpList(unReadTypes.deviceNotice.type)">
                <div class="notice-list-img">
                    <img src="https://store.cdn.xu5g.com/tdsh_h5_notice_device_icon.png" alt="">
                </div>
                <div class="notice-list-content">
                    <p class="notice-list-content-top">
                        <span>设备信息</span>
                        <span v-show="unReadTypes.deviceNotice.notice_time">{{ unReadTypes.deviceNotice.notice_time }}</span>
                    </p>
                    <p class="notice-list-content-bottom">
                        <span v-if="unReadTypes.deviceNotice.content">{{ unReadTypes.deviceNotice.content }}</span>
                        <span v-else>暂无消息</span>
                        <span class="notice-dot" v-show="unReadTypes.deviceNotice.unread_num">
                            {{ unReadTypes.deviceNotice.unread_num }}
                        </span>
                    </p>
                </div>
            </li>
            <!-- 系统消息 -->
            <!-- <li class="notice-list border-1px" @click="jumpList(unReadTypes.systemNotice.type)">
                <div class="notice-list-img">
                    <img src="../../assets/icon_left_system@2x.png" alt="">
                </div>
                <div class="notice-list-content">
                    <p class="notice-list-content-top">
                        <span>系统消息</span>
                        <span v-show="unReadTypes.systemNotice.notice_time">{{ unReadTypes.systemNotice.notice_time }}</span>
                    </p>
                    <p class="notice-list-content-bottom">
                        <span v-if="unReadTypes.systemNotice.content">{{ unReadTypes.systemNotice.content }}</span>
                        <span v-else>暂无消息</span>
                        <span class="notice-dot" v-show="unReadTypes.systemNotice.unread_num">
                            {{ unReadTypes.systemNotice.unread_num }}
                        </span>
                    </p>
                </div>
            </li> -->
            <!-- 围栏消息 -->
            <li class="notice-list border-1px" @click="jumpList(unReadTypes.fence.type)">
                <div class="notice-list-img">
                    <img src="https://store.cdn.xu5g.com/notice_list_fence.png" alt="">
                </div>
                <div class="notice-list-content">
                    <p class="notice-list-content-top">
                        <span>围栏消息</span>
                        <span v-show="unReadTypes.fence.notice_time">{{ unReadTypes.fence.notice_time }}</span>
                    </p>
                    <p class="notice-list-content-bottom">
                        <span v-if="unReadTypes.fence.content">{{ unReadTypes.fence.content }}</span>
                        <span v-else>暂无消息</span>
                        <span class="notice-dot" v-show="unReadTypes.fence.unread_num">
                            {{ unReadTypes.fence.unread_num }}
                        </span>
                    </p>
                </div>
            </li>
            <!-- 电量动态 -->
            <li class="notice-list border-1px" @click="jumpList(unReadTypes.power.type)">
                <div class="notice-list-img">
                    <img src="https://store.cdn.xu5g.com/notice_list_power.png" alt="">
                </div>
                <div class="notice-list-content">
                    <p class="notice-list-content-top">
                        <span>电量动态</span>
                        <span v-show="unReadTypes.power.notice_time">{{ unReadTypes.power.notice_time }}</span>
                    </p>
                    <p class="notice-list-content-bottom">
                        <span v-if="unReadTypes.power.content">{{ unReadTypes.power.content }}</span>
                        <span v-else>暂无消息</span>
                        <span class="notice-dot" v-show="unReadTypes.power.unread_num">
                            {{ unReadTypes.power.unread_num }}
                        </span>
                    </p>
                </div>
            </li>
            <!-- 计步动态 -->
            <!-- <li class="notice-list" @click="jumpList('step')">
                <div class="notice-list-img">
                    <img src="../../assets/icon_left_pedometer@2x.png" alt="">
                </div>
                <div class="notice-list-content">
                    <p class="notice-list-content-top">
                        <span>计步动态</span>
                        <span>2015-12:12</span>
                    </p>
                    <p class="notice-list-content-bottom">暂无数据</p>
                </div>
            </li> -->
        </ul>
    </div>
</template>
<script>
import fun from '../../plugins/functions'
import db from '../../plugins/db'
import getDevice from '../../plugins/getDevice'
export default {
    name:'Notice',
    data() {
        return {
            loading:null,
            unReadTypes:{
                sos:{unread_num:0, type:1,unread_num:0,notice_time:null,content:null},
                deviceNotice:{unread_num:0,type:2,unread_num:0,notice_time:null,content:null},
                systemNotice:{unread_num:0,type:3,unread_num:0,notice_time:null,content:null},
                fence:{unread_num:0,type:4,unread_num:0,notice_time:null,content:null},
                power:{unread_num:0,type:5,unread_num:0,notice_time:null,content:null}
            },
            enterFence:{unread_num:0,type:3,unread_num:0,notice_time:null,content:null},
            leaveFence:{unread_num:0,type:4,unread_num:0,notice_time:null,content:null}
        }
    },
    created() {
        this.getTypeUnRead();
    },
    methods: {
        // 获取设备各消息类型的未读数量
        getTypeUnRead(){
            this.$store.dispatch('getDeviceInfo')
            if(!this.$store.state.deviceInfo){
                return
            }
            let imei_sn = this.$store.state.deviceInfo.imei_sn
            this.loading = this.$Toast.loading({
                duration:0,
                message:'加载中...',
                forbidClick: false,
                loadingType: 'spinner'
            })
            this.$axios.get('/warn/typelast',{ imei_sn }).then(res => {
                this.loading.clear();
                if (res.status == 200) {
                    getDevice.getNoticeCount(imei_sn)
                    for(let item of res.data){
                        switch (item.type) {
                            case 1 : {
                                this.unReadTypes.sos = item
                                break;
                            };
                            case 2 : {
                                this.unReadTypes.deviceNotice = item
                                break;
                            };
                            case 6 : {
                                 this.unReadTypes.fence = item
                                break;
                            };
                            case 5 : {
                                 this.unReadTypes.power = item
                                break;
                            }
                            default : {
                                break;
                            }
                        }
                    }
                }else {
                    this.$Toast(res.message);
                }
            })
        },
        jumpList(type){
            fun.isDevice().then(res => {
                if (res) {
                    db.set('noticeType',type)
                    if(type == 1 || type == 6 || type == 5){
                        this.$router.push({
                            path:'/noticeList',
                        })
                    }else if(type == 2){
                        this.$router.push({
                            path:'/deviceNotice'
                        })
                    }else if(type == 3){
                        this.$router.push({
                            path:'/systemNotice'
                        })
                    }
                    else if(type == 'step'){
                        this.$toast('功能暂未开放')
                    }
                    
                }
            })
        }
    },
    watch: {
    },
}
</script>
<style scoped>
    .notice-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        width: 100%;
        /* border-bottom: 1px solid #E4E7ED; */
        background: #ffffff;
        position: relative;
        width: 100%;
    }
    .notice-list-img {
        width: 40px;
        border-radius: 50%;
        overflow: hidden;
    }
    .notice-list-img > img {
        width: 100%;
        vertical-align: middle;
    }
    .notice-list-content {
        width:-moz-calc(100% - 60px); 
        width:-webkit-calc(100% - 60px);
        width: calc(100% - 60px);
    }
    .notice-list-content-top {
        display: flex;
        justify-content: space-between;
    }
    .notice-list-content-top > span:nth-child(1) {
        font-size: 16px;
        font-weight: 500;
    }
    .notice-list-content-top > span:nth-child(2) {
        font-size: 12px;
        color: #C0C4CC;
    }
    .notice-list-content-bottom {
        padding-right: 15px;
        position: relative;
        margin-top: 3px;
        color: #909399;
        font-size: 13px;
        width: 98%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .notice-dot {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 14px;
        height: 14px;
        font-size: 10px;
        line-height: 14px;
        border-radius: 50%;
        text-align: center;
        background: #FF6C77;
        color: #ffffff;
    }
</style>