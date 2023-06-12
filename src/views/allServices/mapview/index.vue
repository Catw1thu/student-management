<template>
	<div style="height: 100%" class="card content-box">
		<ul class="drawing-panel" style="z-index: 99">
			<li class="btn">
				<div style="margin-top: auto; margin-bottom: auto">摄像头正在工作个数：</div>
			</li>
			<li class="btn1">
				<svg
					t="1679398094466"
					class="icon"
					viewBox="0 0 1024 1024"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					p-id="2869"
					width="30"
					height="30"
				>
					<path
						d="M959.52024 543.984008c0 264.571714-215.444278 480.015992-480.015992 480.015992S0 808.043978 0 543.984008s215.444278-480.015992 480.015992-480.015992v480.015992h479.504248z"
						fill="#9FC2F8"
						p-id="2870"
					></path>
					<path
						d="M1023.488256 480.015992h-480.015992V0C808.043978 0 1023.488256 215.444278 1023.488256 480.015992z"
						fill="#B3DEFC"
						p-id="2871"
						data-spm-anchor-id="a313x.7781069.0.i0"
					></path>
				</svg>
				<a style="margin-left: 10px">{{ len }}</a>
			</li>
		</ul>
		<div id="map-container" style="height: 100%; width: 100%"></div>
	</div>
</template>

<script setup type="text/javascript">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { WebService } from "@/api/config/servicePort";
// const map = ref()
const router = useRouter();
const size = 200;
function CustomSymbol(_size, _anchor) {
	BMapGL.Symbol.call(this, _size, _anchor);
	this.width = _size.width;
	this.height = _size.height;
	// 需要再addOverlay之前设置true，需要保证纹理大小不变化
	this.isReDraw = true;
}
CustomSymbol.prototype = new BMapGL.Symbol();
CustomSymbol.prototype.constructor = CustomSymbol;
CustomSymbol.prototype.add = function () {
	const canvas = document.createElement("canvas");
	canvas.width = this.width * 2;
	canvas.height = this.height * 2;
	this.context = canvas.getContext("2d");
	this.isReDraw = false;
};
CustomSymbol.prototype.render = function (map) {
	const duration = 1300;
	const t = (performance.now() % duration) / duration;

	// 可以通过修改 0.3 0.7
	const radius = (this.width / 2) * 0.05;
	const outerRadius = (this.width / 2) * 0.5 * t + radius;
	const context = this.context;
	context.save();
	// 2倍图
	context.scale(1.2, 1.2);
	context.clearRect(0, 0, this.width, this.height);

	// 扩散圆
	context.beginPath();
	context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
	context.fillStyle = "rgba(38,1,252," + (1 - t) + ")";
	context.fill();

	// 中间圆
	context.beginPath();
	context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
	context.fillStyle = "rgba(0,0,255, 1)";
	context.strokeStyle = "rgba(0,0,255, .1)";
	// 圆描边宽度动态展示
	context.lineWidth = 2 + 2 * (1 - t);
	context.fill();
	context.stroke();

	context.restore();

	// 更新图像的像素数据
	this.data = context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
	return true;
};
var custom = ref();
var map = ref();
var point = ref();
var len = ref();
function addCamera(row) {
	var marker1 = new BMapGL.Marker(new BMapGL.Point(row.locate_x, row.locate_y), { icon: custom, enableDragging: false });
	marker1.setTitle(
		"区域信息：\n" +
			"--摄像头ID：" +
			row.id +
			"\n--监控区域：" +
			row.area +
			"\n--负责人：" +
			row.name +
			"\n--经纬度：{经度:" +
			row.locate_x +
			",维度:" +
			row.locate_y +
			"}\n"
	);
	marker1.addEventListener("click", e => {
		jump(row.id);
	});
	map.addOverlay(marker1);
}
async function init() {
	custom = new CustomSymbol(new BMapGL.Size(size, size), new BMapGL.Size(size / 2, size / 2));
	map = new BMapGL.Map("map-container");
	//学校坐标
	point = new BMapGL.Point(118.147258, 32.088423);
	map.centerAndZoom(point, 17.5);
	map.enableScrollWheelZoom(true);
	console.log("ztc", tableData.value);
	tableData.value.forEach(row => {
		addCamera(row);
	});
}
async function getdata() {
	axios
		.post(axios.defaults.baseURL + WebService + "/getWholeList")
		.then(resp => {
			tableData.value = resp.data["msg"];
			console.log(tableData.value);
			init();
			len.value = tableData.value.length;
		})
		.catch(e => {
			console.log(e);
		});
}
onMounted(async () => {
	await getdata();
	// start()

	setTimeout(start, 500);
});
function start() {
	custom.isReDraw = true;
}
function jump(id) {
	// 在当前页面中点击按钮跳转到目标页面
	router.push({ name: "tableview", query: { id: id } });
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
		locate_x: 118.646258,
		locate_y: 32.087423
	},
	{
		id: "002",
		server_url: "",
		video_url: "http://183.123.542.121/video2",
		area: "厚学楼-西门入口B",
		name: "老王",
		state: "正在运行",
		setarea: "未设置",
		locate_x: 118.648258,
		loacte_y: 32.089423
	},
	{
		id: "003",
		server_url: "http://127.0.0.1/server3",
		video_url: "http://183.123.542.121/video3",
		area: "西苑-食堂二楼",
		name: "马柯",
		state: "正在运行",
		setarea: "未设置",
		locate_x: 118.648258,
		locate_y: 32.086423
	}
]);
</script>

<style type="text/css">
ul li {
	list-style: none;
}

.drawing-panel {
	z-index: 999;
	position: fixed;
	top: 8rem;
	left: 15rem;
	/*bottom: 3.5rem;*/
	margin-left: 3rem;
	padding: 1rem 1rem;
	border-radius: 1.6rem;
	background-color: #fff;
	box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
}

.btn {
	width: auto;
	height: auto;
	float: left;
	background-color: #fff;
	color: rgba(27, 142, 236, 1);
	font-size: 25px;
	border-radius: 5px;
	margin: 0 5px;
	text-align: center;
	text-align-all: center;
	line-height: 30px;
}
.btn1 {
	width: auto;
	height: auto;
	float: left;
	background-color: #fff;
	color: rgba(233, 100, 100, 1);
	font-size: 25px;
	font-weight: bold;
	border-radius: 5px;
	margin: 0 5px;
	/*text-align: center;*/
	line-height: 25px;
	vertical-align: middle;
	font-family: "Times New Roman";
}

.btn1:hover {
	background-color: rgba(27, 142, 236, 0.8);
	color: #fff;
}
</style>
