<template>
	<div style="height: 100%">
		<div ref="cpu_load" class="card content-box"></div>
		<div ref="cpu_percent" class="card content-box" style="margin-top: 10px"></div>
		<div ref="mem_percent" class="card content-box" style="margin-top: 10px"></div>
		<div ref="GPU_percent" class="card content-box" style="margin-top: 10px"></div>
		<div ref="GPU_mem_percent" class="card content-box" style="margin-top: 10px"></div>
		<div ref="net_speed" class="card content-box" style="margin-top: 10px"></div>
		<div style="font: 0px/0px sans-serif; clear: both; display: block"></div>
	</div>
</template>

<script setup lang="js">
import { ref } from "vue";
import * as echarts from "echarts";
import axios from "axios";
import { DatabasePort } from "@/api/config/servicePort";
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

export default {
	name:'sysInfo',
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

		}
	},
	created() {
		console.log("created")
		this.dataGet();
		// console.log(this.x_time);
	},
	mounted() {
		console.log("mounted")
		this.init();
		// this.initChart();
		this.start()
	},
	beforeUnmount() {
		console.log("beforeUnmount")
		clearInterval(this.interval);
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
						saveAsImage: {}
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
						offset: -40
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
						saveAsImage: {}
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
						saveAsImage: {}
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
						saveAsImage: {}
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
						saveAsImage: {}
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
						saveAsImage: {}
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
		start(){
			this.interval = setInterval(() => {
				this.dataGet();
				this.drawBar();
				console.log(1);
			},1000*10)
		},
		dataGet(){
			var n = 15;
			axios.get(axios.defaults.baseURL+DatabasePort+"/serverPerformance/",
				{params:{request_type:0,num:n}})
			.then((resp) =>{
				console.log(resp.data)
				var data = resp.data;
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
				var loop = resp.data.length;
				while (loop--){
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
				}
				this.drawBar();
				window.onresize = function (){
					echarts.init(this.$refs.cpu_load).resize();
					echarts.init(this.$refs.cpu_percent).resize();
					echarts.init(this.$refs.mem_percent).resize();
				}
			})

		},
		dataUpdate(){
			axios.get(axios.defaults.baseURL+DatabasePort+"/serverPerformance/",
				{params:{request_type:0,num:1}})
				.then((resp) =>{
					var data = resp.data;
					this.log1.shift();
					this.log5.shift();
					this.log15.shift();
					this.x_time.shift();
					this.log1.push(data[0].loadavg_1);
					this.log5.push(data[0].loadavg_5);
					this.log15.push(data[0].loadavg_15);
					var temp = Date.parse(data[0].time)
					this.x_time.push(formatDate(temp));
				})
		}
	}
}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
