<template>
  <bm-overlay
    ref="customOverlay"
    class="sample"
    :style="{background:markerColor,borderColor:markerBorder}"
    pane="labelPane"
    @draw="draw">
  </bm-overlay>
</template>

<script>
import BmOverlay from 'vue-baidu-map/components/overlays/Overlay'
export default {
    components:{BmOverlay},
  props: ['position', 'active','markerColor','markerBorder'],
  watch: {
    position: {
      handler () {
        this.$refs.customOverlay.reload()
      },
      deep: true
    }
  },
  methods: {
    handleClick () {
      global.alert('Well done.')
    },
    draw ({el, BMap, map}) {
      const {lng, lat} = this.position
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      el.style.left = pixel.x - 7 + 'px'
      el.style.top = pixel.y - 10 + 'px'
    }
  }
}
</script>

<style scoped>
.sample {
  width: 15px;
  height: 15px;
  line-height: 15px;
  /* background: #3085FF; */
  border-radius: 50%;
  border: 4px solid #ffffff;
  position: absolute;
}
</style>