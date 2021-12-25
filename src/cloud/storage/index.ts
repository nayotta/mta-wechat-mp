import {
	IWxBatchDeleteFileResult,
	IWxBatchDownloadFileResult,
	IWxUploadFileResult
} from './interface'
import { IMtaWechatMpRequestOption } from '../../request/interface'
import { MtaWechatMpRequest } from '../../request'
import { requestOptions } from './const'

export class MtaWechatMpCloudStorage extends MtaWechatMpRequest {
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
	 * wechat miniprogram cloud storage get upload file url
	 * 微信小程序云开发存储获取文件上传链接
	 */
	public async uploadFile (path: string) {
		const res = await this._request<IWxUploadFileResult>({
			...this.requestOptions.uploadFile,
			data: {
				env: this._env,
				path
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { url, token, authorization, file_id: fileid, cos_file_id: cosFileid } = res
		return {
			url,
			token,
			authorization,
			fileid,
			cosFileid
		}
	}

	/**
	 * wechat miniprogram cloud storage batch download files
	 * 微信小程序云开发存储获取文件下载链接
	 */
	public async batchDownloadFile (fileList: {
		fileid: string,
		maxAge: number
	}[]) {
		const res = await this._request<IWxBatchDownloadFileResult>({
			...this.requestOptions.batchDownloadFile,
			data: {
				env: this._env,
				file_list: fileList.map(item => {
					return {
						fileid: item.fileid,
						max_age: item.maxAge
					}
				})
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { file_list: files } = res || {}
		return {
			fileList: (files || []).map(item => {
				return {
					fileid: item.fileid,
					downloadUrl: item.download_url,
					status: item.status,
					errmsg: item.errmsg
				}
			})
		}
	}

	/**
	 * wechat miniprogram cloud storage batch delete files
	 * 微信小程序云开发存储批量删除文件
	 */
	public async batchDeleteFile (fileidList: string[]) {
		const res = await this._request<IWxBatchDeleteFileResult>({
			...this.requestOptions.batchDeleteFile,
			data: {
				env: this._env,
				fileid_list: fileidList
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { delete_list: deleteList } = res || {}
		return {
			deleteList
		}
	}
}
