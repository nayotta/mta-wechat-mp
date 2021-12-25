import { Method } from 'axios'

export const requestOptions: {
	[key: string]: {
		url: string,
		method: Method,
		tokenInQuery?: boolean
	}
} = {
	uploadFile: {
		url: '/tcb/uploadfile',
		method: 'post',
		tokenInQuery: true
	},
	batchDownloadFile: {
		url: '/tcb/batchdownloadfile',
		method: 'post',
		tokenInQuery: true
	},
	batchDeleteFile: {
		url: '/tcb/batchdeletefile',
		method: 'post',
		tokenInQuery: true
	}
}
