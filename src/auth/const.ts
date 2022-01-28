import { Method } from 'axios'

export const requestOptions: {
	[key: string]: {
		url: string,
		method: Method,
		tokenInQuery?: boolean
	}
} = {
	code2Session: {
		url: '/sns/jscode2session',
		method: 'get'
	},
	checkEncryptedData: {
		url: '/wxa/business/checkencryptedmsg',
		method: 'post'
	},
	getPaidUnionId: {
		url: '/wxa/getpaidunionid',
		method: 'get'
	},
	getPluginOpenPid: {
		url: '/wxa/getpluginopenpid',
		method: 'post'
	},
	getAccessToken: {
		url: '/cgi-bin/token',
		method: 'get'
	}
}
