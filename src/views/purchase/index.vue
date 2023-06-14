<template>
	<div>
		<div class="main-box">
			<div class="table-box">
				<!--#Header -->
				<!-- <div class="card table-search">
					<el-form :inline="true" ref="formRef">
						<el-form-item label="内容">
							<el-input v-model="content" />
						</el-form-item>
						<el-form-item label="报警日期">
							<el-date-picker
								v-model="dateRange"
								type="datetimerange"
								unlink-panels
								range-separator="To"
								start-placeholder="Start date"
								end-placeholder="End date"
								:clearable="false"
								value-format="YYYY-MM-DD HH:mm:ss"
							/>
						</el-form-item>
						<el-form-item>
							<div>
								<el-button type="primary" @click="search">搜索</el-button>
								<el-button @click="reset">重置</el-button>
							</div>
						</el-form-item>
					</el-form>
				</div> -->
				<!-- 表格主体 -->
				<div class="card table">
					<el-table
						ref="tableRef"
						:data="tableData"
						:border="true"
						:key="updateKey"
						:cell-style="cellStyle"
						v-fit-columns
						:row-style="{ height: '55px' }"
						:default-sort="{ prop: 'date', order: 'descending' }"
					>
						<el-table-column fixed type="index" label="#" width="60" />
						<el-table-column prop="id" label="id" width="60" />
						<el-table-column prop="device_name" label="设备名" width="180" />
						<el-table-column prop="device_id" label="设备号" width="180" />
						<el-table-column prop="number" label="设备数量" width="150" />
						<el-table-column prop="funds" label="购买经费" width="150" />
						<el-table-column prop="buyer" label="购入者" width="150" />
						<el-table-column prop="date" label="购入日期" width="180" sortable :sort-orders="['descending', 'ascending']" />
						<el-table-column prop="isInStorage" label="是否入库" width="120" />
						<el-table-column prop="operation" label="操作" width="180" fixed="right">
							<template #default="scope">
								<el-button type="primary" link @click="intoSrorage(scope.row)">入库</el-button>
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
					<el-dialog v-model="dialogVisible" title="添加设备" width="60%" v-if="dialogVisible">
						<el-form :model="ruleForm" ref="ruleFormRef" size="large" :rules="rules">
							<el-form-item label="设备名" autosize>
								<el-input v-model="ruleForm.equip_name" type="text" placeholder="请输入设备名" />
							</el-form-item>
							<el-form-item label="设备号" autosize>
								<el-input v-model="ruleForm.equip_num" type="text" placeholder="请输入设备号" />
							</el-form-item>
							<el-form-item label="设备数量" autosize>
								<el-input v-model="ruleForm.quantity" type="text" placeholder="请输入设备数量" />
							</el-form-item>
							<el-form-item label="购买经费" autosize>
								<el-input v-model="ruleForm.cost" type="text" placeholder="请输入购买经费" />
							</el-form-item>
							<el-form-item label="购入者" autosize>
								<el-input v-model="ruleForm.purchaser" type="text" placeholder="请输入购入者" />
							</el-form-item>
							<el-form-item label="购入时间" autosize>
								<el-date-picker
									v-model="ruleForm.date"
									type="date"
									format="YYYY/MM/DD"
									value-format="YYYY-MM-DD"
									placeholder="请选择购入日期"
								/>
							</el-form-item>
						</el-form>
						<template #footer>
							<span class="dialog-footer">
								<el-button @click="dialogVisible = false">取消</el-button>
								<el-button type="primary" @click="addPurchase(ruleFormRef)"> 提交 </el-button>
							</span>
						</template></el-dialog
					>
					<!-- 分页组件 -->
					<!-- <el-pagination
					v-model:current-page="pageNum"
					v-model:page-size="pageSize"
					:page-sizes="[10, 25, 50, 100]"
					:background="true"
					layout="total, sizes, prev, pager, next, jumper"
					:total="totalInfoNum"
				></el-pagination> -->
				</div>
			</div>
		</div>
		<div>
			<el-button
				@click="dialogVisible = true"
				type="primary"
				size="large"
				:icon="Plus"
				circle
				style="position: fixed; bottom: 80px; right: 50px"
			/>
		</div>
	</div>
</template>

<script setup lang="ts" name="purchase">
import { ref, onMounted, reactive } from "vue";
import axios from "axios";
import { ElNotification } from "element-plus";
import { getTimeState } from "@/utils/util";
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
let tableData = ref([]);
let updateKey = ref(0);

onMounted(async () => {
	getDeviece();
	ruleForm.date = new Date(2023, 6, 14);
});

const getDeviece = () => {
	axios({
		method: "GET",
		url: axios.defaults.baseURL + "/equipment/purchase/getall",
		headers: { "content-type": "application/x-www-form-urlencoded" }
	})
		.then(res => {
			tableData = res.data.data.map(item => {
				return {
					id: item.id,
					device_name: item.equip_name,
					device_id: item.equip_num,
					number: item.quantity,
					funds: item.cost,
					buyer: item.purchaser,
					date: item.date,
					isInStorage: item.status === 1 ? "是" : "否"
				};
			});
			updateKey.value += 1;
		})
		.catch(err => {
			console.log(err.message);
		});
};
const intoSrorage = (row: any) => {
	if (row.isInStorage === "是") {
		ElNotification({
			title: getTimeState(),
			message: "该项已入库",
			type: "error",
			duration: 3000
		});
	} else {
		axios({
			method: "POST",
			url: axios.defaults.baseURL + "/equipment/purchase/instorage",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			data: {
				equip_name: row.device_name,
				equip_num: row.device_id,
				quantity: row.number,
				id: row.id
			}
		})
			.then(res => {
				ElNotification({
					title: getTimeState(),
					message: "入库成功",
					type: "success",
					duration: 3000
				});
				getDeviece();
			})
			.catch(err => {
				console.log(err.message);
			});
	}
};
const deleteDevice = (row: any) => {
	axios({
		method: "POST",
		url: axios.defaults.baseURL + "/equipment/purchase/delete",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		data: {
			id: row.id
		}
	})
		.then(res => {
			if (res.data.status === true) {
				getDeviece();
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
const dialogVisible = ref(false);
const ruleForm = reactive({
	equip_name: "",
	equip_num: "",
	quantity: "",
	cost: "",
	date: Date(),
	purchaser: ""
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
	equip_name: [{ required: true, message: "请输入设备名", trigger: "blur" }],
	equip_num: [{ required: true, message: "请输入设备号", trigger: "blur" }],
	quantity: [{ required: true, message: "请输入设备数量", trigger: "blur" }],
	cost: [{ required: true, message: "请输入购买经费", trigger: "blur" }],
	purchaser: [{ required: true, message: "请输入购入者", trigger: "blur" }],
	date: [{ required: true, message: "请输入购入日期", trigger: "blur" }]
});
const addPurchase = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate((valid, fields) => {
		if (valid) {
			axios({
				url: axios.defaults.baseURL + "/equipment/purchase/add",
				method: "post",
				data: {
					equip_name: ruleForm.equip_name,
					equip_num: ruleForm.equip_num,
					quantity: ruleForm.quantity,
					cost: ruleForm.cost,
					date: ruleForm.date,
					purchaser: ruleForm.purchaser
				},
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			})
				.then(res => {
					if (res.data.status === true) {
						dialogVisible.value = false;
						getDeviece();
						ElNotification({
							title: "",
							message: "提交成功。",
							type: "success"
						});
					} else {
						ElNotification({
							title: "",
							message: "提交失败,请查看原因。",
							type: "warning"
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
//根据是否处理状态来渲染红绿
const cellStyle = (row: any, column: any, rowIndex: any, columnIndex: number) => {
	if (row.columnIndex === 8) {
		if (row.row.isInStorage === "否") {
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
