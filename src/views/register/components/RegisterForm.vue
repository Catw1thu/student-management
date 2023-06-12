<template>
	<el-form ref="RegisterFormRef" :model="RegisterForm" :rules="RegisterRules" size="large">
		<el-form-item prop="username">
			<el-input v-model="RegisterForm.username" placeholder="用户名：admin / user">
				<template #prefix>
					<el-icon class="el-input__icon"><user /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input
				type="password"
				v-model="RegisterForm.password"
				placeholder="密码：123456"
				show-password
				autocomplete="new-password"
			>
				<template #prefix>
					<el-icon class="el-input__icon"><lock /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="mail">
			<el-input v-model="RegisterForm.email" placeholder="请输入邮箱"> </el-input>
		</el-form-item>
		<el-form-item prop="ecode">
			<el-input v-model="RegisterForm.code" placeholder="请输入邮箱验证码"> </el-input>
		</el-form-item>
	</el-form>
	<div class="login-btn">
		<el-button round @click="getEcode()" size="large">获取验证码</el-button>
		<el-button :icon="UserFilled" round @click="register(RegisterFormRef)" size="large" type="primary" :loading="loading">
			注册
		</el-button>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Login } from "@/api/interface";
import { ElNotification } from "element-plus";
import { registerApi } from "@/api/modules/login";
import { GlobalStore } from "@/stores";
import { TabsStore } from "@/stores/modules/tabs";
import { getTimeState } from "@/utils/util";
import { LOGIN_URL } from "@/config/config";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import axios from "axios";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";

const router = useRouter();
const tabsStore = TabsStore();
const globalStore = GlobalStore();

// 定义 formRef（校验规则）
type FormInstance = InstanceType<typeof ElForm>;
const RegisterFormRef = ref<FormInstance>();
const RegisterRules = reactive({
	username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码", trigger: "blur" }],
	email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
	code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
});

const loading = ref(false);
const RegisterForm = reactive<Login.ReqRegisterForm>({ username: "", password: "", email: "", code: "" });

const getEcode = () => {
	axios({
		method: "POST",
		url: axios.defaults.baseURL + "/api/ecode",
		headers: { "content-type": "application/x-www-form-urlencoded" },
		data: {
			username: RegisterForm.username,
			email: RegisterForm.email
		}
	})
		.then(res => {
			console.log(res.data.status);
			if (res.data.status === false) {
				ElNotification({
					title: getTimeState(),
					message: res.data.msg,
					type: "error",
					duration: 3000
				});
			} else {
				ElNotification({
					title: getTimeState(),
					message: "验证码发送成功",
					type: "success",
					duration: 3000
				});
			}
		})
		.catch(err => {
			console.error(err);
		});
};

const register = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async valid => {
		if (!valid) return;
		loading.value = true;
		try {
			// 1.执行登录接口

			const { status, msg } = await registerApi({ ...RegisterForm });
			if (status === false) {
				ElNotification({
					title: getTimeState(),
					message: msg,
					type: "error",
					duration: 3000
				});
			} else {
				//2.添加动态路由
				await initDynamicRouter();

				// 3.清除上个账号的 tab 信息
				tabsStore.closeMultipleTab();

				// 4.跳转到登陆
				router.push(LOGIN_URL);
				ElNotification({
					title: getTimeState(),
					message: "注册成功",
					type: "success",
					duration: 3000
				});
			}
		} finally {
			loading.value = false;
		}
	});
};

onMounted(() => {
	// 监听enter事件（调用登录）
	document.onkeydown = (e: any) => {
		e = window.event || e;
		if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
			if (loading.value) return;
			register(RegisterFormRef.value);
		}
	};
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
