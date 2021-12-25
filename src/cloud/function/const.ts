import { Method } from 'axios'

export const requestOptions: {
	[key: string]: {
		url: string,
		method: Method,
		tokenInQuery: boolean
	}
} = {
	invokeCloudFunction: {
		url: '/tcb/invokecloudfunction',
		method: 'post',
		tokenInQuery: true
	}
}
