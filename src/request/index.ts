import { IMtaWechatMpRequestOption, IRequestOption, IWxResult } from './interface'
import axios, { AxiosResponse, Method } from 'axios'
import { MtaWechatMpAuth } from '../auth'

export class MtaWechatMpRequest {
	protected _appid: string
	protected _secret: string
	protected _auth: MtaWechatMpAuth

	public requestOptions: {
		[key: string]: {
			url: string,
			method: Method,
			tokenInQuery?: boolean
		}
	} = {}

	constructor (option: IMtaWechatMpRequestOption) {
		this._appid = option.appid
		this._secret = option.secret
		this.requestOptions = option.requestOptions || {}
		this._auth = option.auth
	}

	protected async _request<T> (option: IRequestOption, unauthRetry?: boolean): Promise<IWxResult & T | Error> {
		let accessTokenUpdated = false
		if (!this._auth.accessToken) {
			accessTokenUpdated = true
			const updateAccessTokenRes = await this._auth.getAccessToken().catch((err: Error) => err)
			if (updateAccessTokenRes instanceof Error) return updateAccessTokenRes
		}
		const {
			url,
			method,
			data,
			tokenInQuery,
			query = {}
		} = option
		const queryWithAccessToken = tokenInQuery
			? {
				...query,
				access_token: this._auth.accessToken
			}
			: {
				...query
			}
		const wholeUrl = this._auth.wechatApiHost + url + `${/\?/.test(url) ? '&' : '?'}${Object.entries(queryWithAccessToken).map(([key, value]) => {
				return `${key}=${value}`
			}).join('&')}`
		return new Promise((resolve, reject) => {
			axios(wholeUrl, {
				method,
				data
			}).then(async (res: AxiosResponse<IWxResult & T>) => {
				const { errcode } = res.data || {}
				if (!accessTokenUpdated && [40001, 42001, 41001, 40014].includes(errcode) && unauthRetry) {
					const tokenRes = await this._auth.getAccessToken().catch((err: Error) => err)
					if (tokenRes instanceof Error) {
						reject(tokenRes)
						return
					}
					const retryRes = await this._request<T>(option, false).catch((err: Error) => err)
					if (retryRes instanceof Error) {
						reject(retryRes)
					} else {
						resolve(retryRes)
					}
				} else {
					resolve(res.data)
				}
			}).catch((err: Error) => {
				reject(err)
			})
		})
	}

	/**
	 * merge module request options
	 * ???????????????????????????
	 */
	public async mergeRequestOptions (option: {
		[key: string]: {
			url: string,
			method: Method,
			tokenInQuery?: boolean
		}
	}) {
		this.requestOptions = {
			...this.requestOptions,
			...option
		}
	}
}
