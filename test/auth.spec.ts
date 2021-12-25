import { MockServer } from 'jest-mock-server'
import { MtaWechatMpAuth } from '../src/auth'

class MtaTestAuth extends MtaWechatMpAuth {
	public grantType: string = this._grantType
	public appid: string = this._appid
	public secret: string = this._secret
}

describe('Testing Auth module', () => {
	const server = new MockServer()

	beforeAll(() => server.start())
	afterAll(() => server.stop())
	beforeEach(() => server.reset())

	it('basic', () => {
		const mtaTestAuth = new MtaTestAuth({
			grantType: 'client_credential',
			appid: 'appid',
			secret: 'secret',
			accessToken: 'test_access_token',
			proxy: {
				proxyUrl: 'http://localhost:2333/wechat'
			},
			requestOptions: {
				test: {
					url: '/test',
					method: 'get'
				}
			}
		})
		expect(mtaTestAuth.grantType).toBe('client_credential')
		expect(mtaTestAuth.appid).toBe('appid')
		expect(mtaTestAuth.secret).toBe('secret')
		expect(mtaTestAuth.accessToken).toBe('test_access_token')
		expect(mtaTestAuth.requestOptions).toBeInstanceOf(Object)
		expect(mtaTestAuth.requestOptions.test).toBeInstanceOf(Object)
		expect(mtaTestAuth.requestOptions.test.url).toBe('/test')
		expect(mtaTestAuth.requestOptions.test.method).toBe('get')
	})

	it('getAccessToken success', async () => {
		const route = server.get('/auth').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				access_token: 'test_access_token',
				expires_in: 7200
			}
		})
		const url = server.getURL()
		const mtaTestAuth = new MtaTestAuth({
			grantType: 'client_credential',
			appid: 'appid',
			secret: 'secret',
			proxy: {
				proxyUrl: url.origin
			},
			requestOptions: {
				getAccessToken: {
					url: '/auth',
					method: 'get'
				}
			}
		})
		expect(mtaTestAuth.accessToken).toBe('')
		const res = await mtaTestAuth.getAccessToken().catch((err: Error) => err)
		if (res instanceof Error) {
			throw res
		}
		expect(mtaTestAuth.accessToken).toBe('test_access_token')
		expect(res.accessToken).toBe('test_access_token')
		expect(res.expiresIn).toBe(7200)
		expect(route).toHaveBeenCalledTimes(1)
	})

	it('getAccessToken fail with status code 500', async () => {
		const route = server.get('/auth').mockImplementationOnce((ctx) => {
			ctx.status = 500
			ctx.body = {
				access_token: 'test_access_token'
			}
		})
		const url = server.getURL()
		const mtaTestAuth = new MtaTestAuth({
			grantType: 'client_credential',
			appid: 'appid',
			secret: 'secret',
			proxy: {
				proxyUrl: url.origin
			},
			requestOptions: {
				getAccessToken: {
					url: '/auth',
					method: 'get'
				}
			}
		})
		expect(mtaTestAuth.accessToken).toBe('')
		const res = await mtaTestAuth.getAccessToken().catch((err: Error) => err)
		expect(res).toBeInstanceOf(Error)
		expect(route).toHaveBeenCalledTimes(1)
	})

	it('getAccessToken fail with missing access token', async () => {
		const route = server.get('/auth').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				errcode: -1,
				errmsg: 'test error'
			}
		})
		const url = server.getURL()
		const mtaTestAuth = new MtaTestAuth({
			grantType: 'client_credential',
			appid: 'appid',
			secret: 'secret',
			proxy: {
				proxyUrl: url.origin
			},
			requestOptions: {
				getAccessToken: {
					url: '/auth',
					method: 'get'
				}
			}
		})
		expect(mtaTestAuth.accessToken).toBe('')
		const res = await mtaTestAuth.getAccessToken().catch((err: Error) => err)
		expect(res).toBeInstanceOf(Error)
		expect(route).toHaveBeenCalledTimes(1)
	})
})
