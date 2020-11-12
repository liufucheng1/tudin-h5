<template>
    <div class="edit-pwd-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25" />
            </p>
            <p class="globe-title">修改密码</p>
        </div>
        <div class="inp-wrap">
            <input v-model="form.old_password" type="password" placeholder="请输入旧密码">
        </div>
        <div class="inp-wrap">
            <input v-model="form.new_password" type="password" placeholder="输入6-16位字母或数字">
        </div>
        <div class="inp-wrap">
            <input v-model="form.confirm_password" type="password" placeholder="请确认新密码">
        </div>
        <td-button class="btn" :disabled="disabled" text="提交" @click="onSubmit"></td-button>
    </div>
</template>
<script>
export default {
    name:'EditPwd',
    data() {
        return {
            disabled:true,
            form:{
                old_password:'',
                new_password:'',
                confirm_password:''
            }
        }
    },
    created() {
        
    },
    methods: {
        back(){
            this.$router.back();
        },
        onSubmit(){
            let len = this.form.new_password.length
            if(len < 6 || len > 16){
                this.$toast('密码只能输入6-16位字母或数字')
                return;
            }
            if(this.form.new_password != this.form.confirm_password){
                this.$toast('两次输入的密码不一致');
                return;
            }
            this.$axios.put('/passport/password',this.form).then(res => {
                this.$toast(res.message);
                if(res.status == 200) {
                    this.back();
                }
            })
        }
    },
    watch: {
        form: {
            handler(newVal, oldVal) {
                if(this.form.old_password != '' && this.form.new_password != '' && this.form.confirm_password != ''){
                    this.disabled = false;
                }else {
                    this.disabled = true;
                };
            },
            deep: true
        }
    },
}
</script>
<style scoped>
    .edit-pwd-wrap {
        padding: 60px 28px 0;
    }
    .inp-wrap {
        padding: 12px 15px;
        background: #F8F8F8;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 15px;
    }
    .inp-wrap > input {
        background: #F8F8F8;
        width: 100%;
        font-size: 14px;
        border: none;
    }
    .btn {
        margin-top: 50px;
    }
</style>