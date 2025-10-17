import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// 配置MSW server (用于Node.js环境，如测试)
export const server = setupServer(...handlers)
