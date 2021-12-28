# mta-wechat-mp

[![Build & Lint & Test](https://github.com/nayotta/mta-wechat-mp/actions/workflows/build.yml/badge.svg)](https://github.com/nayotta/mta-wechat-mp/actions/workflows/build.yml)[![Node.js Package](https://github.com/nayotta/mta-wechat-mp/actions/workflows/release.yml/badge.svg)](https://github.com/nayotta/mta-wechat-mp/actions/workflows/release.yml)

[zh_CN](./README.md)

> an unofficial wechat miniprogram resources sdk for `javascript`/`typescript`

## install

```sh
$ npm install @nayotta/mta-wechat-mp
```

## How to use it ?

```typescript
import { MtaWechatMp } from '@nayotta/mta-wechat-mp'

const mtaWechatMp = new MtaWechatMp({
	appid: 'your_app_id',
	secret: 'your_app_secret',
	cloudEnvs: {
		develop: 'develop_cloud_env_id',
		production: 'production_cloud_env_id'
	},
	// warning: It is not recommended to operate on the client side
	proxy: {
		proxyUrl: 'http://localhost:2333/mp'
	}
})

// cloud
const {
	// database
	db： devDb,
	// cloud function
	func: devFunc,
	// cloud storage
	storage: devStorage
} = mtaWechatMp.clouds.develop

// analysis
mtaWechatMp.analysis.getVisitTrend({
	type: 'daily',
	beginDete: '2021-12-22',
	endDate: '2021-12-22'
}).then(res => {
	console.log(res)
}).catch(err => {
	console.error(err)
})
```

## TODO

- add documents (Github wiki);

- more unit tests;

- add others modules of MtaWechatMp, your PR is welcomed;
