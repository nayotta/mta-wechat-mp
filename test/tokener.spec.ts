import { MockServer } from 'jest-mock-server'
import { MtaWechatMpTokener } from '../src/tokener'

class MtaTestTokener extends MtaWechatMpTokener {
	public appid: string = this._appid
	public secret: string = this._secret
}

describe('Testing Tokener module', () => {
	const server = new MockServer()

	beforeAll(() => server.start())
	afterAll(() => server.stop())
	beforeEach(() => server.reset())

	it('basic', () => {
		const mtaTestTokener = new MtaTestTokener({
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
		expect(mtaTestTokener.appid).toBe('appid')
		expect(mtaTestTokener.secret).toBe('secret')
		expect(mtaTestTokener.accessToken).toBe('test_access_token')
		expect(mtaTestTokener.requestOptions).toBeInstanceOf(Object)
		expect(mtaTestTokener.requestOptions.test).toBeInstanceOf(Object)
		expect(mtaTestTokener.requestOptions.test.url).toBe('/test')
		expect(mtaTestTokener.requestOptions.test.method).toBe('get')
	})

	it('getAccessToken success', async () => {
		const route = server.get('/tokener').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				access_token: 'test_access_token',
				expires_in: 7200
			}
		})
		const url = server.getURL()
		const mtaTestTokener = new MtaTestTokener({
			appid: 'appid',
			secret: 'secret',
			proxy: {
				proxyUrl: url.origin
			},
			requestOptions: {
				getAccessToken: {
					url: '/tokener',
					method: 'get'
				}
			}
		})
		expect(mtaTestTokener.accessToken).toBe('')
		const res = await mtaTestTokener.getAccessToken().catch((err: Error) => err)
		if (res instanceof Error) {
			throw res
		}
		expect(mtaTestTokener.accessToken).toBe('test_access_token')
		expect(res.accessToken).toBe('test_access_token')
		expect(res.expiresIn).toBe(7200)
		expect(route).toHaveBeenCalledTimes(1)
	})

	it('getAccessToken fail with status code 500', async () => {
		const route = server.get('/tokener').mockImplementationOnce((ctx) => {
			ctx.status = 500
			ctx.body = {
				access_token: 'test_access_token'
			}
		})
		const url = server.getURL()
		const mtaTestTokener = new MtaTestTokener({
			appid: 'appid',
			secret: 'secret',
			proxy: {
				proxyUrl: url.origin
			},
			requestOptions: {
				getAccessToken: {
					url: '/tokener',
					method: 'get'
				}
			}
		})
		expect(mtaTestTokener.accessToken).toBe('')
		const res = await mtaTestTokener.getAccessToken().catch((err: Error) => err)
		expect(res).toBeInstanceOf(Error)
		expect(route).toHaveBeenCalledTimes(1)
	})

	it('getAccessToken fail with missing access token', async () => {
		const route = server.get('/tokener').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				errcode: -1,
				errmsg: 'test error'
			}
		})
		const url = server.getURL()
		const mtaTestTokener = new MtaTestTokener({
			appid: 'appid',
			secret: 'secret',
			proxy: {
				proxyUrl: url.origin
			},
			requestOptions: {
				getAccessToken: {
					url: '/tokener',
					method: 'get'
				}
			}
		})
		expect(mtaTestTokener.accessToken).toBe('')
		const res = await mtaTestTokener.getAccessToken().catch((err: Error) => err)
		expect(res).toBeInstanceOf(Error)
		expect(route).toHaveBeenCalledTimes(1)
	})
})
