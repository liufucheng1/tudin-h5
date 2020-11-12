<template>
    <div class="login-home wrap">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name:'LoginHome',
    data() {
        return {
            // path:'index'
        }
    },
    created() {
        // this.path = window.location.href.split('#')[1].split('\/')[2]
    },
    methods: {
    },
}
</script>
<style scoped>
</style>