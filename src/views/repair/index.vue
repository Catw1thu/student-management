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
						:cell-style="cellStyle"
						:default-sort="{ prop: 'date', order: 'descending' }"
					>
						<el-table-column fixed type="index" label="#" width="60" />
						<el-table-column prop="id" label="id" width="60" />
						<el-table-column prop="device_name" label="设备名" width="200" />
						<el-table-column prop="device_id" label="设备号" width="200" />
						<el-table-column prop="number" label="数量" width="150" />
						<el-table-column prop="cost" label="维修费" width="160" />
						<el-table-column prop="operator" label="维修人" width="150" />
						<el-table-column prop="date" label="维修日期" width="180" sortable :sort-orders="['descending', 'ascending']" />
						<el-table-column prop="status" label="状态" width="150" />
						<el-table-column prop="operation" label="操作" width="180" fixed="right">
							<template #default="scope">
								<el-button type="primary" link @click="repairFinish(scope.row)">完成</el-button>
								<el-button type="danger" link @click="scrap(scope.row)">报废</el-button>
								<el-button type="info" link @click="deleteRepair(scope.row)">删除</el-button>
							</template>
						</el-table-column>
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
					<el-dialog v-model="dialogVisible" title="报废设备" width="60%" v-if="dialogVisible">
						<el-descriptions title="设备信息" size="large" border>
							<el-descriptions-item label="id">{{ selected_id }}</el-descriptions-item>
							<el-descriptions-item label="设备名">{{ selected_device_name }}</el-descriptions-item>
							<el-descriptions-item label="设备号">{{ selected_device_id }}</el-descriptions-item>
						</el-descriptions>
						<el-form :model="ruleForm" ref="ruleFormRef" size="large" :rules="rules">
							<el-form-item label="批准人" autosize>
								<el-input v-model="ruleForm.applicant" type="text" placeholder="请输入批准人" />
							</el-form-item>
							<el-form-item label="数量" autosize>
								<el-input v-model="ruleForm.number" type="text" placeholder="请输入设备数量" />
							</el-form-item>
							<el-form-item label="报废时间" autosize>
								<el-date-picker
									v-model="ruleForm.scrap_time"
									type="date"
									format="YYYY/MM/DD"
									value-format="YYYY-MM-DD"
									placeholder="请选择报废日期"
								/>
							</el-form-item>
						</el-form>
						<template #footer>
							<span class="dialog-footer">
								<el-button @click="dialogVisible = false">取消</el-button>
								<el-button type="primary" @click="setScrap(ruleFormRef)"> 提交 </el-button>
							</span>
						</template></el-dialog
					>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts" name="repair">
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { ElNotification } from "element-plus";
import { getTimeState } from "@/utils/util";
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
let tableData = ref([]);
let updateKey = ref(0);

onMounted(async () => {
	getRepair();
	ruleForm.scrap_time = new Date(2023, 6, 14);
});
const getRepair = () => {
	axios({
		method: "GET",
		url: axios.defaults.baseURL + "/equipment/repair/getall",
		headers: { "content-type": "application/x-www-form-urlencoded" }
	})
		.then(res => {
			let status2 = ["未完成", "已完成"];
			tableData = res.data.data.map(item => {
				return {
					id: item.id,
					device_name: item.equip_name,
					device_id: item.equip_num,
					number: item.quantity,
					cost: item.cost,
					operator: item.operator,
					date: item.date,
					status: status2[item.status]
				};
			});
			updateKey.value += 1;
		})
		.catch(err => {
			console.log(err.message);
		});
};
const repairFinish = (row: any) => {
	axios({
		method: "POST",
		url: axios.defaults.baseURL + "/equipment/repair/setnormal",
		data: { id: row.id },
		headers: { "Content-Type": "application/x-www-form-urlencoded" }
	})
		.then(res => {
			if (res.data.status === true) {
				getRepair();
				ElNotification({
					title: getTimeState(),
					message: "提交成功。",
					type: "success",
					duration: 3000
				});
			} else {
				ElNotification({
					title: getTimeState(),
					message: "该维修已完成。",
					type: "error",
					duration: 3000
				});
			}
		})
		.catch(err => {
			console.log(err.message);
		});
};
let selected_id = ref("");
let selected_device_id = ref("");
let selected_device_name = ref("");
let selected_device_number = ref("");
const dialogVisible = ref(false);
const ruleForm = reactive({
	applicant: "",
	scrap_time: Date(),
	number: ""
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
	applicant: [{ required: true, message: "请输入批准人", trigger: "blur" }],
	scrap_time: [{ required: true, message: "请选择报废时间", trigger: "blur" }],
	number: [{ required: true, message: "请输入设备数量", trigger: "blur" }]
});
const scrap = (row: any) => {
	if (row.status === "已完成") {
		ElNotification({
			title: getTimeState(),
			message: "该维修已完成。",
			type: "error",
			duration: 3000
		});
	} else {
		selected_id = row.id;
		selected_device_id = row.device_id;
		selected_device_name = row.device_name;
		selected_device_number = row.number;
		dialogVisible.value = true;
	}
};
const setScrap = async (formEl: FormInstance | undefined) => {
	if (parseInt(ruleForm.number) <= 0 || parseInt(ruleForm.number) > parseInt(selected_device_number)) {
		ElNotification({
			title: getTimeState(),
			message: "请输入正确的设备数量。",
			type: "error",
			duration: 3000
		});
		return;
	}
	if (!formEl) return;
	await formEl.validate((valid, fields) => {
		if (valid) {
			axios({
				url: axios.defaults.baseURL + "/equipment/repair/setscrap",
				method: "post",
				data: {
					id: selected_id,
					applicant: ruleForm.applicant,
					scrap_time: ruleForm.scrap_time,
					number: ruleForm.number
				},
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			})
				.then(res => {
					if (res.data.status === true) {
						dialogVisible.value = false;
						getRepair();
						ElNotification({
							title: getTimeState(),
							message: "提交成功。",
							type: "success",
							duration: 3000
						});
					} else {
						ElNotification({
							title: getTimeState(),
							message: "提交失败,请查看原因。",
							type: "error",
							duration: 3000
						});
					}
				})
				.catch(error => {
					console.log(error);
				});
		} else {
		}
	});
};
const deleteRepair = (row: any) => {
	axios({
		method: "POST",
		url: axios.defaults.baseURL + "/equipment/repair/delete",
		data: { id: row.id },
		headers: { "Content-Type": "application/x-www-form-urlencoded" }
	})
		.then(res => {
			if (res.data.status === true) {
				getRepair();
				ElNotification({
					title: getTimeState(),
					message: "删除成功",
					type: "success",
					duration: 3000
				});
			} else {
				ElNotification({
					title: getTimeState(),
					message: "删除失败，请查看原因",
					type: "error",
					duration: 3000
				});
			}
		})
		.catch(err => {
			console.log(err.message);
		});
};
const cellStyle = (row: any, column: any, rowIndex: any, columnIndex: number) => {
	if (row.columnIndex === 8) {
		if (row.row.status === "未完成") {
			return { color: "red" };
		} else {
			return { color: "green" };
		}
	}
};
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
