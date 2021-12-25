import { MtaWechatMp } from '../src'
import { MtaWechatMpAnalysis } from '../src/analysis'
import { MtaWechatMpAuth } from '../src/auth'
import { MtaWechatMpCloud } from '../src/cloud'

describe('Testing MtaWechatMp', () => {
	it('basic', () => {
		const grantType = 'client_credential'
		const appid = 'appid'
		const secret = 'secret'
		const cloudEnvs = {
			test: 'test_env_id'
		}
		const accessToken = 'test_access_token'
		const proxy = {
			proxyUrl: 'http://localhost:2333/test'
		}
		const mtaWechatMp = new MtaWechatMp({
			grantType,
			appid,
			secret,
			cloudEnvs,
			accessToken,
			proxy
		})
		expect(mtaWechatMp.grantType).toBe(grantType)
		expect(mtaWechatMp.appid).toBe(appid)
		expect(mtaWechatMp.clouds.test).toBeInstanceOf(MtaWechatMpCloud)
		expect(mtaWechatMp.auth).toBeInstanceOf(MtaWechatMpAuth)
		expect(mtaWechatMp.analysis).toBeInstanceOf(MtaWechatMpAnalysis)
	})
})
