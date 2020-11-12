import db from './db'
import AppLogin from './getToken'
import WechatLogin from './WechatLogin'
import getDevice from './getDevice'
import store from '../store'
import common from './common.js'
export default {
    login:function(){
        // 看本地sessionStroage有没有存token
        let token = db.get('token')
        if(token){
            store.dispatch('loginStatus',true)
            getDevice.main();
        // }else if(localToken){
        }else {
            // 没有的话，url路径中是否带有appid和sign
            let urlData = common.getUrlData();
            if(urlData.appid && urlData.sign) {
                // 有的话
                let localToken = localStorage.getItem('appid_' + urlData.appid + '_token')
                let localUser = localStorage.getItem('appid_' + urlData.appid + '_user')
                if(localToken && localUser){
                    db.set('token',localToken)
                    let appid = localStorage.getItem('appid');
                    let sign = localStorage.getItem('sign');
                    let user = JSON.parse(localUser);
                    db.set('user',user)
                    db.set('appid',appid)
                    db.set('sign',sign)
                    store.dispatch('loginStatus',true)
                    getDevice.main();
                }else {//没有的话
                    let user= navigator.userAgent.toLowerCase();
                    if( user.match(/MicroMessenger/i) == "micromessenger" ) {
                        WechatLogin.login();
                    } else {
                        AppLogin.login();
                    }
                }
            }else {
                let user= navigator.userAgent.toLowerCase();
                if( user.match(/MicroMessenger/i) == "micromessenger" ) {
                    WechatLogin.login();
                } else {
                    AppLogin.login();
                }
            }
        }
    },
}