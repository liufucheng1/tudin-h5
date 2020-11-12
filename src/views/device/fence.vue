<template>
    <div class="globe-wrap">
        <div class="globe-header">
            <p class="globe-back" @click="back()">
                <van-icon class="globe-header-icon" name="arrow-left" size="25"/>
            </p>
            <p class="globe-title">电子围栏</p>
        </div>
        <van-swipe-cell v-for="(item,index) in list" :key="index">
            <div class="fence-list flex flex-align-item-center">
                <div class="cover">
                    <img :src="item.cover + '-avatar.jpg'" alt="">
                </div>
                <div class="fence-content">
                    <p>
                        <span class="truename">{{ item.truename }}</span>
                        <span class="radius">{{ '半径' + item.radius + '米' }}</span>
                    </p>
                    <p class="address">{{ item.address }}</p>
                </div>
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
        <div class="btn">
            <td-button @click="addFence" :disabled="false" text="新增电子围栏"></td-button>
        </div>
        <van-action-sheet
                v-model="show"
                :actions="actions"
                @select="isDel"
                description="确定删除？"
                cancel-text="取消"/>
    </div>
</template>
<script>
    export default {
        name: 'Fence',
        data() {
            return {
                show: false,
                list: [],
                fence_id: '',
                fence_key: '',
                actions: [
                    {
                        name: '确认',
                        color: '#C50B0F'
                    }
                ]
            }
        },
        created() {
            this.getData();
        },
        methods: {
            // 后退
            back() {
                this.$router.push({path: '/self'})
            },
            // 获取围栏列表
            getData() {
                this.$store.dispatch('getDeviceInfo');
                let imei_sn = this.$store.state.deviceInfo.imei_sn
                this.$axios.get('/fences', {imei_sn}).then(res => {
                    if (res.status == 200) {
                        this.list = res.data
                    } else {
                        this.$toast(res.message);
                    }
                })
            },
            // 删除按钮
            del(item, index) {
                this.fence_id = item.id;
                this.fence_key = index;
                this.show = true;
            },
            // 确认删除
            isDel() {
                this.show = false;
                this.$axios.delete('/fence', {fence_id: this.fence_id}).then(res => {
                    this.$toast(res.message);
                    if (res.status == 200) {
                        this.list.splice(this.fence_key, 1)
                    }
                })
            },
            addFence() {
                if (this.list.length >= 3) {
                    this.$toast('围栏最多只能设置三个')
                    return;
                } else {
                    this.$router.push({
                        name: 'FenceCreate',
                    })
                }
            }
        },
    }
</script>
<style scoepd>
    .fence-list {
        padding: 8px;
        background: #ffffff;
        margin-bottom: 10px;
    }

    .cover {
        width: 62px;
        height: 62px;
        vertical-align: middle;
    }

    .cover > img {
        width: 100%;
        height: 100%;
    }

    .delete-button {
        height: 100%;
    }

    .fence-content {
        margin-left: 8px;
        width: 75%; /*写给不支持calc()的浏览器*/
        width: -moz-calc(100% - 70px);
        width: -webkit-calc(100% - 70px);
        width: calc(100% - 70px);
    }

    .truename, .radius {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
    }

    .truename {
        padding-right: 10px;
        margin-right: 10px;
        border-right: 1px solid #E4E7ED;
    }

    .address {
        margin-top: 8px;
        color: #999999;
        font-size: 12px;
    }

    .btn {
        padding: 0 30px;
        margin-top: 50px;
    }
</style>
