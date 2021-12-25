export interface IWxCloudDbMigrateImportResult {
	'job_id': number
}

export interface IWxCloudDbMigrateExportResult {
	'job_id': number
}

export interface IWxCloudDbMigrateQueryInfoResult {
	status: string,
	'record_success': number,
	'record_fail': number,
	'error_msg': string,
	'file_url': string
}

export interface IWxCloudDbCollectionGetResult {
	pager: {
		Offset: number,
		Limit: number,
		Total: number
	},
	collections: {
		name: string,
		count: number,
		size: number,
		'index_count': number,
		'index_size': number
	}[]
}

export interface IWxCloudDbAddResult {
	'id_list': string[]
}

export interface IWxCloudDbDeleteResult {
	deleted: number
}

export interface IWxCloudDbQueryResult {
	pager?: {
		Limit: number,
		Offset: number,
		Total: number
	},
	data?: any[]
}

export interface IWxCloudDbUpdateResult {
	matched: number,
	modified: number,
	id?: string
}

export interface IWxCloudDbAggregateResult {
	data: string[]
}

export interface IWxCloudDbCountResult {
	count: number
}
