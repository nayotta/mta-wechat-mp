import { dayjs } from '../src/util'

describe('Testing util funcs', () => {
	it('dayjs timezone', () => {
		expect(dayjs('2022-01-26T00:00:00').tz('Asia/Shanghai').format('YYYYMMDD')).toBe('20220126')
		expect(dayjs('2022-01-26T00:00:00').tz('America/Chicago').format('YYYYMMDD')).toBe('20220125')
	})
})
