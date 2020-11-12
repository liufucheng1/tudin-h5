import axios from 'axios'
import store from '../store'
import { Toast } from 'vant'
axios.defaults.timeout = 10000;
const prefix = '/api';
axios.interceptors.response.use((res) =>{
    if(res.data.status == 101 || res.data.status == 103){
        Toast(res.data.message);
        store.dispatch('loginStatus',false)
        sessionStorage.setItem('token',null)
    }else{
        return res;
    }

}, (error) => {
    // 根据传回来的错误信息`erroe`进行判断
	// 	意为：`error.code`
	if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
		// console.log('根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案')
        // `这里我 的方案是，超时后再次请求，所以新建了一个promise`
        Toast.clear();
        Toast('网络连接发生问题，请检查您的网络设置')
    }
	// 若不是超时,则返回未错误信息
	return Promise.reject(error)
});

export default {
    post:function(url,data,params){
        if(url == '/user/login' || url == '/wechat/login' || url == '/sms/code'){
            let appid = sessionStorage.getItem('appid');
            axios.defaults.headers.post['appid'] = appid
        }else {
            axios.defaults.headers.post['token'] = sessionStorage.getItem('token');
        }
        axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
        return new Promise((resolve, reject) => {
            axios.post(prefix+url,data,params)
                .then(response => {
                    resolve(response.data);
                }, err => {
                    console.log(error)
                })
                .catch((error) => {

                })
        })
    },
    put:function(url,data,params){
        axios.defaults.headers.put['token'] = sessionStorage.getItem('token');
        axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        return new Promise((resolve, reject) => {
            axios.put(prefix+url,data,params)
                .then(response => {
                    resolve(response.data);
                }, err => {
                    console.log(error)
                })
                .catch((error) => {

                })
        })
    },
    get:function(url,data,params){
        axios.defaults.headers.get['token'] = sessionStorage.getItem('token');
        if(!params){
            params = {};
        }
        if(data){
            params.params = data;
        }

        return new Promise((resolve, reject) => {
            axios.get(prefix+url,params)
                .then(response => {
                    resolve(response.data);
                }, err => {
                    console.log(error)
                })
                .catch((error) => {

                })
        })
    },
    delete:function(url,data,params){
        axios.defaults.headers.delete['token'] = sessionStorage.getItem('token');
        if(!params){
            params = {};
        }
        if(data){
            params.params = data;
        }
        return new Promise((resolve, reject) => {
            axios.delete(prefix+url,params)
                .then(response => {
                    resolve(response.data);
                }, err => {
                    console.log(error)
                })
                .catch((error) => {

                })
        })
    },
}