<template>
	<div class="wrapper">
		<div class="one-seg-contaier" :style="{ transform: `translateY(${count}0%)` }">
			<div v-for="(item, index) in Array.from(Array(10))" :key="index">
				<span class="segment">{{ 9 - index }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: "OneSegment",
	props: {
		count: {
			type: Number,
			default: 0
		}
	}
};
</script>

<style lang="scss">
:root {
	--width: 50px;
	--heigth: 65px;
}
.wrapper {
	position: relative;
	width: var(--width);
	height: var(--heigth);
	overflow: hidden;
	transition: 500ms;
}

.one-seg-contaier {
	position: absolute;
	bottom: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	transition: 500ms;
}

.segment {
	width: var(--width);
	height: var(--heigth);
	font-size: 60px;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
