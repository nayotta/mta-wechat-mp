export interface IWxUploadFileResult {
	url: string,
	token: string,
	authorization: string,
	'file_id': string,
	'cos_file_id': string
}

export interface IWxBatchDownloadFileResult {
	'file_list': {
		fileid: string,
		'download_url': string,
		status: number,
		errmsg: string
	}[]
}

export interface IWxBatchDeleteFileResult {
	'delete_list': {
		fileid: string,
		status: number,
		errmsg: string
	}[]
}
