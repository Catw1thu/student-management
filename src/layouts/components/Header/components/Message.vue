<template>
	<div class="message">
		<el-popover placement="bottom" :width="300" trigger="hover">
			<template #reference>
				<el-badge :value="messageCount" :max="99" class="item">
					<i :class="'iconfont icon-xiaoxi'" class="toolBar-icon"></i>
				</el-badge>
			</template>
			<el-tabs v-model="activeName">
				<el-tab-pane label="通知" name="first">
					<div class="message-list">
						<div class="message-item" @click="goEventlist">
							<img src="@/assets/images/msg01.png" alt="" class="message-icon" />
							<div class="message-content">
								<span class="message-title">{{ messageTitle }}</span>
								<span class="message-title">点击跳转处理页面 💚</span>
								<span class="message-date">一分钟前</span>
							</div>
						</div>
					</div>
				</el-tab-pane>
				<!-- <el-tab-pane label="消息(0)" name="second">
					<div class="message-empty">
						<img src="@/assets/images/notData.png" alt="notData" />
						<div>暂无消息</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="代办(0)" name="third">
					<div class="message-empty">
						<img src="@/assets/images/notData.png" alt="notData" />
						<div>暂无代办</div>
					</div>
				</el-tab-pane> -->
			</el-tabs>
		</el-popover>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { DatabasePort, messageCount, messageTitle, getMessageCount } from "@/api/config/servicePort";
import { useRouter } from "vue-router";

const activeName = ref("first");

onMounted(async () => {
	await getMessageCount();
});

const router = useRouter();
const goEventlist = () => {
	router.push("/eventList?is_deal=0");
};
</script>

<style scoped lang="scss">
.message-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 260px;
	line-height: 45px;
}
.message-list {
	display: flex;
	flex-direction: column;
	.message-item {
		cursor: pointer;
		display: flex;
		align-items: center;
		padding: 5px 0;
		border-bottom: 1px solid var(--el-border-color-light);
		&:last-child {
			border: none;
		}
		.message-icon {
			width: 40px;
			height: 40px;
			margin: 0 20px 0 5px;
		}
		.message-content {
			display: flex;
			flex-direction: column;
			.message-title {
				margin-bottom: 5px;
			}
			.message-date {
				font-size: 12px;
				color: var(--el-text-color-secondary);
			}
		}
	}
}
</style>
