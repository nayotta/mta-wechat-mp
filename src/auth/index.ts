import { IWxCheckEncryptedDataResult, IWxCode2SessionResult, IWxGetAccessTokenResult, IWxGetPaidUnionIdResult, IWxGetPluginOpenPidResult } from './interface'
import { IMtaWechatMpRequestOption } from '../request/interface'
import { MtaWechatMpRequest } from '../request'
import { requestOptions } from './const'

export class MtaWechatMpAuth extends MtaWechatMpRequest {
	constructor (option: IMtaWechatMpRequestOption) {
		super({
			...option,
			requestOptions: option.requestOptions || requestOptions
		})
	}

	/**
	 * WeChat miniprogram verifies the login credential
	 * 登录凭证校验，通过 wx.login 接口获得临时登录凭证 code 后传到开发者服务器调用此接口完成登录流程
	 */
	public async code2Session (option: {
		jsCode: string
	}): Promise<Error | {
		openid?: string,
		sessionKey?: string,
		unionid?: string,
		errcode?: number,
		errmsg?: string
	}> {
		const res = await this._request<IWxCode2SessionResult>({
			...this.requestOptions.code2Session,
			query: {
				appid: this._appid,
				secret: this._secret,
				js_code: option.jsCode,
				grant_type: 'authorization_code'
			}
		}, false).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { openid, session_key: sessionKey, unionid, errmsg, errcode } = res || {}
		return {
			openid,
			sessionKey,
			unionid,
			errcode,
			errmsg
		}
	}

	/**
	 * wechat miniprogram check encrypted data
	 * 检查加密信息是否由微信生成（当前只支持手机号加密数据），只能检测最近3天生成的加密数据
	 */
	public async checkEncryptedData (encryptedMsgHash: string) {
		const res = await this._request<IWxCheckEncryptedDataResult>({
			...this.requestOptions.checkEncryptedData,
			data: {
				encrypted_msg_hash: encryptedMsgHash
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { errcode, errmsg, valid, create_time: createTime } = res
		return {
			errcode,
			errmsg,
			valid,
			createTime
		}
	}

	/**
	 * obtains the UnionId of a user after the user completes payment
	 * 用户支付完成后，获取该用户的 UnionId，无需用户授权。本接口支持第三方平台代理查询
	 */
	public async getPaidUnionId (option: {
		openid: string,
		transactionId?: string,
		mchId?: string,
		outTradeNo?: string
	}): Promise<Error | {
		unionid?: string,
		errcode?: number,
		errmsg?: string
	}> {
		const { openid, transactionId, mchId, outTradeNo } = option
		const query: {
			[key: string]: string
		} = {}
		if (openid) query.openid = openid
		if (transactionId) query.transaction_id = transactionId
		if (mchId) query.mch_id = mchId
		if (outTradeNo) query.out_trade_no = outTradeNo
		const res = await this._request<IWxGetPaidUnionIdResult>({
			...this.requestOptions.getPaidUnionId,
			query
		}, true).catch((err: Error) => err)
		return res
	}

	public async getPluginOpenPid (option: {
		code: string
	}): Promise<Error | {
		errcode?: number,
		errmsg?: string,
		openpid?: string
	}> {
		const res = await this._request<IWxGetPluginOpenPidResult>({
			...this.requestOptions.getPluginOpenPid,
			query: {
				code: option.code
			}
		}, true).catch((err: Error) => err)
		return res
	}

	/**
	 *  wechat miniprogram auth access token
	 * 获取小程序全局唯一后台接口调用凭据（access_token）
	 */
	public async getAccessToken (option: {
		appid: string,
		secret: string
	}): Promise<Error | {
		errcode?: number,
		errmsg?: string,
		accessToken?: string,
		expiresIn?: number
	}> {
		const res = await this._request<IWxGetAccessTokenResult>({
			...this.requestOptions.getAccessToken,
			query: {
				...option
			}
		}).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { errcode, errmsg, access_token: accessToken, expires_in: expiresIn } = res
		return {
			errcode,
			errmsg,
			accessToken,
			expiresIn
		}
	}
}
