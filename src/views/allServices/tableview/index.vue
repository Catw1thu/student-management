<template>
	<div style="height: 100%">
		<div style="height: 100%">
			<div ref="allcamera" class="card content-box">
				<el-table
					:data="tableData"
					highlight-current-row
					ref="singleTableRef"
					style="height: 92%; width: 100%"
					table-layout="auto"
				>
					<el-table-column label="编号">
						<template #default="scope">
							<div style="display: flex; align-items: center" :ref="scope.row.id + 'ref'">
								<el-icon><timer /></el-icon>
								<span style="margin-left: 10px">{{ scope.row.id }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="服务器地址">
						<template #default="scope">
							<el-popover effect="light" trigger="hover" placement="top" width="auto">
								<template #default>
									<div v-if="scope.row.server_url">服务路由: {{ scope.row.server_url }}</div>
								</template>
								<template #reference>
									<div>
										<div v-if="scope.row.server_url">
											<el-tag>已设置</el-tag>
										</div>
										<div v-else>
											<el-tag type="danger">未设置</el-tag>
										</div>
									</div>
								</template>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="监控流地址">
						<template #default="scope">
							<el-popover effect="light" trigger="hover" placement="top" width="auto">
								<template #default>
									<div v-if="scope.row.video_url">监控流地址: {{ scope.row.video_url }}</div>
								</template>
								<template #reference>
									<div>
										<div v-if="scope.row.video_url">
											<el-tag>已设置</el-tag>
										</div>
										<div v-else>
											<el-tag type="danger">未设置</el-tag>
										</div>
									</div>
								</template>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="区域">
						<template #default="scope">
							<el-popover effect="light" trigger="hover" placement="top" width="auto">
								<template #default>
									<div>--------经 纬 度:--------</div>
									<div>{经度:{{ scope.row.locate_x }}，纬度:{{ scope.row.locate_y }}}</div>
								</template>
								<template #reference>
									<div style="display: flex; align-items: center">
										<el-icon><place /></el-icon>
										<span style="margin-left: 10px">{{ scope.row.area }}</span>
									</div>
								</template>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="安全责任人">
						<template #default="scope">
							<div style="display: flex; align-items: center">
								<el-icon><user /></el-icon>
								<span style="margin-left: 10px">{{ scope.row.name }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="状态">
						<template #default="scope">
							<el-popover effect="light" trigger="hover" placement="top" width="auto">
								<template #default>
									<div>状态: {{ scope.row.state }}</div>
									<div>警报区域: {{ scope.row.setarea }}</div>
								</template>
								<template #reference>
									<div>
										<div v-if="scope.row.state === '未运行'">
											<el-tag type="danger">{{ scope.row.state }}</el-tag>
										</div>
										<div v-else>
											<el-tag type="prime">{{ scope.row.state }}</el-tag>
										</div>
									</div>
								</template>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="scope">
							<el-button size="middle" type="danger" round plain @click="diaToOpen(scope.$index, scope.row)"
								>设置警报类别</el-button
							>
							<el-button
								round
								plain
								size="middle"
								type="success"
								@click="handleOnlineShow(scope.$index, scope.row)"
								@close="hadleOnlineShowClosed"
								>实时查看</el-button
							>
							<el-button-group class="ml-4" style="margin-left: 10px">
								<el-button round plain size="middle" type="primary" :icon="Edit" @click="editDialog(scope.$index, scope.row)" />
								<el-button
									round
									plain
									size="middle"
									type="primary"
									:icon="Delete"
									@click="deleteDialog(scope.$index, scope.row)"
								/>
							</el-button-group>
						</template>
					</el-table-column>
				</el-table>
				<el-button class="mt-4" style="width: 100%; height: 8%" @click="addDialog" type="info">添加服务节点</el-button>
			</div>
			<div style="font: 0px/0px sans-serif; clear: both; display: block"></div>
		</div>
		<el-dialog @opened="diaOpened" @closed="diaClosed" v-model="dialogFormVisible" title="设置报警类别" width="1150px">
			<div id="body1" style="height: 450px">
				<div class="div1">
					<canvas id="myCanvas" width="700" height="450" style="border: 1px solid #000000"></canvas>
				</div>
				<div class="div2">
					<el-table :data="modelTableData" highlight-current-row max-height="450">
						<el-table-column label="是否启动模型">
							<template #default="scope">
								<div style="display: flex; align-items: center">
									<el-checkbox v-model="scope.row.availability" :label="scope.row.modelName" size="middle" border />
								</div>
							</template>
						</el-table-column>
						<el-table-column label="报警间隔">
							<template #default="scope">
								<div style="display: flex; align-items: center">
									<el-input-number v-model="scope.row.alarmInterval" :step="1" :disabled="!scope.row.availability" />
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-tag class="ml-2" type="success">{{ settedAreaNum.value }}</el-tag>
					<el-button type="success" @click="nextArea()" style="margin-right: 150px"> 添加下一个区域 </el-button>
					<el-button type="success" @click="resetArea()" style="margin-right: 150px"> 重置所有区域 </el-button>
					<el-button @click="closeDia">取消</el-button>
					<el-button type="primary" @click="conformbutton()"> 保存设置 </el-button>
				</span>
			</template>
		</el-dialog>
		<el-dialog @closed="diaClosed1" v-model="dialogFormVisible1" title="修改摄像头服务" width="500px">
			<div style="margin-left: auto; margin-right: auto">
				<el-form :model="edit_form" label-width="120px">
					<el-form-item label="编号:">
						<el-input v-model="edit_form.id" disabled placeholder />
					</el-form-item>
					<el-form-item label="服务路由:">
						<el-input v-model="edit_form.server_url" />
					</el-form-item>
					<el-form-item label="监控流地址:">
						<el-input v-model="edit_form.video_url" />
					</el-form-item>
					<el-form-item label="监控区域:">
						<el-input v-model="edit_form.area" />
					</el-form-item>
					<el-form-item label="安全责任人:">
						<el-input v-model="edit_form.name" />
					</el-form-item>
					<el-form-item label="经纬度:">
						<el-input-number v-model="edit_form.locate_x" :precision="6" :step="0.0001" :max="120" />
						<el-input-number v-model="edit_form.locate_y" :precision="6" :step="0.0001" :max="33" />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="doEdit">修改</el-button>
						<el-button @click="dialogFormVisible1 = false">取消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
		<el-dialog v-model="delete_dialogVisible" title="！！！警告！！！" width="30%" :before-close="handleClose">
			<span>该操作将会删除摄像头记录【记录ID:{{ edit_form.id }}】，请谨慎操作！如确认要删除，请点击确定。</span>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="delete_dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="doDelete">确定</el-button>
				</span>
			</template>
		</el-dialog>
		<el-dialog @closed="diaClosed1" v-model="add_dialogVisible" title="添加摄像头服务" width="500px">
			<div style="margin-left: auto; margin-right: auto">
				<el-form :model="edit_form" label-width="120px">
					<el-form-item label="服务路由:">
						<el-input v-model="edit_form.server_url" />
					</el-form-item>
					<el-form-item label="监控流地址:">
						<el-input v-model="edit_form.video_url" />
					</el-form-item>
					<el-form-item label="监控区域:">
						<el-input v-model="edit_form.area" />
					</el-form-item>
					<el-form-item label="安全责任人:">
						<el-input v-model="edit_form.name" />
					</el-form-item>
					<el-form-item label="经纬度:">
						<div>①经度：<el-input-number v-model="edit_form.locate_x" :precision="6" :step="0.0001" :max="120" /></div>
						<div style="margin-top: 10px">
							②纬度：<el-input-number v-model="edit_form.locate_y" :precision="6" :step="0.0001" :max="33" />
						</div>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="doAdd">确认</el-button>
						<el-button @click="add_dialogVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
		<el-dialog v-model="online_show" title="实时查看摄像头" width="850px" @closed="videoReset">
			<div>
				<video v-if="videoFlag"  id="onlineShow" autoplay width="800" height="480"></video>
				<video v-else  ref="vvideo" id="onlineShow1" autoplay width="800" height="480"></video>
			</div>
		</el-dialog>
	</div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { ElTable } from "element-plus";
import { Delete, Edit } from "@element-plus/icons-vue";
import { set } from "husky";
import { WebService } from "@/api/config/servicePort";
function videoReset(){
	if(vvideo.value){
		vvideo.value.src = null
	}
}
const vvideo = ref(null)
const video_url = ref("")
const dialogFormVisible = ref(false);
const dialogFormVisible1 = ref(false);
const delete_dialogVisible = ref(false);
const add_dialogVisible = ref(false);
const online_show = ref(false);
const currentRow = ref();
const settedAreaNum = ref(0);
const videoFlag = ref(false)
const singleTableRef = ref<InstanceType<typeof ElTable>>();
var setarea_url = ref("");
var running_state = "未设置";
const webRtcServer = ref(null);
const tempID=ref()
onMounted(async () => {
	const route = useRoute();
	let id = route.query.id;
	await getData();
	tableData.value.forEach(row => {
		console.log(row.id, id);
		if (parseInt(row.id) === parseInt(id)) {
			console.log(row.id);
			singleTableRef.value!.setCurrentRow(row);
			// singleTableRef.value!.scrollTo(id)
			// window.onload = function (){
			// 	singleTableRef.value!.setScrollTop(this.$refs.)
			// }
		}
	});
	// webRtcServer.value = new WebRtcStreamer(
	// 	"onlineShow",
	// 	location.protocol + "//127.0.0.1:8000"
	// );
});
const edit_form = reactive({
	id: "",
	server_url: "",
	video_url: "",
	area: "",
	name: "",
	state: "",
	setarea: "",
	locate_x: 118.647258,
	locate_y: 32.088423
});
async function getData() {
	await axios
		.post(axios.defaults.baseURL + WebService + "/getWholeList")
		.then((resp: any) => {
			tableData.value = resp.data["msg"];
			console.log(tableData.value);
		})
		.catch(error => {
			console.log(error);
		});
}

function closeDia() {
	dialogFormVisible.value = false;
	tableData1.value = [];
	tableData1_COPY.value = [];
	allAreas.value = [];
	allAreas_COPY.value = [];
	requestdata.value = [];
}

async function doEdit() {
	await axios
		.post(axios.defaults.baseURL + WebService + "/updateInfo", edit_form)
		.then((resp: any) => {
			if (resp.data["msg"] === "error") {
				console.log(resp.data["msg"]);
			}
			if (resp.data["msg"] === "success") {
				console.log(resp.data["msg"]);
			}
		})
		.catch(error => {
			console.log(error);
		});
	dialogFormVisible1.value = false;
	getData();
}
async function doDelete() {
	await axios
		.post(axios.defaults.baseURL + WebService + "/deleteRecord", { id: edit_form.id })
		.then((resp: any) => {
			if (resp.data["msg"] === "error") {
				console.log(resp.data["msg"]);
			}
			if (resp.data["msg"] === "success") {
				console.log(resp.data["msg"]);
			}
		})
		.catch(error => {
			console.log(error);
		});
	getData();
	delete_dialogVisible.value = false;
}
async function doAdd() {
	await axios
		.post(axios.defaults.baseURL + WebService + "/addRecord", edit_form)
		.then((resp: any) => {
			if (resp.data["msg"] === "error") {
				console.log(resp.data["msg"]);
			}
			if (resp.data["msg"] === "success") {
				console.log(resp.data["msg"]);
			}
		})
		.catch(error => {
			console.log(error);
		});
	dialogFormVisible1.value = false;
	getData();
	// tableData.value.push(edit_form)
	console.log(tableData);
	add_dialogVisible.value = false;
}
const tableData1: any = ref([]);
const tableData1_COPY: any = ref([]);
const allAreas: any = ref([]);
const allAreas_COPY: any = ref([]);
const requestdata: any = ref([]);
function editDialog(index: number, row: User) {
	edit_form.id = row.id;
	edit_form.name = row.name;
	edit_form.area = row.area;
	edit_form.state = row.state;
	edit_form.setarea = row.setarea;
	edit_form.server_url = row.server_url;
	edit_form.video_url = row.video_url;
	edit_form.locate_x = row.locate_x;
	edit_form.locate_y = row.locate_y;
	dialogFormVisible1.value = true;
}
function deleteDialog(index: number, row: User) {
	delete_dialogVisible.value = true;
	edit_form.id = row.id;
}
function addDialog() {
	edit_form.id = "";
	edit_form.name = "";
	edit_form.area = "";
	edit_form.state = "";
	edit_form.setarea = "";
	edit_form.server_url = "";
	edit_form.video_url = "";
	add_dialogVisible.value = true;
}
function resetArea() {
	tableData1.value = [];
	tableData1_COPY.value = [];
	allAreas.value = [];
	allAreas_COPY.value = [];
	requestdata.value = [];
	settedAreaNum.value = 0;
	diaOpened();
}
function nextArea() {
	if (tableData1.value.length < 3) {
		tableData1.value = [];
		return;
	}
	settedAreaNum.value++;
	allAreas.value.push(JSON.parse(JSON.stringify(tableData1.value)));
	allAreas_COPY.value.push(JSON.parse(JSON.stringify(tableData1_COPY.value)));
	tableData1.value = [];
	tableData1_COPY.value = [];
	console.log(allAreas.value);
}
function conformbutton() {
	console.log("zbb")
	dialogFormVisible.value = false;
	allAreas.value.push(JSON.parse(JSON.stringify(tableData1.value)));
	allAreas_COPY.value.push(JSON.parse(JSON.stringify(tableData1_COPY.value)));
	// requestdata.value.push("video_url")
	requestdata.value.push({interver_time:10 * 1000});
	requestdata.value.push({pointSet:allAreas_COPY.value});
	requestdata.value.push({ modelSettings: modelTableData.value });
	requestdata.value.push({ id : tempID})
	console.log("zbb",requestdata.data)
	//这里需要发送数据
	axios
		.post(setarea_url.value + "/init_service", requestdata.value)
		.catch(err => {
			console.log(err);
		})
		.then((resp: any) => {
			// console.log(resp.data);
			getData()
		});
	//
	console.log(requestdata.value);
	tableData1.value = [];
	tableData1_COPY.value = [];
	allAreas.value = [];
	allAreas_COPY.value = [];
	requestdata.value = [];
}
function mouseDownEvent(e: any) {
	var x = e.offsetX;
	var y = e.offsetY;
	tableData1.value.push({
		x: x,
		y: y
	});
	tableData1_COPY.value.push({
		x: (x * img.width) / canvas.width,
		y: (y * img.height) / canvas.height
	});
	context.beginPath();
	context.arc(x, y, 4, 0, 2 * Math.PI);
	context.fillStyle = "red";
	context.fill();
}
function mouseUpEvent() {
	// img.src = "src/assets/images/ttt.jpg";
	context.beginPath();
	var case1 = 1;
	var color1;
	if (case1 === 1) color1 = "rgba(254, 67, 101, 0.8)";
	if (case1 === 2) color1 = "rgba(252, 157, 154, 0.3)";
	if (case1 === 3) color1 = "rgba(131, 175, 155, 0.3)";
	if (case1 === 4) color1 = "rgba(200, 200, 169, 0.3)";
	context.fillStyle = color1;
	for (var i = 0; i < tableData1.value.length; i++) {
		var x = tableData1.value[i].x;
		var y = tableData1.value[i].y;
		if (i == 0) {
			context.moveTo(x, y);
		} else {
			context.lineTo(x, y);
		}
	}
	context.closePath();
	context.fill();
}
function diaOpened() {
	// if(canvas === null) {
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");
	img = new Image();
	img.onload = function () {
		context.drawImage(img, 0, 0, canvas.width, canvas.height);
	};
	img.src = img_src.value;
	canvas.width = canvas.width + 1 - 1;
	canvas.addEventListener("mousedown", mouseDownEvent);
	canvas.addEventListener("mouseup", mouseUpEvent);
	// }
}
function diaClosed() {
	tableData1.value = [];
	tableData1_COPY.value = [];
	requestdata.value = [];
}
function opendialog_1() {
	online_show.value = true;

}
function choose_video(f:any) {
	videoFlag.value = f;

}
async function handleOnlineShow(index: number, row: User) {
	await opendialog_1();

	if(row.video_url.startsWith("rtsp")){
		await choose_video(true)
		webRtcServer.value = new WebRtcStreamer("onlineShow",  axios.defaults.baseURL+ ":8800");
		webRtcServer.value.connect(row.video_url);
		console.log(webRtcServer.value)
	}else{
		await choose_video(false)
		vvideo.value.src = row.video_url
	}
	

	
}
function hadleOnlineShowClosed() {
	webRtcServer.value.disconnect();
}
let img_src = ref("");
async function diaToOpen(index: number, row: User) {
	await axios
		.get(axios.defaults.baseURL + WebService + "/get_img", { params: { video_url: row.video_url } })
		.catch(err => {
			console.log(err);
		})
		.then((resp: any) => {
			img_src.value = resp.data["base64_img"];
			setarea_url.value = row.server_url;
			tempID.value = row.id
		});
	dialogFormVisible.value = true;
	requestdata.value=[]
	requestdata.value.push({video_url:row.video_url});
}
let canvas: any = null;
let context: any = null;
let img: any = null;
interface User {
	id: any;
	server_url: string;
	video_url: string;
	area: string;
	name: string;
	state: string;
	setarea: string;
	locate_x: any;
	locate_y: any;
}
interface xy {
	id: any;
	x: any;
	y: any;
}
const tableData = ref([
	{
		id: "001",
		server_url: "http://10.22.0.15:5000/get_img",
		video_url: "D:/test_video_1.mp4",
		area: "厚学楼-西门入口A",
		name: "朱天赐",
		state: "正在运行",
		setarea: "已设置",
		locate_x: "0.0000",
		locate_y: "0.0000"
	},
	{
		id: "002",
		server_url: "",
		video_url: "http://183.123.542.121/video2",
		area: "厚学楼-西门入口B",
		name: "老王",
		state: "正在运行",
		setarea: "未设置",
		locate_x: "0.0000",
		locate_y: "0.0000"
	},
	{
		id: "003",
		server_url: "http://127.0.0.1/server3",
		video_url: "rtsp://admin:admin@10.22.204.90:8554/live",
		area: "西苑-食堂二楼",
		name: "马柯",
		state: "正在运行",
		setarea: "未设置",
		locate_x: "0.0000",
		locate_y: "0.0000"
	}
]);
const modelTableData = ref([
	{
		id: 0,
		modelName: "进入危险区域",
		port: 5000,
		availability: false,
		alarmInterval: 60
	},
	{
		id: 1,
		modelName: "烟雾",
		port: 5000,
		availability: false,
		alarmInterval: 60
	},
	{
		id: 2,
		modelName: "明火",
		port: 5000,
		availability: false,
		alarmInterval: 60
	},
	{
		id: 3,
		modelName: "路面积水",
		port: 5000,
		availability: false,
		alarmInterval: 60
	},
	{
		id: 4,
		modelName: "墙壁渗水",
		port: 5000,
		availability: false,
		alarmInterval: 60
	},
	{
		id: 5,
		modelName: "区域停留时间过长",
		port: 5000,
		availability: false,
		alarmInterval: 60
	},
	{
		id: 6,
		modelName: "摔倒",
		port: 5001,
		availability: false,
		alarmInterval: 60
	},
	{
		id: 7,
		modelName: "挥手",
		port: 5001,
		availability: false,
		alarmInterval: 60
	},
	{
		id: 8,
		modelName: "吸烟",
		port: 5001,
		availability: false,
		alarmInterval: 60
	},
	{
		id: 9,
		modelName: "打架",
		port: 5001,
		availability: false,
		alarmInterval: 60
	}
]);
</script>

<style scoped lang="scss">
.thisblack-bgc {
	background-color: rgba(0, 0, 0, 0.1);
}
.el-button--text {
	margin-right: 15px;
}
.el-select {
	width: 300px;
}
.el-input {
	width: 300px;
}
.dialog-footer button:first-child {
	margin-right: 10px;
}
.div1 {
	float: left; /* 添加左浮动 */
	width: 710px;
	height: 450px;
	text-align: center;
	line-height: 200px;
}
.div2 {
	float: left; /* 添加左浮动 */
	width: 380px;
	height: 450px;
	text-align: center;
	line-height: 200px;
}
//.el-table-column{
//	width: auto;
//}
</style>
