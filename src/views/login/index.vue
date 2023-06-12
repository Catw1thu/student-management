<template>
	<div class="login-container flx-center">
		<SwitchDark class="dark" />
		<div class="login-box">
			<div class="login-left" style="width: 55%; height: 55%">
				<img src="@/assets/images/13113(1).png" alt="login" />
			</div>
			<div class="login-form">
				<div class="login-logo">
					<img class="login-icon" style="width: 100px; height: 100px" src="@/assets/images/video-camera.png" alt="" />
					<h2 class="logo-text">智慧校园安全保障</h2>
				</div>
				<LoginForm />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="login">
import SwitchDark from "@/components/SwitchDark/index.vue";
import LoginForm from "./components/LoginForm.vue";
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
