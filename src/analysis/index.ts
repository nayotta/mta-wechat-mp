import {
	IWxGetPerformanceDataResult,
	IWxGetRetainResult,
	IWxGetSummaryResult,
	IWxGetUserProtraitResult,
	IWxGetVisitDistributionResult,
	IWxGetVisitPageResult,
	IWxGetVisitTrendResult
} from './interface'
import {
	TAnalysisGetPerformanceDataDevice,
	TAnalysisGetPerformanceDataDeviceLevel,
	TAnalysisGetPerformanceDataModule,
	TAnalysisGetPerformanceDataNetworktype,
	TAnalysisGetRetainType,
	TAnalysisGetSummaryType,
	TAnalysisGetVisitTrendType
} from './type'
import { IMtaWechatMpRequestOption } from '../request/interface'
import { MtaWechatMpRequest } from '../request'
import { dayjs } from '../util'
import { requestOptions } from './const'

export class MtaWechatMpAnalysis extends MtaWechatMpRequest {
	readonly tz: string

	constructor (option: IMtaWechatMpRequestOption & { tz?: string }) {
		super({
			...option,
			requestOptions: option.requestOptions || requestOptions
		})
		this.tz = option.tz || dayjs.tz.guess()
	}

	/**
	 * wechat miniprogram analysis query retain info
	 * 获取用户访问小程序留存
	 */
	public async getRetain (option: {
		type: TAnalysisGetRetainType,
		begin: string | number | Date,
		end: string | number | Date
	}) {
		const { type, begin, end } = option
		const url = {
			daily: this.requestOptions.getDailyRetain.url,
			monthly: this.requestOptions.getMonthlyRetain.url,
			weekly: this.requestOptions.getWeeklyRetain.url
		}[type]
		const res = await this._request<IWxGetRetainResult>({
			url,
			method: 'post',
			tokenInQuery: true,
			data: {
				begin_date: dayjs(begin).tz(this.tz).format('YYYYMMDD'),
				end_date: dayjs(end).tz(this.tz).format('YYYYMMDD')
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { ref_date: refDate, visit_uv: visitUv, visit_uv_new: visitUvNew } = res || {}
		return {
			refDate,
			visitUv,
			visitUvNew
		}
	}

	/**
	 * wechat miniprogram analysis get summary info
	 * 用户访问小程序数据概况
	 */
	public async getSummary (option: {
		type: TAnalysisGetSummaryType,
		begin: string | number | Date,
		end: string | number | Date
	}) {
		const { type, begin, end } = option
		const url = {
			daily: this.requestOptions.getDailySummary.url
		}[type]
		const res = await this._request<IWxGetSummaryResult>({
			url,
			method: 'post',
			tokenInQuery: true,
			data: {
				begin_date: dayjs(begin).tz(this.tz).format('YYYYMMDD'),
				end_date: dayjs(end).tz(this.tz).format('YYYYMMDD')
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { list } = res || {}
		return {
			list: (list || []).map((item) => {
				return {
					refDate: item.ref_date,
					visitTotal: item.visit_total,
					sharePv: item.share_pv,
					shareUv: item.share_uv
				}
			})
		}
	}

	/**
	 * wechat miniprogram analysis query visit trend info
	 * 获取用户访问小程序数据趋势
	 */
	public async getVisitTrend (option: {
		type: TAnalysisGetVisitTrendType,
		begin: string | number | Date,
		end: string | number | Date
	}) {
		const { type, begin, end } = option
		const url = {
			daily: this.requestOptions.getDailyVisitTrend.url,
			monthly: this.requestOptions.getMonthlyVisitTrend.url,
			weekly: this.requestOptions.getWeeklyVisitTrend.url
		}[type]
		const res = await this._request<IWxGetVisitTrendResult>({
			url,
			method: 'post',
			tokenInQuery: true,
			data: {
				begin_date: dayjs(begin).tz(this.tz).format('YYYYMMDD'),
				end_date: dayjs(end).tz(this.tz).format('YYYYMMDD')
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { list } = res || {}
		return {
			list: (list || []).map((item) => {
				return {
					refDate: item.ref_date,
					sessionCnt: item.session_cnt,
					visitPv: item.visit_pv,
					visitUv: item.visit_uv,
					visitUvNew: item.visit_uv_new,
					stayTimeUv: item.stay_time_uv,
					stayTimeSession: item.stay_time_session,
					visitDepth: item.visit_depth
				}
			})
		}
	}

	/**
	 * wechat miniprogram analysis query performance data
	 * 获取小程序启动性能，运行性能等数据
	 */
	public async getPerformanceData (option: {
		begin: string | number | Date,
		end: string | number | Date,
		module: TAnalysisGetPerformanceDataModule,
		params: {
			networktype?: (TAnalysisGetPerformanceDataNetworktype)[],
			device?: (TAnalysisGetPerformanceDataDevice)[],
			deviceLevel?: (TAnalysisGetPerformanceDataDeviceLevel)[]
		}
	}) {
		const { begin, end, module, params } = option

		// params transform
		const paramsKeys = Object.keys(params)
		if (!paramsKeys.every(item => ['networktype', 'device', 'deviceLevel'].includes(item))) {
			return new Error('query params\'s value must be one of networktype/deviceLevel/device')
		} else if (paramsKeys.length === 0) {
			return new Error('query params\'s value empty')
		}
		const paramsArr: {
			field: string,
			value: string
		}[] = []
		if (params.networktype) {
			paramsArr.push({
				field: 'networktype',
				value: (params.networktype || []).map(item => {
					return {
						all: '-1',
						'3g': '3g',
						'4g': '4g',
						wifi: 'wifi'
					}[item]
				}).join(',')
			})
		}
		if (params.device) {
			paramsArr.push({
				field: 'device',
				value: (params.device || []).map(item => {
					return {
						all: '-1',
						ios: '1',
						android: '2'
					}[item]
				}).join(',')
			})
		}
		if (params.deviceLevel) {
			paramsArr.push({
				field: 'device_level',
				value: (params.deviceLevel || []).map(item => {
					return {
						all: '-1',
						highEnd: '1',
						midEnd: '2',
						lowEnd: '3'
					}[item]
				}).join(',')
			})
		}

		// module transform
		const moduleCode = {
			openRate: 10016,
			timeInEachStage: 10017,
			timePageSwitching: 10021,
			memoryIndicator: 10022,
			memoryException: 10023
		}[module]

		const res = await this._request<IWxGetPerformanceDataResult>({
			...this.requestOptions.getPerformanceData,
			data: {
				time: {
					begin_timestamp: Math.round(new Date(begin).getTime() / 1000),
					end_timestamp: Math.round(new Date(end).getTime() / 1000)
				},
				module: moduleCode,
				params: paramsArr
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { body } = res.data
		const { tables, count } = body
		return {
			tables,
			count
		}
	}

	/**
	 * wechat miniprogram analysis query user portrait
	 * 获取小程序新增或活跃用户的画像分布数据
	 */
	public async getUserPortrait (option: {
		begin: string | number | Date,
		end: string | number | Date
	}) {
		const { begin, end } = option
		const res = await this._request<IWxGetUserProtraitResult>({
			...this.requestOptions.getUserPortrait,
			data: {
				begin_date: dayjs(begin).tz(this.tz).format('YYYYMMDD'),
				end_date: dayjs(end).tz(this.tz).format('YYYYMMDD')
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { ref_date: refDate, visit_uv: visitUv, visit_uv_new: visitUvNew } = res
		return {
			refDate,
			visitUv,
			visitUvNew
		}
	}

	/**
	 * wechat miniprogram analysis query visit distribution info
	 * 获取用户小程序访问分布数据
	 */
	public async getVisitDistribution (option: {
		begin: string | number | Date,
		end: string | number | Date
	}) {
		const { begin, end } = option
		const res = await this._request<IWxGetVisitDistributionResult>({
			...this.requestOptions.getVisitDistribution,
			data: {
				begin_date: dayjs(begin).tz(this.tz).format('YYYYMMDD'),
				end_date: dayjs(end).tz(this.tz).format('YYYYMMDD')
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { ref_date: refDate, list } = res || {}
		return {
			refDate,
			list: (list || []).map(item => {
				return {
					index: item.index,
					itemList: item.item_list
				}
			})
		}
	}

	/**
	 * wechat miniprogram analysis query visit page info
	 * 获取用户小程序访问分布数据
	 */
	public async getVisitPage (option: {
		begin: string | number | Date,
		end: string | number | Date
	}) {
		const { begin, end } = option
		const res = await this._request<IWxGetVisitPageResult>({
			...this.requestOptions.getVisitPage,
			data: {
				begin_date: dayjs(begin).tz(this.tz).format('YYYYMMDD'),
				end_date: dayjs(end).tz(this.tz).format('YYYYMMDD')
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { ref_date: refDate, list } = res || {}
		return {
			refDate,
			list: (list || []).map(item => {
				return {
					pagePath: item.page_path,
					pageVisitPv: item.page_visit_pv,
					pageVisitUv: item.page_visit_uv,
					pageStaytimePv: item.page_staytime_pv,
					entrypagePv: item.entrypage_pv,
					exitpagePv: item.exitpage_pv,
					pageSharePv: item.page_share_pv,
					pageShareUv: item.page_share_uv
				}
			})
		}
	}
}
