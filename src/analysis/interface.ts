export interface IWxGetRetainResult {
	'ref_date': string,
	'visit_uv_new': {
		key: number,
		value: number
	},
	'visit_uv': {
		key: number,
		value: number
	}
}

export interface IWxGetSummaryResult {
	list: {
		'ref_date': string,
		'visit_total': number,
		'share_pv': number,
		'share_uv': number
	}[]
}

export interface IWxGetVisitTrendResult {
	list: {
		'ref_date': string,
		'session_cnt': number,
		'visit_pv': number,
		'visit_uv': number,
		'visit_uv_new': number,
		'stay_time_uv': number,
		'stay_time_session': number,
		'visit_depth': number
	}[]
}

export interface IWxGetPerformanceDataResult {
	data: {
		body: {
			tables: {
				id: string,
				lines: {
					fields: {
						refdate: string,
						value: string
					}[]
				}[],
				zh: string
			}[],
			count: number
		}
	}
}

export interface IWxGetUserProtraitVisitUvItem {
	id: number,
	name: string,
	value: number
}

export interface IWxGetUserProtraitResult {
	'ref_date': string,
	'visit_uv_new': {
		index: number,
		province: IWxGetUserProtraitVisitUvItem,
		city: IWxGetUserProtraitVisitUvItem,
		genders: IWxGetUserProtraitVisitUvItem,
		platforms: IWxGetUserProtraitVisitUvItem,
		devices: IWxGetUserProtraitVisitUvItem,
		ages: IWxGetUserProtraitVisitUvItem
	},
	'visit_uv': {
		index: number,
		province: IWxGetUserProtraitVisitUvItem,
		city: IWxGetUserProtraitVisitUvItem,
		genders: IWxGetUserProtraitVisitUvItem,
		platforms: IWxGetUserProtraitVisitUvItem,
		devices: IWxGetUserProtraitVisitUvItem,
		ages: IWxGetUserProtraitVisitUvItem
	}
}

export interface IWxGetVisitDistributionResult {
	'ref_date': string,
	list: {
		index: 'access_source_session_cnt' | 'access_source_visit_uv' | 'access_staytime_info' | 'access_depth_info',
		'item_list': {
			key: number,
			value: number
		}[]
	}[]
}

export interface IWxGetVisitPageResult {
	'ref_date': string,
	list: {
		'page_path': string,
		'page_visit_pv': number,
		'page_visit_uv': number,
		'page_staytime_pv': number,
		'entrypage_pv': number,
		'exitpage_pv': number,
		'page_share_pv': number,
		'page_share_uv': number
	}[]
}
