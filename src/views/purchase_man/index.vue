<template>
	<div class="main-box">
		<div class="table-box">
			<!-- #Header -->
			<!--<div class="card table-search">
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
							:shortcuts="shortcuts"
							:disabled-date="disabledDate"
							value-format="YYYY-MM-DD HH:mm:ss"
						/>
					</el-form-item>
					<el-form-item>
						<div>
							<el-button type="primary" :icon="Search" @click="search">搜索</el-button>
							<el-button :icon="Delete" @click="reset">重置</el-button>
						</div>
					</el-form-item>
				</el-form>
			</div>-->
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
					<el-table-column prop="device_name" label="设备名" width="120" />
					<el-table-column prop="device_id" label="设备号" width="60" />
					<el-table-column prop="number" label="设备数量" width="60" />
					<el-table-column prop="funds" label="购买经费" width="60" />
					<el-table-column prop="buyer" label="购入者" width="120" />
					<el-table-column prop="date" label="购入日期" width="150" sortable :sort-orders="['descending', 'ascending']" />
					<el-table-column prop="isInStorage" label="是否入库" width="60" />
					<el-table-column prop="operation" label="操作" width="60" fixed="right">
						<!-- <template #default="scope">
							<el-button type="primary" link :icon="View" @click="detialInfo(scope.row)">入库</el-button>
						</template> -->
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
</template>

<scrip setup lang="ts" name="purchase_man">
import { reactive, ref } from "vue";
import axios from "axios";
let tableData = ref([]);
let updateKey = ref(0);

const getDevieces = () => {
	axios({
		method: "GET",
		url: axios.defaults.baseURL + "/equipment/purchase/getall",
		headers: { "content-type": "application/x-www-form-urlencoded" }
	})
		.then(res => {
			tableData = res.data.data.map(item => {
				return {
					device_name: item.equip_name,
					device_id: item.num,
					number: item.quantity,
					funds: item.cost,
					buyer: item.purchaser,
					date: item.date,
					isInStorage: item.status === 1 ? "是" : "否"
				};
				updateKey.value += 1;
			});
		})
		.catch(err => {
			console.log(err.message);
		});
};
getDevieces();

//根据是否处理状态来渲染红绿
const cellStyle = (row: any, column: any, rowIndex: any, columnIndex: number) => {
	if (row.columnIndex === 6) {
		if (row.row.isInStorage === "否") {
			return { color: "red" };
		} else {
			return { color: "green" };
		}
	}
};
</scrip>

<style scoped lang="scss">
@import "./index.scss";
</style>
