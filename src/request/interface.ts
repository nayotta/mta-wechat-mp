import { Method } from 'axios'
import { MtaWechatMpAuth } from '../auth'

export interface IMtaWechatMpRequestOption {
	grantType: 'client_credential',
	appid: string,
	secret: string,
	auth: MtaWechatMpAuth,
	requestOptions?: {
		[key: string]: {
			url: string,
			method: Method,
			tokenInQuery?: boolean
		}
	}
}

export interface IRequestOption {
	url: string,
	method: Method,
	data?: any,
	tokenInQuery?: boolean,
	query?: {
		[key: string]: string
	}
}

export interface IWxResult {
	errcode: number,
	errmsg: string,
	[key: string]: any
}
