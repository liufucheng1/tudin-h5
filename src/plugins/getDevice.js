import axios from './http'
import store from '../store'
import db from './db'
import { Toast } from 'vant'
export default {
    main:function(){
        axios.get('/family/devices').then(res => {
            if(res.status == 200){
                store.dispatch('setDevices',res.data);
                var imeiSns = [] //用于装设备号的数组  方便查询判断本地存储的是否有此设备   有的话就不用重新赋值了
                if (res.data.length > 0) {// 如果有设备的话执行下面的操作
                    //将用户的所有的设备的设备号存到数组里面
                    for(let item of res.data){
                        imeiSns.push(item.imei_sn)
                    }
                    // 从本地存储里面获取设备信息，并存到vuex里面
                    store.dispatch('getDeviceInfo')
                    // 获取vuex中的设备信息
                    let deviceInfo = store.state.deviceInfo
                    // 如果vuex.deviceInfo里面存储的有数据的话
                    if(deviceInfo){
                        // 判断用户是否有此设备
                        if(imeiSns.indexOf(deviceInfo.imei_sn) < 0){
                            // 如果没有的话，存后台获取的数据中的第一个设备信息
                            db.set('deviceInfo',res.data[0]);
                        }
                    }else {
                        // 如果vuex.deviceInfo里面存储的没有数据的话，那么就存从后台获取的设备列表的第一个设备信息
                        db.set('deviceInfo',res.data[0])
                    }
                    // 走到这一步，说明本地存储sessionStorage存的已经有一个设备信息，用vuex中的actions方法获取设备信息
                    store.dispatch('getDeviceInfo')
                    // 获取当前设备的imei_sn
                    let imei = store.state.deviceInfo.imei_sn
                    this.getNoticeCount(imei);
                    this.getModules(imei);
                }else {
                    store.dispatch('setIsNoDevice',true);
                    db.set('deviceInfo','');
                    store.dispatch('getDeviceInfo')
                }
            }else {
                Toast(res.message);
            }
        });
    },
    // 获取设备的未读消息数
    getNoticeCount:function(imei_sn){
        axios.get('/warns/unread',{ imei_sn }).then(res => {
            if (res.status == 200) {
                store.dispatch('setUnread',res.data.unread)
            }else {
                Toast(res.message);
            }
        })
    },
    // 获取设备所有有的权限列表
    getModules:function(imei_sn) {
        axios.get('/device/models',{ imei_sn }).then(res => {
            if(res.status == 200){
                let modules = [];
                for(let item of res.data.modules){
                    modules.push(item.alias);
                }
                store.dispatch('setModules',modules)
            }
        })
    },
}