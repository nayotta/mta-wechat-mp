import { Method } from 'axios'

export const requestOptions: {
	[key: string]: {
		url: string,
		method: Method,
		tokenInQuery?: boolean
	}
} = {
	getDailyRetain: {
		url: '/datacube/getweanalysisappiddailyretaininfo',
		method: 'post',
		tokenInQuery: true
	},
	getMonthlyRetain: {
		url: '/datacube/getweanalysisappidmonthlyretaininfo',
		method: 'post',
		tokenInQuery: true
	},
	getWeeklyRetain: {
		url: '/datacube/getweanalysisappidweeklyretaininfo',
		method: 'post',
		tokenInQuery: true
	},
	getDailySummary: {
		url: '/datacube/getweanalysisappiddailysummarytrend',
		method: 'post',
		tokenInQuery: true
	},
	getDailyVisitTrend: {
		url: '/datacube/getweanalysisappiddailyvisittrend',
		method: 'post',
		tokenInQuery: true
	},
	getMonthlyVisitTrend: {
		url: '/datacube/getweanalysisappidmonthlyvisittrend',
		method: 'post',
		tokenInQuery: true
	},
	getWeeklyVisitTrend: {
		url: '/datacube/getweanalysisappidweeklyvisittrend',
		method: 'post',
		tokenInQuery: true
	},
	getPerformanceData: {
		url: '/wxa/business/performance/boot',
		method: 'post',
		tokenInQuery: true
	},
	getUserPortrait: {
		url: '/datacube/getweanalysisappiduserportrait',
		method: 'post',
		tokenInQuery: true
	},
	getVisitDistribution: {
		url: '/datacube/getweanalysisappidvisitdistribution',
		method: 'post',
		tokenInQuery: true
	},
	getVisitPage: {
		url: '/datacube/getweanalysisappidvisitpage',
		method: 'post',
		tokenInQuery: true
	}
}
