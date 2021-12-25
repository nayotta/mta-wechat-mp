import { Method } from 'axios'

export const requestOptions: {
	[key: string]: {
		url: string,
		method: Method,
		tokenInQuery?: boolean
	}
} = {
	databaseMigrateImport: {
		url: '/tcb/databasemigrateimport',
		method: 'post',
		tokenInQuery: true
	},
	databaseMigrateExport: {
		url: '/tcb/databasemigrateexport',
		method: 'post',
		tokenInQuery: true
	},
	databaseMigrateQueryInfo: {
		url: '/tcb/databasemigratequeryinfo',
		method: 'post',
		tokenInQuery: true
	},
	databaseUpdateIndex: {
		url: '/tcb/updateindex',
		method: 'post',
		tokenInQuery: true
	},
	databaseCollectionAdd: {
		url: '/tcb/databasecollectionadd',
		method: 'post',
		tokenInQuery: true
	},
	databaseCollectionDelete: {
		url: '/tcb/databasecollectionadd',
		method: 'post',
		tokenInQuery: true
	},
	databaseCollectionGet: {
		url: '/tcb/databasecollectionget',
		method: 'post',
		tokenInQuery: true
	},
	databaseAdd: {
		url: '/tcb/databaseadd',
		method: 'post',
		tokenInQuery: true
	},
	databaseQuery: {
		url: '/tcb/databasequery',
		method: 'post',
		tokenInQuery: true
	},
	databaseUpdate: {
		url: '/tcb/databaseupdate',
		method: 'post',
		tokenInQuery: true
	},
	databaseDelete: {
		url: '/tcb/databasedelete',
		method: 'post',
		tokenInQuery: true
	},
	databaseAggregate: {
		url: '/tcb/databaseaggregate',
		method: 'post',
		tokenInQuery: true
	},
	databaseCount: {
		url: '/tcb/databasecount',
		method: 'post',
		tokenInQuery: true
	}
}
