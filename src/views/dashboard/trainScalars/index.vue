<template>
	<div style="width: 100%; height: 100%">
		<iframe id="my-iframe" :src="url" style="width: 100%; height: 100%"></iframe>
	</div>
</template>

<script setup>
import axios from "axios";
import { format } from "echarts";
import { onMounted, ref } from "vue";
import { VisualizePort } from "@/api/config/servicePort";
let url = ref("");
onMounted(() => {
	url.value = axios.defaults.baseURL + VisualizePort;
	let iframe = document.getElementById("my-iframe");
	let innerDOM = iframe.contentWindow.document;
	let brand = innerDOM.getElementsByClassName("brand");
	console.log(brand);
	// console.log(innerDOM)
});
</script>

<style scoped></style>
