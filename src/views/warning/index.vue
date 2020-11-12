<template>
    <div>
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">中国儿童失踪预警平台</p>
        </div>
        <div class="warning-index-content">
            <!-- 预警列表 -->
            <ul v-if="warnings.length">
                <li class="warning-list" v-for="(item,index) in warnings" :key="index" @click="handle('detail',item)">
                    <div class="warning-list-info border-1px">
                        <!-- 孩子图片 -->
                        <div class="child-img" :style="{ backgroundImage : 'url(' + childImg(item.child_pics) + ')' }"></div>
                        <!-- 孩子信息 -->
                        <div class="child-lost-info">
                            <div class="child-lost-info-top border-1px">
                                <p>
                                    <span class="child-name">{{ item.child_name }}</span>
                                    <span class="child-age"> {{ item.child_age + '周岁' }} </span>
                                </p>
                                <div>
                                    <p class="warning-stauts">{{ item.alert_status == 3 ? '已关闭':(item.alert_status == 1?'正在预警':(item.alert_status == 0?'审核中':'未通过')) }}</p>
                                </div>
                            </div>
                            <div>
                                <div class="child-lost-info-bottom">
                                    <img src="https://store.cdn.xu5g.com/shh5_child_lost_time_icon.png" alt="">
                                    <p v-text="lostDate(item.child_lost_time)"></p>
                                </div>
                                <div class="child-lost-info-bottom">
                                    <img src="https://store.cdn.xu5g.com/shh5_child_lost_address_icon.png" alt="">
                                    <p class="child-lost-address">{{ item.child_lost_address }}</p>
                                </div>
                                <div class="child-lost-info-bottom">
                                    <img src="https://store.cdn.xu5g.com/shh5_child_lost_content_icon.png" alt="">
                                    <p class="child-lost-content">{{ item.child_lost_info }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="warning-list-handle" v-if="item.alert_status == 1 || item.alert_status == 2">
                        <p class="warning-mes" v-if="item.alert_status == 1">正在预警,信息持续推送中！</p>
                        <p class="warning-mes" :class="{ 'text-danger' : item.alert_status == 2 }" v-else-if="item.alert_status == 2">{{ item.reject_reason }}</p>
                        <div class="warning-list-btn">
                            <p @click.stop="handle('close', item)" class="warning-list-close" v-if="item.alert_status == 1">关闭预警</p>
                            <p @click.stop="handle('edit', item)" class="warning-list-edit" v-if="item.alert_status == 2">重新编辑</p>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="no-warnings" v-else>
                <img src="https://store.cdn.xu5g.com/no_warnings.png" alt="">
                <p>暂无发布记录</p>
            </div>
            <div class="create-warning" @click="handle('create')">发布失踪预警</div>
        </div>
        <van-dialog
          title="请选择关闭原因"
          v-model="closeDialog"
          show-cancel-button
          @cancel="closeCancel"
          @confirm="closeConfirm"
          width="284px" >
            <div class="close-radio">
                <van-radio-group v-model="closeform.close_type" checked-color="#FDD100">
                    <van-radio :name="1">已找到</van-radio>
                    <van-radio :name="0" style="margin-top:20px">其他原因</van-radio>
                </van-radio-group>
            </div>
        </van-dialog>
    </div>
</template>
<script>
import db from '../../plugins/db'
import fun from '../../plugins/functions'
export default {
    name:'WarningIndex',
    data() {
        return {
            warnings:[],
            loading:null,
            closeDialog:false,
            closeform:{
                aid:'',
                close_type:1
            }
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
        // 操作按钮
        handle(type,item){
            switch(type){
                case 'detail' : {
                    this.$router.push({
                        path:'warning/detail',
                        query:{
                            warning_aid:item.aid
                        }
                    })
                    break;
                }case 'edit' : {
                    this.editWarning(item)
                    break;
                }case 'close' : {
                    this.warningClose(item.aid);
                    break;
                }case 'create' : {
                    this.$router.push({
                        path:'/warning/send'
                    })
                    break;
                }default : {
                    break;
                }
            }
        },
        // 关闭预警
        warningClose(aid){
            this.closeform.aid = aid;
            this.closeDialog = true;
        },
        // 编辑按钮
        editWarning(item){
            let warning_form = item
            let time = new Date(parseInt(warning_form.child_lost_time)*1000)
            let lost_time = fun.format_date(time,'yyyy-MM-dd hh:mm') + ':00';
            warning_form.child_lost_time = lost_time;
            warning_form.child_gender = parseInt(warning_form.child_gender)
            db.set('warning_form',warning_form);
            this.$router.push({
                path:'/warning/send',
                query:{
                    type:'edit'
                }
            })
        },
        // 获取告警列表
        getData(){
            this.setLoading();
            this.$axios.get('/earlys').then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.warnings = res.data.alerts;
                }else {
                    if(res.status == 500){
                        this.warnings = []
                    }else {
                        this.$toast(res.message)
                    }
                }
            })
        },
        // 儿童照片
        childImg(imgs){
            return imgs.split(',')[0]
        },
        // 丢失时间计算
        lostDate(time){
            let date = new Date(parseInt(time)*1000)
            return fun.format_date(date,'yyyy-MM-dd')
        },
        // 关闭预警弹窗的关闭按钮
        closeCancel(){
            this.closeform = {
                aid: '',
                close_type: 1,
                closeDialog: false
            }
        },
        //关闭预警弹窗中的确认按钮
        closeConfirm(){
            this.closeDialog = false;
            if(this.closeform.close_type == 0){
                this.setLoading();
                this.$axios.put('/early/close',this.closeform).then(res => {
                    this.clearLoading();
                    if(res.status == 200){
                        this.getData();
                    }else {
                        this.$toast(res.message)
                    }
                })
            }else if(this.closeform.close_type == 1){
                this.$router.push({
                    path:'/warning/lost/address',
                    query:{
                        type:'close',
                        aid:this.closeform.aid
                    }
                })
            }
        }
    },
}
</script>
<style scoped>
    .warning-index-content {
        padding: 44px 15px 0;
    }
    .warning-list {
        background-color: #ffffff;
        margin: 10px 0;
        border-radius: 6px;
    }
    .warning-list-info {
        padding: 10px;
        overflow: hidden;
    }
    .warning-list-handle {
        padding: 10px;
    }
    .child-img {
        float: left;
        width: 106px;
        height: 150px;
        border-radius: 4px;
        background: no-repeat;
        background-position: center;
        background-size: cover;
    }
    .child-lost-info {
        margin-left: 121px;
        height: 100%;
    }
    .child-lost-info-top {
        padding-bottom: 10px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .child-lost-info-top .child-name {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
    }
    .child-lost-info-top .child-age {
        font-size: 14px;
        color: #666666;
        margin-left: 10px;
    }
    .warning-stauts {
        padding: 3px 10px;
        background: #F6F6F6;
        border-radius: 12px;
        font-size: 12px;
        color: #666666;
    }
    .child-lost-info-bottom {
        margin-top: 10px;
        overflow: hidden;
    }
    .child-lost-info-bottom > img {
        width: 16px;
        float: left;
    }
    .child-lost-info-bottom > p {
        margin-left: 20px;
        color: #666666;
        font-size: 14px;
    }
    .child-lost-address {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .child-lost-content {
        text-align: justify;
        text-align-last: left;
        -moz-text-align-last: left;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
    }
    .no-warnings {
        margin: 30px 0;
        color: #A8A8A8;
        text-align: center;
    }
    .no-warnings > img {
        width:246px;
        margin-bottom: 30px;
    }
    .create-warning {
        width: 148px;
        height: 40px;
        border-radius: 20px;
        text-align: center;
        line-height: 40px;
        background: #FDD100;
        color: #333333;
        font-size: 14px;
        margin: 30px auto;
    }
    .warning-mes {
        margin-bottom: 10px;
        font-size: 14px;
        color: #AAAAAA;
    }
    .text-danger {
        color: rgb(221, 81, 69);
    }
    .warning-list-btn {
        /* margin-top: 10px; */
        overflow: hidden;
    }
    .warning-list-btn > p {
        float: right;
        width: 113px;
        height: 40px;
        border-radius: 20px;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
    }
    .warning-list-edit {
        border:1px solid rgba(217,217,217,1);
    }
    .warning-list-close {
        background: #FDD100;
        margin-left: 10px;
    }
    .close-radio {
        padding: 20px;
    }
</style>