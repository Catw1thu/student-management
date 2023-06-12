<template>
	<div class="main-box">
		<div class="card filter">
			<h4 class="title sle">过滤器</h4>
			<el-scrollbar :style="{ height: `calc(100% - 95px)` }">
				<el-input v-model="filterText_status" placeholder="状态关键字过滤" clearable />
				<el-tree
					ref="treeRef_status"
					:highlight-current="true"
					:expand-on-click-node="true"
					:default-expand-all="true"
					:data="data_status"
					:props="defaultProps"
					node-key="id"
					:filter-node-method="filterNode"
					@node-click="handleNodeClick_status"
				/>
				<p></p>
				<el-input v-model="filterText_camera" placeholder="摄像头/地区关键字过滤" clearable />
				<el-tree
					ref="treeRef_camera"
					:highlight-current="true"
					:expand-on-click-node="true"
					:data="data_camera"
					:props="defaultProps"
					node-key="id"
					:filter-node-method="filterNode"
					@node-click="handleNodeClick_camera"
				/>
				<p></p>
				<el-input v-model="filterText_type" placeholder="类型关键字过滤" clearable />
				<el-tree
					ref="treeRef_type"
					:highlight-current="true"
					:expand-on-click-node="true"
					:data="data_type"
					:props="defaultProps"
					node-key="id"
					:filter-node-method="filterNode"
					@node-click="handleNodeClick_type"
				/>
			</el-scrollbar>
		</div>
		<div class="table-box">
			<!-- #Header -->
			<div class="card table-search">
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
			</div>
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
					:default-sort="{ prop: 'warning_time', order: 'descending' }"
				>
					<el-table-column fixed type="index" label="#" width="60" />
					<!-- <el-table-column fixed prop="id" label="id" width="60" /> -->
					<el-table-column prop="camera_id" label="摄像头" width="120" />
					<el-table-column prop="camera_location" label="摄像头区域" width="120" />
					<el-table-column prop="warning_type" label="类型" width="150" />
					<el-table-column prop="warning_degree" label="警告等级" width="90" />
					<el-table-column prop="warning_time" label="时间" width="180" sortable :sort-orders="['descending', 'ascending']" />
					<el-table-column prop="is_deal" label="状态" width="120" />
					<el-table-column prop="warning_message" label="处理内容" width="auto" />
					<el-table-column prop="operation" label="操作" width="150" fixed="right">
						<template #default="scope">
							<el-button type="primary" link :icon="View" @click="detialInfo(scope.row)">查看</el-button>
							<el-button type="primary" link :icon="EditPen" @click="handleDeal(scope.row)">处理</el-button>
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
				<!-- 详细信息Dialog -->
				<el-dialog v-model="dialogInfoVisible" title="详细信息" width="60%" v-if="dialogInfoVisible">
					<!-- 视频 -->
					<div class="a">
						<video class="vd" autoplay :src="video_url" ref="video_con" controls width="800">您的浏览器无法播放该视频！</video>
						<!-- <div class="c">
							<el-button type="primary" @click="getVideoUrl">播放</el-button>
							<el-button type="primary" @click="rePlay">重新播放</el-button>
						</div> -->
					</div>
					<el-descriptions title="报警信息" size="large" border>
						<el-descriptions-item label="事件id">{{ selected_id }}</el-descriptions-item>
						<el-descriptions-item label="摄像头">{{ selected_camera_id }}</el-descriptions-item>
						<el-descriptions-item label="摄像头区域">{{ selected_camera_location }}</el-descriptions-item>
						<el-descriptions-item label="类型">{{ selected_warning_type }}</el-descriptions-item>
						<el-descriptions-item label="警告等级">{{ selected_warning_degree }}</el-descriptions-item>
						<el-descriptions-item label="时间">{{ selected_warning_time }}</el-descriptions-item>
						<el-descriptions-item label="状态">{{ selected_is_deal }}</el-descriptions-item>
						<el-descriptions-item label="处理内容">{{ selected_warning_message }}</el-descriptions-item>
					</el-descriptions>
					<template #footer>
						<span class="dialog-footer">
							<el-button type="primary" @click="dialogInfoVisible = false"> 确认</el-button>
						</span>
					</template></el-dialog
				>
				<!-- 处置信息Dialog -->
				<el-dialog v-model="dialogDealVisible" title="处理" width="60%" v-if="dialogDealVisible">
					<el-descriptions title="报警信息" size="large" border>
						<el-descriptions-item label="事件id">{{ selected_id }}</el-descriptions-item>
						<el-descriptions-item label="摄像头">{{ selected_camera_id }}</el-descriptions-item>
						<el-descriptions-item label="摄像头区域">{{ selected_camera_location }}</el-descriptions-item>
						<el-descriptions-item label="类型">{{ selected_warning_type }}</el-descriptions-item>
						<el-descriptions-item label="警告等级">{{ selected_warning_degree }}</el-descriptions-item>
						<el-descriptions-item label="时间">{{ selected_warning_time }}</el-descriptions-item>
						<el-descriptions-item label="状态">{{ selected_is_deal }}</el-descriptions-item>
						<el-descriptions-item label="处理内容">{{ selected_warning_message }}</el-descriptions-item>
					</el-descriptions>
					<el-form :model="ruleForm" ref="ruleFormRef" size="large" :rules="rules">
						<el-form-item label="处理结果" placeholder="Please input" autosize prop="desc">
							<el-input v-model="ruleForm.desc" type="textarea" :autosize="{ minRows: 4 }" />
						</el-form-item>
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="dialogDealVisible = false">取消</el-button>
							<el-button type="primary" @click="dealSubmit(ruleFormRef)"> 提交 </el-button>
						</span>
					</template></el-dialog
				>
				<!-- 分页组件 -->
				<el-pagination
					v-model:current-page="pageNum"
					v-model:page-size="pageSize"
					:page-sizes="[10, 25, 50, 100]"
					:background="true"
					layout="total, sizes, prev, pager, next, jumper"
					:total="totalInfoNum"
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="useTreeFilter">
import { ref, watch, reactive } from "vue";
import axios from "axios";
// import treeFilter from "@/components/hhj/treeFilter.vue";
// import proTable from "@/components/hhj/proTable.vue";
import { onMounted } from "vue";
import { ElTree } from "element-plus";
import { Delete, Search, EditPen, View } from "@element-plus/icons-vue";
import { start } from "repl";
import { ElNotification } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { DatabasePort, WebService } from "@/api/config/servicePort";
import { children } from "dom7";
import { enumDeclaration } from "@babel/types";
import { head } from "lodash";

onMounted(async () => {
	let href = window.location.href;
	let params_str = href.substring(href.indexOf("?") + 1);
	let params_obj = new URLSearchParams(params_str); // 获取URL中的参数
	is_deal.value = eval(params_obj.get("is_deal"));
	await getCameraList();
	await getWarningTypeList();
	search();
});

// //树形控件的过滤功能
// interface Tree {
// 	label: string;
// 	children?: Tree[];
// 	id: number;
// }

// const filterText_camera = ref<string>("");
// const filterText_type = ref<string>("");
// const filterText_status = ref<string>("");
// const treeRef_camera = ref<InstanceType<typeof ElTree>>();
// const treeRef_type = ref<InstanceType<typeof ElTree>>();
// const treeRef_status = ref<InstanceType<typeof ElTree>>();

// const defaultProps = {
// 	children: "children",
// 	label: "label"
// };

// watch(filterText_camera, val => {
// 	treeRef_camera.value!.filter(val);
// });

// watch(filterText_type, val => {
// 	treeRef_type.value!.filter(val);
// });

// watch(filterText_status, val => {
// 	treeRef_type.value!.filter(val);
// });

// // 过滤
// const filterNode = (value: string, _data: { [key: string]: any }, node: any) => {
// 	if (!value) return true;
// 	let parentNode = node.parent,
// 		labels = [node.label],
// 		level = 1;
// 	while (level < node.level) {
// 		labels = [...labels, parentNode.label];
// 		parentNode = parentNode.parent;
// 		level++;
// 	}
// 	return labels.some(label => label.indexOf(value) !== -1);
// };

// //定义树形控件的内容，需要动态获取
// const data_camera = ref([
// 	{
// 		id: -1,
// 		label: "所有摄像头/区域",
// 		children: [{ id: -1, label: "全部", camera_id: -1, camera_name: "", camera_location: "" }]
// 	}
// ]);

// const data_type = ref([
// 	{
// 		id: -1,
// 		label: "所有类型",
// 		children: [{ id: -1, label: "全部", warning_event: "", warning_type: -1 }]
// 	}
// ]);

// const data_status: Tree[] = [
// 	{
// 		id: -1,
// 		label: "所有状态",
// 		children: [
// 			{ id: -1, label: "全部" },
// 			{ id: 1, label: "已处理" },
// 			{ id: 0, label: "未处理" }
// 		]
// 	}
// ];

//当前页面所有信息
let camera_id = ref(-1);
let camera_location = ref("");
let warning_type = ref(-1);
let is_deal = ref(-1);
let warning_message = ref("");
let start_date = ref("");
let end_date = ref("");
let dateRange = ref("");
let content = ref("");
let pageNum = ref(1);
let pageSize = ref(10);
let totalInfoNum = ref(0);
let tableData = ref([]);
let updateKey = ref(0);

//左侧过滤器 和 上方搜索
const handleNodeClick_camera = (data: { [key: string]: any }) => {
	camera_id.value = data.camera_id;
};

const handleNodeClick_type = (data: { [key: string]: any }) => {
	warning_type.value = data.id;
};

const handleNodeClick_status = (data: { [key: string]: any }) => {
	is_deal.value = data.id;
};

watch([dateRange], () => {
	start_date.value = dateRange.value[0];
	end_date.value = dateRange.value[1];
});
watch([camera_id, warning_type, is_deal, pageNum, pageSize], () => {
	search();
});

//禁用超前时间
const disabledDate = (time: Date) => {
	return time.getTime() > Date.now();
};

//datapicker快捷日期选择
const shortcuts = [
	{
		text: "今天",
		value: () => {
			const end = new Date();
			end.setHours(23);
			end.setMinutes(59);
			end.setSeconds(59);
			const start = new Date();
			start.setTime(end.getTime() - 3600 * 1000 * 24 * 1 + 1000);
			return [start, end];
		}
	},
	{
		text: "昨天",
		value: () => {
			const end = new Date();
			end.setHours(23);
			end.setMinutes(59);
			end.setSeconds(59);
			const start = new Date();
			end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
			start.setTime(end.getTime() - 3600 * 1000 * 24 * 1 + 1000);
			return [start, end];
		}
	},
	{
		text: "前3天",
		value: () => {
			const end = new Date();
			end.setHours(23);
			end.setMinutes(59);
			end.setSeconds(59);
			const start = new Date();
			end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
			start.setTime(end.getTime() - 3600 * 1000 * 24 * 3 + 1000);
			return [start, end];
		}
	},
	{
		text: "本周",
		value: () => {
			const end = new Date();
			const week = end.getDay();
			end.setHours(23);
			end.setMinutes(59);
			end.setSeconds(59);
			const start = new Date();
			start.setTime(end.getTime() - 3600 * 1000 * 24 * (week + 1) + 1000);
			return [start, end];
		}
	},
	{
		text: "上周",
		value: () => {
			const end = new Date();
			const week = end.getDay();
			end.setHours(23);
			end.setMinutes(59);
			end.setSeconds(59);
			end.setTime(end.getTime() - 3600 * 1000 * 24 * (week + 1));
			const start = new Date();
			start.setTime(end.getTime() - 3600 * 1000 * 24 * 7 + 1000);
			return [start, end];
		}
	},
	{
		text: "本月",
		value: () => {
			const today = new Date();
			const start = new Date(today.getFullYear(), today.getMonth(), 1);
			start.setHours(0);
			start.setMinutes(0);
			start.setSeconds(0);
			const end = new Date();
			end.setHours(23);
			end.setMinutes(59);
			end.setSeconds(59);
			return [start, end];
		}
	},
	{
		text: "上个月",
		value: () => {
			const today = new Date();
			const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
			start.setHours(0);
			start.setMinutes(0);
			start.setSeconds(0);
			const end = new Date(today.getFullYear(), today.getMonth(), 1);
			end.setHours(0);
			end.setMinutes(0);
			end.setSeconds(0);
			end.setTime(end.getTime() - 1000);
			return [start, end];
		}
	},
	{
		text: "前3个月",
		value: () => {
			const today = new Date();
			const start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
			start.setHours(0);
			start.setMinutes(0);
			start.setSeconds(0);
			const end = new Date(today.getFullYear(), today.getMonth(), 1);
			end.setHours(0);
			end.setMinutes(0);
			end.setSeconds(0);
			end.setTime(end.getTime() - 1000);
			return [start, end];
		}
	},
	{
		text: "前6个月",
		value: () => {
			const today = new Date();
			const start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
			start.setHours(0);
			start.setMinutes(0);
			start.setSeconds(0);
			const end = new Date(today.getFullYear(), today.getMonth(), 1);
			end.setHours(0);
			end.setMinutes(0);
			end.setSeconds(0);
			end.setTime(end.getTime() - 1000);
			return [start, end];
		}
	},
	{
		text: "前12个月",
		value: () => {
			const today = new Date();
			const start = new Date(today.getFullYear(), today.getMonth() - 12, 1);
			start.setHours(0);
			start.setMinutes(0);
			start.setSeconds(0);
			const end = new Date(today.getFullYear(), today.getMonth(), 1);
			end.setHours(0);
			end.setMinutes(0);
			end.setSeconds(0);
			end.setTime(end.getTime() - 1000);
			return [start, end];
		}
	}
];

//重置
const reset = () => {
	dateRange.value = "";
	content.value = "";
};

//映射表
const is_dealTable = ["未处理", "已处理"];

//动态获取左侧过滤器内容
const getCameraList = async () => {
	return axios
		.get(axios.defaults.baseURL + DatabasePort + "/camera/", {
			params: {}
		})
		.then(response => {
			for (let i = 0; i < response.data.length; i++) {
				data_camera.value[0].children.push({
					id: i,
					label: response.data[i].name + " " + response.data[i].location,
					camera_id: response.data[i].id,
					camera_name: response.data[i].name,
					camera_location: response.data[i].location
				});
			}
		})
		.catch(error => {
			console.log(error);
		});
};

const getWarningTypeList = async () => {
	return axios
		.get(axios.defaults.baseURL + DatabasePort + "/warningType/list/", {
			params: {}
		})
		.then(response => {
			for (let i = 0; i < response.data.length; i++) {
				data_type.value[0].children.push({
					id: i,
					label: response.data[i].warning_event,
					warning_event: response.data[i].warning_event,
					warning_type: response.data[i].warning_id
				});
			}
		})
		.catch(error => {
			console.log(error);
		});
};

//根据camera_id返回camera_name
function cameraIdToName(camera_id: any) {
	for (let i = 0; i < data_camera.value[0].children.length; i++) {
		if (camera_id === data_camera.value[0].children[i].camera_id) {
			return data_camera.value[0].children[i].camera_name;
		}
	}
}
//根据camera_id返回camera_location
function cameraIdToLocation(camera_id: any) {
	for (let i = 0; i < data_camera.value[0].children.length; i++) {
		if (camera_id === data_camera.value[0].children[i].camera_id) {
			return data_camera.value[0].children[i].camera_location;
		}
	}
}

//根据warning_type返回warning_type
function warningIdToType(warning_type: any) {
	for (let i = 0; i < data_type.value[0].children.length; i++) {
		if (warning_type === data_type.value[0].children[i].warning_type) {
			return data_type.value[0].children[i].warning_event;
		}
	}
}

//搜索
const search = () => {
	// console.log(data_camera);
	// console.log(data_type);
	axios
		.get(axios.defaults.baseURL + DatabasePort + "/warningRecord/page/", {
			params: {
				camera_id: camera_id.value,
				warning_type: warning_type.value,
				is_deal: is_deal.value,
				warning_message: content.value,
				start_date: start_date.value,
				end_date: end_date.value,
				num: pageSize.value,
				page: pageNum.value
			}
		})
		.then(response => {
			// console.log(response.data);
			totalInfoNum = response.data.total_count;
			tableData = response.data.data.map((item: { [x: string]: any; id: any }) => {
				return {
					id: item.id,
					camera_id: cameraIdToName(item.camera_id),
					camera_location: cameraIdToLocation(item.camera_id),
					warning_type: warningIdToType(item.warning_type),
					warning_type_id: item.warning_type,
					warning_time: item.warning_time,
					is_deal: is_dealTable[item.is_deal],
					warning_message: item.warning_message,
					warning_degree: item.warning_degree + "级",
					warning_url: item.warning_url
				};
			});
			updateKey.value += 1;
		})
		.catch(error => {
			console.log(error);
		});
};

//详细信息和处理功能 全部信息
const dialogInfoVisible = ref(false);
const dialogDealVisible = ref(false);
let selected_id = ref(0);
let selected_camera_id = ref(0);
let selected_camera_location = ref("");
let selected_warning_type = ref(-1);
let selected_warning_type_id = ref(-1);
let selected_warning_degree = ref(-1);
let selected_is_deal = ref(-1);
let selected_warning_time = ref("");
let selected_warning_message = ref("");
//视频
const video_url = ref(axios.defaults.baseURL + WebService + "/getSpecificVideo");

function detialInfo(row: any) {
	selected_id = row.id;
	selected_camera_id = row.camera_id;
	selected_camera_location = row.camera_location;
	selected_warning_type = row.warning_type;
	selected_warning_type_id = row.warning_type_id;
	selected_warning_degree = row.warning_degree;
	selected_is_deal = row.is_deal;
	selected_warning_time = row.warning_time;
	selected_warning_message = row.warning_message;
	dialogInfoVisible.value = true;
	video_url.value = axios.defaults.baseURL + WebService + "/getSpecificVideo" + row.warning_url;
}

function handleDeal(row: any) {
	if (row.is_deal === "已处理") {
		ElNotification({
			title: "",
			message: "此报警事件已被处理。",
			type: "warning"
		});
	} else {
		ruleForm.desc = "";
		selected_id = row.id;
		selected_camera_id = row.camera_id;
		selected_camera_location = row.camera_location;
		selected_warning_type = row.warning_type;
		selected_warning_type_id = row.warning_type_id;
		selected_warning_degree = row.warning_degree;
		selected_is_deal = row.is_deal;
		selected_warning_time = row.warning_time;
		selected_warning_message = row.warning_message;
		dialogDealVisible.value = true;
	}
}
const ruleForm = reactive({
	desc: ""
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
	desc: [{ required: true, message: "请输入处理内容:", trigger: "blur" }]
});

const dealSubmit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate((valid, fields) => {
		if (valid) {
			axios({
				url: axios.defaults.baseURL + DatabasePort + "/warningRecord/deal/",
				method: "post",
				data: {
					id: selected_id,
					warning_message: ruleForm.desc
				},
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			})
				.then(response => {
					if (response.data.result === "succ") {
						dialogDealVisible.value = false;
						search();
						//getMessageCount();
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
	if (row.columnIndex === 6) {
		if (row.row.is_deal === "未处理") {
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
