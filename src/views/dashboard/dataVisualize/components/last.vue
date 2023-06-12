<template>
	<!-- 数据来源 -->
	<div class="echarts" ref="echartsRef"></div>
</template>
<script setup lang="ts" name="last">
import { ref } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
import axios from "axios";
let m = ref(0);
let a = ref(0);
let b = ref(0);
let c = ref(0);
let d = ref(0);
let e = ref(0);
let f = ref(0);
let g = ref(0);
let h = ref(0);
// let sum = ref(0);
const categories2 = (function () {
	let res = [];
	let len = 10;
	while (len--) {
		res.push(10 - len - 1);
	}
	return res;
})();

const data2 = (function () {
	let res = [];
	let len = 0;
	while (len < 5) {
		res.push(0);
		len++;
	}
	return res;
})();
const echartsRef = ref<HTMLElement>();
const initChart = () => {
	const myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
	const option = {
		title: {
			text: "Dynamic Data"
		},
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "cross",
				label: {
					backgroundColor: "#283b56"
				}
			}
		},
		legend: {},
		toolbox: {
			show: true,
			feature: {
				dataView: { readOnly: false },
				restore: {},
				saveAsImage: {}
			}
		},
		dataZoom: {
			show: false,
			start: 0,
			end: 100
		},
		xAxis: [
			{
				type: "category",
				boundaryGap: true,
				data: categories2
			}
		],
		yAxis: [
			{
				type: "value",
				scale: true,
				name: "number",
				max: 30,
				min: 0,
				boundaryGap: [0.2, 0.2]
			}
		],
		series: [
			{
				name: "Dynamic Line",
				type: "line",
				data: data2
			}
		]
	};
	// option.series[0].data = res;
	// useEcharts(myChart, option);
	let count = ref(11);
	// setInterval(getdou, 1000);
	// function getdou() {
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
	let i = ref(0);
	setInterval(function () {
		// let axisData = new Date().toLocaleTimeString().replace(/^\D*/, "");
		data2.shift();
		// data2.push(+(Math.random() * 10 + 5).toFixed(1));
		axios
			.get("http://8.136.80.196:8000/warningType/list_count/")
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
				// sum.value = m.value + a.value + b.value + c.value + d.value + e.value + f.value + g.value + h.value;
				// let res = [m.value, a.value, b.value, c.value, d.value, e.value, f.value, g.value, h.value];
				let res = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 16];
				// option.series[0].data = res;
				// option.series[0].data = res[i.value];
				while (i.value >= res.length) {
					i.value = 0;
				}
				data2.push(res[i.value]);
				// data2.push(sum.value);
				i.value++;
				// useEcharts(myChart, option);
			})
			.catch(err => {
				console.log(err);
			});
		categories2.shift();
		categories2.push(count.value++);
		xAxis: [
			{
				data: categories2
			}
		];
		series: [
			{
				data: data2
			}
		];
		useEcharts(myChart, option);
	}, 1000);
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
