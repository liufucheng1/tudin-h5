<template>
    <div>
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">设备信息</p>
        </div>
        <div class="globe-wrap">
            <ul>
                <li class="options">
                    <p class="option-title">头像</p>
                    <div class="upload">
                    <avatar-upload class="upload-img" :imgUrl="deviceInfo.avatar + '-avatar.jpg'" @callback="avatarCallback"></avatar-upload>
                </div>
                </li>
                <li class="options" @click="editNick">
                    <van-icon class="option-icon" name="arrow" size="17" />
                    <p>昵称</p>
                    <span v-show="deviceInfo">
                        {{ deviceInfo.nick }}
                    </span>
                </li>
                <li class="options" @click="showShip">
                    <van-icon class="option-icon" name="arrow" size="17" />
                    <p>关系</p>
                    <span v-show="deviceInfo">
                        {{ deviceInfo.ship }}
                    </span>
                </li>
                <li class="options">
                    <p>手机号</p>
                    <span>
                        {{ deviceInfo.device_mobile }}
                    </span>
                </li>
            </ul>
        </div>
        <van-dialog v-model="nickDialog" title="输入昵称" @cancel="diaCancel('nick')" @confirm="editConfirm('nick')" show-cancel-button width="285">
            <div class="inp">
                <input maxlength="4" v-model="nick" type="text" placeholder="请输入（4字以内）">
            </div>
        </van-dialog>
        <van-dialog v-model="shipDialog" title="自定义关系" @cancel="diaCancel('ship')" @confirm="editConfirm('ship')" show-cancel-button width="285">
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
import db from '../../plugins/db'
import AvatarUpload from '../../components/avatarUpload/upload'
export default {
    name:'DeviceInfo',
    components:{ AvatarUpload },
    data() {
        return {
            nickDialog:false,
            shipShow:false,
            shipDialog:false,
            nick:'',
            avatar:'',
            ship:'',
            loading:null,
            actions:[
                {name:'亲友',alias:'friend'},
                {name:'主人',alias:'admin'},
                {name:'自定义',alias:'custom'}
            ],
            deviceInfo:''
        }
    },
    created() {
        this.$store.dispatch('getDeviceInfo');
        this.getDeviceInfo();
    },
    methods: {
        recover: function() {
            window.scrollTo(0, 0);
        },
        ajaxLoading(){
            this.loading = this.$Toast.loading({
                duration:0,//不自动消失
                message:'修改中...',
                forbidClick: true,//加载的时候禁止其他屏幕操作
                loadingType: 'spinner'
            })
        },
        // 返回按钮
        back(){
            this.$router.push({
                path:'/self'
            });
        },
        // 修改设备昵称
        editNick(){
            // this.nickDialog = !this.nickDialog
            this.$router.push({
                path:'/device/nickname'
            })
        },
        // 修改昵称确认按钮
        editConfirm(type){
            let form = this.deviceInfo;
            if(type == 'nick'){
                form.nick = this.nick
                if(!form.nick){
                    this.$Toast('不能为空');
                    return;
                }
            }else if(type == 'ship') {
                form.ship = this.ship
                if(!form.ship){
                    this.$Toast('不能为空');
                    return;
                }
            }
            this.editShip(form);
        },
        // 取消昵称修改的按钮
        diaCancel(val){
            if(val == 'nick'){
                this.nick = ''
            }else if(val == 'ship') {
                this.ship = ''
            }
        },
        //点击关系
        showShip(){
            this.shipShow = !this.shipShow
        },
        //选中关系
        shipCancel(action){
            let form = this.deviceInfo
            if(action.alias == 'custom'){
                this.shipShow = false;
                this.shipDialog = true;
            }else {
                form.ship = action.name
                this.shipShow = false;
                this.editShip(form);
            }
        },
        // 修改设备资料
        editShip(form){
            this.ajaxLoading();
            this.$axios.put('/device/info',form).then(res => {
                this.loading.clear();
                this.loading = null;
                if(res.status == 200){
                    this.$Toast('修改成功')
                    let device = db.get('deviceInfo')
                    device.avatar = form.avatar;
                    device.relation = form.ship;
                    device.nick = form.nick;
                    db.set('deviceInfo',device);
                    this.$store.dispatch('getDeviceInfo')
                    this.getDeviceInfo();
                    // 信息修改成功之后
                    this.getDevices();
                }else {
                    this.$Toast(res.message);
                    this.getDeviceInfo();
                }
            })
        },
        getDeviceInfo(){
            this.deviceInfo = {
                imei_sn:this.$store.state.deviceInfo.imei_sn,
                avatar:this.$store.state.deviceInfo.avatar,
                ship:this.$store.state.deviceInfo.relation,
                nick:this.$store.state.deviceInfo.nick,
                device_mobile:this.$store.state.deviceInfo.device_mobile
            }
        },
        getDevices(){
            this.$axios.get('/family/devices').then(res => {
                if(res.status == 200){
                    this.$store.dispatch('setDevices',res.data)
                }else {
                    this.$toast(res.message)
                }
            })
        },
        // 图片选中之后的回调
        avatarCallback(val){
            this.ajaxLoading();
            let baseFile = val.split(',')[1];
            this.$axios.post('/upload/base/image',{ file:baseFile }).then(res => {
                this.loading.clear();
                if(res.status == 200){
                    let form = this.deviceInfo;
                    form.avatar = res.data.url;
                    this.editShip(form)
                }else {
                    this.$toast(res.message)
                }
            })
        },
        //将base64转换为文件
        dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
        }
    },
}
</script>
<style scoped>
    .options > p {
        display: inline-block;
        width: 5rem;
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
    .upload {
        position: absolute;
        top: 50%;
        left: 95px;
        transform: translateY(-50%);
        width: 100%;
        height: 35px;
        overflow: hidden;
    }
    .upload img {
        width: 100%;
        height: 100%;
    }
    .upload-img {
        width: 100%;
    }
</style>