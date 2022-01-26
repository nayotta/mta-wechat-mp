import { MtaWechatMpAnalysis } from './analysis'
import { MtaWechatMpAuth } from './auth'
import { MtaWechatMpCloud } from './cloud'
import { dayjs } from './util'

// export types
export * from './analysis/type'
export * from './cloud/database/type'

export class MtaWechatMp {
	readonly appid: string
	readonly tz: string = dayjs.tz.guess()

	readonly proxy: {
		proxyUrl?: string
	} = {}

	readonly auth: MtaWechatMpAuth

	readonly clouds: {
		[name: string]: MtaWechatMpCloud
	} = {}

	readonly analysis: MtaWechatMpAnalysis

	constructor (option: {
		appid: string,
		secret: string,
		cloudEnvs: {
			[name: string]: string
		},
		accessToken?: string,
		proxy?: {
			proxyUrl?: string
		},
		tz?: string
	}) {
		this.appid = option.appid
		this.proxy = option.proxy || {}
		this.tz = option.tz || dayjs.tz.guess()

		// auth
		this.auth = new MtaWechatMpAuth({
			appid: option.appid,
			secret: option.secret,
			proxy: option.proxy
		})

		// cloud instances
		for (const cloudName in option.cloudEnvs) {
			this.clouds[cloudName] = new MtaWechatMpCloud({
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
