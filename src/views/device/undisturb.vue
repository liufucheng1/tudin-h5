<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">免打扰时段</p>
        </div>
        <van-swipe-cell class="list" v-for="(item,index) in list" :key="index">
            <div class="list-content">
                <p class="list-content-title">
                    {{ item.start + ' - ' + item.end }}
                </p>
                <p class="list-content-content">
                    {{ getWeek(item.dates) }}
                </p>
            </div>
            <van-button
            slot="right"
            square
            icon="delete"
            type="danger"
            class="delete-button"
            @click="del(item,index)"
            />
        </van-swipe-cell>
        <van-action-sheet
        v-model="show"
        :actions="actions"
        @select="isDel"
        description="确定删除？"
        cancel-text="取消"/>
        <div class="add">
            <td-button text="添 加" @click="add"></td-button>
        </div>
    </div>
</template>
<script>
export default {
    name:'UnDisturb',
    data() {
        return {
            show:false,
            idnex:'',
            list:[],
            loading:null,
            actions:[
                {
                    name:'确认',
                    color: '#C50B0F'
                }
            ]
        }
    },
    created() {
        this.getData();
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
        // 计算星期
        getWeek(val){
            let dates = val.split('')
            let newArr = [];
            for(let i in dates){
                switch(dates[i]){
                    case '1' : {
                        newArr.push('周一');
                        break;
                    }
                    case '2' : {
                        newArr.push('周二');
                        break;
                    }
                    case '3' : {
                        newArr.push('周三');
                        break;
                    }
                    case '3' : {
                        newArr.push('周三');
                        break;
                    }
                    case '4' : {
                        newArr.push('周四');
                        break;
                    }
                    case '5' : {
                        newArr.push('周五');
                        break;
                    }
                    case '6' : {
                        newArr.push('周六');
                        break;
                    }
                    case '7' : {
                        newArr.push('周日');
                        break;
                    }
                    default : {
                        break;
                    }
                }
            }
            return newArr.join('\xa0\xa0\xa0')
        },
        // 后退
        back(){
            this.$router.push({path:'/equipment'})
        },
        // 获取数据列表
        getData(){
            // 获取设备信息
            this.$store.dispatch('getDeviceInfo')
            let imei_sn = this.$store.state.deviceInfo.imei_sn;
            this.setLoading();
            this.$axios.get('/device/undisturbs',{ imei_sn }).then(res => {
                this.clearLoading();
                if(res.status == 200){
                    this.list = res.data;
                }else {
                    this.$toast(res.message);
                }
            })
        },
        // 点击删除按钮
        del(val,key){
            this.index = key;
            this.show = true;
        },
        // 点击确认删除按钮
        isDel(){
            this.show = false;
            let imei_sn = this.$store.state.deviceInfo.imei_sn;
            let dates = []
            for(let item of this.list){
                dates.push(item)
            }
            dates.splice(this.index,1);
            let form = {
                imei_sn,
                dates
            }
            this.setLoading();
            this.$axios.put('/device/undisturb',form).then(res => {
                this.clearLoading();
                this.$toast(res.message);
                if(res.status == 200){
                    this.list.splice(this.idnex,1)
                }
            })
        },
        // 添加按钮
        add(){
            if(this.list.length >= 5){
                this.$toast('最多只能添加5个时段');
                return;
            }
            this.$router.push({
                path:'/addUndisturb'
            })
        }
    },
}
</script>
<style scoped>
    .delete-button {
        height: 100%;
    }
    .list-content {
        width: 100%;
        padding: 10px 15px;
        background: #ffffff;
        border-bottom: 1px solid #EBEEF5;
        position: relative;
    }
    .list-content-title {
        font-size: 15px;
        color: #333333;
    }
    .list-content-content {
        font-size: 12px;
        color: #999999;
        margin-top: 8px;
    }
    .add {
        padding: 0 30px;
        margin-top: 30px;
    }
</style>