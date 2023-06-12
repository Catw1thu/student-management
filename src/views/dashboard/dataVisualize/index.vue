<template>
	<div class="dataVisualize-box">
		<div class="card top-box">
			<div class="top-title">数据可视化</div>
			<el-tabs v-model="tabActive" class="demo-tabs">
				<el-tab-pane v-for="item in tab" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
			</el-tabs>
			<div class="top-content">
				<div class="item-left sle">
					<div class="img-box">
						<img src="./images/alarm.png" alt="" />
					</div>
					<span class="left-title">报警总数:</span>
					<span class="left-title">{{ m + a + b + c + d + e + f + g + h }}</span>
					<br />
					<span class="left-title">今日报警总数:</span>
					<span class="left-title">{{ x1 + x2 + x3 + x4 + x5 + x6 + x7 + x8 + x9 }}</span>
					<br />
					<span class="left-title">较昨日增加的报警总数:</span>
					<span class="left-title">{{
						x1 + x2 + x3 + x4 + x5 + x6 + x7 + x8 + x9 - y1 - y2 - y3 - y4 - y5 - y6 - y7 - y8 - y9
					}}</span>
					<br />
				</div>
				<div class="item-right">
					<div class="echarts-title">各报警类型分布饼图</div>
					<div class="book-echarts">
						<Pie ref="pieRef" />
					</div>
				</div>
				<div class="item-center">
					<div class="gitee-traffic traffic-box">
						<div class="traffic-img">
							<img src="./images/danger.png" alt="" />
						</div>
						<span class="item-value">进入危险区域</span>
						<span class="item-value">总事件数:{{ m }}</span>
						<span class="item-value">今日新增事件数:{{ x1 }}</span>
						<span class="item-value">昨日发生事件数:{{ y1 }}</span>
					</div>
					<div class="gitHub-traffic traffic-box">
						<div class="traffic-img">
							<img src="./images/smoke.png" alt="" />
						</div>
						<span class="item-value">烟雾</span>
						<span class="item-value">总事件数:{{ a }}</span>
						<span class="item-value">今日新增事件数:{{ x2 }}</span>
						<span class="item-value">昨日发生事件数:{{ y2 }}</span>
					</div>
					<div class="today-traffic traffic-box">
						<div class="traffic-img">
							<img src="./images/Fire.png" alt="" />
						</div>
						<span class="item-value">明火</span>
						<span class="item-value">总事件数:{{ b }}</span>
						<span class="item-value">今日新增事件数:{{ x3 }}</span>
						<span class="item-value">昨日发生事件数:{{ y3 }}</span>
					</div>
					<div class="yesterday-traffic traffic-box">
						<div class="traffic-img">
							<img src="./images/water.png" alt="" />
						</div>
						<span class="item-value">路面积水</span>
						<span class="item-value">总事件数:{{ c }}</span>
						<span class="item-value">今日新增事件数:{{ x4 }}</span>
						<span class="item-value">昨日发生事件数:{{ y4 }}</span>
					</div>
					<div class="today-traffic traffic-box">
						<div class="traffic-img">
							<img src="./images/shen.png" alt="" />
						</div>
						<span class="item-value">墙壁渗水</span>
						<span class="item-value">总事件数:{{ d }}</span>
						<span class="item-value">今日新增事件数:{{ x5 }}</span>
						<span class="item-value">昨日发生事件数:{{ y5 }}</span>
					</div>
					<div class="today-traffic traffic-box">
						<div class="traffic-img">
							<img src="./images/area.png" alt="" />
						</div>
						<span class="item-value">区域停留时间过长</span>
						<span class="item-value">总事件数:{{ e }}</span>
						<span class="item-value">今日新增事件数:{{ x6 }}</span>
						<span class="item-value">昨日发生事件数:{{ y6 }}</span>
					</div>
					<div class="today-traffic traffic-box">
						<div class="traffic-img">
							<img src="./images/down.png" alt="" />
						</div>
						<span class="item-value">摔倒</span>
						<span class="item-value">总事件数:{{ f }}</span>
						<span class="item-value">今日新增事件数:{{ x7 }}</span>
						<span class="item-value">昨日发生事件数:{{ y7 }}</span>
					</div>
					<div class="today-traffic traffic-box">
						<div class="traffic-img">
							<img src="./images/hand.png" alt="" />
						</div>
						<span class="item-value">挥手</span>
						<span class="item-value">总事件数:{{ g }}</span>
						<span class="item-value">今日新增事件数:{{ x8 }}</span>
						<span class="item-value">昨日发生事件数:{{ y8 }}</span>
					</div>
					<div class="today-traffic traffic-box">
						<div class="traffic-img">
							<img src="./images/smoke2.png" alt="" />
						</div>
						<span class="item-value">吸烟</span>
						<span class="item-value">总事件数:{{ h }}</span>
						<span class="item-value">今日新增事件数:{{ x9 }}</span>
						<span class="item-value">昨日发生事件数:{{ y9 }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="demo-date-picker">
			<div class="block">
				<p>选择指定日期显示报警分布情况</p>
				<el-date-picker
					v-model="dateRange"
					type="daterange"
					unlink-panels
					range-separator="To"
					start-placeholder="Start date"
					end-placeholder="End date"
					:clearable="false"
					value-format="YYYY-MM-DD"
				/>
			</div>
		</div>
		<div>
			<div style="display: flex; justify-content: space-between">
				<div></div>
				<el-button @click="exportBarData">导出当前数据Excel表格</el-button>
			</div>
			<div class="card bottom-box">
				<div class="bottom-title">柱状分布情况</div>
				<div class="bottom-tabs">
					<el-tabs v-model="tabActive" class="demo-tabs">
						<el-tab-pane v-for="item in tab" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
					</el-tabs>
				</div>
				<div class="curve-echarts">
					<Curve :name="'123'" :msg="'123'" :data="allData" ref="curveRef" />
				</div>
			</div>
		</div>

		<div style="display: flex; flex-direction: column; padding: 20px">
			<p style="margin: 0 auto; padding: 10px">选择不同类型数据折线图显示</p>
			<el-select v-model="chosen" class="m-2" placeholder="Select" style="margin: 0 auto; margin-top: 10px">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
		</div>
		<div>
			<div style="display: flex; justify-content: space-between">
				<div></div>
				<el-button @click="exportCurveData">导出当前数据Excel表格</el-button>
			</div>
			<div class="card bottom-box">
				<div class="bottom-title"></div>
				<div class="curve-echarts">
					<dou ref="douRef" />
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts" name="dataVisualize">
import { ref, onMounted, watch } from "vue";
import Pie from "./components/pie.vue";
import Curve from "./components/curve.vue";
import dou from "./components/dou.vue";
// import last from "./components/last.vue";
import axios, { all } from "axios";
import { DatabasePort } from "@/api/config/servicePort";
import * as XLSX from "xlsx";
function exportToExcel(data: any, filename: any) {
	// 创建一个工作簿
	const workbook = XLSX.utils.book_new();

	// 将数据转化为工作表
	const worksheet = XLSX.utils.json_to_sheet(data);

	// 将工作表添加到工作簿
	XLSX.utils.book_append_sheet(workbook, worksheet);

	// 导出Excel文件
	XLSX.writeFile(workbook, filename + ".xlsx");
}
function getFileName(sufix: String) {
	let currentDate = new Date();
	// 获取当前年、月、日
	let year = currentDate.getFullYear();
	let month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
	let day = currentDate.getDate().toString().padStart(2, "0");

	// 获取当前时、分、秒
	let hours = currentDate.getHours().toString().padStart(2, "0");
	let minutes = currentDate.getMinutes().toString().padStart(2, "0");
	let seconds = currentDate.getSeconds().toString().padStart(2, "0");
	// 输出年月日、时分秒格式数据
	return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}` + sufix;
}
function exportBarData() {
	let fileName = getFileName("Bar");
	axios
		.get(axios.defaults.baseURL + DatabasePort + "/warningRecord/", {
			params: { start_data: start_date.value, end_data: end_date.value + " 23.59.59" }
		})
		.then(resp => {
			for (let i = 0; i < resp.data.length; i++) {
				delete resp.data[i].id;
			}
			exportToExcel(resp.data, fileName);
		})
		.catch(err => {
			console.log(err);
		});
}
function exportCurveData() {
	let fileName = getFileName("Curve");
	if (chosen_group.value !== undefined) {
		axios
			.get(axios.defaults.baseURL + DatabasePort + "/warningRecord/")
			.then(resp => {
				let data = [];
				for (let i = 0; i < resp.data.length; i++) {
					if (resp.data[i].warning_type === eval(chosen_group.value)) {
						delete resp.data[i].id;
						data.push(resp.data[i]);
					}
				}
				exportToExcel(data, fileName);
			})
			.catch(err => {
				console.log(err);
			});
	}
}
const dateRange: any = ref([]);
let start_date = ref();
let end_date = ref();
const chosen = ref("");
let chosen_group = ref();
let allData = ref([
	{ id: 1, time: 1 },
	{ id: 2, time: 3 },
	{ id: 4, time: 5 }
]);
function updateBar() {
	start_date.value = dateRange.value[0];
	end_date.value = dateRange.value[1];
	axios
		.get(axios.defaults.baseURL + DatabasePort + "/warningType/time_type_count/", {
			params: {
				start_date: start_date.value,
				end_date: end_date.value + " 23:59:59"
			}
		})
		.then(resp => {
			M.value = resp.data[0].count;
			A.value = resp.data[1].count;
			B.value = resp.data[2].count;
			C.value = resp.data[3].count;
			D.value = resp.data[4].count;
			E.value = resp.data[5].count;
			F.value = resp.data[6].count;
			G.value = resp.data[7].count;
			H.value = resp.data[8].count;
			console.log(M.value);
			let allData = [M.value, A.value, B.value, C.value, D.value, E.value, F.value, G.value, H.value];
			for (let i = 0; i < allData.length; i++) {
				curveData.value[i].value = allData[i];
			}
			curveRef.value.initChart(curveData);
		})
		.catch(err => {
			console.log(err);
		});
}
watch([dateRange], () => {
	updateBar();
});
let today2 = new Date();
let yesterday2 = new Date(today2.getTime() - 1 * 24 * 60 * 60 * 1000);
let twoDaysAgo = new Date(today2.getTime() - 2 * 24 * 60 * 60 * 1000);
let threeDaysAgo = new Date(today2.getTime() - 3 * 24 * 60 * 60 * 1000);
let tomorrow2 = new Date(today2.getTime() + 1 * 24 * 60 * 60 * 1000);
function formatDate(date: any) {
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	month = (month < 10 ? "0" : "") + month;
	day = (day < 10 ? "0" : "") + day;
	return year + "-" + month + "-" + day;
}
let z1 = ref(0);
let z2 = ref(0);
let z3 = ref(0);
let z4 = ref(0);
watch([chosen], () => {
	chosen_group.value = chosen.value;
	axios
		.get(axios.defaults.baseURL + DatabasePort + "/warningType/time_type_count/", {
			params: {
				start_date: formatDate(today2),
				end_date: formatDate(tomorrow2)
			}
		})
		.then(resp => {
			z1.value = resp.data[chosen_group.value].count;
			douData.value[3].value = z1.value;
			douRef.value.initChart(douData);
		})
		.catch(err => {
			console.log(err);
		});
	axios
		.get(axios.defaults.baseURL + DatabasePort + "/warningType/time_type_count/", {
			params: {
				start_date: formatDate(yesterday2),
				end_date: formatDate(today2)
			}
		})
		.then(resp => {
			z2.value = resp.data[chosen_group.value].count;
			douData.value[2].value = z2.value;
			douRef.value.initChart(douData);
		})
		.catch(err => {
			console.log(err);
		});
	axios
		.get(axios.defaults.baseURL + DatabasePort + "/warningType/time_type_count/", {
			params: {
				start_date: formatDate(twoDaysAgo),
				end_date: formatDate(yesterday2)
			}
		})
		.then(resp => {
			z3.value = resp.data[chosen_group.value].count;
			douData.value[1].value = z3.value;
			douRef.value.initChart(douData);
		})
		.catch(err => {
			console.log(err);
		});
	axios
		.get(axios.defaults.baseURL + DatabasePort + "/warningType/time_type_count/", {
			params: {
				start_date: formatDate(threeDaysAgo),
				end_date: formatDate(twoDaysAgo)
			}
		})
		.then(resp => {
			z4.value = resp.data[chosen_group.value].count;
			douData.value[0].value = z4.value;
			douRef.value.initChart(douData);
		})
		.catch(err => {
			console.log(err);
		});
	douRef.value.initChart(douData);
});
const tabActive = ref([0, 1]);
const douRef = ref();
const pieRef = ref();
const curveRef = ref();
let m = ref(0);
let a = ref(0);
let b = ref(0);
let c = ref(0);
let d = ref(0);
let e = ref(0);
let f = ref(0);
let g = ref(0);
let h = ref(0);
getpie();
// setInterval(getJoke, 8000);
getJoke();
getJoke2();
getJoke3();
function getpie() {
	axios
		.get(axios.defaults.baseURL + DatabasePort + "/warningType/list_count/")
		.then(resp => {
			// console.log(resp.data);
			m.value = resp.data[0].count;
			a.value = resp.data[1].count;
			b.value = resp.data[2].count;
			c.value = resp.data[3].count;
			d.value = resp.data[4].count;
			e.value = resp.data[5].count;
			f.value = resp.data[6].count;
			g.value = resp.data[7].count;
			h.value = resp.data[8].count;
			let res = [m.value, a.value, b.value, c.value, d.value, e.value, f.value, g.value, h.value];
			// let res = [20, 40, 60, 60, 80, 400, 80, 80, 80];
			// console.log(option.series[0].data.value);
			// let name = ["进入危险区域", "路面积水", "墙壁渗水", "烟雾", "明火", "区域停留时间过长", "摔倒", "吸烟", "挥手"];
			for (let i = 0; i < res.length; i++) {
				pieData.value[i].value = res[i];
				// curveData.value[i].value = res[i];
			}
			pieRef.value.initChart(pieData);
			// curveRef.value.initChart(curveData);
		})
		.catch(err => {
			console.log(err);
		});
}
let A = ref(0);
let B = ref(0);
let C = ref(0);
let D = ref(0);
let E = ref(0);
let F = ref(0);
let G = ref(0);
let H = ref(0);
let M = ref(0);
function getJoke() {
	axios
		.get(axios.defaults.baseURL + DatabasePort + "/warningType/time_type_count/", {
			params: {
				start_date: start_date.value,
				end_date: end_date.value
			}
		})
		.then(resp => {
			M.value = resp.data[0].count;
			A.value = resp.data[1].count;
			B.value = resp.data[2].count;
			C.value = resp.data[3].count;
			D.value = resp.data[4].count;
			E.value = resp.data[5].count;
			F.value = resp.data[6].count;
			G.value = resp.data[7].count;
			H.value = resp.data[8].count;
			console.log(M.value);
			// let res = [M.value, A.value, B.value, C.value, D.value, E.value, F.value, G.value, H.value];
			let allData = [M.value, A.value, B.value, C.value, D.value, E.value, F.value, G.value, H.value];
			for (let i = 0; i < allData.length; i++) {
				// douData.value[i].value = res[i];
				// curveData.value[i].value = res[i];
				curveData.value[i].value = allData[i];
			}
			// douRef.value.initChart(douData);
			curveRef.value.initChart(curveData);
		})
		.catch(err => {
			console.log(err);
		});
}
let x1 = ref(0);
let x2 = ref(0);
let x3 = ref(0);
let x4 = ref(0);
let x5 = ref(0);
let x6 = ref(0);
let x7 = ref(0);
let x8 = ref(0);
let x9 = ref(0);
let y1 = ref(0);
let y2 = ref(0);
let y3 = ref(0);
let y4 = ref(0);
let y5 = ref(0);
let y6 = ref(0);
let y7 = ref(0);
let y8 = ref(0);
let y9 = ref(0);
function getJoke2() {
	axios
		.get(axios.defaults.baseURL + DatabasePort + "/warningType/time_type_count/", {
			params: {
				start_date: formatDate(today2),
				end_date: formatDate(tomorrow2)
			}
		})
		.then(resp => {
			x1.value = resp.data[0].count;
			x2.value = resp.data[1].count;
			x3.value = resp.data[2].count;
			x4.value = resp.data[3].count;
			x5.value = resp.data[4].count;
			x6.value = resp.data[5].count;
			x7.value = resp.data[6].count;
			x8.value = resp.data[7].count;
			x9.value = resp.data[8].count;
		})
		.catch(err => {
			console.log(err);
		});
}
function getJoke3() {
	axios
		.get(axios.defaults.baseURL + DatabasePort + "/warningType/time_type_count/", {
			params: {
				start_date: formatDate(yesterday2),
				end_date: formatDate(today2)
			}
		})
		.then(resp => {
			y1.value = resp.data[0].count;
			y2.value = resp.data[1].count;
			y3.value = resp.data[2].count;
			y4.value = resp.data[3].count;
			y5.value = resp.data[4].count;
			y6.value = resp.data[5].count;
			y7.value = resp.data[6].count;
			y8.value = resp.data[7].count;
			y9.value = resp.data[8].count;
		})
		.catch(err => {
			console.log(err);
		});
}
onMounted(() => {
	pieRef.value.initChart(pieData);
	curveRef.value.initChart(curveData);
	douRef.value.initChart(douData);
	axios
		.get(axios.defaults.baseURL + DatabasePort + "/warningRecord/")
		.then(resp => {
			let result1 = resp.data[0].warning_time.substring(0, resp.data[0].warning_time.indexOf("T"));
			let last = resp.data.slice(-1)[0]["warning_time"];
			let result2 = last.substring(0, last.indexOf("T"));
			console.log(result1, result2);
			dateRange.value[0] = result1;
			dateRange.value[1] = result2;
			updateBar();
		})
		.catch(err => {
			console.log(err);
		});
});
const douData = ref([
	{ value: 0, name: "进入危险区域" },
	{ value: 0, name: "烟雾" },
	{ value: 0, name: "明火" },
	{ value: 0, name: "路面积水" },
	{ value: 0, name: "墙壁渗水" },
	{ value: 0, name: "区域停留时间过长" },
	{ value: 0, name: "摔倒" },
	{ value: 0, name: "挥手" },
	{ value: 0, name: "吸烟" }
]);
const tab = [{ label: "实时数据显示", name: 1 }];
const pieData = ref([
	{ value: 30, name: "进入危险区域" },
	{ value: 30, name: "烟雾" },
	{ value: 30, name: "明火" },
	{ value: 30, name: "路面积水" },
	{ value: 30, name: "墙壁渗水" },
	{ value: 30, name: "区域停留时间过长" },
	{ value: 30, name: "摔倒" },
	{ value: 30, name: "挥手" },
	{ value: 30, name: "吸烟" }
]);
const curveData = ref([
	{ value: M.value, spotName: "进入危险区域" },
	{ value: A.value, spotName: "烟雾" },
	{ value: B.value, spotName: "明火" },
	{ value: C.value, spotName: "路面积水" },
	{ value: D.value, spotName: "墙壁渗水" },
	{ value: E.value, spotName: "区域停留时间过长" },
	{ value: F.value, spotName: "摔倒" },
	{ value: G.value, spotName: "挥手" },
	{ value: H.value, spotName: "吸烟" }
]);
const options = [
	{
		value: "0",
		label: "进入危险区域"
	},
	{
		value: "1",
		label: "烟雾"
	},
	{
		value: "2",
		label: "明火"
	},
	{
		value: "3",
		label: "路面积水"
	},
	{
		value: "4",
		label: "墙壁渗水"
	},
	{
		value: "5",
		label: "区域停留时间过长"
	},
	{
		value: "6",
		label: "摔倒"
	},
	{
		value: "7",
		label: "挥手"
	},
	{
		value: "8",
		label: "吸烟"
	}
];
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
<style scoped>
.demo-date-picker {
	display: flex;
	width: 100%;
	padding: 0;
	flex-wrap: wrap;
}
.demo-date-picker .block {
	padding: 30px 0;
	text-align: center;
	border-right: solid 1px var(--el-border-color);
	flex: 1;
}
.demo-date-picker .block:last-child {
	border-right: none;
}
</style>
