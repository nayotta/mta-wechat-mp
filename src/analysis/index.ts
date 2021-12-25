import * as dayjs from 'dayjs'
import {
	IWxGetPerformanceDataResult,
	IWxGetRetainResult,
	IWxGetSummaryResult,
	IWxGetUserProtraitResult,
	IWxGetVisitDistributionResult,
	IWxGetVisitPageResult,
	IWxGetVisitTrendResult
} from './interface'
import { IMtaWechatMpRequestOption } from '../request/interface'
import { MtaWechatMpRequest } from '../request'
import { requestOptions } from './const'

export class MtaWechatMpAnalysis extends MtaWechatMpRequest {
	constructor (option: IMtaWechatMpRequestOption) {
		super({
			...option,
			requestOptions: option.requestOptions || requestOptions
		})
	}

	/**
	 * wechat miniprogram analysis query retain info
	 * 获取用户访问小程序留存
	 */
	public async getRetain (option: {
		type: 'daily' | 'monthly' | 'weekly',
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
				begin_date: dayjs(begin).format('YYYYMMDD'),
				end_date: dayjs(end).format('YYYYMMDD')
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
		type: 'daily',
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
				begin_date: dayjs(begin).format('YYYYMMDD'),
				end_date: dayjs(end).format('YYYYMMDD')
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
		type: 'daily' | 'monthly' | 'weekly',
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
				begin_date: dayjs(begin).format('YYYYMMDD'),
				end_date: dayjs(end).format('YYYYMMDD')
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
		module: 'open_rate' | 'time_in_each_stage' | 'time_page_switching' | 'memory_indicator' | 'memory_exception',
		params: {
			networktype?: ('all' | '3g' | '4g' | 'wifi')[],
			deviceLevel?: ('all' | 'high_end' | 'mid_end' | 'low_end')[],
			device?: ('all' | 'ios' | 'android')[]
		}
	}) {
		const { begin, end, module, params } = option

		// params transform
		const paramsKeys = Object.keys(params)
		let paramsField = ''
		let paramsValue = ''
		if (paramsKeys.length > 1) {
			return new Error('query params\'s value must be one of networktype/deviceLevel/device')
		} else if (paramsKeys.length === 0) {
			return new Error('query params\'s value empty')
		} else {
			paramsField = paramsKeys[0]
		}
		switch (paramsField) {
			case 'networktype':
				paramsValue = (params.networktype || []).map(item => {
					return {
						all: '-1',
						'3g': '3g',
						'4g': '4g',
						wifi: 'wifi'
					}[item]
				}).join(',')
				break
			case 'deviceLevel':
				// update params field value
				paramsField = 'device_level'
				paramsValue = (params.deviceLevel || []).map(item => {
					return {
						all: '-1',
						high_end: '1',
						mid_end: '2',
						low_end: '3'
					}[item]
				}).join(',')
				break
			case 'device':
				paramsValue = (params.device || []).map(item => {
					return {
						all: '-1',
						ios: '1',
						android: '2'
					}[item]
				}).join(',')
				break
			default:
				return new Error('query params\'s value must be one of networktype/deviceLevel/device')
		}

		// module transform
		const moduleCode = {
			open_rate: 10016,
			time_in_each_stage: 10017,
			time_page_switching: 10021,
			memory_indicator: 10022,
			memory_exception: 10023
		}[module]

		const res = await this._request<IWxGetPerformanceDataResult>({
			...this.requestOptions.getPerformanceData,
			data: {
				time: {
					begin_timestamp: dayjs(begin).format('YYYY-MM-DD HH:mm:ss'),
					end_timestamp: dayjs(end).format('YYYY-MM-DD HH:mm:ss')
				},
				module: moduleCode,
				params: {
					field: paramsField,
					value: paramsValue
				}
			}
		}, true).catch((err: Error) => err)
		if (res instanceof Error) return res
		const { tables, count } = res
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
				begin_date: dayjs(begin).format('YYYYMMDD'),
				end_date: dayjs(end).format('YYYYMMDD')
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
				begin_date: dayjs(begin).format('YYYYMMDD'),
				end_date: dayjs(end).format('YYYYMMDD')
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
				begin_date: dayjs(begin).format('YYYYMMDD'),
				end_date: dayjs(end).format('YYYYMMDD')
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
