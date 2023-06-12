<template>
	<div class="home card">
		<Timer></Timer>
		<img class="home-bg" src="@/assets/images/welcome.png" alt="welcome" />
	</div>
</template>

<script setup lang="ts" name="home">
import Timer from "./Timer/index.vue";
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
