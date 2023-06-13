<template>
	<div>
		<div class="main-box">
			<div class="table-box">
				<div class="card table">
					<el-table
						ref="tableRef"
						:data="tableData"
						:border="true"
						:key="updateKey"
						v-fit-columns
						:row-style="{ height: '55px' }"
						:default-sort="{ prop: 'date', order: 'descending' }"
					>
						<el-table-column fixed type="index" label="#" width="60" />
						<el-table-column prop="id" label="id" width="60" />
						<el-table-column prop="device_name" label="设备名" width="200" />
						<el-table-column prop="device_id" label="设备号" width="200" />
						<el-table-column prop="applicant" label="批准人" width="150" />
						<el-table-column prop="date" label="报废日期" width="180" sortable :sort-orders="['descending', 'ascending']" />
						<!-- <el-table-column prop="operation" label="操作" width="150" fixed="right">
						<template #default="scope">
							<el-button type="primary" link @click="intoSrorage(scope.row)">入库</el-button>
						</template>
					</el-table-column> -->
						<!-- 表格无数据情况 -->
						<template #empty>
							<div class="table-empty">
								<slot name="empty">
									<img src="@/assets/images/notData.png" alt="notData" />
									<div>暂无数据</div>
								</slot>
							</div>
						</template>
					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts" name="scrap">
import { ref, onMounted } from "vue";
import axios from "axios";
let tableData = ref([]);
let updateKey = ref(0);

onMounted(async () => {
	getScrap();
});

const getScrap = () => {
	axios({
		method: "GET",
		url: axios.defaults.baseURL + "/equipment/scrap/getall",
		headers: { "content-type": "application/x-www-form-urlencoded" }
	})
		.then(res => {
			tableData = res.data.data.map(item => {
				return {
					id: item.id,
					device_name: item.equip_name,
					device_id: item.equip_num,
					applicant: item.applicant,
					date: item.scrap_time
				};
			});
			updateKey.value += 1;
		})
		.catch(err => {
			console.log(err.message);
		});
};
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
