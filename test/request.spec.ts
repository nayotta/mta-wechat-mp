import { MockServer } from 'jest-mock-server'
import { MtaWechatMpAuth } from '../src/auth'
import { MtaWechatMpRequest } from '../src/request'

class MtaTestRequest extends MtaWechatMpRequest {
	public grantType: string = this._grantType
	public appid: string = this._appid
	public secret: string = this._secret
	public request = this._request
}

describe('Testing Request module', () => {
	const server = new MockServer()

	beforeAll(() => server.start())
	afterAll(() => server.stop())
	beforeEach(() => server.reset())

	it('basic', () => {
		const grantType = 'client_credential'
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestRequest = new MtaTestRequest({
			grantType,
			appid,
			secret,
			auth: new MtaWechatMpAuth({
				grantType,
				appid,
				secret
			})
		})
		expect(mtaTestRequest.grantType).toBe(grantType)
		expect(mtaTestRequest.appid).toBe(appid)
		expect(mtaTestRequest.secret).toBe(secret)
	})

	it('merge request options', async () => {
		const grantType = 'client_credential'
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestRequest = new MtaTestRequest({
			grantType,
			appid,
			secret,
			auth: new MtaWechatMpAuth({
				grantType,
				appid,
				secret
			})
		})
		mtaTestRequest.mergeRequestOptions({
			test: {
				url: '/test',
				method: 'get',
				tokenInQuery: true
			}
		})
		expect(mtaTestRequest.requestOptions.test.url).toBe('/test')
		expect(mtaTestRequest.requestOptions.test.method).toBe('get')
		expect(mtaTestRequest.requestOptions.test.tokenInQuery).toBe(true)
	})

	it('request success', async () => {
		const route = server.get('/test').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				test: 'success'
			}
		})
		const url = server.getURL()
		const grantType = 'client_credential'
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestRequest = new MtaTestRequest({
			grantType,
			appid,
			secret,
			auth: new MtaWechatMpAuth({
				grantType,
				appid,
				secret,
				proxy: {
					proxyUrl: url.origin
				},
				accessToken: 'access_token'
			})
		})
		const res = await mtaTestRequest.request<{
			test: string
		}>({
			url: '/test',
			method: 'get'
		}).catch((err: Error) => err)
		if (res instanceof Error) {
			throw res
		}
		expect(res.test).toBe('success')
		expect(route).toHaveBeenCalledTimes(1)
	})

	it('request fail with status code 500', async () => {
		const route = server.get('/test').mockImplementationOnce((ctx) => {
			ctx.status = 500
		})
		const url = server.getURL()
		const grantType = 'client_credential'
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestRequest = new MtaTestRequest({
			grantType,
			appid,
			secret,
			auth: new MtaWechatMpAuth({
				grantType,
				appid,
				secret,
				proxy: {
					proxyUrl: url.origin
				},
				accessToken: 'access_token'
			})
		})
		const res = await mtaTestRequest.request<{
			test: string
		}>({
			url: '/test',
			method: 'get'
		}).catch((err: Error) => err)
		expect(res).toBeInstanceOf(Error)
		expect(route).toHaveBeenCalledTimes(1)
	})

	it('request fail with errcode', async () => {
		const route = server.post('/test').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				errcode: 40001,
				errmsg: 'unauthrization'
			}
		})
		const url = server.getURL()
		const grantType = 'client_credential'
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestRequest = new MtaTestRequest({
			grantType,
			appid,
			secret,
			auth: new MtaWechatMpAuth({
				grantType,
				appid,
				secret,
				proxy: {
					proxyUrl: url.origin
				},
				accessToken: 'access_token'
			})
		})
		const res = await mtaTestRequest.request<{
			test: string
		}>({
			url: '/test',
			method: 'post'
		}).catch((err: Error) => err)
		if (res instanceof Error) {
			throw res
		}
		expect(res.errcode).toBe(40001)
		expect(res.errmsg).toBe('unauthrization')
		expect(route).toHaveBeenCalledTimes(1)
	})

	it('request success with unauth retry', async () => {
		let count = 0
		const testRoute = server.post('/test').mockImplementation((ctx) => {
			ctx.status = 200
			ctx.body = count <= 0
				? {
					errcode: 40001,
					errmsg: 'unauthrization'
				}
				: {
					test: 'success'
				}
			count++
		})
		const authRoute = server.get('/auth').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				access_token: 'test_access_token'
			}
		})
		const url = server.getURL()
		const grantType = 'client_credential'
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestRequest = new MtaTestRequest({
			grantType,
			appid,
			secret,
			auth: new MtaWechatMpAuth({
				grantType,
				appid,
				secret,
				accessToken: 'test_auth_token',
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
		})
		const res = await mtaTestRequest.request<{
			test: string
		}>({
			url: '/test',
			method: 'post'
		}, true).catch((err: Error) => err)
		if (res instanceof Error) {
			throw res
		}
		expect(res.test).toBe('success')
		expect(testRoute).toHaveBeenCalledTimes(2)
		expect(authRoute).toHaveBeenCalledTimes(1)
	})

	it('request fail with unauth retry', async () => {
		const testRoute = server.post('/test').mockImplementation((ctx) => {
			ctx.status = 200
			ctx.body = {
				errcode: 40001,
				errmsg: 'unauthrization'
			}
		})
		const authRoute = server.get('/auth').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				access_token: 'test_access_token'
			}
		})
		const url = server.getURL()
		const grantType = 'client_credential'
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestRequest = new MtaTestRequest({
			grantType,
			appid,
			secret,
			auth: new MtaWechatMpAuth({
				grantType,
				appid,
				secret,
				accessToken: 'test_auth_token',
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
		})
		const res = await mtaTestRequest.request<{
			test: string
		}>({
			url: '/test',
			method: 'post'
		}, true).catch((err: Error) => err)
		if (res instanceof Error) {
			throw res
		}
		expect(res.errcode).toBe(40001)
		expect(res.errmsg).toBe('unauthrization')
		expect(testRoute).toHaveBeenCalledTimes(2)
		expect(authRoute).toHaveBeenCalledTimes(1)
	})
})
