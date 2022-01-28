export interface IWxCode2SessionResult {
	openid?: string,
	'session_key'?: string,
	unionid?: string,
	errcode?: number,
	errmsg?: string
}

export interface IWxCheckEncryptedDataResult {
	errcode?: number,
	errmsg?: string,
	valid?: boolean,
	'create_time'?: string
}

export interface IWxGetPaidUnionIdResult {
	unionid?: string,
	errcode?: number,
	errmsg?: string
}

export interface IWxGetPluginOpenPidResult {
	errcode?: number,
	errmsg?: string,
	openpid?: string
}

export interface IWxGetAccessTokenResult {
	errcode?: number,
	errmsg?: string,
	'access_token'?: string,
	'expires_in'?: number
}
