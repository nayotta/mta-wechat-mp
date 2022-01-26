import * as DAYJS from 'dayjs'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'

DAYJS.extend(utc)
DAYJS.extend(timezone)

export const dayjs = DAYJS
