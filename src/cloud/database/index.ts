import {
	IWxCloudDbAddResult,
	IWxCloudDbAggregateResult,
	IWxCloudDbCollectionGetResult,
	IWxCloudDbCountResult,
	IWxCloudDbDeleteResult,
	IWxCloudDbMigrateExportResult,
	IWxCloudDbMigrateImportResult,
	IWxCloudDbMigrateQueryInfoResult,
	IWxCloudDbQueryResult,
	IWxCloudDbUpdateResult
} from './interface'
import {
	TDbMigrateExportFileType,
	TDbMigrateImportConflictMode,
	TDbMigrateImportFileType,
	TDbUpdateIndexDirection
} from './type'
import { IMtaWechatMpRequestOption } from '../../request/interface'
import { MtaWechatMpRequest } from '../../request'
import { requestOptions } from './const'

export class MtaWechatMpCloudDatabase extends MtaWechatMpRequest {
	protected _env: string

	constructor (option: IMtaWechatMpRequestOption & {
		env: string
	}) {
		super({
			...option,
			requestOptions: option.requestOptions || requestOptions
		})
		this._env = option.env
	}

	/**
	 * wechat miniprogram cloud database migrate import
	 * 微信小程序云开发数据库导入
	 */
	public async migrateImport (option: {
		collectionName: string,
		filePath: string,
		fileType: TDbMigrateImportFileType,
		stopOnError: boolean,
		conflictMode: TDbMigrateImportConflictMode
	}) {
		const { collectionName, filePath, fileType, stopOnError, conflictMode } = option
		const fileTypeCode = {
			json: 1,
			csv: 2
		}[fileType]
		const conflictModeCode = {
			insert: 1,
			upsert: 2
		}[conflictMode]
		const res = await this._request<IWxCloudDbMigrateImportResult>({
			...this.requestOptions.databaseMigrateImport,
			data: {
				env: this._env,
				collection_name: collectionName,
				file_path: filePath,
				file_type: fileTypeCode,
				stop_on_error: stopOnError,
				conflict_mode: conflictModeCode
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { job_id: jobId } = res || {}
		return {
			jobId
		}
	}

	/**
	 * wechat miniprogram cloud database migrate export
	 * 微信小程序云开发数据库导出
	 */
	public async migrateExport (option: {
		filePath: string,
		fileType: TDbMigrateExportFileType,
		query: string
	}) {
		const { filePath, fileType, query } = option
		const fileTypeCode = {
			json: 1,
			csv: 2
		}[fileType]
		const res = await this._request<IWxCloudDbMigrateExportResult>({
			...this.requestOptions.databaseMigrateExport,
			data: {
				env: this._env,
				file_path: filePath,
				file_type: fileTypeCode,
				query
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { job_id: jobId } = res || {}
		return {
			jobId
		}
	}

	/**
	 * wechat miniprogram cloud database migrate query info
	 * 微信小程序云开发数据库迁移状态查询
	 */
	public async migrateQueryInfo (option: {
		jobId: number
	}) {
		const { jobId } = option
		const res = await this._request<IWxCloudDbMigrateQueryInfoResult>({
			...this.requestOptions.databaseMigrateQueryInfo,
			data: {
				env: this._env,
				job_id: jobId
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { status, record_success: recordSuccess, record_fail: recordFail, error_msg: errorMsg, file_url: fileUrl } = res || {}
		return {
			status,
			recordSuccess,
			recordFail,
			errorMsg,
			fileUrl
		}
	}

	/**
	 * wechat miniprogram cloud database update index
	 * 微信小程序云开发变更数据库索引
	 */
	public async updateIndex (option: {
		collectionName: string,
		createIndexes: {
			name: string,
			unique: boolean,
			keys: {
				name: string,
				direction: TDbUpdateIndexDirection
			}[]
		}[],
		dropIndexes: {
			name: string
		}[]
	}) {
		const { collectionName, createIndexes, dropIndexes } = option || {}
		const res = await this._request<{}>({
			...this.requestOptions.databaseUpdateIndex,
			data: {
				collection_name: collectionName,
				create_indexes: createIndexes,
				drop_indexes: dropIndexes
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { errcode, errmsg: message } = res
		return {
			errcode,
			message
		}
	}

	/**
	 * wechat miniprogram cloud database add collection
	 * 微信小程序云开发数据库新增集合
	 */
	public async collectionAdd (option: {
		collectionName: string
	}) {
		const { collectionName } = option
		const res = await this._request<{}>({
			...this.requestOptions.databaseCollectionAdd,
			data: {
				env: this._env,
				collection_name: collectionName
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { errcode, errmsg: message } = res
		return {
			errcode,
			message
		}
	}

	/**
	 * wechat miniprogram cloud database delete collection
	 * 微信小程序云开发数据库删除集合
	 */
	public async collectionDelete (option: {
		collectionName: string
	}) {
		const { collectionName } = option
		const res = await this._request<{}>({
			...this.requestOptions.databaseCollectionDelete,
			data: {
				env: this._env,
				collection_name: collectionName
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { errcode, errmsg: message } = res
		return {
			errcode,
			message
		}
	}

	/**
	 * wechat miniprogram cloud database get collections info
	 * 微信小程序云开发数据库获取集合信息
	 */
	public async collectionGet (option: {
		limit: number,
		offset: number
	}): Promise<Error | {
		pager: {
			offset: number,
			limit: number,
			total: number
		},
		collections: {
			name: string,
			count: number,
			size: number,
			indexCount: number,
			indexSize: number
		}[]
	}> {
		const { limit, offset } = option
		const res = await this._request<IWxCloudDbCollectionGetResult>({
			...this.requestOptions.databaseCollectionGet,
			data: {
				env: this._env,
				limit,
				offset
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { pager, collections } = res || {}
		return {
			pager: {
				offset: pager.Offset,
				limit: pager.Limit,
				total: pager.Total
			},
			collections: (collections || []).map(item => {
				return {
					name: item.name,
					count: item.count,
					size: item.size,
					indexCount: item.index_count,
					indexSize: item.index_size
				}
			})
		}
	}

	/**
	 * wechat miniprogram cloud database add
	 * 微信小程序云开发数据库插入记录
	 */
	public async add (option: {
		query: string
	}): Promise<Error | {
		idList: string[]
	}> {
		const { query } = option
		const res = await this._request<IWxCloudDbAddResult>({
			...this.requestOptions.databaseAdd,
			data: {
				env: this._env,
				query
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		return {
			idList: res.id_list
		}
	}

	/**
	 * wechat miniprogram cloud database delete
	 * 微信小程序云开发数据库删除记录
	 */
	public async delete (option: {
		query: string
	}): Promise<Error | {
		deleted: number
	}> {
		const { query } = option
		const res = await this._request<IWxCloudDbDeleteResult>({
			...this.requestOptions.databaseDelete,
			data: {
				env: this._env,
				query
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		return {
			deleted: res.deleted
		}
	}

	/**
	 * wechat miniprogram cloud database update
	 * 微信小程序云开发数据库更新记录
	 */
	public async update (option: {
		query: string
	}): Promise<Error | {
		matched: number,
		modified: number,
		id?: string
	}> {
		const { query } = option
		const res = await this._request<IWxCloudDbUpdateResult>({
			...this.requestOptions.databaseUpdate,
			data: {
				env: this._env,
				query
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { errmsg = 'unknown error', matched, modified, id } = res || {}
		if (matched !== undefined || modified !== undefined) {
			return {
				matched,
				modified,
				id
			}
		} else {
			return new Error(errmsg)
		}
	}

	/**
	 * wechat miniprogram cloud database query
	 * 微信小程序云开发数据库查询记录
	 */
	public async query <T> (option: {
		query: string
	}): Promise<Error | {
		pager: {
			total: number,
			offset: number,
			limit: number
		},
		data: (T & {})[]
	}> {
		const { query } = option
		const res = await this._request<IWxCloudDbQueryResult>({
			...this.requestOptions.databaseQuery,
			data: {
				env: this._env,
				query
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { errmsg = 'unknown error', pager, data } = res || {}
		if (pager && data) {
			return {
				pager: {
					total: pager.Total,
					offset: pager.Offset,
					limit: pager.Limit
				},
				data: data.map(item => JSON.parse(item) as T & {})
			}
		} else {
			return new Error(errmsg)
		}
	}

	/**
	 * wechat miniprogram cloud database aggregate
	 * 微信小程序云开发数据库聚合
	 */
	public async aggregate <T> (option: {
		query: string
	}): Promise<Error | {
		data?: (T & {})[]
	}> {
		const { query } = option
		const res = await this._request<IWxCloudDbAggregateResult>({
			...this.requestOptions.databaseAggregate,
			data: {
				env: this._env,
				query
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { data } = res || {}
		return {
			data: (data || []).map(item => {
				return JSON.parse(item) as T & {}
			})
		}
	}

	/**
	 * wechat miniprogram cloud database count
	 * 微信小程序云开发统数据库计集合记录数或统计查询语句对应的结果记录数
	 */
	public async count (option: {
		query: string
	}): Promise<Error | {
		count: number
	}> {
		const { query } = option
		const res = await this._request<IWxCloudDbCountResult>({
			...this.requestOptions.databaseAggregate,
			data: {
				env: this._env,
				query
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { count } = res || {}
		return {
			count
		}
	}
}
