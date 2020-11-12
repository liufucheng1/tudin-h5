<template>
    <span>
        <template v-if="isOnline">

            <img class="td-power-icon" :alt="'电量'+value+'%'" v-if="value >=90"
                 src="https://store.cdn.xu5g.com/signal_icon%20copy@3x%20%281%29.png">
            <img class="td-power-icon" :alt="'电量'+value+'%'" v-if="value>20 && value < 90"
                 src="https://store.cdn.xu5g.com/battery_four_icon@3x.png"/>
            <img class="td-power-icon" :alt="'电量'+value+'%'" v-if="value <=20"
                 src="https://store.cdn.xu5g.com/battery_fless_icon@3x.png"/>
            <span class="td-power-span">
                {{ powerRate + '%' }}
            </span>
        </template>
        <template v-else>

            <img class="td-power-icon" :alt="'电量'+value+'%'" v-if="value >=90"
                 src="https://store.cdn.xu5g.com/shh5_unonline_power_four.png">
            <img class="td-power-icon" :alt="'电量'+value+'%'" v-if="value>20 && value < 90"
                 src="https://store.cdn.xu5g.com/shh5_unonline_power_three.png"/>
            <img class="td-power-icon" :alt="'电量'+value+'%'" v-if="value <=20"
                 src="https://store.cdn.xu5g.com/shh5_unonline_power_one.png"/>
            <span class="td-power-span">
                {{ powerRate + '%' }}
            </span>
        </template>
    </span>
</template>

<script>
    export default {
        name: 'DevicePower',
        props: {
            value: {
                type: Number,
                default: 0
            },
            isOnline: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                powerRate: 0
            }
        },
        mounted() {
            if (this.value) {
                this.powerRate = this.value
            } else {
                this.powerRate = 0
            }
        },
        watch: {
            value: function () {
                if (this.value) {
                    this.powerRate = this.value
                } else {
                    this.powerRate = 0
                }
            }
        },
    }
</script>

<style>
    .td-power-icon {
        width: 20px;
    }

    .td-power-span {
        font-size: 12px;
    }
</style>
