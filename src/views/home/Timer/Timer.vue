<template>
	<div class="timer-wrapper">
		<h2 class="timer-title">系统已运行(自2023-06-12 08:30:00)</h2>
		<div class="timer-container">
			<Segment :number="timeAgo.month" :title="'Months'"></Segment>
			<Segment :number="timeAgo.day" :title="'Days'"></Segment>
			<Segment :number="timeAgo.hour" :title="'Hours'"></Segment>
			<Segment :number="timeAgo.minute" :title="'Minutes'"></Segment>
			<Segment :number="timeAgo.second" :title="'Seconds'"></Segment>
		</div>

		<div class="container swing">
			<span class="string"></span>
			<span class="ball">:)</span>
		</div>
	</div>
</template>

<script lang="ts">
import Segment from "./Segment.vue";

function calculateTimeAgo(date: string) {
	const oneSecond = 1000;
	const oneMinute = oneSecond * 60;
	const oneHour = oneMinute * 60;
	const oneDay = oneHour * 24;
	const oneMonth = oneDay * 30;

	let leftTime = new Date().getTime() - new Date(date).getTime();

	const month = Math.floor(leftTime / oneMonth);
	leftTime = leftTime % oneMonth;

	const day = Math.floor(leftTime / oneDay);
	leftTime = leftTime % oneDay;

	const hour = Math.floor(leftTime / oneHour);
	leftTime = leftTime % oneHour;

	const minute = Math.floor(leftTime / oneMinute);
	leftTime = leftTime % oneMinute;

	const second = Math.floor(leftTime / oneSecond);

	return { month, day, hour, minute, second };
}

const startTime = "2023-06-12 08:30:00";

export default {
	components: {
		Segment
	},
	data() {
		return {
			timer: "",
			timeAgo: calculateTimeAgo(startTime)
		};
	},
	methods: {
		updateTimeAgo() {
			this.timeAgo = calculateTimeAgo(startTime);
		}
	},
	mounted() {
		this.timer = setInterval(this.updateTimeAgo, 1000);
	},
	beforeDestroy() {
		clearInterval(this.timer);
	}
};
</script>

<style lang="scss">
.timer-wrapper {
	position: relative;
}

.timer-title {
	text-align: center;
	color: #7e7e7e;
	margin-bottom: 10px;
}

.timer-container {
	display: flex;
	flex-direction: row;
	gap: 40px;
}

@property --angle {
	inherits: false;
	syntax: "<angle>";
	initial-value: 15deg;
}

.container {
	position: absolute;
	top: 0;
	right: -200px;

	height: 13rem;
	display: flex;
	align-items: center;
	flex-direction: column;

	transform-origin: top;
	transform: rotate(var(--angle));
}

.swing {
	transform-origin: top;
	animation: swing 1s linear infinite alternate-reverse;
}

@keyframes swing {
	0% {
		--angle: 15deg;
	}
	20% {
		--angle: 13deg;
	}
	80% {
		--angle: -13deg;
	}
	100% {
		--angle: -15deg;
	}
}

.string {
	width: 0.2rem;
	background: #439a97;
	height: 7rem;
}

.ball {
	--size: 4rem;
	height: var(--size);
	width: var(--size);
	border-radius: 50%;
	background: radial-gradient(#f2cd5c, #f2921d);
	box-shadow: 0 0 10px #f2921d;

	display: flex;
	font-size: 2rem;
	font-weight: bold;
	align-items: center;
	flex-direction: columm;
	justify-content: center;
	writing-mode: vertical-rl;
}
</style>
