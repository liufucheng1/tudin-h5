<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">账户设置</p>
        </div>
        <ul>
            <li class="options">
                <span class="option-title">头像</span>
                <div class="upload">
                    <avatar-upload class="upload-img" :imgUrl="userInfo.avatar" @callback="avatarCallback"></avatar-upload>
                </div>
            </li>
            <li class="options" @click="handle('name')">
                <van-icon class="option-icon" name="arrow" size="17" />
                <span class="option-title">昵称</span>
                <span v-if="userInfo">
                    <span>{{ userInfo.truename?userInfo.truename:'点击编辑' }}</span>
                </span>
            </li>
            <!-- 性别 -->
            <!-- <li class="options" @click="handle('sex')">
                <van-icon class="option-icon" name="arrow" size="17" />
                <span class="option-title">性别</span>
                <span>
                    {{ userInfo.sex }}
                </span>
            </li> -->
        </ul>
        <ul style="margin:10px 0">
            <li class="options" @click="handle('resetMobile')">
                <p class="option-icon">
                    <span v-if=" userInfo.mobile ">
                        {{ userInfo.mobile }}
                    </span>
                    <van-icon name="arrow" size="17"/>
                </p>
                <span>{{ userInfo.mobile?'更换手机号':'绑定手机号' }}</span>
            </li>
        </ul>
        <ul style="margin:10px 0" v-if="isMobileLogin">
            <li class="options" @click="handle('exit')">
                <van-icon class="option-icon" name="arrow" size="17" />
                <span class="option-title">退出登录</span>
            </li>
        </ul>
        <!-- <p class="exit" @click="handle('exit')">退出登录</p> -->
        <van-dialog v-model="nameDialog" title="输入昵称" @cancel="diaCancel('name')" @confirm="editConfirm('name')" show-cancel-button width="285">
            <div class="inp">
                <input maxlength="4" v-model="name" type="text" placeholder="请输入（4字以内）">
            </div>
        </van-dialog>
        <!-- 性别选框 -->
        <van-action-sheet
          v-model="showSex"
          :actions="actions"
          cancel-text="取消"
          :description="description"
          @select="sheetCancel"
        />
    </div>
</template>
<script>
import db from '../../plugins/db'
import AvatarUpload from '../../components/avatarUpload/upload'
import fun from '../../plugins/functions'
export default {
    name:'SelfSetting',
    components:{ AvatarUpload },
    data() {
        return {
            nameDialog:false,
            showSex:false,
            codeDialog:false,
            name:'',
            userInfo:'',
            description:'',
            actions:[],
        }
    },
    created() {
        this.userInfo = db.get('user')
    },
    computed: {
        isMobileLogin(){
            let localAppid = localStorage.getItem('appid');
            let sessAppid = db.get('appid')
            if(localAppid && sessAppid){
                return localAppid == sessAppid
            }else {
                return false
            }
        }
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
        back(){
            this.$router.back();
        },
        diaCancel(type){
            if(type == 'name'){
                this.name = ''
            }
        },
        // 昵称弹框确认按钮
        editConfirm(type) {
            if(type == 'name'){
                if(!this.name){
                    this.$toast('昵称不能为空');
                    return;
                }
                this.userInfo.truename = this.name
                this.editInfo();
            }
        },
        sheetCancel(data){
            if(data.alias == 'sex'){
                let form = {
                    sex:data.name
                }
                this.editInfo(form,'sex');
                this.showSex = false;
            }else if(data.alias == 'exit') {
                localStorage.clear();
                db.set('deviceInfo','');
                db.set('user','');
                db.set('token','');
                this.$store.dispatch('loginStatus',false)
                this.$store.dispatch('getDeviceInfo');
                this.$store.dispatch('setDevices',[]);
                this.$router.push({
                    path:'/self'
                })
            }
        },
        // 修改资料请求
        editInfo(){
            this.setLoading();
            this.$axios.put('/member',this.userInfo).then(res => {
                this.clearLoading();
                console.log(res)
                if(res.status == 200){
                    this.$toast.success('操作成功')
                    db.set('user',this.userInfo)
                }else {
                    this.$toast.fail(res.message)
                }
            })
        },
        handle(type){
            switch(type){
                case 'name' : {
                    // this.nameDialog = true;
                    this.$router.push({
                        path:'/user/nickname'
                    })
                    break;
                }
                case 'sex' : {
                    this.description = '',
                    this.actions = [
                        {name:'男',alias:'sex',color:this.userInfo.sex == '男'?'#C50B0F':''},
                        {name:'女',alias:'sex',color:this.userInfo.sex == '女'?'#C50B0F':''}
                    ]
                    this.showSex = true;
                    break;
                }
                case 'exit' : {
                    this.description = '确定要退出登录？'
                    this.actions = [
                        {name:'确认',color:'#C50B0F',alias:'exit'}
                    ]
                    this.showSex = true;
                    break;
                }
                case 'resetPwd' : {
                    this.$router.push({
                        path:'/editPwd'
                    })
                    break;
                }
                case 'resetMobile' : {
                    this.$router.push({
                        path:'/resetMobile'
                    })
                    break;
                }
                case 'addFamily' : {
                    this.addFamilys();
                    break;
                }
                default : {
                    console.log('错误操作')
                    break;
                }
            }
        },
        // 获取设备列表
        getDevices(){
            this.$axios.get('/family/devices').then(res => {
                if(res.status == 200){
                    this.$store.dispatch('setDevices',res.data);
                    if(res.data.length > 1){
                        return;
                    }else {
                        db.set('deviceInfo',res.data[0]);
                        this.$store.dispatch('getDeviceInfo');
                        this.getNoticeCount(res.data[0].imei_sn);
                        this.getModules(res.data[0].imei_sn)
                    }
                }else {
                    this.$toast(res.message)
                }
            })
        },
        // 获取设备的未读消息数
        getNoticeCount(imei_sn){
            this.$axios.get('/warns/unread',{ imei_sn }).then(res => {
                if (res.status == 200) {
                    this.$store.dispatch('setUnread',res.data.unread)
                }else {
                    this.$toast(res.message);
                }
            })
        },
        // 获取设备所有有的权限列表
        getModules(imei_sn) {
            this.$axios.get('/device/models',{ imei_sn }).then(res => {
                if(res.status == 200){
                    let modules = [];
                    for(let item of res.data.modules){
                        modules.push(item.alias);
                    }
                    this.$store.dispatch('setModules',modules)
                }
            })
        },
        // 裁剪图片的回调函数
        avatarCallback(val){
            this.setLoading();
            let baseFile = val.split(',')[1];
            this.$axios.post('/upload/base/image',{ file:baseFile }).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.userInfo.avatar = res.data.url;
                    this.editInfo();
                }else {
                    this.$toast(res.message)
                }
            })
        },
        dataURLtoFile(dataurl, filename) {//将base64转换为文件
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
    .option-title {
        display: inline-block;
        width: 80px;
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
    .option-icon > :nth-child(n) {
        vertical-align: middle;
    }
    .exit {
        padding: 15px;
        background: #ffffff;
        text-align: center;
        font-size: 14px;
        color: black;
        font-weight: 500;
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
    .no-truename {
        color: #999999;
    }
</style>