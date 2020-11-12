<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">修改资料</p>
            <p class="globe-right" v-if="relativeInfo.group != 1" @click="delParent">
                <van-icon name="delete" size="20" />
            </p>
        </div>
        <div class="info-top" v-if="relativeInfo">
            <div class="avatar">
                <img :src="relativeInfo.avatar" alt="">
            </div>
            <div class="info">
                <p class="truename">{{ relativeInfo.truename }}</p>
                <p class="mobile">{{ relativeInfo.mobile }}</p>
            </div>
        </div>
        <ul style="margin-top:10px">
            <li class="options" @click="showShip">
                <p class="option-icon">
                    <span v-show="relativeInfo" >
                        {{ relativeInfo.relation }}
                    </span>
                    <van-icon class="icon" name="arrow" size="17" />
                </p>
                <p>关系</p>
            </li>
            <li class="options">
                <div class="option-icon">
                    <van-switch :value="checked" size="18px" active-color="#FDD100" @input="onInput"  />
                </div>
                <p>转让管理员</p>
            </li>
        </ul>
        <van-dialog v-model="shipDialog" title="自定义关系" @cancel="diaCancel()" @confirm="editConfirm()" show-cancel-button width="285">
            <div class="inp">
                <input maxlength="4" v-model="ship" type="text" placeholder="请输入（4字以内）" @blur="recover">
            </div>
        </van-dialog>
        <van-action-sheet
          v-model="shipShow"
          :actions="actions"
          cancel-text="取消"
          @select="shipCancel"
        />
    </div>
</template>
<script>
export default {
    name:'FamilyEdit',
    data() {
        return {
            loading:null,
            shipShow:false,
            shipDialog:false,
            relativeInfo:'',
            actions:[
                {name:'亲友',alias:'friend'},
                {name:'主人',alias:'admin'},
                {name:'自定义',alias:'custom'}
            ],
            ship:'',
            checked:false
        }
    },
    created() {
        if(this.$store.state.relativeInfo){
            this.relativeInfo = this.$store.state.relativeInfo;
            if(this.relativeInfo.group == 1){
                this.checked = true
            }else {
                this.checked = false
            }
        }else {
            this.back();
        }
    },
    methods: {
        recover: function() {
            window.scrollTo(0, 0);
        },
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
        back() {
            this.$router.back();
        },
        // 取消昵称修改的按钮
        diaCancel(){
            this.ship = ''
        },
        // 修改昵称确认按钮
        editConfirm(){
            if(!this.ship){
                this.$toast('关系名称不能为空')
                return;
            }
            let form = {
                relation:this.ship,
                imei_sn:this.relativeInfo.imei_sn,
                id:this.relativeInfo.member_id,
                group:this.relativeInfo.group
            }
            this.editShip(form);
        },
        //点击关系
        showShip(){
            this.shipShow = !this.shipShow
        },
        //选中关系
        shipCancel(action){
            if(action.alias == 'custom'){
                this.shipShow = false;
                this.shipDialog = true;
            }else {
                let form = {
                    relation:action.name,
                    imei_sn:this.relativeInfo.imei_sn,
                    id:this.relativeInfo.member_id,
                    group:this.relativeInfo.group
                }
                this.shipShow = false;
                this.editShip(form);
            }
        },
        editShip(form){
            this.$axios.put('/family/member',form).then(res => {
                this.$toast(res.message);
                if(res.status == 200){
                    this.relativeInfo.relation = form.relation
                }
            })
        },
        onInput(checked){
            if(!checked){
                return;
            }else {
                this.shiftManage();
            }
        },
        // 转让管理员
        shiftManage(){
            this.$dialog.alert({
                width:'284px',
                title:'提示',
                message:'确认转让管理员吗？',
                showCancelButton:true,
                confirmButtonColor:'#000000'
            }).then(() => {
                this.setLoading();
                let form = {
                    imei_sn:this.relativeInfo.imei_sn,
                    id:this.relativeInfo.member_id
                }
                this.$axios.put('/family/moveadmin',form).then(res => {
                    this.clearLoading();
                    this.$toast(res.message);
                    if(res.status == 200){
                        this.checked = true;
                        this.relativeInfo.group = 1
                    }
                })
            }).catch(() => {

            })
        },
        delParent(){
            if(this.relativeInfo.member_id){
                this.$dialog.alert({
                    width:'284px',
                    title:'提示',
                    message:'确认移除该亲人吗？删除后该好友无法查看该设备的信息。',
                    showCancelButton:true,
                    confirmButtonColor:'#C50B0F'
                }).then(res => {
                    this.setLoading();
                    let data = {
                        imei_sn:this.relativeInfo.imei_sn,
                        id:this.relativeInfo.member_id
                    }
                    this.$axios.delete('/family/member',data).then( res => {
                        this.clearLoading();
                        this.$toast(res.message);
                        if(res.status == 200) {
                            this.$router.back();
                        }
                    })
                }).catch(() => {

                })
            }
        }
    },
}
</script>
<style scoped>
    .info-top {
        background: #ffffff;
        padding: 15px;
    }
    .info-top > div {
        display: inline-block;
        vertical-align: middle;
    }
    .avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 5px;
    }
    .avatar > img {
        width: 100%;
        height: 100%;
    }
    .truename {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
    }
    .mobile {
        margin-top: 5px;
        font-size: 13px;
        color: #999999;
    }
    .option-icon > span {
        vertical-align: middle;
    }
    .option-icon > .icon {
        vertical-align: middle;
    }
    .inp > input {
        background: #EFEFEF;
        width: 100%;
        font-size: 16px;
        border: none;
    }
    .inp {
        border-radius: 8px;
        overflow: hidden;
        padding: 10px;
        background: #EFEFEF;
        margin: 15px auto;
        width: 241px;
    }
    .globe-right {
        color: black;
    }
</style>