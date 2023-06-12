<template>
	<div class="outer">
		<div class="pins">
			<span></span>
			<span></span>
			<span></span>
		</div>
		<div class="seg-container">
			<OneSegment :count="Math.floor(number / 10)"></OneSegment>
			<OneSegment :count="Math.floor(number % 10)"></OneSegment>
		</div>
		<h1>{{ title }}</h1>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OneSegment from "./OneSegment.vue";

export default defineComponent({
	props: {
		title: {
			type: String,
			default: ""
		},
		number: {
			type: Number,
			default: 0
		}
	},
	components: {
		OneSegment
	}
});
</script>

<style lang="scss">
.outer {
	color: white;
	box-shadow: 0 0 5px gray;
	border-radius: 0.5rem;
	width: 120px;

	h1 {
		background: green;
		color: white;
		font-size: 25px;
		height: fit-content;
		margin: 0;
		padding-block: 0.5rem;
		border-radius: 0 0 0.5rem 0.5rem;
		text-align: center;
	}
}

.pins {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	background: #eab308;
	padding-block: 0.5rem;
	padding-inline: 0.5rem;
	border-radius: 0.5rem 0.5rem 0 0;

	span {
		display: block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: white;
	}
}

.seg-container {
	display: flex;
	flex-direction: row;
	background: #eab308;
	justify-content: center;
	gap: 10px;
	padding-block: 0.5rem;
}
</style>
