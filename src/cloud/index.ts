import { IMtaWechatMpRequestOption } from '../request/interface'
import { MtaWechatMpCloudDatabase } from './database'
import { MtaWechatMpCloudFunction } from './function'
import { MtaWechatMpCloudStorage } from './storage'

export class MtaWechatMpCloud {
	public env: string
	public func: MtaWechatMpCloudFunction
	public db: MtaWechatMpCloudDatabase
	public storage: MtaWechatMpCloudStorage

	constructor (option: IMtaWechatMpRequestOption & {
		env: string
	}) {
		this.env = option.env
		this.func = new MtaWechatMpCloudFunction({
			...option
		})
		this.db = new MtaWechatMpCloudDatabase({
			...option
		})
		this.storage = new MtaWechatMpCloudStorage({
			...option
		})
	}
}
