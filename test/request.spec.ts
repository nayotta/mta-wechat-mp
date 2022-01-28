import { MockServer } from 'jest-mock-server'
import { MtaWechatMpRequest } from '../src/request'
import { MtaWechatMpTokener } from '../src/tokener'

class MtaTestRequest extends MtaWechatMpRequest {
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
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestRequest = new MtaTestRequest({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
				appid,
				secret
			})
		})
		expect(mtaTestRequest.appid).toBe(appid)
		expect(mtaTestRequest.secret).toBe(secret)
	})

	it('merge request options', async () => {
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestRequest = new MtaTestRequest({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
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
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestRequest = new MtaTestRequest({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
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
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestRequest = new MtaTestRequest({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
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
				errmsg: 'untokenerrization'
			}
		})
		const url = server.getURL()
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestRequest = new MtaTestRequest({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
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
		expect(res.errmsg).toBe('untokenerrization')
		expect(route).toHaveBeenCalledTimes(1)
	})

	it('request success with untokener retry', async () => {
		let count = 0
		const testRoute = server.post('/test').mockImplementation((ctx) => {
			ctx.status = 200
			ctx.body = count <= 0
				? {
					errcode: 40001,
					errmsg: 'untokenerrization'
				}
				: {
					test: 'success'
				}
			count++
		})
		const tokenerRoute = server.get('/tokener').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				access_token: 'test_access_token'
			}
		})
		const url = server.getURL()
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestRequest = new MtaTestRequest({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
				appid,
				secret,
				accessToken: 'test_tokener_token',
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
		expect(tokenerRoute).toHaveBeenCalledTimes(1)
	})

	it('request fail with untokener retry', async () => {
		const testRoute = server.post('/test').mockImplementation((ctx) => {
			ctx.status = 200
			ctx.body = {
				errcode: 40001,
				errmsg: 'untokenerrization'
			}
		})
		const tokenerRoute = server.get('/tokener').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				access_token: 'test_access_token'
			}
		})
		const url = server.getURL()
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestRequest = new MtaTestRequest({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
				appid,
				secret,
				accessToken: 'test_tokener_token',
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
		expect(res.errmsg).toBe('untokenerrization')
		expect(testRoute).toHaveBeenCalledTimes(2)
		expect(tokenerRoute).toHaveBeenCalledTimes(1)
	})
})
