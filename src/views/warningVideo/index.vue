<template>
	<div class="con">
		<div class="a">
			<video class="vd" autoplay :src="video_url" ref="video_con" controls>
				您的浏览器无法播放该视频！
			</video>
		</div>
		<div class="x">
				<el-form
					label-position="right"
					label-width="100px"
					:model="eventInfo"
					style="max-width: 800px; min-width: 275px; padding: 5px; display: flex; flex-direction: column; margin-left: 20%">
					<el-form-item label="报警地点:">
						<div class='fixed-info'>{{area_desc.at(eventInfo.camera_id)}}</div>
					</el-form-item>
					<el-form-item label="报警类型:">
						<div class='fixed-info'>{{event_desc.at(eventInfo.warning_type)}}</div>
					</el-form-item>
					<el-form-item label="报警时间:">
						<div class='fixed-info'>{{eventInfo.warning_time}}</div>
					</el-form-item>
					<el-form-item label="是否处理:">
						<div class='fixed-info'><el-switch
							v-model="isDisable"
							size="large"
							disabled
							inline-prompt
							style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
							active-text="已处理"
							inactive-text="未处理"/>
						</div>
					</el-form-item>
					<el-form-item label="处理信息:" >
						<div style="display: flex; flex-direction: row; width: 100%">
							<el-input v-model="eventInfo.warning_message" type="textarea" :rows="3" style="font-size: 17px; width: 70%" :disabled="isDisable"/>
							<el-button @click="submitMessage" style="align-self: center; margin: 5px; height: 40px" v-if="!isDisable" type="danger">处理该事件</el-button>
						</div>

					</el-form-item>

				</el-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import {ref, reactive, onMounted} from "vue";
const event_desc = ['进入危险区域', '烟雾', '明火', '路面积水', '墙壁渗水', '区域停留时间过长', '摔倒', '挥手', '吸烟', 'xxx']
const area_desc = ['教学楼A', '西食堂', '教学楼B']
import {DatabasePort, WebService} from "@/api/config/servicePort";
const video_url = ref( '')
const video_con = ref()
const isDisable = ref(false)
import {getMessageCount} from "@/api/config/servicePort";

let eventInfo = reactive({
	"camera_id": -1,
	"id": -1,
	"is_deal": 0,
	"warning_degree": -1,
	"warning_message": '',
	"warning_time": '',
	"warning_type": -1,
	"warning_url": ''
})
// 数据库访问
function getLatestInfo() {
	axios.get(axios.defaults.baseURL + DatabasePort + '/warningRecord/get_last/')
	.then(resp => {
		let t:String = resp.data[0].warning_time
		t = t.replace('T', ' ')
		resp.data[0].warning_time = t.slice(0, t.indexOf('.'))
		Object.assign(eventInfo, resp.data[0])
		video_url.value = axios.defaults.baseURL + WebService + '/getSpecificVideo' + eventInfo.warning_url;
		isDisable.value = (eventInfo.is_deal.valueOf() === 1)
	})
	.catch(err => {
		console.log(err)
	})
}
onMounted(() => {
	getLatestInfo()
})

function submitMessage() {
	if(eventInfo.warning_message === ''){
		 return;
	}
	axios.post(axios.defaults.baseURL + DatabasePort + '/warningRecord/deal/', {"id": eventInfo.id, "warning_message": eventInfo.warning_message}
	,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
	.then(resp => {
		getLatestInfo()
		getMessageCount()
	})
	.catch(err => {
		console.log(err)
	})
}

</script>

<style scoped>
.vd{
	max-width: 60%;
	border-radius: 10px;
	align-self: center;
	justify-self: center;
}
.con{
	display: flex;
	flex-direction: column;
}
.a{
	flex-direction: column;
	display: flex;
}
.x{
	display: flex;
	flex-direction: column;
	box-shadow: #666 5px 5px 5px 7px;
	margin: 10px;
}
.fixed-info{
	min-width: 275px;
}
</style>
