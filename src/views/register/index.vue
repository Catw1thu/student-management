<template>
	<div class="login-container flx-center">
		<div class="login-box">
			<div class="login-left" style="width: 55%; height: 55%">
				<img src="@/assets/images/13113(1).png" alt="login" />
			</div>
			<div class="login-form">
				<div class="login-logo">
					<img class="login-icon" style="width: 100px; height: 100px" src="@/assets/images/video-camera.png" alt="" />
					<h2 class="logo-text">设备管理系统</h2>
				</div>
				<RegisterForm />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="login">
import RegisterForm from "./components/RegisterForm.vue";
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
