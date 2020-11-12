<template>
        <bm-overlay
			ref="customOverlay"
			:class="{sample: true, active}"
			pane="labelPane"
			@draw="draw">
		<img id="overlay" :src="icon" class="position-img">
		<div v-bind:style="{backgroundImage:'url(' + avatar + ')'}" class="position-contianer"></div>
	</bm-overlay>
</template>
<script>
import BmOverlay from 'vue-baidu-map/components/overlays/Overlay'
var dEnter = 'https://store.cdn.xu5g.com/tdsh_h5_location_enter.png';
var dLeave = 'https://store.cdn.xu5g.com/tdsh_h5_location_leave.png';
var dOff = 'https://store.cdn.xu5g.com/tdsh_h5_location_off.png';
export default {
    components:{BmOverlay},
	props: ['position', 'active','avatar','is_online'],
	data() {
		return {
            icon: dEnter,
            el:null
		}
	},
	created(){
		this.isOnline();
	},
	watch: {
		position: {
			handler () {
				this.$refs.customOverlay.reload()
			},
			deep: true
        },
        is_online: function(){
            this.isOnline();
        }
    },
    mounted() {
        
    },
	methods: {
        isOnline(){
            if(this.is_online){
                this.icon = dEnter;
            }else {
                this.icon = dOff
            }
        },
        draw ({el, BMap, map}) {
            var that = this
			const {lng, lat} = this.position
			const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
			el.style.left = pixel.x - 36 + 'px'
            el.style.top = pixel.y - 66 + 'px'
            this.el = el
            this.el.addEventListener('touchend',that.onChange)
        },
        onChange(){
            this.$emit('touch')
        }
    },
    beforeDestroy() {
        document.removeEventListener('touchend', this.onChange);
    }
}
</script>

<style scoped>
	.sample {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		line-height: 35px;
		color: #fff;
		text-align: center;
		padding: 10px;
		position: absolute;
		background-size: 100% 100%;
	}
	.position-contianer {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		position: relative;
		left: 7px;
		top: -67px;
        background-size: 100% 100%;
	}
	.position-img {
		width: 50px;
		height: 60px;
	}
</style>