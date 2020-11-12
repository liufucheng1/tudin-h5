<template>
    <div>
        <div ref="echart" id="myChart" :style="{width: '300px', height: '220px'}"></div>
    </div>
</template>
<script>
import echarts from 'echarts'
// // 引入基本模板
// let echarts = require('echarts/lib/echarts')
// // 引入折线图组件
// require('echarts/lib/chart/line')
// require('echarts/lib/component/grid')
export default {
    name:'EchartsIndex',
    props:{
        data:{
            type:Object,
            required:true
        }
    },
    data() {
        return {

        }
    },
    mounted() {
        let x = this.data.xAxis;
        let series = [];
        for(let i = 0;i < this.data.yAxis.length;i++){
            let color = i?'#93D3F5':'#FDD100'
            let obj = {
                data: this.data.yAxis[i],
                type: 'line',
                smooth: true,
                color
            }
            series.push(obj);
        }
        this.drawLine(x,series);
    },
    created() {
        
    },
    methods: {
        drawLine(xAxis,series){
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption({
                grid:{
                    left: '1%',
                    right: '0',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: xAxis,
                    boundaryGap:true,
                },
                yAxis: {
                    type: 'value',
                    nameTextStyle:{
                        color:'#999999'
                    }
                },
                series,
            });
        }
    },
}
</script>
<style scoped>
    
</style>