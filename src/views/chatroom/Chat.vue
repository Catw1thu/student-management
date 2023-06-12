<template>
	<div class="bg-box">
		<div class="chat-box" ref="chatBox">
			<div v-for="(message, index) in messages" :key="index" class="message">
				<div :class="message.role === 'user' ? 'user-msg-wrapper' : 'bot-msg-wrapper'">
					<img :src="message.role === 'user' ? userAvatarUrl : botAvatarUrl" class="avatar" />
					<div :class="message.role === 'user' ? 'user-msg' : 'bot-msg'" style="white-space: pre-wrap">
						{{ message.content }}
					</div>
				</div>
			</div>
		</div>

		<div class="input-area input-container" v-loading="loadShow" element-loading-text="等待答复中...">
			<el-input
				style="font-size: 1.2rem"
				placeholder="请输入内容"
				type="textarea"
				v-model="inputMessage"
				@keyup.enter="sendMessage"
				:autosize="{ minRows: 3, maxRows: 10 }"
				resize="none"
			></el-input>
			<el-button size="large" type="primary" @click="sendMessage">发送</el-button>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import userAvatar from "@/assets/images/user.png";
import botAvatar from "@/assets/images/chatbot.png";
import axios from "axios";
import { ElNotification } from "element-plus";
import io from "socket.io-client";
import { ChatServer, WebService } from "@/api/config/servicePort";
import { socketChat } from "../../socket/socket";
let answer = ref("");
let loadShow = ref(false);
let user_id = Math.random().toString(36).slice(-8);
let socket = socketChat;
//每次进入的时候随机加载user_id
// let socket = io(ChatServer, {
// 	transports: ["websocket", "polling"],
// 	timeout: 5000
// });
socket.on("recChat", resp => {
	if (resp["msg"] === "__new__" && loadShow) {
		loadShow.value = false;
		console.log("test");
		messages.value.push({
			role: "assistant",
			content: ""
		});
	} else if (resp["msg"] === "failure") {
		if (loadShow) loadShow.value = false;
		open();
	} else {
		answer.value += resp["msg"];
		messages.value[messages.value.length - 1].content = answer.value;
		nextTick(() => {
			scrollToBottom();
		});
	}
});
// socket.on("connect", () => {
// 	console.log("连接上了");
// 	user_id = socket.id;
// });
//
// socket.on("disconnect", () => {
// 	console.log("断开了连接上");
// 	socket.close();
// });
// window.onbeforeunload = () => {
// 	axios.get("/disconnect/" + user_id);
// 	socket.close();
// };
// function refresh() {
// 	location.reload();
// }

const messages = ref([{ role: "assistant", content: "我是校园安全机器人!\n可以问我校园安全方面的问题哦！" }]);
const inputMessage = ref("");
const userAvatarUrl = userAvatar;
const botAvatarUrl = botAvatar;
const chatBox = ref(null);

const sendMessage = () => {
	if (inputMessage.value === "") return;
	if (inputMessage.value.trim() !== "") {
		messages.value.push({ role: "user", content: inputMessage.value });
		inputMessage.value = "";
		console.log(messages.value);
		// 添加聊天机器人的回复
		// messages.value.push({ role: "assistant", content: "123" });
		loadShow.value = true;
		answer.value = "";
		axios
			.post(ChatServer + "/getChat/" + socket.id, messages.value)
			.then(resp => {
				if (resp.data["msg"] === "failure") {
					alert("单次请求上限为20次, 刷新浏览器页面即可重置");
					if (loadShow) loadShow.value = false;
				}
			})
			.catch(err => {
				console.log(err);
			});
		nextTick(() => {
			scrollToBottom();
		});
	}
};

const scrollToBottom = () => {
	chatBox.value.scrollTop = chatBox.value.scrollHeight;
};

onMounted(() => {
	scrollToBottom();
});
</script>

<style scoped>
.el-container {
	height: 100vh;
	background-color: white;
}

.el-header {
	background-color: #e6f7ff;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 2rem; /* 增加字体大小 */
	color: #42b983;
}

.chat-box {
	height: 60vh; /* 缩短聊天区的高度 */
	overflow-y: auto;
	border: 1px solid #ebeef5;
	padding: 10px;
	margin-bottom: 10px;
}

.message {
	margin: 5px 0;
}

.user-msg-wrapper,
.bot-msg-wrapper {
	display: flex;
	align-items: flex-start;
	gap: 5px;
}

.user-msg-wrapper {
	justify-content: flex-end;
}

.avatar {
	width: 48px; /* 增加头像大小 */
	height: 48px; /* 增加头像大小 */
	border-radius: 50%;
}

.user-msg {
	background-color: #e6f7ff;
	display: inline-block;
	padding: 5px 10px;
	border-radius: 10px;
	color: #42b983;
	font-size: 1.2rem; /* 增加字体大小 */
}

.bot-msg {
	background-color: #f0f9eb;
	display: inline-block;
	padding: 5px 10px;
	border-radius: 10px;
	color: #2b2b2b;
	font-size: 1.2rem; /* 增加字体大小 */
}

.input-area {
	height: 15vh; /* 缩短聊天区的高度 */
	display: flex;
	gap: 10px;
	align-items: center;
	font-size: 1.2rem; /* 增加字体大小 */
}

.el-input {
	width: 100%; /* 扩大输入区的大小 */
}
.input-area ::v-deep .el-contentarea__inner {
	font-size: 1.2rem !important; /* 调整输入区和文本区域字体大小以匹配聊天区字体大小 */
}
.input-container {
	display: flex;
}

.el-textarea {
	flex: 1;
}

.el-textarea__inner {
	height: 100% !important;
	resize: none !important;
}
</style>
