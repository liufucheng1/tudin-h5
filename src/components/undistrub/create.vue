<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">添加时段</p>
        </div>
        <ul>
            <li class="options">
                <p class="option-icon" @click="setTime('start')">
                    <span>{{ form.start?form.start:'请选择开始时间' }}</span>
                    &nbsp;
                    <van-icon class="icon" name="arrow" size="17" />
                </p>
                <p>开始时间</p>
            </li>
            <li class="options" @click="setTime('end')">
                <p class="option-icon">
                    <span>{{ form.start?form.end:'请选择结束时间' }}</span>
                    &nbsp;
                    <van-icon class="icon" name="arrow" size="17" />
                </p>
                <p>结束时间</p>
            </li>
            <li class="options" @click="setTime('week')">
                <p class="option-icon">
                    <span>{{ weekStr }}</span>
                    &nbsp;
                    <van-icon class="icon" name="arrow" size="17" />
                </p>
                <p>选择日期</p>
            </li>
        </ul>
        <div class="time-picker" v-if="showTimePicker || showWeekPicker">
            <van-datetime-picker
            v-if="showTimePicker"
            class="picker"
            type="time"
            :title="pickerTitle"
            v-model="timePicker"
            @confirm='confirm($event,"time")'
            @cancel="cancel()"/>
            <div class="week picker" v-else-if="showWeekPicker">
                <p class="week-head">
                    <span @click="cancel()"> 取消 </span>
                    <span class="tit"> {{ pickerTitle }} </span>
                    <span @click="confirm(null,'week')">确定</span>
                </p>
                <van-checkbox-group v-model="week" checked-color="#FDD100">
                    <van-cell-group>
                        <van-cell
                        v-for="(item, index) in list"
                        clickable
                        :key="index"
                        :title="item.title"
                        >
                            <van-checkbox slot="right-icon" :name="item.value" ref="checkboxes" />
                        </van-cell>
                    </van-cell-group>
                </van-checkbox-group>
            </div>
        </div>
        <div class="on-submit">
            <td-button text="添 加" @click="onSubmit"></td-button>
        </div>
    </div>
</template>
<script>
export default {
    name:'AddUndisturb',
    data() {
        return {
            loading:null,
            showTimePicker:false,
            showWeekPicker:false,
            timePicker:'00:00',
            week:[],
            weekStr:'',
            type:'',
            pickerTitle:'',
            form:{},
            list:[
                {
                    title:'周一',
                    value:1
                },{
                    title:'周二',
                    value:2
                },{
                    title:'周三',
                    value:3
                },{
                    title:'周四',
                    value:4
                },{
                    title:'周五',
                    value:5
                },{
                    title:'周六',
                    value:6
                },{
                    title:'周日',
                    value:7
                },
            ]
        }
    },
    created() {
        
    },
    methods: {
        setLoading(){
            this.loading = this.$toast.loading({
                duration:0,//不自动消失
                message:'提交中...',
                forbidClick: true,//加载的时候禁止其他屏幕操作
                loadingType: 'spinner'
            })
        },
        clearLoading(){
            this.loading.clear();
            this.loading = null;
        },
        back() {
            this.$router.push({path:'/undisturb'})
        },
        // 点击操作列表
        setTime(type){
            if(type == 'start' || type == 'end'){
                this.showTimePicker = true;
                if(type == 'start'){
                    this.pickerTitle = '开始时间'
                }else if(type == 'end'){
                    this.pickerTitle = '结束时间'
                }
            }else if(type == 'week') {
                this.showWeekPicker = true;
                this.pickerTitle = '日期'
            }
            this.type = type;
        },
        // 点击选择日期上面的取消按钮
        cancel(){
            this.showWeekPicker = false;
            this.showTimePicker = false
        },
        // 点击日期选择上面的确认按钮
        confirm(val,type){
            if(type == 'time'){
                if(this.type == 'start'){
                    this.form.start = val
                }else if(this.type == 'end') {
                    this.form.end = val
                }
            }else if(type == 'week') {
                this.week.sort();
                this.form.week = this.week.join('')
                this.getWeek();
            }
            this.cancel();
        },
        // 计算星期
        getWeek(){
            this.week.sort();
            let newArr = [];
            for(let i in this.week){
                switch(this.week[i]){
                    case 1 : {
                        newArr.push('周一');
                        break;
                    }
                    case 2 : {
                        newArr.push('周二');
                        break;
                    }
                    case 3 : {
                        newArr.push('周三');
                        break;
                    }
                    case 4 : {
                        newArr.push('周四');
                        break;
                    }
                    case 5 : {
                        newArr.push('周五');
                        break;
                    }
                    case 6 : {
                        newArr.push('周六');
                        break;
                    }
                    case 7 : {
                        newArr.push('周日');
                        break;
                    }
                    default : {
                        break;
                    }
                }
            }
           this.weekStr = newArr.join(' ')
        },
        onSubmit(){
            if(!this.form.start){
                this.$toast('请选择开始时间');
                return;
            }
            if(!this.form.end){
                this.$toast('请选择结束时间')
                return;
            }
            if(!this.form.week){
                this.$toast('请选择日期')
                return;
            }
            this.setLoading();
            this.$store.dispatch('getDeviceInfo');
            this.form.imei_sn = this.$store.state.deviceInfo.imei_sn;
            this.form.dates = this.form.week;
            this.$axios.post('/device/undisturb',this.form).then(res => {
                this.clearLoading();
                this.$toast(res.message);
                if(res.status == 200){
                    this.$router.push({
                        path:'/undisturb'
                    })
                }
            })
        }
    },
}
</script>
<style scoped>
    .option-icon > span {
        vertical-align: middle;
    }
    .option-icon > .icon {
        vertical-align: middle;
    }
    .time-picker {
        z-index: 2;
        position: fixed;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.4);
    }
    .picker {
        position:absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }
    .week {
        background: #FFFFFF;
    }
    .week-head {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #1989FA;
    }
    .week-head > .tit {
        color: #000000;
        font-size: 16px;
    }
    .on-submit {
        margin-top: 30px;
        padding: 0 30px;
    }
</style>