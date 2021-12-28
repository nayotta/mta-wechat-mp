# mta-wechat-mp

[![Build & Lint & Test](https://github.com/nayotta/mta-wechat-mp/actions/workflows/build.yml/badge.svg)](https://github.com/nayotta/mta-wechat-mp/actions/workflows/build.yml)[![Node.js Package](https://github.com/nayotta/mta-wechat-mp/actions/workflows/release.yml/badge.svg)](https://github.com/nayotta/mta-wechat-mp/actions/workflows/release.yml)

[en](./README.en.md)

> 基于 `javascript`/`typescript` 环境的非官方微信小程序资源sdk

## 安装

```sh
$ npm install @nayotta/mta-wechat-mp
```

## 使用

```typescript
import { MtaWechatMp } from '@nayotta/mta-wechat-mp'

const mtaWechatMp = new MtaWechatMp({
	appid: 'your_app_id',
	secret: 'your_app_secret',
	cloudEnvs: {
		develop: 'develop_cloud_env_id',
		production: 'production_cloud_env_id'
	},
	// 虽然支持代理，但不建议在客户端进行操作
	proxy: {
		proxyUrl: 'http://localhost:2333/mp'
	}
})

// 云开发资源
const {
	// 数据库
	db： devDb,
	// 云函数
	func: devFunc,
	// 存储
	storage: devStorage
} = mtaWechatMp.clouds.develop

// 数据分析
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

## 待完善

- 添加说明文档（打算使用GitHub wiki）;

- 添加更多单元测试；

- 持续添加其他模块，欢迎大家来提PR；
