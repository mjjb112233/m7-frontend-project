import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// 配置MSW worker
export const worker = setupWorker(...handlers)
