import { Method } from 'axios'
import { MtaWechatMpTokener } from '../tokener'

export interface IMtaWechatMpRequestOption {
	appid: string,
	secret: string,
	tokener: MtaWechatMpTokener,
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
