<template>
	<!-- Gitee / GitHub 访问量占比 -->
	<div ref="echartsRef" class="echarts"></div>
</template>
<script setup lang="ts" name="pie">
import { ref } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
// import axios from "axios";
// import axios from "axios";
// let m = ref(0);
// let a = ref(0);
// let b = ref(0);
// let c = ref(0);
// let d = ref(0);
// let e = ref(0);
// let f = ref(0);
// let g = ref(0);
// let h = ref(0);
const echartsRef = ref<HTMLElement>();
const initChart = (data: any) => {
	const myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
	// : echarts.EChartsOption
	const option = {
		title: {
			text: "各报警类型占比情况",
			left: "center"
		},
		tooltip: {
			trigger: "item"
		},
		legend: {
			orient: "vertical",
			left: "left"
		},
		series: [
			{
				name: "报警信息",
				type: "pie",
				radius: "50%",
				data: data.value,
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: "rgba(0, 0, 0, 0.5)"
					}
				}
			}
		]
	};
	useEcharts(myChart, option);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// let res = [
	// 	[112, 234, 567, 567],
	// 	[567, 234, 567, 567],
	// 	[112, 112, 82, 888],
	// 	[112, 999, 567, 47]
	// ];
	// let g = ref(0);
	// setInterval(getpie, 1000);
	// function getpie() {
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
	// 			// let res = [20, 40, 60, 60, 80, 400, 80, 80, 80];
	// 			// console.log(option.series[0].data.value);
	// 			// let name = ["进入危险区域", "路面积水", "墙壁渗水", "烟雾", "明火", "区域停留时间过长", "摔倒", "吸烟", "挥手"];
	// 			option.series[0].data.value = res;
	// 			console.log(res);
	// 			console.log(option.series[0].data.value);
	// 			console.log(option.series[0].data);
	// 			// option.series[0].data.name = name;
	// 			useEcharts(myChart, option);
	// 		})
	// 		.catch(err => {
	// 			console.log(err);
	// 		});
	// }
	// option.series[0].data = res;
	// useEcharts(myChart, option);
	// function getpie() {
	// 	let i = Math.floor(Math.random() * res.length);
	// 	option.series[0].data = res[i];
	// 	useEcharts(myChart, option);
	// 	// d.value = res[i];
	// 	return d;
	// 	// g.value++;
	// 	// while (g.value >= 5) {
	// 	// 	g.value = 0;
	// 	// }
	// 	// axios
	// 	// 	.get("http://8.136.80.196:8000/serverPerformance/")
	// 	// 	.then(resp => {
	// 	// 		console.log(resp.data);
	// 	// 		let res1 = [
	// 	// 			resp.data[g.value].mem_free,
	// 	// 			resp.data[g.value].mem_used,
	// 	// 			resp.data[g.value].mem_used_percent,
	// 	// 			resp.data[g.value].mem_free
	// 	// 		];
	// 	// 		option.series[0].data = res1;
	// 	// 		useEcharts(myChart, option);
	// 	// 	})
	// 	// 	.catch(err => {
	// 	// 		console.log(err);
	// 	// 	});
	// }
};
defineExpose({
	initChart
});
// let res = [112, 234, 567, 567];
// let d = ref(0);
// function getpie() {
// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 	let i = Math.floor(Math.random() * res.length);
// 	console.log(i);
// 	d.value = res[i];
// 	console.log("数值");
// 	console.log(d);
// 	return d;
// }
</script>

<style lang="scss" scoped>
.echarts {
	width: 100%;
	height: 100%;
}
</style>
