import { MtaWechatMp } from '../src'
import { MtaWechatMpAnalysis } from '../src/analysis'
import { MtaWechatMpAuth } from '../src/auth'
import { MtaWechatMpCloud } from '../src/cloud'
import { MtaWechatMpTokener } from '../src/tokener'

describe('Testing MtaWechatMp', () => {
	it('basic', () => {
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
			appid,
			secret,
			cloudEnvs,
			accessToken,
			proxy
		})
		expect(mtaWechatMp.appid).toBe(appid)
		expect(mtaWechatMp.clouds.test).toBeInstanceOf(MtaWechatMpCloud)
		expect(mtaWechatMp.auth).toBeInstanceOf(MtaWechatMpAuth)
		expect(mtaWechatMp.analysis).toBeInstanceOf(MtaWechatMpAnalysis)
		expect(mtaWechatMp.tokener).toBeInstanceOf(MtaWechatMpTokener)
	})
})
