<template>
	<div class="card bg-box">
		<div style="height: 100%" id="control">
			<div class="block">
				<span>选定日期范围：</span>
				<el-date-picker
					v-model="value1"
					type="datetimerange"
					:shortcuts="shortcuts"
					range-separator="到"
					start-placeholder="开始时间"
					end-placeholder="截止时间"
				/>
				<el-button type="primary" icon="Search" style="margin-left: 20px" @click="dataUpdate()">Search</el-button>
			</div>
			<div id="alert">
				<div style="margin-top: 40px; margin-bottom: 25px"><el-alert title="注意事项：" type="warning" show-icon center /></div>
				<el-carousel :interval="2000" type="card" height="200px" >
					<el-carousel-item>
						<h3 text="2xl" justify="center">①请在上面的日期时间选择器中确定时间范围后点击搜索。</h3>
					</el-carousel-item>
					<!-- <el-carousel-item>
						<h3 text="2xl" justify="center">②为展示效果更好，建议时间范围不超过24小时。</h3>
					</el-carousel-item>
					<el-carousel-item>
						<h3 text="2xl" justify="center">③请及时保存查询的数据，不保留上次查询结果。</h3>
					</el-carousel-item> -->
					<el-carousel-item>
						<h3 text="2xl" justify="center">②该功能展示重要日志信息，获取完整信息请下载excel。</h3>
					</el-carousel-item>
					<el-carousel-item>
						<span>
							<h3 text="2xl"  justify="center">③即时监测服务器的各项性能指标，包括CPU的使用率、GPU的使用率、内存的占用率情况等等。</h3>
						</span>
					</el-carousel-item>
				</el-carousel>
			</div>
			<div id="downcontrol">
				<div>
					<el-button type="primary" icon="download" style="margin-left: 20px" @click="downloadExcel()"
						>下载日志数据(excel)</el-button
					>
					<el-button type="danger" icon="delete" style="margin-left: 60px" @click="cleanChart()">清除筛选</el-button>
				</div>
			</div>
			<div id="chartcontrol" style="height: 100%; margin-top: 10px">
				<div ref="cpu_load" class="card content-box" id="chart1"></div>
				<div ref="cpu_percent" class="card content-box" style="margin-top: 10px" id="chart2"></div>
				<div ref="mem_percent" class="card content-box" style="margin-top: 10px" id="chart3"></div>
				<div ref="GPU_percent" class="card content-box" style="margin-top: 10px" id="chart4"></div>
				<div ref="GPU_mem_percent" class="card content-box" style="margin-top: 10px" id="chart5"></div>
				<div ref="net_speed" class="card content-box" style="margin-top: 10px" id="chart6"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="js">
import { ref } from "vue";
import * as echarts from "echarts";
import { DatabasePort } from "@/api/config/servicePort";
import axios from "axios";
function formatDate(time) {
	var date = new Date(time);
	date.setTime(date.getTime())
	var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
	var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
	return date.getFullYear() + "-" + month + "-" + currentDate+" "+hh + ":" + mm + ":" + ss;
	//返回格式：yyyy-MM-dd hh:mm
}
function jsonToExcel(data,head,filename) {
	let str = head ? head + '\n' : '';
	console.log(str);
	data.forEach(item => {
		// 拼接json数据, 增加 \t 为了不让表格显示科学计数法或者其他格式
		for(let key in item) {
			str = `${str + item[key] + '\t'},`
		}
		str += '\n'
	});
	console.log(str)
	// encodeURIComponent解决中文乱码
	const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
	// 通过创建a标签实现
	const link = document.createElement("a");
	link.href = uri;
	// 对下载的文件命名
	link.download =  `${filename + '.csv'}`;
	link.click();

}
export default {
	name:'select_by_range',
	data(){
		return{
			test:true,
			myChart:null,
			syca_myChart:null,//图标
			interval:null,//定时器
			timer:null,
			log1:[],
			log5:[],
			log15:[],
			cpu_percent:[],
			mem_percent:[],
			gpu_percent:[],
			gpu_mem_percent:[],
			net_sent:[],
			net_recv:[],
			x_time:[],
			full_data:[],
			shortcuts : [
				{
					text: '最近半小时',
					value: () => {
						const end = new Date()
						const start = new Date()
						start.setTime(start.getTime() - 3600 * 1000 * 0.5)
						return [start, end]
					},
				},
				{
					text: '最近1小时',
					value: () => {
						const end = new Date()
						const start = new Date()
						start.setTime(start.getTime() - 3600 * 1000)
						return [start, end]
					},
				},
				{
					text: '最近3小时',
					value: () => {
						const end = new Date()
						const start = new Date()
						start.setTime(start.getTime() - 3600 * 1000 * 3)
						return [start, end]
					},
				},
				{
					text: '最近6小时',
					value: () => {
						const end = new Date()
						const start = new Date()
						start.setTime(start.getTime() - 3600 * 1000 * 6)
						return [start, end]
					},
				},
				{
					text: '最近12小时',
					value: () => {
						const end = new Date()
						const start = new Date()
						start.setTime(start.getTime() - 3600 * 1000 * 12)
						return [start, end]
					},
				},
				{
					text: '最近24小时',
					value: () => {
						const end = new Date()
						const start = new Date()
						start.setTime(start.getTime() - 3600 * 1000 * 24)
						return [start, end]
					},
				},
				{
					text: '今天',
					value: () => {
						const start = new Date(new Date().setHours(0, 0, 0, 0)); //获取当天零点的时间
						const end = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1); //获取当天23:59:59的时间
						return [start, end]
					},
				},
				{
					text: '昨天',
					value: () => {
						const start = new Date(new Date().setHours(0, 0, 0, 0)); //获取当天零点的时间
						const end = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1); //获取当天23:59:59的时间
						start.setTime(start.getTime() - 3600 * 1000 * 24)
						end.setTime(end.getTime() - 3600 * 1000 * 24)
						return [start, end]
					},
				},
			],
			value1: [new Date().getTime()- 1000 * 60 * 15, new Date().getTime()],
		}
	},
	created() {
		console.log("created");
	},
	mounted() {
		console.log("mounted")
		document.getElementById('downcontrol').style.display = 'none';
		document.getElementById('chartcontrol').style.display = 'none';
	},
	beforeUnmount() {
		console.log("beforeUnmount")
		// clearInterval(this.interval);
	},
	methods:{
		init(){
			// this.myChart = echarts.init(this.$refs.echartsRef);
			// this.dataGet();
			this.drawBar();
		},
		drawBar()
		{
			echarts.init(this.$refs.cpu_load).setOption({
				title: {
					text: "①CPU平均负载",
					textStyle: {
						color: "#a1a1a1"
					}
				},
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "cross",
						label: {
							backgroundColor: "#6a7985"
						}
					},

				},
				legend: {
					data: ["cpu1分钟负载", "cpu5分钟负载", "cpu15分钟负载"],
					textStyle: {
						color: "#a1a1a1"
					}
				},
				toolbox: {
					feature: {
						saveAsImage: {
							title:'下载',
						}
					}
				},
				grid: {
					top: "12%",
					left: "3%",
					right: "5%",
					bottom: "3%",
					containLabel: true
				},
				xAxis: [
					{
						type: "category",
						boundaryGap: false,
						data: this.x_time,
						axisLabel: {
							color: "#a1a1a1"
						}
					}
				],
				yAxis: [
					{
						name:"平均进程数/单位时间",
						type: "value",
						axisLabel: {
							color: "#a1a1a1"
						},
						scale:true,
					}
				],
				series: [
					{
						name: "cpu1分钟负载",
						type: "line",
						// stack: "Total",
						// areaStyle: {},
						emphasis: {
							focus: "series"
						},
						data: this.log1
					},
					{
						name: "cpu5分钟负载",
						type: "line",
						// stack: "Total",
						// areaStyle: {},
						emphasis: {
							focus: "series"
						},
						data: this.log5
					},
					{
						name: "cpu15分钟负载",
						type: "line",
						// stack: "Total",
						// areaStyle: {},
						emphasis: {
							focus: "series"
						},
						// label: {
						// 	show: true,
						// 	position: "top"
						// },
						data: this.log15
					}
				]
			});
			echarts.init(this.$refs.cpu_percent).setOption({
				title: {
					text: "②CPU利用率",
					textStyle: {
						color: "#a1a1a1"
					}
				},
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "cross",
						label: {
							backgroundColor: "#6a7985"
						}
					},

				},
				legend: {
					data: ["cpu利用率"],
					textStyle: {
						color: "#a1a1a1"
					}
				},
				toolbox: {
					feature: {
						saveAsImage: {
							title:'下载',
						}
					}
				},
				grid: {
					top: "12%",
					left: "3%",
					right: "5%",
					bottom: "3%",
					containLabel: true
				},
				xAxis: [
					{
						type: "category",
						boundaryGap: false,
						data: this.x_time,
						axisLabel: {
							color: "#a1a1a1"
						}
					}
				],
				yAxis: [
					{
						name:"单位: %",
						type: "value",
						axisLabel: {
							color: "#a1a1a1"
						},
						scale:true,
					}
				],
				series: [
					{
						name: "cpu利用率",
						type: "line",
						// stack: "Total",
						// areaStyle: {},
						emphasis: {
							focus: "series"
						},
						data: this.cpu_percent
					},
				]
			});
			echarts.init(this.$refs.mem_percent).setOption({
				title: {
					text: "③内存使用率",
					textStyle: {
						color: "#a1a1a1"
					}
				},
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "cross",
						label: {
							backgroundColor: "#6a7985"
						}
					},

				},
				legend: {
					data: ["内存使用率"],
					textStyle: {
						color: "#a1a1a1"
					}
				},
				toolbox: {
					feature: {
						saveAsImage: {
							title:'下载',
						}
					}
				},
				grid: {
					top: "12%",
					left: "3%",
					right: "5%",
					bottom: "3%",
					containLabel: true
				},
				xAxis: [
					{
						type: "category",
						boundaryGap: false,
						data: this.x_time,
						axisLabel: {
							color: "#a1a1a1"
						}
					}
				],
				yAxis: [
					{
						name:"单位: %",
						type: "value",
						axisLabel: {
							color: "#a1a1a1"
						},
						scale:true,

					}
				],
				series: [
					{
						name: "内存使用率",
						type: "line",
						// stack: "Total",
						// areaStyle: {},
						emphasis: {
							focus: "series"
						},
						data: this.mem_percent
					},
				]
			});
			echarts.init(this.$refs.GPU_percent).setOption({
				title: {
					text: "④GPU利用率",
					textStyle: {
						color: "#a1a1a1"
					}
				},
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "cross",
						label: {
							backgroundColor: "#6a7985"
						}
					},

				},
				legend: {
					data: ["GPU利用率"],
					textStyle: {
						color: "#a1a1a1"
					}
				},
				toolbox: {
					feature: {
						saveAsImage: {
							title:'下载',
						}
					}
				},
				grid: {
					top: "12%",
					left: "3%",
					right: "5%",
					bottom: "3%",
					containLabel: true
				},
				xAxis: [
					{
						type: "category",
						boundaryGap: false,
						data: this.x_time,
						axisLabel: {
							color: "#a1a1a1"
						}
					}
				],
				yAxis: [
					{
						name:"单位: %",
						type: "value",
						axisLabel: {
							color: "#a1a1a1"
						},
						scale:true,

					}
				],
				series: [
					{
						name: "GPU利用率",
						type: "line",
						// stack: "Total",
						// areaStyle: {},
						emphasis: {
							focus: "series"
						},
						data: this.gpu_percent
					},
				]
			});
			echarts.init(this.$refs.GPU_mem_percent).setOption({
				title: {
					text: "⑤GPU内存(显存)使用率",
					textStyle: {
						color: "#a1a1a1"
					}
				},
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "cross",
						label: {
							backgroundColor: "#6a7985"
						}
					},

				},
				legend: {
					data: ["GPU内存(显存)使用率"],
					textStyle: {
						color: "#a1a1a1"
					}
				},
				toolbox: {
					feature: {
						saveAsImage: {
							title:'下载',
						}
					}
				},
				grid: {
					top: "12%",
					left: "3%",
					right: "5%",
					bottom: "3%",
					containLabel: true
				},
				xAxis: [
					{
						type: "category",
						boundaryGap: false,
						data: this.x_time,
						axisLabel: {
							color: "#a1a1a1"
						}
					}
				],
				yAxis: [
					{
						name:"单位: %",
						type: "value",
						axisLabel: {
							color: "#a1a1a1"
						},
						scale:true,

					}
				],
				series: [
					{
						name: "GPU内存(显存)使用率",
						type: "line",
						// stack: "Total",
						// areaStyle: {},
						emphasis: {
							focus: "series"
						},
						data: this.gpu_mem_percent
					},
				]
			});
			echarts.init(this.$refs.net_speed).setOption({
				title: {
					text: "⑥网络上传/下载速度(上下行)",
					textStyle: {
						color: "#a1a1a1"
					}
				},
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "cross",
						label: {
							backgroundColor: "#6a7985"
						}
					},

				},
				legend: {
					data: ["上行速度", "下行速度"],
					textStyle: {
						color: "#a1a1a1"
					}
				},
				toolbox: {
					feature: {
						saveAsImage: {
							title:'下载',
						},

					},

				},
				grid: {
					top: "12%",
					left: "3%",
					right: "5%",
					bottom: "3%",
					containLabel: true
				},
				xAxis: [
					{
						type: "category",
						boundaryGap: false,
						data: this.x_time,
						axisLabel: {
							color: "#a1a1a1"
						}
					}
				],
				yAxis: [
					{
						name:"单位: KB/s",
						type: "value",
						axisLabel: {
							color: "#a1a1a1"
						},
						scale:true,
					}
				],
				series: [
					{
						name: "上行速度",
						type: "line",
						// stack: "Total",
						// areaStyle: {},
						emphasis: {
							focus: "series"
						},
						data: this.net_sent
					},
					{
						name: "下行速度",
						type: "line",
						// stack: "Total",
						// areaStyle: {},
						emphasis: {
							focus: "series"
						},
						data: this.net_recv
					},
				]
			});
			// useEcharts(myChart,option);
		},
		dataGet(){
			axios.get(axios.defaults.baseURL + DatabasePort + "/serverPerformance/",
				{params:{request_type:1,
						bgntime:formatDate(this.value1[0]),
						endtime:formatDate(this.value1[1])}})
			.then((resp) =>{
				console.log(resp.data)
				var data = resp.data;
				this.full_data = data;
				this.log1 = [];
				this.log5 = [];
				this.log15 = [];
				this.cpu_percent = [];
				this.mem_percent = [];
				this.gpu_percent = [];
				this.gpu_mem_percent = [];
				this.net_sent = [];
				this.net_recv = [];
				this.x_time = [];
				var len = resp.data.length;
				var loop = 0;
				while (loop < len){
					console.log(data[0].loadavg_1);
					this.log1.push(data[loop].loadavg_1);
					this.log5.push(data[loop].loadavg_5);
					this.log15.push(data[loop].loadavg_15);
					this.cpu_percent.push(data[loop].cpu_percent);
					this.mem_percent.push(data[loop].mem_used_percent);
					this.gpu_percent.push(data[loop].gpu_percent);
					this.gpu_mem_percent.push(data[loop].gpu_mem_percent);
					this.net_recv.push(data[loop].net_recv_speed);
					this.net_sent.push(data[loop].net_sent_speed);
					var temp = Date.parse(data[loop].time)
					this.x_time.push(formatDate(temp));
					loop++;
				}
				this.drawBar();
				window.onresize = function (){
					echarts.init(this.$refs.cpu_load).resize();
					echarts.init(this.$refs.cpu_percent).resize();
					echarts.init(this.$refs.mem_percent).resize();
					echarts.init(this.$refs.gpu_percent).resize();
					echarts.init(this.$refs.gpu_mem_percent).resize();
					echarts.init(this.$refs.net_speed).resize();
				}
			})
		},
		dataUpdate(){
			console.log("click")
			document.getElementById('alert').style.display='none';
			var loop = 6;
			// while(loop){
			// 	var name = 'chart'+loop;
			// 	document.getElementById(name).style.visibility = 'visible';
			// 	loop--;
			// }
			document.getElementById('downcontrol').style.display = 'block';
			document.getElementById('chartcontrol').style.display = 'block';
			this.dataGet()
		},
		downloadExcel(){
			console.log("download")
			var headname = ['ID','记录时间','cpu一分钟负载','cpu五分钟负载','cpu十五分钟负载','cpu利用率','cpu运行时长','cpu频率','内存总大小(MB)','已使用内存(MB)','剩余内存(MB)',
			'内存使用率','磁盘总大小(GB)','磁盘已使用(GB)','剩余磁盘(GB)','磁盘使用率','网络上行(KB/s)','网络下行(KB/s)','GPU内存(显存)使用率','GPU利用率']
			var filename = '完整系统日志['+formatDate(this.value1[0])+']至['+formatDate(this.value1[1])+']'
			jsonToExcel(this.full_data,headname,filename);
		},
		cleanChart(){
			console.log('clean')
			document.getElementById('downcontrol').style.display = 'none';
			document.getElementById('chartcontrol').style.display = 'none';
			document.getElementById('alert').style.display='block';
			var char = '2022-1-28'

		}
	}
}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
