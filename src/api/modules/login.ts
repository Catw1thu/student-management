import { Login } from "@/api/interface";
import DynamicRouter from "@/assets/json/dynamicRouter.json";
import AuthButtons from "@/assets/json/authButtons.json";
// import qs from "qs";
import axios from "axios";
import { WebService } from "../config/servicePort";
import http from "@/api";

/**
 * @name 登录模块
 */
// * 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
	// return http.post<Login.ResLogin>(axios.defaults.baseURL + `/login`, params, { headers: { noLoading: true } }); // 正常 post json 请求  ==>  application/json
	return http.post<Login.ResLogin>(axios.defaults.baseURL + WebService + "/login", params, { headers: { noLoading: true } });
};

// * 获取按钮权限
export const getAuthButtonListApi = () => {
	// return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`, {}, { headers: { noLoading: true } });
	// 如果想让按钮权限变为本地数据，注释上一行代码，并引入本地 authButtons.json 数据
	return AuthButtons;
};

// * 获取菜单列表
export const getAuthMenuListApi = () => {
	// return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`, {}, { headers: { noLoading: true } });
	// 如果想让菜单变为本地数据，注释上一行代码，并引入本地 dynamicRouter.json 数据
	return DynamicRouter;
};

// * 用户退出登录
export const logoutApi = () => {
	// return http.post(axios.defaults.baseURL + `/logout`);
	return http.post(axios.defaults.baseURL + WebService + "/logout");
};