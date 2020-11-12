<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">邀请好友资料</p>
        </div>
        <ul>
            <li class="options" @click="showShip('group')">
                <p class="option-icon">
                    <span>
                        {{ role_name }}
                    </span>
                    <van-icon class="icon" name="arrow" size="17" />
                </p>
                <p>角色</p>
            </li>
            <li class="options" @click="showShip('ship')">
                <p class="option-icon">
                    <span>
                        {{ form.relation }}
                    </span>
                    <van-icon class="icon" name="arrow" size="17" />
                </p>
                <p>关系</p>
            </li>
            <li class="options">
                <input type="text" maxlength="11" class="option-icon" v-model="form.mobile" placeholder="请输入手机号">
                <p>手机号码</p>
            </li>
            <li class="options">
                <span v-if="disabled" class="option-icon">{{ form.nickname }}</span>
                <input v-else type="text" maxlength="4" class="option-icon" v-model="form.nickname" placeholder="请输入昵称">
                <p>昵称</p>
            </li>
        </ul>
        <p class="tool"> 
            {{ '共有' + data.count + '人加入：' + data.manager }}
        </p>
        <div class="btn">
            <td-button text="提 交" @click="onSubmit()"></td-button>
        </div>
        <van-dialog v-model="shipDialog" title="自定义关系" @cancel="diaCancel()" @confirm="editConfirm()" show-cancel-button width="285">
            <div class="inp">
                <input maxlength="4" v-model="ship" type="text" placeholder="请输入（4字以内）"  @blur="recover">
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
    name:'FamilyCreate',
    data() {
        return {
            loading:null,
            shipShow:false,
            shipDialog:false,
            disabled:false,
            ship:'',
            role_name:'',
            form:{
                imei_sn:'',
                mobile:'',
                relation:'',
                nickname:''
            },
            actions:[],
            data:{
                count:0,
                manager:''
            }
        }
    },
    created() {
        this.$store.dispatch('getDeviceInfo');
        this.form.imei_sn = this.$store.state.deviceInfo.imei_sn;
        this.getData();
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
        // 后退
        back(){
            this.$router.push({
                path:'/familys'
            });
        },
        // 取消昵称修改的按钮
        diaCancel(){
            this.ship = ''
        },
        //点击关系
        showShip(type){
            if(type == 'ship'){
                this.actions = [
                    {name:'亲友',alias:'friend'},
                    {name:'主人',alias:'admin'},
                    {name:'自定义',alias:'custom'}
                ]
            }else if(type == 'group') {
                this.actions = [
                    // {name:'管理员',alias:'role',value:1},
                    {name:'通话成员',alias:'role',value:2},
                    {name:'普通成员',alias:'role',value:3}
                ]
            }
            this.shipShow = !this.shipShow
        },
        //选中关系
        shipCancel(action){
            if(action.alias == 'custom'){
                this.shipShow = false;
                this.shipDialog = true;
            }else if(action.alias == 'role') {
                this.role_name = action.name;
                this.form.group = action.value;
                this.shipShow = false;
            }else {
                this.form.relation = action.name
                this.shipShow = false;
            }
        },
        // 修改昵称确认按钮
        editConfirm(){
            if(!this.ship){
                this.$toast('关系名称不能为空')
                return;
            }
            this.form.relation = this.ship;
        },
        //获取成员列表
        getData(){
            this.setLoading();
            let imei_sn = this.$store.state.deviceInfo.imei_sn
            this.$axios.get('/device/members',{ imei_sn }).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    let str = []
                    res.data.map((item,index) => {
                        str.push(res.data[index].truename)
                    })
                    this.data.manager = str.join(', ');
                    this.data.count = res.data.length
                }else {
                    this.$toast(res.message);
                }
            })
        },
        // 检索输入的手机号码
        getUsername(){
            this.$axios.get('/member',{mobile:this.form.mobile}).then(res => {
                if(res.status == 200){
                    if(res.data.truename){
                        this.form.nickname = res.data.truename;
                        this.disabled = true;
                    }else {
                        this.disabled = false;
                    }
                }else {
                    this.$toast(res.message)
                }
            })
        },
        onSubmit(){
            if(!this.form.nickname) {
                this.$toast('请输入昵称');
                return;
            }
            if(!this.form.relation) {
                this.$toast('选择关系');
                return;
            }
            if(!this.form.mobile) {
                this.$toast('请输入手机号');
                return;
            }
            this.setLoading();
            this.$axios.post('/family/invite',this.form).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.$dialog.alert({
                        width:'284px',
                        title:'提示',
                        message:'邀请码已通过短信发送至该手机号，此用户可通过我的 > 家庭管理 > 加入家庭组，成为该设备的家庭成员'
                    }).then(res => {
                        this.$router.back();
                    })
                }else {
                    this.$toast(res.message)
                }
            })
        }
    },
    watch: {
        'form.mobile':function(){
            if(this.form.mobile.length == 11){
                this.getUsername();
            }else {
                this.disabled = false;
            }
        }
    },
}
</script>
<style scoped>
    .option-icon {
        text-align: right;
        border: none;
        width: 150px;
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
    .tool {
        font-size: 14px;
        margin-top: 5px;
        color: #A2A2A2;
        padding-left: 15px;
    }
    .btn {
        width: 100%;
        padding: 0 30px;
        margin-top: 80px;
    }
</style>