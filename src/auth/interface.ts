export interface IWxGetAccessTokenResult {
	errcode?: number,
	errmsg?: string,
	'access_token'?: string,
	'expires_in'?: number
}

export interface IAuthGetAccessTokenResult {
	accessToken?: string,
	expiresIn?: number
}
