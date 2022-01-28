import { Method } from 'axios'

export const requestOptions: {
	[key: string]: {
		url: string,
		method: Method,
		tokenInQuery?: boolean
	}
} = {
	getAccessToken: {
		url: '/cgi-bin/token',
		method: 'get'
	}
}
