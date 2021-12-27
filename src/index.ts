import { MtaWechatMpAnalysis } from './analysis'
import { MtaWechatMpAuth } from './auth'
import { MtaWechatMpCloud } from './cloud'

// export types
export * from './analysis/type'
export * from './cloud/database/type'

export class MtaWechatMp {
	public grantType: string
	public appid: string

	public proxy: {
		proxyUrl?: string
	} = {}

	public auth: MtaWechatMpAuth

	public clouds: {
		[name: string]: MtaWechatMpCloud
	} = {}

	public analysis: MtaWechatMpAnalysis

	constructor (option: {
		grantType: 'client_credential',
		appid: string,
		secret: string,
		cloudEnvs: {
			[name: string]: string
		},
		accessToken?: string,
		proxy?: {
			proxyUrl?: string
		}
	}) {
		this.grantType = option.grantType
		this.appid = option.appid
		this.proxy = option.proxy || {}

		// auth
		this.auth = new MtaWechatMpAuth({
			grantType: option.grantType,
			appid: option.appid,
			secret: option.secret,
			proxy: option.proxy
		})

		// cloud instances
		for (const cloudName in option.cloudEnvs) {
			this.clouds[cloudName] = new MtaWechatMpCloud({
				grantType: option.grantType,
				appid: option.appid,
				secret: option.secret,
				env: option.cloudEnvs[cloudName],
				auth: this.auth
			})
		}

		// analysis instance
		this.analysis = new MtaWechatMpAnalysis({
			...option,
			auth: this.auth
		})
	}
}
