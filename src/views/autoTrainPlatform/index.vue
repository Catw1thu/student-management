<template>
	<div class="bg-box">
		<div style="display: flex; flex-direction: column; height: 100%">
			<el-form>
				<el-form-item>
					<span>模型种类：</span>
					<el-cascader
						id="model_name"
						v-model="model_name"
						:options="model_names"
						:show-all-levels="false"
						placeholder="请选择模型"
					/>
				</el-form-item>
				<el-form-item>
					<span>导出格式：</span>
					<el-checkbox-group id="model_format" v-model="model_formats">
						<el-checkbox border checked label="ONNX" />
						<el-checkbox border label="Engine" />
						<el-checkbox border disabled label="OpenVINO" />
						<el-checkbox border disabled label="PaddleLite" />
					</el-checkbox-group>
				</el-form-item>
				<el-form-item>
					<div style="margin-top: 20px">
						<span>采用onnx-simplifier进行优化：</span>
						<el-radio-group v-model="is_simplifier">
							<el-radio border label="1">是</el-radio>
							<el-radio border label="2">否</el-radio>
						</el-radio-group>
					</div>
				</el-form-item>
				<el-form-item>
					<span>训练轮数设置：</span>
					<el-select v-model="epochs" placeholder="Select">
						<el-option v-for="item in epochs_list" :disabled="item.disabled" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<span>早停设置：</span>
					<el-popover
						:width="200"
						content="该属性值小于等于0时会训练到指定的轮数，不会提前停止"
						placement="top-start"
						title="提示"
						trigger="hover"
					>
						<template #reference>
							<el-input-number v-model="patience"></el-input-number>
						</template>
					</el-popover>
				</el-form-item>
				<el-form-item>
					<span>业务类别-1：</span>
					<el-checkbox-group id="names" v-model="names">
						<el-checkbox border label="人" />
						<el-checkbox border label="烟雾" />
						<el-checkbox border label="明火" />
						<el-checkbox border label="积水" />
						<el-checkbox border label="渗水" />
					</el-checkbox-group>
				</el-form-item>
				<el-form-item>
					<span>业务类别-2：</span>
					<el-checkbox-group id="names2" v-model="names2">
						<el-checkbox border label="摔倒" />
						<el-checkbox border label="挥手" />
						<el-checkbox border label="吸烟" />
					</el-checkbox-group>
				</el-form-item>
				<el-form-item>
					<span>新增检测类型（可选）：</span>
					<el-checkbox-group id="names3">
						<el-upload
							ref="upload"
							class="upload-demo"
							action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
							:limit="1"
							:on-exceed="handleExceed"
							:auto-upload="false">
							<el-button type="primary">上传数据集</el-button>
							<el-button class="ml-3" type="success" @click="submitUpload">
								上传至服务器
							</el-button>
							<template #tip>
								<div class="el-upload__tip text-red">
									新上传的训练数据集会覆盖旧训练数据集
								</div>
							</template>
						</el-upload>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item>

					<span>启动数据增强：</span>
					<el-popover
						:width="200"
						content="建议在数据集较少的情况下开启该功能"
						placement="top-start"
						title="提示"
						trigger="hover"
					>
						<template #reference>
							<el-switch
								size="large"
								v-model="augment"
								active-text="是"
								inactive-text="否"
								style="--el-switch-off-color: #ff4949"
								inline-prompt
							/>
						</template>
					</el-popover>
				</el-form-item>
				<el-form-item>
					<el-button style="margin: 0 auto; height: 45px" @click="beginTrain">开始训练</el-button>
					<el-button style="margin: 0 auto; height: 45px" @click="downloadModel">下载最新训练模型</el-button>
				</el-form-item>
			</el-form>
			<div style="display: flex; flex-direction: column; flex: 1; font-size: 18px">
				<div style="text-align: center; background: rgb(246, 248, 250)">
					<span style="">控制台输出：</span>
				</div>
				<el-space style="white-space: pre-wrap; background: rgb(246, 248, 250); min-height: 100%">
					<span style="white-space: pre-wrap">{{ train_message }}</span>
				</el-space>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { WebService } from "@/api/config/servicePort";
import {ElNotification} from "element-plus";

let socket = socketTrain

import { genFileId } from 'element-plus'
import  type, { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import {socketTrain} from "@/socket/socket";

const upload = ref<UploadInstance>();

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const submitUpload = () => {
  upload.value!.submit()
}

const model_names = [
	{
		value: "obj_detect",
		label: "目标检测类",
		children: [
			{
				value: "YOLOV8",
				label: "YOLOV8",
				children: [
					{
						value: "yolov8n.pt",
						label: "YOLOV8n.pt"
					},
					{
						value: "yolov8s.pt",
						label: "YOLOV8s.pt"
					},
					{
						value: "yolov8m.pt",
						label: "YOLOV8m.pt"
					}
				]
			},
			{
				value: "navigation",
				label: "YOLOV5",
				disabled: true,
				children: [{}]
			}
		]
	},
	{
		value: "obj_mask",
		label: "实例分割类",
		children: [{}],
		disabled: true
	}
];
const model_formats = ref([]);
const model_name = ref("");
const is_simplifier = ref("1");
const epochs = ref(1);
const epochs_list = ref([
	{
		value: 1,
		label: "1 epoch"
	},
	{
		value: 30,
		label: "30 epoch"
	},
	{
		value: 50,
		label: "50 epoch"
	},
	{
		value: 100,
		label: "100 epoch"
	},
	{
		value: 150,
		label: "150 epoch"
	},
	{
		value: 200,
		label: "200 epoch"
	}
]);
const patience = ref(10);
const names = ref([]);
const names2 = ref([]);
const visualize = ref(true);
const augment = ref(false);
const train_message = ref("");
const open = () => {
  ElNotification({
    title: '警告',
    message: '请君稍安勿躁，待训练结束后方可继续训练和下载训练模型。',
    type: 'warning',
		position: 'top-left',

  })
}
function isValid() {
	if (model_name.value === "") {
		return false;
	}
	if (model_formats.value.length === 0) {
		return false;
	}
	return names.value.length > 1;
}

function downloadModel() {
	window.open(axios.defaults.baseURL + WebService + "/downloadTrainedModel", "_blank");
}

function beginTrain() {
	if (isValid()) {
		axios
			.post(axios.defaults.baseURL + WebService + "/train/" + socket.id, {
				model_name: model_name.value.slice(-1)[0],
				model_formats: model_formats.value,
				optimize: is_simplifier.value === "1",
				simplify: is_simplifier.value === "1",
				epochs: epochs.value,
				patience: patience.value,
				names: names.value,
				visualize: visualize.value,
				augment: augment.value
			})
			.then(resp => {
				if (resp.data['msg'].startsWith('请')){
					open()
				}else{
					train_message.value = ""
				}

			})
			.catch(err => {
				console.log(err)
			});
	}
}

// let socket = io(axios.defaults.baseURL + WebService, {
// 	transports: ["websocket", "polling"],
// 	timeout: 5000
// });
// let user_id = undefined;
// socket.on("connect", () => {
// 	user_id = socket.id;
// 	console.log("服务器连接成功", user_id);
// });
// socket.on("disconnect", () => {
// 	socket.close();
// 	console.log("服务器断开连接");
// });
socket.on("trainMessage", resp => {
	train_message.value += resp["msg"];
});
</script>

<style scoped></style>
