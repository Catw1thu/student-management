// * 后端微服务端口名
export const ChatServer = "http://123.60.110.117";
export const WebService = ":5002";
export const Model1 = ":5000";
export const DatabasePort = ":8000";
export const VisualizePort = ":6006";
import axios from "axios";
import { ref } from "vue";
export const messageCount = ref(0);
export const messageTitle = ref("");
export const getMessageCount = async () => {
	axios
		.get(axios.defaults.baseURL + DatabasePort + "/warningRecord/page/", {
			params: {
				camera_id: -1,
				warning_type: -1,
				is_deal: 0,
				warning_message: "",
				start_date: "",
				end_date: "",
				num: 10,
				page: 1
			}
		})
		.then(response => {
			console.log(response.data);
			messageCount.value = response.data.total_count;
			if (messageCount.value > 0) {
				messageTitle.value = "当前有" + (messageCount.value < 99 ? messageCount.value : "99+") + "条信息未处理！";
			} else {
				messageTitle.value = "所有消息已被处理！";
			}
		})
		.catch(error => {
			console.log(error);
		});
};
