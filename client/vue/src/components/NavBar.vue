<template>
<div class="nav">
    <router-link to="/" class="nav-link">Demo App</router-link>
</div>
</template>

<style>
.nav {
    height: 64px;
    width: calc(100vw - 30px);
    padding: 0 15px;

    display: flex;
    align-items: center;
    justify-content: space-between;
}

.nav-link {
    text-decoration: none;
    color: black;
    font-size: 28px;
}
</style>
