import { IMtaWechatMpRequestOption } from '../../request/interface'
import { IWxInvokeCloudFunctionResult } from './interface'
import { MtaWechatMpRequest } from '../../request'
import { requestOptions } from './const'

export class MtaWechatMpCloudFunction extends MtaWechatMpRequest {
	protected _env: string

	constructor (option: IMtaWechatMpRequestOption & {
		env: string
	}) {
		super({
			...option,
			requestOptions: option.requestOptions || requestOptions
		})
		this._env = option.env
	}

	/**
	 * wechat miniprogram cloud invoke function
	 * 触发云函数。注意：HTTP API 途径触发云函数不包含用户信息。
	 */
	public async invokeCloudFunction <T> (option: {
		name: string,
		data: any
	}) {
		const { name, data } = option
		const res = await this._request<IWxInvokeCloudFunctionResult>({
			...this.requestOptions.invokeCloudFunction,
			data: {
				name,
				POSTBODY: JSON.stringify(data)
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { resp_data: respData } = res || {}
		return {
			respData: JSON.parse(respData) as T
		}
	}
}
