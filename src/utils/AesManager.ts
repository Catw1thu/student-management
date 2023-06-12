import * as CryptoJS from "crypto-js";
//秘钥
const CRYPTOJSKEY = "gTlgLEc6oqZxdwGe";
export class AesManager {
	/*
	 * 加密方法
	 * {param} plaintText 加密明文
	 * return  str 加密结果
	 */
	public static encrypt(plaintText: any) {
		const options = {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		};
		const key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
		const encryptedData = CryptoJS.AES.encrypt(plaintText, key, options);
		const encryptedBase64Str = encryptedData.toString();
		return encryptedBase64Str;
	}
	/*
	 * 解密方法
	 * {param} plaintText 解密密文
	 * return  str 解密结果
	 */
	public static decrypt(encryptedBase64Str: any) {
		const options = {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		};
		const key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
		const decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, options);
		const decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
		return decryptedStr;
	}
}
