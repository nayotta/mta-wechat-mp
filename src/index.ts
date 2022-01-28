import { MtaWechatMpAnalysis } from './analysis'
import { MtaWechatMpAuth } from './auth'
import { MtaWechatMpCloud } from './cloud'
import { MtaWechatMpTokener } from './tokener'
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

	readonly tokener: MtaWechatMpTokener

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

		// tokener
		this.tokener = new MtaWechatMpTokener({
			appid: option.appid,
			secret: option.secret,
			proxy: option.proxy
		})

		// auth
		this.auth = new MtaWechatMpAuth({
			...option,
			tokener: this.tokener
		})

		// analysis instance
		this.analysis = new MtaWechatMpAnalysis({
			...option,
			tokener: this.tokener
		})

		// cloud instances
		for (const cloudName in option.cloudEnvs) {
			this.clouds[cloudName] = new MtaWechatMpCloud({
				appid: option.appid,
				secret: option.secret,
				env: option.cloudEnvs[cloudName],
				tokener: this.tokener
			})
		}
	}
}
