<template>
<div id="app">
    <nav-bar/>
    <router-view></router-view>
</div>
</template>

<script>
import NavBar from './components/NavBar.vue';
export default {
    name: "App",
    components: { NavBar },
};
</script>
