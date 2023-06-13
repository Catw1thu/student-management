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
						:cell-style="cellStyle"
						v-fit-columns
						:row-style="{ height: '55px' }"
					>
						<el-table-column fixed type="index" label="#" width="60" />
						<el-table-column prop="id" label="id" width="60" />
						<el-table-column prop="device_name" label="设备名" width="200" />
						<el-table-column prop="device_id" label="设备号" width="200" />
						<el-table-column prop="current_num" label="现存设备数量" width="160" />
						<el-table-column prop="status" label="设备状态" width="150" />
						<el-table-column prop="operation" label="操作" width="180" fixed="right">
							<template #default="scope">
								<el-button type="danger" link @click="broken(scope.row)">损坏</el-button>
								<el-button type="primary" link @click="sendRepair(scope.row)">送修</el-button>
								<el-button type="info" link @click="deleteDevice(scope.row)">删除</el-button>
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
					<el-dialog v-model="dialogBrokenVisible" title="损坏设备" width="60%" v-if="dialogBrokenVisible">
						<el-descriptions title="设备信息" size="large" border>
							<el-descriptions-item label="id">{{ selected_id }}</el-descriptions-item>
							<el-descriptions-item label="设备名">{{ selected_device_name }}</el-descriptions-item>
							<el-descriptions-item label="设备号">{{ selected_device_id }}</el-descriptions-item>
						</el-descriptions>
						<el-form :model="ruleBrokenForm" ref="ruleBrokenFormRef" size="large" :rules="rulesBroken">
							<el-form-item label="设备数量" autosize>
								<el-input v-model="ruleBrokenForm.number" type="text" placeholder="请输入损坏设备数量" />
							</el-form-item>
						</el-form>
						<template #footer>
							<span class="dialog-footer">
								<el-button @click="dialogBrokenVisible = false">取消</el-button>
								<el-button type="primary" @click="brokenDevice(ruleBrokenFormRef)"> 提交 </el-button>
							</span>
						</template></el-dialog
					>
					<el-dialog v-model="dialogRepairVisible" title="维修设备" width="60%" v-if="dialogRepairVisible">
						<el-descriptions title="设备信息" size="large" border>
							<el-descriptions-item label="id">{{ selected_id }}</el-descriptions-item>
							<el-descriptions-item label="设备名">{{ selected_device_name }}</el-descriptions-item>
							<el-descriptions-item label="设备号">{{ selected_device_id }}</el-descriptions-item>
						</el-descriptions>
						<el-form :model="ruleRepairForm" ref="ruleRepairFormRef" size="large" :rules="rulesRepair">
							<el-form-item label="数量" autosize>
								<el-input v-model="ruleRepairForm.number" type="text" placeholder="请输入维修费用" />
							</el-form-item>
							<el-form-item label="费用" autosize>
								<el-input v-model="ruleRepairForm.cost" type="text" placeholder="请输入维修费用" />
							</el-form-item>
							<el-form-item label="维修人" autosize>
								<el-input v-model="ruleRepairForm.operator" type="text" placeholder="请输入维修人" />
							</el-form-item>
							<el-form-item label="维修时间" autosize>
								<el-date-picker
									v-model="ruleRepairForm.date"
									type="date"
									format="YYYY/MM/DD"
									value-format="YYYY-MM-DD"
									placeholder="pick a day"
								/>
							</el-form-item>
						</el-form>
						<template #footer>
							<span class="dialog-footer">
								<el-button @click="dialogRepairVisible = false">取消</el-button>
								<el-button type="primary" @click="repairDevice(ruleRepairFormRef)"> 提交 </el-button>
							</span>
						</template></el-dialog
					>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts" name="inventory">
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { ElNotification } from "element-plus";
import { getTimeState } from "@/utils/util";
import type { FormInstance, FormRules } from "element-plus";
let tableData = ref([]);
let updateKey = ref(0);

onMounted(async () => {
	getInventory();
});

const getInventory = () => {
	axios({
		method: "GET",
		url: axios.defaults.baseURL + "/equipment/inventory/getall",
		headers: { "content-type": "application/x-www-form-urlencoded" }
	})
		.then(res => {
			let status2 = ["正常", "损坏", "维修中"];
			tableData = res.data.data.map(item => {
				return {
					id: item.id,
					device_name: item.equip_name,
					device_id: item.equip_num,
					current_num: item.current_num,
					status: status2[item.equip_status]
				};
			});
			updateKey.value += 1;
		})
		.catch(err => {
			console.log(err.message);
		});
};
let selected_id = ref("");
let selected_device_name = ref("");
let selected_device_id = ref("");
let selected_device_number = ref("");
const dialogBrokenVisible = ref(false);
const ruleBrokenForm = reactive({
	number: ""
});
const ruleBrokenFormRef = ref<FormInstance>();
const rulesBroken = reactive<FormRules>({
	number: [{ required: true, message: "请输入损坏设备数量", trigger: "blur" }]
});
const broken = (row: any) => {
	if (row.status !== "正常") {
		ElNotification({
			title: getTimeState(),
			message: "设备状态不是正常",
			type: "error",
			duration: 3000
		});
	} else {
		selected_id = row.id;
		selected_device_id = row.device_id;
		selected_device_name = row.device_name;
		selected_device_number = row.current_num;
		dialogBrokenVisible.value = true;
	}
};
const brokenDevice = async (formEl: FormInstance | undefined) => {
	if (parseInt(ruleBrokenForm.number) <= 0 || parseInt(ruleBrokenForm.number) > parseInt(selected_device_number)) {
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
				url: axios.defaults.baseURL + "/equipment/inventory/setstatus",
				method: "post",
				data: {
					id: selected_id,
					number: ruleBrokenForm.number
				},
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			})
				.then(res => {
					if (res.data.status === true) {
						dialogBrokenVisible.value = false;
						getInventory();
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
const dialogRepairVisible = ref(false);
const ruleRepairForm = reactive({
	number: "",
	cost: "",
	operator: "",
	date: Date()
});
const ruleRepairFormRef = ref<FormInstance>();
const rulesRepair = reactive<FormRules>({
	number: [{ required: true, message: "请输入设备数量", trigger: "blur" }],
	cost: [{ required: true, message: "请输入维修费", trigger: "blur" }],
	operator: [{ required: true, message: "请输入维修人", trigger: "blur" }],
	date: [{ required: true, message: "请选择维修日期", trigger: "blur" }]
});
const sendRepair = (row: any) => {
	if (row.status !== "损坏") {
		ElNotification({
			title: getTimeState(),
			message: "设备状态不是损坏",
			type: "error",
			duration: 3000
		});
	} else {
		selected_id = row.id;
		selected_device_id = row.device_id;
		selected_device_name = row.device_name;
		selected_device_number = row.current_num;
		dialogRepairVisible.value = true;
	}
};
const repairDevice = async (formEl: FormInstance | undefined) => {
	if (parseInt(ruleRepairForm.number) <= 0 || parseInt(ruleRepairForm.number) > parseInt(selected_device_number)) {
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
				url: axios.defaults.baseURL + "/equipment/inventory/sendrepair",
				method: "post",
				data: {
					id: selected_id,
					number: ruleRepairForm.number,
					cost: ruleRepairForm.cost,
					operator: ruleRepairForm.operator,
					date: ruleRepairForm.date
				},
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			})
				.then(res => {
					if (res.data.status === true) {
						dialogRepairVisible.value = false;
						getInventory();
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
							type: "warning",
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
const deleteDevice = (row: any) => {
	axios({
		method: "POST",
		url: axios.defaults.baseURL + "/equipment/inventory/delete",
		data: { id: row.id },
		headers: { "Content-Type": "application/x-www-form-urlencoded" }
	})
		.then(res => {
			if (res.data.status === true) {
				getInventory();
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
	if (row.columnIndex === 5) {
		if (row.row.status === "损坏") {
			return { color: "red" };
		} else if (row.row.status === "维修中") {
			return { color: "blue" };
		} else {
			return { color: "green" };
		}
	}
};
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
