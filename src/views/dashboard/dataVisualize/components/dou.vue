<template>
	<!-- 数据来源 -->
	<div class="echarts" ref="echartsRef"></div>
</template>
<script setup lang="ts" name="dou">
import { ref } from "vue";
import * as echarts from "echarts";
import { useEcharts } from "@/hooks/useEcharts";
// const start = ref(new Date());
// let s1 = ref(start.value.getFullYear());
// let s2 = ref(start.value.getMonth() + 1);
// let s3 = ref(start.value.getDate());
// let today = s1.value + "-" + s2.value + "-" + s3.value;
// let s4 = ref(start.value.getDate() - 1);
// if (s2.value == 1 && s4.value <= 0) {
// 	s1.value -= 1;
// 	s2.value = 12;
// 	s4.value = 31;
// }
// if (s2.value == 2 && s4.value <= 0) {
// 	s2.value = 1;
// 	s4.value = 31;
// }
// if (s2.value == 3 && s4.value <= 0) {
// 	s2.value = 2;
// 	s4.value = 29;
// }
// if (s2.value == 4 && s4.value <= 0) {
// 	s2.value = 3;
// 	s4.value = 31;
// }
// if (s2.value == 5 && s4.value <= 0) {
// 	s2.value = 4;
// 	s4.value = 30;
// }
// if (s2.value == 6 && s4.value <= 0) {
// 	s2.value = 5;
// 	s4.value = 31;
// }
// if (s2.value == 7 && s4.value <= 0) {
// 	s2.value = 6;
// 	s4.value = 30;
// }
// if (s2.value == 8 && s4.value <= 0) {
// 	s2.value = 7;
// 	s4.value = 31;
// }
// if (s2.value == 9 && s4.value <= 0) {
// 	s2.value = 8;
// 	s4.value = 31;
// }
// if (s2.value == 10 && s4.value <= 0) {
// 	s2.value = 9;
// 	s4.value = 30;
// }
// if (s2.value == 11 && s4.value <= 0) {
// 	s2.value = 10;
// 	s4.value = 31;
// }
// if (s2.value == 12 && s4.value <= 0) {
// 	s2.value = 11;
// 	s4.value = 30;
// }
// let yesterday = s1.value + "-" + s2.value + "-" + s4.value;
// let s5 = ref(start.value.getDate() - 2);
// let qian1 = s1.value + "-" + s2.value + "-" + s5.value;
// let s6 = ref(start.value.getDate() - 3);
// let qian2 = s1.value + "-" + s2.value + "-" + s6.value;
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
console.log("Today's date is: " + formatDate(today2));
console.log("Yesterday's date was: " + formatDate(yesterday2));
console.log("Two days ago, the date was: " + formatDate(twoDaysAgo));
console.log("Three days ago, the date was: " + formatDate(threeDaysAgo));
console.log("tomorrow's date is: " + formatDate(tomorrow2));
const echartsRef = ref<HTMLElement>();
const initChart = (data: any) => {
	const myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
	const option = {
		title: {
			text: "折线图显示选定不同类型的数据"
		},
		xAxis: {
			type: "category",
			data: [formatDate(threeDaysAgo), formatDate(twoDaysAgo), formatDate(yesterday2), formatDate(today2)]
		},
		yAxis: {
			type: "value"
		},
		series: [
			{
				data: data.value,
				type: "line",
				smooth: true
			}
		]
	};
	useEcharts(myChart, option);
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
