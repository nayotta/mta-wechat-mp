import { Method } from 'axios'
import { MockServer } from 'jest-mock-server'
import { MtaWechatMpAnalysis } from '../src/analysis'
import { MtaWechatMpTokener } from '../src/tokener'
import { dayjs } from '../src/util'

class MtaTestAnalysis extends MtaWechatMpAnalysis {
	public appid: string = this._appid
	public secret: string = this._secret
	public tokener: MtaWechatMpTokener = this._tokener
}

describe('Testing Analysis module', () => {
	const server = new MockServer()

	beforeAll(() => server.start())
	afterAll(() => server.stop())
	beforeEach(() => server.reset())

	it('basic', () => {
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestAnalysis = new MtaTestAnalysis({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
				appid,
				secret,
				accessToken: 'test_access_token'
			})
		})
		expect(mtaTestAnalysis.appid).toBe(appid)
		expect(mtaTestAnalysis.secret).toBe(secret)
		expect(mtaTestAnalysis.tokener.accessToken).toBe('test_access_token')
	})

	it('getRetain success', async () => {
		const now = Date.now()
		const route = server.post('/dailyRetain').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				ref_date: dayjs(now).format('YYYYMMDD'),
				visit_uv_new: {
					key: 0,
					value: 5464
				},
				visit_uv: {
					key: 0,
					value: 55500
				}
			}
		})
		const url = server.getURL()
		const appid = 'appid'
		const secret = 'secret'
		const requestOption: {
			url: string,
			method: Method,
			tokenInQuery?: boolean
		} = {
			url: '/dailyRetain',
			method: 'post',
			tokenInQuery: true
		}
		const mtaTestAnalysis = new MtaTestAnalysis({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
				appid,
				secret,
				accessToken: 'test_access_token',
				proxy: {
					proxyUrl: url.origin
				}
			}),
			requestOptions: {
				getDailyRetain: requestOption,
				getMonthlyRetain: requestOption,
				getWeeklyRetain: requestOption
			}
		})
		const res = await mtaTestAnalysis.getRetain({
			type: 'daily',
			begin: now,
			end: now
		}).catch((err: Error) => err)
		if (res instanceof Error) {
			throw res
		}
		expect(res.refDate).toBe(dayjs(now).format('YYYYMMDD'))
		expect(res.visitUv).toBeInstanceOf(Object)
		expect(typeof res.visitUv.key).toBe('number')
		expect(typeof res.visitUv.value).toBe('number')
		expect(res.visitUvNew).toBeInstanceOf(Object)
		expect(typeof res.visitUvNew.key).toBe('number')
		expect(typeof res.visitUvNew.value).toBe('number')
		expect(route).toHaveBeenCalledTimes(1)
	})

	it('getSummary success', async () => {
		const now = Date.now()
		const route = server.post('/dailySummary').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				list: [{
					ref_date: dayjs(now).format('YYYYMMDD'),
					visit_total: 391,
					share_pv: 572,
					share_uv: 383
				}]
			}
		})
		const url = server.getURL()
		const appid = 'appid'
		const secret = 'secret'
		const requestOption: {
			url: string,
			method: Method,
			tokenInQuery?: boolean
		} = {
			url: '/dailySummary',
			method: 'post',
			tokenInQuery: true
		}
		const mtaTestAnalysis = new MtaTestAnalysis({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
				appid,
				secret,
				accessToken: 'test_access_token',
				proxy: {
					proxyUrl: url.origin
				}
			}),
			requestOptions: {
				getDailySummary: requestOption
			}
		})
		const res = await mtaTestAnalysis.getSummary({
			type: 'daily',
			begin: now,
			end: now
		}).catch((err: Error) => err)
		if (res instanceof Error) {
			throw res
		}
		expect(res.list).toBeInstanceOf(Object)
		expect(Array.isArray(res.list)).toBe(true)
		expect(res.list.length).toBe(1)
		expect(res.list[0].refDate).toBe(dayjs(now).format('YYYYMMDD'))
		expect(res.list[0].visitTotal).toBe(391)
		expect(res.list[0].sharePv).toBe(572)
		expect(res.list[0].shareUv).toBe(383)
		expect(route).toHaveBeenCalledTimes(1)
	})

	it('getVisitTrend success', async () => {
		const now = Date.now()
		const route = server.post('/visitTrend').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				list: [{
					ref_date: dayjs(now).format('YYYYMMDD'),
					session_cnt: 142549,
					visit_pv: 472351,
					visit_uv: 55500,
					visit_uv_new: 5464,
					stay_time_session: 0,
					visit_depth: 1.9838
				}]
			}
		})
		const url = server.getURL()
		const appid = 'appid'
		const secret = 'secret'
		const requestOption: {
			url: string,
			method: Method,
			tokenInQuery?: boolean
		} = {
			url: '/visitTrend',
			method: 'post',
			tokenInQuery: true
		}
		const mtaTestAnalysis = new MtaTestAnalysis({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
				appid,
				secret,
				accessToken: 'test_access_token',
				proxy: {
					proxyUrl: url.origin
				}
			}),
			requestOptions: {
				getDailyVisitTrend: requestOption,
				getMonthlyVisitTrend: requestOption,
				getWeeklyVisitTrend: requestOption
			}
		})
		const res = await mtaTestAnalysis.getVisitTrend({
			type: 'daily',
			begin: now,
			end: now
		}).catch((err: Error) => err)
		if (res instanceof Error) {
			throw res
		}
		expect(res.list).toBeInstanceOf(Object)
		expect(Array.isArray(res.list)).toBe(true)
		expect(res.list.length).toBe(1)
		expect(res.list[0].refDate).toBe(dayjs(now).format('YYYYMMDD'))
		expect(res.list[0].sessionCnt).toBe(142549)
		expect(res.list[0].visitPv).toBe(472351)
		expect(res.list[0].visitUv).toBe(55500)
		expect(res.list[0].visitUvNew).toBe(5464)
		expect(res.list[0].stayTimeSession).toBe(0)
		expect(res.list[0].visitDepth).toBe(1.9838)
		expect(route).toHaveBeenCalledTimes(1)
	})

	it('getPerformanceData success', async () => {
		const now = Date.now()
		let requestBody: any = {}
		const route = server.post('/performanceData').mockImplementationOnce((ctx) => {
			requestBody = ctx.request.body
			ctx.status = 200
			ctx.body = {
				data: {
					body: {
						tables: [{
							id: 'memorydiff',
							lines: [{
								fields: [{
									refdate: dayjs(now).format('YYYYMMDD'),
									value: 70.7778
								}]
							}],
							zh: '内存增长均值'
						}, {
							id: 'memory',
							lines: [{
								fields: [{
									refdate: dayjs(now).format('YYYYMMDD'),
									value: 314
								}]
							}],
							zh: '内存均值'
						}],
						count: 2
					}
				}
			}
		})
		const url = server.getURL()
		const appid = 'appid'
		const secret = 'secret'
		const requestOption: {
			url: string,
			method: Method,
			tokenInQuery?: boolean
		} = {
			url: '/performanceData',
			method: 'post',
			tokenInQuery: true
		}
		const mtaTestAnalysis = new MtaTestAnalysis({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
				appid,
				secret,
				accessToken: 'test_access_token',
				proxy: {
					proxyUrl: url.origin
				}
			}),
			requestOptions: {
				getPerformanceData: requestOption
			}
		})
		const res = await mtaTestAnalysis.getPerformanceData({
			begin: now,
			end: now,
			module: 'memoryIndicator',
			params: {
				device: ['all', 'ios']
			}
		}).catch((err: Error) => err)
		if (res instanceof Error) {
			throw res
		}
		// request body
		expect(requestBody).toBeInstanceOf(Object)
		expect(requestBody.time).toBeInstanceOf(Object)
		expect(requestBody.time.begin_timestamp).toBe(Math.round(new Date(now).getTime() / 1000))
		expect(requestBody.time.end_timestamp).toBe(Math.round(new Date(now).getTime() / 1000))
		expect(typeof requestBody.module).toBe('number')
		expect(Array.isArray(requestBody.params)).toBe(true)
		expect(requestBody.params[0].field).toBe('device')
		expect(requestBody.params[0].value).toBe('-1,1')

		// response body
		expect(res.tables).toBeInstanceOf(Object)
		expect(Array.isArray(res.tables)).toBe(true)
		expect(res.tables.length).toBe(res.count)
		expect(res.tables[0].lines[0].fields[0].refdate).toBe(dayjs(now).format('YYYYMMDD'))
		expect(res.tables[1].lines[0].fields[0].refdate).toBe(dayjs(now).format('YYYYMMDD'))
		expect(route).toHaveBeenCalledTimes(1)
	})

	it('getPerformanceData params error', async () => {
		const now = Date.now()
		const appid = 'appid'
		const secret = 'secret'
		const mtaTestAnalysis = new MtaTestAnalysis({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
				appid,
				secret,
				accessToken: 'test_access_token'
			})
		})
		const emptyParamsRes = await mtaTestAnalysis.getPerformanceData({
			begin: now,
			end: now,
			module: 'memoryIndicator',
			params: {}
		}).catch((err: Error) => err)
		expect(emptyParamsRes).toBeInstanceOf(Error)
		if (emptyParamsRes instanceof Error) {
			expect(emptyParamsRes.message).toBe('query params\'s value empty')
		} else {
			throw new Error('getPerformanceData result should be error')
		}
	})

	it('getPerformanceData params check', async () => {
		const now = Date.now()
		let requestBody: any = {}
		const route = server.post('/performanceData').mockImplementation((ctx) => {
			requestBody = ctx.request.body
			ctx.status = 200
			ctx.body = {
				data: {
					body: {
						tables: [{
							id: 'memorydiff',
							lines: [{
								fields: [{
									refdate: dayjs(now).format('YYYYMMDD'),
									value: 70.7778
								}]
							}],
							zh: '内存增长均值'
						}, {
							id: 'memory',
							lines: [{
								fields: [{
									refdate: dayjs(now).format('YYYYMMDD'),
									value: 314
								}]
							}],
							zh: '内存均值'
						}],
						count: 2
					}
				}
			}
		})
		const url = server.getURL()
		const appid = 'appid'
		const secret = 'secret'
		const requestOption: {
			url: string,
			method: Method,
			tokenInQuery?: boolean
		} = {
			url: '/performanceData',
			method: 'post',
			tokenInQuery: true
		}
		const mtaTestAnalysis = new MtaTestAnalysis({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
				appid,
				secret,
				accessToken: 'test_access_token',
				proxy: {
					proxyUrl: url.origin
				}
			}),
			requestOptions: {
				getPerformanceData: requestOption
			}
		})
		const deviceParamsRes = await mtaTestAnalysis.getPerformanceData({
			begin: now,
			end: now,
			module: 'memoryIndicator',
			params: {
				device: ['all', 'ios', 'android']
			}
		}).catch((err: Error) => err)
		if (deviceParamsRes instanceof Error) {
			throw deviceParamsRes
		}
		// request body
		expect(Array.isArray(requestBody.params)).toBe(true)
		expect(requestBody.params[0].field).toBe('device')
		expect(requestBody.params[0].value).toBe('-1,1,2')

		const networktypeParamsRes = await mtaTestAnalysis.getPerformanceData({
			begin: now,
			end: now,
			module: 'memoryIndicator',
			params: {
				networktype: ['all', '3g', '4g', 'wifi']
			}
		}).catch((err: Error) => err)
		if (networktypeParamsRes instanceof Error) {
			throw networktypeParamsRes
		}
		// request body
		expect(Array.isArray(requestBody.params)).toBe(true)
		expect(requestBody.params[0].field).toBe('networktype')
		expect(requestBody.params[0].value).toBe('-1,3g,4g,wifi')

		const deviceLevelParamsRes = await mtaTestAnalysis.getPerformanceData({
			begin: now,
			end: now,
			module: 'memoryIndicator',
			params: {
				deviceLevel: ['all', 'highEnd', 'midEnd', 'lowEnd']
			}
		}).catch((err: Error) => err)
		if (deviceLevelParamsRes instanceof Error) {
			throw deviceLevelParamsRes
		}
		// request body
		expect(Array.isArray(requestBody.params)).toBe(true)
		expect(requestBody.params[0].field).toBe('device_level')
		expect(requestBody.params[0].value).toBe('-1,1,2,3')

		expect(route).toHaveBeenCalledTimes(3)
	})

	it('getUserPortrait success', async () => {
		const now = Date.now()
		const route = server.post('/userPortrait').mockImplementationOnce((ctx) => {
			ctx.status = 200
			const uvItem = {
				id: 0,
				name: 'name',
				value: 1
			}
			ctx.body = {
				ref_date: dayjs(now).format('YYYYMMDD'),
				visit_uv_new: {
					province: [uvItem],
					city: [uvItem],
					genders: [uvItem],
					platforms: [uvItem],
					devices: [uvItem],
					ages: [uvItem]
				},
				visit_uv: {
					province: [uvItem],
					city: [uvItem],
					genders: [uvItem],
					platforms: [uvItem],
					devices: [uvItem],
					ages: [uvItem]
				}
			}
		})
		const url = server.getURL()
		const appid = 'appid'
		const secret = 'secret'
		const requestOption: {
			url: string,
			method: Method,
			tokenInQuery?: boolean
		} = {
			url: '/userPortrait',
			method: 'post',
			tokenInQuery: true
		}
		const mtaTestAnalysis = new MtaTestAnalysis({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
				appid,
				secret,
				accessToken: 'test_access_token',
				proxy: {
					proxyUrl: url.origin
				}
			}),
			requestOptions: {
				getUserPortrait: requestOption
			}
		})
		const res = await mtaTestAnalysis.getUserPortrait({
			begin: now,
			end: now
		}).catch((err: Error) => err)
		if (res instanceof Error) {
			throw res
		}
		expect(res.refDate).toBe(dayjs(now).format('YYYYMMDD'))
		expect(res.visitUv).toBeInstanceOf(Object)
		expect(res.visitUvNew).toBeInstanceOf(Object)
		expect(route).toHaveBeenCalledTimes(1)
	})

	it('getVisitDistribution success', async () => {
		const now = Date.now()
		const route = server.post('/visitDistribution').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				ref_date: dayjs(now).format('YYYYMMDD'),
				list: [{
					index: 'access_source_session_cnt',
					item_list: [{
						key: 1,
						value: 1
					}]
				}]
			}
		})
		const url = server.getURL()
		const appid = 'appid'
		const secret = 'secret'
		const requestOption: {
			url: string,
			method: Method,
			tokenInQuery?: boolean
		} = {
			url: '/visitDistribution',
			method: 'post',
			tokenInQuery: true
		}
		const mtaTestAnalysis = new MtaTestAnalysis({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
				appid,
				secret,
				accessToken: 'test_access_token',
				proxy: {
					proxyUrl: url.origin
				}
			}),
			requestOptions: {
				getVisitDistribution: requestOption
			}
		})
		const res = await mtaTestAnalysis.getVisitDistribution({
			begin: now,
			end: now
		}).catch((err: Error) => err)
		if (res instanceof Error) {
			throw res
		}
		expect(res.refDate).toBe(dayjs(now).format('YYYYMMDD'))
		expect(res.list).toBeInstanceOf(Object)
		expect(Array.isArray(res.list)).toBe(true)
		expect(res.list[0].itemList).toBeInstanceOf(Object)
		expect(Array.isArray(res.list[0].itemList)).toBe(true)
		expect(route).toHaveBeenCalledTimes(1)
	})

	it('getVisitPage success', async () => {
		const now = Date.now()
		const route = server.post('/visitPage').mockImplementationOnce((ctx) => {
			ctx.status = 200
			ctx.body = {
				ref_date: dayjs(now).format('YYYYMMDD'),
				list: [{
					page_path: 'pages/index/index',
					page_visit_pv: 1,
					page_visit_uv: 1,
					page_staytime_pv: 3.4,
					entrypage_pv: 1,
					exitpage_pv: 1,
					page_share_pv: 1,
					page_share_uv: 1
				}]
			}
		})
		const url = server.getURL()
		const appid = 'appid'
		const secret = 'secret'
		const requestOption: {
			url: string,
			method: Method,
			tokenInQuery?: boolean
		} = {
			url: '/visitPage',
			method: 'post',
			tokenInQuery: true
		}
		const mtaTestAnalysis = new MtaTestAnalysis({
			appid,
			secret,
			tokener: new MtaWechatMpTokener({
				appid,
				secret,
				accessToken: 'test_access_token',
				proxy: {
					proxyUrl: url.origin
				}
			}),
			requestOptions: {
				getVisitPage: requestOption
			}
		})
		const res = await mtaTestAnalysis.getVisitPage({
			begin: now,
			end: now
		}).catch((err: Error) => err)
		if (res instanceof Error) {
			throw res
		}
		expect(res.refDate).toBe(dayjs(now).format('YYYYMMDD'))
		expect(res.list).toBeInstanceOf(Object)
		expect(typeof res.list[0].pagePath).toBe('string')
		expect(typeof res.list[0].pageVisitPv).toBe('number')
		expect(typeof res.list[0].pageVisitUv).toBe('number')
		expect(typeof res.list[0].pageStaytimePv).toBe('number')
		expect(typeof res.list[0].pageSharePv).toBe('number')
		expect(typeof res.list[0].pageShareUv).toBe('number')
		expect(typeof res.list[0].entrypagePv).toBe('number')
		expect(typeof res.list[0].exitpagePv).toBe('number')
		expect(route).toHaveBeenCalledTimes(1)
	})
})
