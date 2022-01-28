import { MtaWechatMpCloud } from '../src/cloud'
import { MtaWechatMpCloudDatabase } from '../src/cloud/database'
import { MtaWechatMpCloudFunction } from '../src/cloud/function'
import { MtaWechatMpCloudStorage } from '../src/cloud/storage'
import { MtaWechatMpTokener } from '../src/tokener'

describe('Testing MtaWechatMpCloud', () => {
	it('basic', () => {
		const appid = 'appid'
		const secret = 'secret'
		const env = 'test_env_id'
		const mtaWechatMpCloud = new MtaWechatMpCloud({
			appid,
			secret,
			env,
			tokener: new MtaWechatMpTokener({
				appid,
				secret
			})
		})
		expect(mtaWechatMpCloud.env).toBe(env)
		expect(mtaWechatMpCloud.db).toBeInstanceOf(MtaWechatMpCloudDatabase)
		expect(mtaWechatMpCloud.func).toBeInstanceOf(MtaWechatMpCloudFunction)
		expect(mtaWechatMpCloud.storage).toBeInstanceOf(MtaWechatMpCloudStorage)
	})
})
