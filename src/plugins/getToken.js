import common from './common'
import axios from './http'
import store from '../store'
import db from './db'
import { Toast } from 'vant'
import router from '../router'
import getDevice from './getDevice'
export default {
    // 入口函数
    login: function(){
        // 首先是判断url中是否携带有appid、sign等参数，有的话用url中的参数判断登录方式
        var urlData = common.getUrlData();
        if(urlData.sign && urlData.appid){
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
    // 获取url中带的参数并使用这些参数进行登录
    getToken:function(urlData){
        db.set('out_sn',urlData.out_sn)
        db.set('sign', urlData.sign)
        db.set('appid',urlData.appid)
        this.userLogin(urlData.out_sn, urlData.sign,urlData.appid)
    },
    userLogin(out_sn, sign, appid){
        axios.post('/user/login',{out_sn, sign, appid }).then(res => {
            if(res.status == 200){
                db.set('user',res.data)
                db.set('token',res.data.token)
                store.dispatch('setToken',res.data.token);
                store.dispatch('loginStatus',true)
                getDevice.main();
                if(res.data.is_new_member == 1){
                    router.push({
                        path:'/self'
                    })
                }   
            }else {
                alert(res.message)
            }
        })
    },
    // 获取登录方式
    getLoginType(form) {
        axios.get('/user/registertype',form).then(res => {
            if(res.status == 200){
                if(res.data.register_type == 2){//微信登录
                    Toast('请使用微信打开')
                }else if(res.data.register_type == 3) {//手机号登录
                    localStorage.setItem('appid',form.appid);
                    localStorage.setItem('sign',form.sign);
                    db.set('appid',form.appid)
                    db.set('sign',form.sign)
                    router.push({
                        path:'/login'
                    })
                }else if(res.data.register_type == 1) {//out_sn登录
                    this.getToken(form);
                }
            }else {
                Toast(res.message)
            }
        })
    }
}