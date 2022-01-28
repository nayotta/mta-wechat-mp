import axios, { AxiosResponse, Method } from 'axios'
import { IWxGetAccessTokenResult } from './interface'
import { requestOptions } from './const'

export class MtaWechatMpTokener {
	protected _appid: string
	protected _secret: string
	protected _proxy: {
		proxyUrl?: string
	} = {}

	public wechatApiHost: string = 'https://api.weixin.qq.com'
	public accessToken: string = ''

	public requestOptions: {
		[key: string]: {
			url: string,
			method: Method,
			tokenInQuery?: boolean
		}
	} = requestOptions

	constructor (option: {
		appid: string,
		secret: string,
		accessToken?: string,
		proxy?: {
			proxyUrl?: string
		},
		requestOptions?: {
			[key: string]: {
				url: string,
				method: Method,
				tokenInQuery?: boolean
			}
		}
	}) {
		this._appid = option.appid
		this._secret = option.secret
		this._proxy = option.proxy || {}
		this.requestOptions = option.requestOptions || requestOptions
		this.accessToken = option.accessToken || ''
		// update wechat api host by proxy option
		if (option.proxy && option.proxy.proxyUrl) {
			this.wechatApiHost = option.proxy.proxyUrl
		}
	}

	/**
	 *  wechat miniprogram auth access token
	 * 获取小程序全局唯一后台接口调用凭据（access_token）
	 */
	public getAccessToken (): Promise<Error | {
		accessToken: string,
		expiresIn?: number
	}> {
		return new Promise((resolve, reject) => {
			const { _appid, _secret } = this
			axios(`${this.wechatApiHost}${this.requestOptions.getAccessToken.url}?grant_type=client_credential&appid=${_appid}&secret=${_secret}`, {
				method: this.requestOptions.getAccessToken.method
			}).then((res: AxiosResponse<IWxGetAccessTokenResult>) => {
				const { access_token: accessToken, expires_in: expiresIn, errcode, errmsg } = res.data || {}
				if (!accessToken) {
					reject(new Error(`access_token not found with errcode (${errcode}) & errmsg (${errmsg})`))
					return
				}
				this.accessToken = accessToken
				resolve({
					accessToken,
					expiresIn
				})
			}).catch((err: Error) => {
				reject(err)
			})
		})
	}
}
