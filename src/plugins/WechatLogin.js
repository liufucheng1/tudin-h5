import common from './common'
import axios from './http'
import store from '../store'
import db from './db'
import { Toast, Form } from 'vant'
import router from '../router.js'
import getDevice from './getDevice'
import appLogin from './getToken'
export default {
    // 入口函数
    login:function(){
        var urlData = common.getUrlData();
        //注意：这里要多加一个code的判断，判断是不是从微信授权链接跳转过来的，如果是:从本地获取拿到urlData中的code  从本地获取appid，然后请求/api/wechat/user，此方法就是通过code获取微信用户的信息的，然后拿到信息之后再用这些信息请求/api/wechat/login 其中重要的参数有openid
        if(urlData.code){
            let appid = db.get('appid')
            // 拿到code码之后 通过code码和appid   去获取用户信息
            this.getUserInfo(urlData.code, appid)
        }else if(urlData.appid && urlData.sign){
            db.set('appid',urlData.appid)
            db.set('sign',urlData.sign)
            // 这里获取登录方式 登录方式为三种：APP嵌入out_sn登录、微信openid登录、手机号登录
            db.set('url_data',urlData)
            this.getLoginType(urlData);
        }else {
            // 没有的话从本地取，看是否存过appid、sign等参数，有的话拿这些参数获取登录方式
            let newUrlData = db.get('url_data');
            if(newUrlData && newUrlData.sign && newUrlData.appid){
                this.getLoginType(newUrlData);
            }else {
                // 如果本地也没有，url参数中也没有，那就提示应用不存在
                Toast('应用不存在')
            }
        }
    },
    // 获取微信授权链接
    getAutoUrl(appid,sign){
        var loading = Toast.loading({
            duration:0,//不自动消失
            message:'加载中...',
            forbidClick: true,//加载的时候禁止其他屏幕操作
            loadingType: 'spinner'
        })
        axios.get('/wechat/oauth',{ appid }).then(res => {
            loading.clear();
            loading = null
            if(res.status == 200){
                console.log(res.data)
                window.location.href = res.data.url;
            }else {
                Toast(res.message)
            }
        })
    },
    // 通过code和appid获取微信用户的基本信息
    getUserInfo( code, appid ) {
        axios.get('/wechat/user',{ code, appid }).then(res => {
            if(res.status == 200){
                let obj = {
                    appid,
                    sign:db.get('sign'),
                    openid:res.data.openid,
                    nickname:res.data.nickname,
                    avatar:res.data.headimgurl
                }
                this.userLogin(obj)
            }else {
                Toast(res.message)
            }
        })
    },
    userLogin(userInfo){
        var loading = Toast.loading({
            duration:0,//不自动消失
            message:'登录中...',
            forbidClick: true,//加载的时候禁止其他屏幕操作
            loadingType: 'spinner'
        })
        axios.post('/wechat/login',userInfo).then(res => {
            loading.clear();
            loading = null
            if(res.status == 200){
                db.set('user',res.data)
                db.set('token',res.data.token)
                store.dispatch('loginStatus',true)
                store.dispatch('setToken',res.data.token);
                getDevice.main();
                if(res.data.is_new_member == 1){
                    router.push({
                        path:'/self'
                    })
                } 
            }else {
                Toast(res.message)
            }
        })
    },
    getLoginType: function(form){
        axios.get('/user/registertype',form).then(res => {
            if(res.status == 200){
                if(res.data.register_type == 2){//微信登录
                    this.getAutoUrl(form.appid, form.sign);
                }else if(res.data.register_type == 3) {//手机号登录
                    localStorage.setItem('appid',form.appid);
                    localStorage.setItem('sign',form.sign);
                    db.set('appid',form.appid);
                    db.set('sign',form.sign);
                    router.push({
                        path:'/login'
                    })
                }else if(res.data.register_type == 1) {//out_sn登录
                    appLogin.getToken(form);
                }
            }else {
                Toast(res.message)
            }
        })
    }
}