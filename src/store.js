import Vue from 'vue'
import Vuex from 'vuex'
import db from './plugins/db'
Vue.use(Vuex)

const state = {
    devices:[],
    isLogin:false,
    deviceInfo:null,
    unRead:0,
    relativeInfo:null,
    modules:[],
    token:null,
    isNoDevice:false,
    showDeviceList:false,
    safetyInfoSwitch: true,
};

const getters = {};
const mutations = {
    SET_DEVICES : (state,value) => {
        state.devices = value;
    },
    LOGIN_STATUS : (state,value) => {
        state.isLogin = value
    },
    GET_DEVICE_INFO : (state) => {
        state.deviceInfo = db.get('deviceInfo')
    },
    SET_UNREAD : (state,value) => {
        state.unRead = value
    },
    SET_RELATIVE_INFO : (state,value) => {
        state.relativeInfo = value
    },
    SET_MODULES : (state,value) => {
        state.modules = value;
    },
    SET_TOKEN : (state,value) => {
        state.token = value
    },
    SET_IS_NO_DEVICE : (state,value) => {
        state.isNoDevice = value
    },
    SET_SHOW_DEVICE_LIST : (state, value) => {
        state.showDeviceList = value
    },
    SET_SAFETY_INFO_SWITCH: (state) => {
        state.safetyInfoSwitch = !state.safetyInfoSwitch
    },
};

const actions = {
    // 设置设备列表
    setDevices({ commit },value){
        commit('SET_DEVICES',value);
    },
    // 登录状态
    loginStatus({ commit },value) {
        commit('LOGIN_STATUS',value)
    },
    // 获取设备信息
    getDeviceInfo({ commit }) {
        commit('GET_DEVICE_INFO')
    },
    // 设置未读消息数
    setUnread({ commit },value) {
        commit('SET_UNREAD',value)
    },
    setRelativeInfo({ commit },value) {
        commit('SET_RELATIVE_INFO',value)
    },
    //设置权限
    setModules({ commit },value){
        commit('SET_MODULES',value)
    },
    // 设置token
    setToken({ commit },value){
        commit('SET_TOKEN',value)
    },
    // 设置是否显示安全页无设备提示信息
    setIsNoDevice({ commit }, value) {
        commit('SET_IS_NO_DEVICE',value)
    },
    // 设置设备列表显示开关
    setShowDeviceList({ commit }, value){
        commit('SET_SHOW_DEVICE_LIST',value)
    },
    // 设置安全页 设备信息折叠
    setSafetyInfoSwitch({ commit }) {
        commit('SET_SAFETY_INFO_SWITCH')
    }
};

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})
