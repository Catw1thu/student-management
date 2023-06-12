<template>
	<!-- 数据来源 -->
	<div class="echarts" ref="echartsRef"></div>
</template>
<script setup lang="ts" name="cure">
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";;
// import axios from "axios";
const props = defineProps({
	msg:{
		type:String,
		require:true,
		default:"xxxx"
	},
	name:{
		type:String,
		require:true,
		default:"xxxx"
	},
	data:{
		type:Array,
		require:true
	}
})
onMounted(()=>{
	console.log(props.data)
})
const echartsRef = ref<HTMLElement>();
const initChart = (data: any) => {
	const myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
	const option = {
		// xAxis: {
		// 	type: "category",
		// 	data: ["进入危险区域", "烟雾", "明火", "路面积水", "墙壁渗水", "区域停留时间过长", "摔倒", "挥手", "吸烟"]
		// },
		// yAxis: {
		// 	type: "value"
		// },
		// series: [
		// 	{
		// 		data: data.value,
		// 		type: "bar",
		// 		showBackground: true,
		// 		backgroundStyle: {
		// 			color: "rgba(180, 180, 180, 0.2)"
		// 		}
		// 	}
		// ]
			tooltip: {
				trigger: "axis",
				backgroundColor: "transparent",
				axisPointer: {
					type: "none"
				},
				padding: 0,
				formatter: (p: any) => {
					let dom = `<div style="width:100%; height: 70px !important; display:flex;flex-direction: column;justify-content: space-between;padding:10px;box-sizing: border-box;
		  color:#fff; background: #6B9DFE;border-radius: 4px;font-size:14px; ">
		    <div style="display: flex; align-items: center;"> <div style="width:5px;height:5px;background:#ffffff;border-radius: 50%;margin-right:5px"></div>类型 :  ${p[0].name}</div>
		    <div style="display: flex;align-items: center;"><div style="width:5px;height:5px;background:#ffffff;border-radius: 50%;margin-right:5px"></div>数据量 :  ${p[0].value}</div>
		  </div>`;
					return dom;
				}
			},
			toolbox: {
				show: true,
				orient: "horizontal"
			},
			grid: {
				left: "5%",
				right: "6%"
			},
			dataZoom: [
				{
					show: false,
					height: 10,
					xAxisIndex: [0],
					bottom: 0,
					startValue: 0, //数据窗口范围的起始数值
					endValue: 9, //数据窗口范围的结束数值
					handleStyle: {
						color: "#6b9dfe"
					},
					textStyle: {
						color: "transparent"
					}
				},
				{
					type: "inside",
					show: true,
					height: 0,
					zoomLock: true //控制伸缩
				}
			],
			xAxis: [
				{
					type: "category",

					// data: data.map((val: any) => {
					// 	return {
					// 		value: val.spotName
					// 	};
					// }),
					data: ["进入危险区域", "烟雾", "明火", "路面积水", "墙壁渗水", "区域停留时间过长", "摔倒", "挥手", "吸烟"],
					axisTick: {
						show: false
					},
					axisLabel: {
						// interval: time > 4 ? 27 : 0,
						margin: 20,
						interval: 0,
						color: "#a1a1a1",
						fontSize: 14,
						formatter: function (name: string) {
							undefined;
							return name.length > 8 ? name.slice(0, 8) + "..." : name;
						}
					},
					axisLine: {
						lineStyle: {
							color: "#F6F6F7",
							width: 2
						}
					}
				}
			],
			yAxis: [
				{
					min: 0,
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					splitLine: {
						show: true,
						lineStyle: {
							type: "dashed",
							color: "#edeff5",
							width: 2
						}
					},
					axisLabel: {
						color: "#a1a1a1",
						fontSize: 16,
						fontWeight: 400,
						formatter: function (value: number) {
							if (value === 0) {
								return value;
							} else if (value >= 10000) {
								return value / 10000 + "w";
							}
							return value;
						}
					}
				}
			],
			series: [
				{
					name: "Direct",
					type: "bar",
					// data: data.map((val: any) => {
					// 	return {
					// 		value: val.value
					// 	};
					// }),
					data: data.value,
					barWidth: "45px",
					itemStyle: {
						color: "#C5D8FF",
						borderRadius: [12, 12, 0, 0]
					},
					emphasis: {
						itemStyle: {
							color: "#6B9DFE"
						}
					}
				}
			]
	};
	useEcharts(myChart, option);
	// let res1 = [
	// 	[112, 234, 567, 567, 56, 78, 91, 123, 197],
	// 	[567, 234, 567, 567, 67, 567, 56, 78, 91],
	// 	[112, 112, 82, 888, 567, 234, 567, 567, 67],
	// 	[112, 999, 567, 47, 98, 23, 1298, 670, 12]
	// ];
	// let e = ref(0);
	// let m = ref(0);
	// let a = ref(0);
	// let b = ref(0);
	// let c = ref(0);
	// let d = ref(0);
	// let e = ref(0);
	// let f = ref(0);
	// let g = ref(0);
	// let h = ref(0);
	// setInterval(getzhu, 1000);
	// option.series[0].data = res;
	// useEcharts(myChart, option);
	// function getzhu() {
	// 	let i = Math.floor(Math.random() * res1.length);
	// 	option.series[0].data = res1[i];
	// 	useEcharts(myChart, option);
	// 	// d.value = res[i];
	// 	return e;
	// }
	// function getzhu() {
	// 	axios
	// 		.get("http://8.136.80.196:8000/warningType/list_count/")
	// 		.then(resp => {
	// 			console.log(resp.data);
	// 			m.value = resp.data[0].count;
	// 			a.value = resp.data[1].count;
	// 			b.value = resp.data[2].count;
	// 			c.value = resp.data[3].count;
	// 			d.value = resp.data[4].count;
	// 			e.value = resp.data[5].count;
	// 			f.value = resp.data[6].count;
	// 			g.value = resp.data[7].count;
	// 			h.value = resp.data[8].count;
	// 			let res = [m.value, a.value, b.value, c.value, d.value, e.value, f.value, g.value, h.value];
	// 			option.series[0].data = res;
	// 			useEcharts(myChart, option);
	// 		})
	// 		.catch(err => {
	// 			console.log(err);
	// 		});
	// }
};
defineExpose({
	initChart
});
</script>
<style lang="scss" scoped>
.echarts {
	width: 100%;
	height: 100%;
}
</style>
