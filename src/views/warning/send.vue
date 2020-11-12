<template>
    <div class="warning-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">发布预警</p>
        </div>
        <div class="warning-content">
            <p class="warning-content-title" v-show="!isAuth">
                <span>实名认证</span>
            </p>
            <img v-if="src" :src="src" alt="">
            <div v-show="!isAuth"> 
                <van-field label="家长姓名" v-model="name" placeholder="请输入姓名（必填）"></van-field>
                <van-field label="身份证号码" v-model="id_number" placeholder="请输入身份证号码（必填）"></van-field>
            </div>
            <p class="warning-content-title">
                <span>基本信息</span>
            </p>
            <!-- 基本信息表单 -->
            <div class="children-info">
                <!-- 儿童照片 -->
                <van-field name="images" label="照片">
                    <template slot="input">
                        <van-uploader accept="image/png, image/jpeg, image/jpg" v-model="imgages" :after-read="afterRead" :before-read="beforeRead" :before-delete="deforeDelete"></van-uploader>
                    </template>
                </van-field>
                <!-- 儿童姓名 -->
                <van-field name="child_name" label="姓名" v-model="form.child_name" placeholder="请输入姓名（必填）"></van-field>
                <!-- 儿童出生日期 -->
                <van-field name="birthday" label="出生日期" placeholder="请选择生日（必选）" @click="showBirthday = true" right-icon="arrow">
                    <template slot="input">
                        <span v-text="form.child_date_of_birth?form.child_date_of_birth:'请选择生日（必选）'" :class="{'no-birthday' : !form.child_date_of_birth}"></span>
                    </template>
                </van-field>
                <!-- 儿童性别 -->
                <van-field name="child_gender" label="性别">
                    <template slot="input">
                        <van-radio-group v-model="form.child_gender" direction="horizontal" checked-color="#FDD100">
                            <van-radio icon-size="16px" name="1">男</van-radio>
                            <van-radio icon-size="16px" name="0">女</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <!-- 儿童籍贯 -->
                <van-field name="nativePlace" label="籍贯" @click="showArea = true" right-icon="arrow">
                    <template slot="input">
                        <span v-text="area?area:'请选择籍贯（必选）'" :class="{'no-birthday' : !area}"></span>
                    </template>
                </van-field>
                <!-- 补充信息 -->
                <van-field label="补充信息" v-model="form.child_lost_info" rows="2" autosize type="textarea" placeholder="建议填写儿童走失时的具体信息（必填）" />
                <van-field name="loseTime" label="丢失时间" @click="showLose = true" right-icon="arrow">
                    <template slot="input">
                        <span v-text="form.child_lost_time"></span>
                    </template>
                </van-field>
                <!-- 丢失地址 -->
                <van-field label="丢失地址" @click="lostAddress()" right-icon="arrow">
                    <template slot="input">
                        <p class="lost-address" v-text="form.child_lost_address?form.child_lost_address:'请选择丢失地址（必选）'" :class="{'no-birthday' : !form.child_lost_address}"></p>
                    </template>
                </van-field>
                <!-- 地址补充 -->
                <van-field label="详细地址" v-model="address_copy" rows="2" autosize type="textarea" placeholder="建议填写丢失的详细地址" @input="supAddress()" @focus="supAddressBlur()" />
            </div>
            <p class="warning-content-title">
                <span>联系人信息</span>
            </p>
            <div>
                <!-- 紧急联系人 -->
                <van-field name="emergence" label="姓名" v-model="form.emergence_contact" placeholder="请输入联系人姓名（必填）"></van-field>
                <!-- 紧急联系人电话  -->
                <van-field name="emergence_phone" type="number" maxlength="11" label="电话" v-model="form.emergence_phone" placeholder="请输入联系人电话（必填）"></van-field>
            </div>
            <!-- 预警协议 -->
            <div class="auth-protocal">
                <van-checkbox icon-size="14px" v-model="checked" shape="square" checked-color="#fdd100">我已阅读并同意<span class="auto-protocal-tite" @click.stop="jumpProtocal">《预警协议》</span></van-checkbox>
            </div>
            <!-- 提交 -->
            <div class="on-submit">
                <td-button text="提交" :disabled="disabled" @click="onSubmit"></td-button>
            </div>
        </div>
        <!-- 生日选择器 -->
        <div class="birthday-time-wrap" v-show="showBirthday">
            <van-datetime-picker
            class="birthday-time"
            v-model="nowDate"
            type="date"
            title="选择年月日"
            :min-date="minDate"
            :max-date="maxDate"
            @cancel="showBirthday = false"
            @confirm="timeConfirm"
            v-show="showBirthday"
            :formatter="formatter"
            />
        </div>
        <!-- 籍贯选择器 -->
        <div class="birthday-time-wrap" v-if="showArea">
            <van-area
            class="birthday-time"
            title="籍贯"
            v-if="showArea"
            :area-list="areaList"
            @cancel="showArea = false"
            @confirm="areaConfirm"
            />
        </div>
        <!-- 丢失时间选择器  -->
        <div class="birthday-time-wrap" v-if="showLose">
            <van-datetime-picker
            class="birthday-time"
            v-if="showLose"
            v-model="loseDate"
            @cancel="showLose = false"
            @confirm="loseTimeConfirm"
            :max-date="maxDate"
            type="datetime"
            title="儿童丢失时间"
            :formatter="formatter"
            />
        </div>
    </div>
</template>
<script>
// 地区json
import areas from '../../plugins/area.js'
// 发送短信
import sendWarning from '../../plugins/sendWarning'
// 存储
import db from '../../plugins/db.js'
// 解决iphone上传旋转90度
import fileUtils from '../../plugins/fileUtils'
import fun from '../../plugins/functions'
export default {
    name:'Warning',
    data() {
        return {
            // 生日最小和最大值
            minDate: new Date(2000, 1, 1),
            maxDate: new Date(),
            // 同义协议状态
            checked:false,
            // 按钮状态
            disabled:true,
            // 儿童照片
            imgages:[],
            // 默认生日为今天
            nowDate:new Date(),
            // 生日选择器的开关
            showBirthday:false,
            // 籍贯选择器的开关
            showArea:false,
            // 籍贯显示的字符串，例如：河南省郑州市金水区
            area:'',
            // 全国省市区json
            areaList:areas,
            // 失踪事件的控制开关
            showLose:false,
            // 失踪事件绑定的值
            loseDate:new Date(),
            // 丢失地址显示的字符串
            address:'',
            address_copy:'',
            // 是否已经认证身份
            isAuth:false,
            // 家长实名信息
            name:'',
            id_number:'',
            // loading用来控制页面加载效果
            loading:null,
            src:'',
            form:{
                child_lost_info:'',//儿童丢失的补充信息
                child_name:'',//儿童姓名
                child_date_of_birth:'',//儿童生日
                child_pics:'',//儿童照片
                child_gender:'',//儿童性别
                child_province:'',//籍贯 -> 省
                child_city:'',//籍贯 -> 市
                child_county:'',//籍贯 -> 区
                child_lost_time:'',//孩子丢失时间
                child_lost_address:'',//孩子丢失地址
                child_lost_lon:'',//孩子走失经度(GCJ-02)
                child_lost_lat:'',//孩子走失维度(GCJ-02)
                emergence_phone:'',//紧急联系人电话
                emergence_contact:'',//紧急联系人姓名
            }
        }
    },
    created() {
        let time = new Date()
        this.getNowTime(time);
        this.isAuthUser();
        let query = this.$route.query
        if(query.type){
            let data = db.get('warning_form')
            this.getData(data);
            if(query.type == 'address'){
                this.form.child_lost_lon = query.lng;
                this.form.child_lost_lat = query.lat;
                this.form.child_lost_address = query.addressContent;
                this.address = query.addressContent;
            }
        }
    },
    methods: {
        formatter(type, val) {
            if (type === 'year') {
                return `${val}年`;
            } else if (type === 'month') {
                return `${val}月`;
            } else if( type == 'day' ) {
                return `${val}日`
            } else if( type == 'hour' ) {
                return `${val}时`
            }else if( type == 'minute' ){
                return `${val}分`
            }
            return val;
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
        // 点击跳转至预警协议
        jumpProtocal(){
            this.setWarningForm();
            this.$router.push({
                path:'/warning/protocal'
            })
        },
        // 点击跳转至选择位置地址
        lostAddress(){
            this.setWarningForm();
            this.$router.push({
                path:'/warning/lost/address',
                query:{
                    type:'send'
                }
            })
        },
        // 将表单数据进行本地化存储，以防数据丢失
        setWarningForm(){
            if(this.id_number){
                this.form.id_number = this.id_number
            }
            if (this.name) {
                this.form.name = this.name
            }
            db.set('warning_form',this.form);
            db.set('warning_area',this.area)
        },
        clearWarningForm(){
            db.set('warning_form','');
            db.set('warning_area','')
        },
        // 后退
        back(){
            this.clearWarningForm();
            this.$router.push({
                path:'/warning'
            });
        },
        // 获取用户认证情况
        isAuthUser(){
            this.setLoading();
            this.$axios.get('/early/authuser').then(res => {
                this.clearLoading();
                if(res.status == 200){
                    if(res.data.is_auth == 0){
                        this.isAuth = false
                    }else {
                        this.isAuth = true
                    }
                }else {
                    this.$toast(res.message)
                }
            })
        },
        // 文件读取前的操作
        beforeRead(file){
            // let isSize =  file.size/1024 < 2048;
            let isType = file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/jpeg';
            // if(!isSize){
            //     this.$toast('图片最大不能超过2M')
            // }
            if (!isType) {
                this.$toast('图片格式只能为 png 或 jpg 格式')
            }
            return isType
        },
        // 文件读取完后的操作
        afterRead(file,index){
            file.status = 'uploading';
            file.message = '上传中...';
            new Promise((resolve) => {
                // 解决iphone拍照问题
                fileUtils.getOrientation(file.file).then((orient) => {
                    if (orient && orient === 6) {
                        let reader = new FileReader()
                        let img = new Image()
                        reader.onload = (e) => {
                            img.src = e.target.result
                            img.onload = function () {
                            const data = fileUtils.rotateImage(img, img.width, img.height)
                            const newFile = data
                            resolve(newFile)
                            }
                        }
                        reader.readAsDataURL(file.file)
                    } else {
                        resolve(file.content)
                    }
                })
            }).then(resolve => {
                // 压缩图片
                var src = resolve;
                let canvas =  document.createElement('canvas')  
                let context = canvas.getContext('2d') 
                let img = new Image()
                img.src = src
                img.onload = () => {
                    var width = img.width;
                    var height = img.height
                    canvas.width = width
                    canvas.height = height
                    context.drawImage(img, 0, 0, width, height)
                    src = canvas.toDataURL(file.file.type, 0.35) 
                    src = src.split(',')[1]
                    // 上传
                    this.$axios.post('/upload/base/image',{ file:src }).then(res => {
                        if(res.status == 200){
                            file.message = '上传成功',
                            file.status = 'success'
                            if(this.form.child_pics){
                                this.form.child_pics += ',' + res.data.url
                            }else {
                                this.form.child_pics = res.data.url;
                            }
                        }else {
                            this.imgages.splice(index.index,1)
                            file.message = res.message;
                            file.status = 'failed'
                        }
                    })
                } 
            }) 
        },
        // 删除前的操作
        deforeDelete(file,index){
            let arr = this.form.child_pics.split(',');
            arr.splice(index.index,1);
            this.form.child_pics = arr.join(',')
            return true;
        },
        // 用来格式化丢失时间
        getNowTime(val){
            let date = new Date(val);
            
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            if(month < 10) month = '0' + month;
            let day = date.getDate();
            if(day < 10) day = '0' + day;
            let hours = date.getHours();
            if(hours < 10) hours = '0' + hours;
            let minute = date.getMinutes();
            if(minute < 10) minute = '0' + minute;
            let time = year + '-' + month + '-' + day + ' ' + hours + ':' + minute + ':00';
            this.form.child_lost_time = time;
        },
        // 格式化生日时间
        timeConfirm(val){
            let date = new Date(val);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            if(month < 10) month = '0' + month;
            let day = date.getDate();
            if(day < 10) day = '0' + day;
            this.form.child_date_of_birth = year + '-' + month + '-' + day;
            this.showBirthday = false;
        },
        // 籍贯选择的确认按钮
        areaConfirm(val){
            let addresss = val
            this.area = '';
            for (let i = 0; i < addresss.length; i++) {
                this.area += addresss[i].name;
                if(i == 0){
                    this.form.child_province = addresss[i].code;
                }else if(i == 1) {
                    this.form.child_city = addresss[i].code;
                }else if(i == 2){
                    this.form.child_county = addresss[i].code;
                }
            }
            this.showArea = false;
        },
        // 丢失时间选择器确定按钮
        loseTimeConfirm(val){
            this.getNowTime(val);
            this.showLose = false
        },
        getData(data){
            if(data.aid){
                this.form.aid = data.aid;
            }
            // 儿童照片
            if(data.child_pics){
                let imgs = data.child_pics.split(',');
                for(let url of imgs){
                    let obj = { url };
                    this.imgages.push(obj)
                }
                this.form.child_pics = data.child_pics
            }else {
                this.imgages = []
            }
            // 儿童姓名
            this.form.child_name = data.child_name;
            // 儿童生日
            if(data.child_date_of_birth){
                // console.log(data.child_date_of_birth)
                let new_birth = data.child_date_of_birth.split('-').join('/')
                this.timeConfirm(new_birth);
            }
            // 儿童性别
            if(data.child_gender){
                this.form.child_gender = String(data.child_gender)
                // this.form.child_gender = data.child_gender
            };
            // 儿童籍贯
            if(data.child_county){
                this.form.child_county = data.child_county;
                this.form.child_city = data.child_city;
                this.form.child_province = data.child_province;
                let area = db.get('warning_area');
                if(area){
                    this.area = area;
                }
            }
            // 补充信息
            if(data.child_lost_info){
                this.form.child_lost_info = data.child_lost_info
            }
            // 丢失时间
            if(data.child_lost_time){
                let new_lost_time = data.child_lost_time.split('-').join('/')
                console.log(new_lost_time)
                this.getNowTime(new_lost_time)
            }
            // 丢失地点
            if(data.child_lost_address){
                this.form.child_lost_address = data.child_lost_address
            }
            // 丢失地点坐标
            if (data.child_lost_lon) {
                this.form.child_lost_lon = data.child_lost_lon;
                this.form.child_lost_lat = data.child_lost_lat;
            }
            //紧急联系人电话
            if(data.emergence_phone){
                this.form.emergence_phone = data.emergence_phone;
            }
            //紧急联系人姓名
            if(data.emergence_contact){
                this.form.emergence_contact = data.emergence_contact;
            }
            // 实名信息
            if(data.name){
                this.form.name = data.name;
                this.name = data.name;
            }
            if(data.id_number){
                this.form.id_number = data.id_number;
                this.id_number = data.id_number;
            }
            // 失踪经纬度
            if(data.child_lost_lon){
                this.form.child_lost_lon = data.child_lost_lon;
                this.form.child_lost_lat = data.child_lost_lat;
            }
            this.formDirection();
        },
        supAddress(){
            this.form.child_lost_address = this.address + this.address_copy;
            console.log(this.form.child_lost_address)
        },
        supAddressBlur(){
            if(!this.form.child_lost_lon || !this.form.child_lost_address || !this.form.child_lost_lat){
                this.$dialog.alert({
                    width:'284px',
                    title:'提示',
                    message:'请选选择丢失位置',
                    // confirmButtonColor:'#C50B0F'
                }).then(() => {
                    this.lostAddress();
                }).catch(() => {

                })
            }
        },
        onSubmit(){
            if(!this.isAuth){
                this.form.name = this.name;
                this.form.id_number = this.id_number;
            }
            if(!fun.isMobile(this.form.emergence_phone)){
                this.$toast('请输入正确的手机号码');
                return
            }
            let resType = '';
            if(this.form.aid){
                resType = 'put'
            }else {
                resType = 'post'
            }
            this.setLoading();
            this.$axios[resType]('/early',this.form).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.$toast.success('操作成功!')
                    this.clearWarningForm();
                    this.$router.push({
                        path:'/warning'
                    })
                }else {
                    this.$toast(res.message)
                }
            })
        },
        // 表单检测
        formDirection(){
            // 表单
            for(let item in this.form){
                if(!this.form[item]){
                    this.disabled = true;
                    return;
                }
            }
            // 身份认证信息
            if(!this.isAuth){
                if(!this.name || !this.id_number){
                    this.disabled = true;
                    return;
                }
            }
            // 预警协议
            if(!this.checked){
                this.disabled = true;
                return;
            }
            this.disabled = false;
        }
    },
    watch: {
        // form表单有变动的话进行表单检测
        form: {
            handler(newVal, oldVal) {
                this.formDirection()
            },
            deep: true
        },
        // 预警协议勾选变动的话进行表单检测
        checked:function(){
            this.formDirection();
        },
        // 身份信息变化对表单进行检索
        name:function(){
            this.formDirection();
        },
        id_number:function(){
            this.formDirection();
        }
    }
}
</script>
<style scoped>
    .warning-wrap {
        padding-top: 44px;
        min-height: 100vh;
        background: #ffffff;
    }
    .warning-content-title {
        background: #fafafa;
        padding: 8px;
        font-size: 14px;
    }
    .warning-content-title > span {
        padding-left: 8px;
        border-left: 3px solid #fdd100;
    }
    /* 生日选择器 */
    .birthday-time-wrap {
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.4);
        position: fixed;
        top: 0;
        left: 0;
    }
    .birthday-time {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
    }
    .no-birthday {
        color: #999999;
    }
    .on-submit {
        padding: 0 20px;
        margin-bottom: 30px;
    }
    .auto-protocal-tite {
        color: #FDD100;
    }
    .auth-protocal {
        font-size: 12px;
        padding: 10px 16px;
    }
    .lost-address {
        word-wrap: break-word;
	    word-break: break-all;
    }
</style>