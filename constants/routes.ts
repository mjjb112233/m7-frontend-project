/**
 * 路由相关常量
 */

// 页面路由
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ACCOUNT: '/account',
  CVV_CHECK: '/cvv-check',
  BIN_CLASSIFY: '/bin-classify',
  BIN_QUERY: '/bin-query',
  INFO_GENERATE: '/info-generate',

  RECHARGE: '/recharge',
} as const

// 导航菜单项
export const NAV_ITEMS = {
  HOME: { href: '/', label: 'nav.home', icon: 'CreditCard' },
  CVV_CHECK: { href: '/cvv-check', label: 'nav.cvvCheck', icon: 'Shield' },
  BIN_CLASSIFY: { href: '/bin-classify', label: 'nav.binClassify', icon: 'CreditCard' },
  BIN_QUERY: { href: '/bin-query', label: 'nav.binQuery', icon: 'Lock' },
  INFO_GENERATE: { href: '/info-generate', label: 'nav.infoGenerate', icon: 'Zap' },
  RECHARGE: { href: '/recharge', label: 'nav.recharge', icon: 'Zap' },
  LOGIN: { href: '/login', label: 'nav.login', icon: 'LogIn' },
  REGISTER: { href: '/register', label: 'nav.register', icon: 'UserPlus' },
} as const

// 用户权限级别对应的菜单
export const USER_LEVEL_MENUS = {
  GUEST: ['HOME', 'CVV_CHECK', 'BIN_CLASSIFY', 'RECHARGE'],
  LEVEL_1: ['HOME', 'CVV_CHECK', 'BIN_CLASSIFY', 'BIN_QUERY', 'RECHARGE'],
  LEVEL_2: ['HOME', 'CVV_CHECK', 'BIN_CLASSIFY', 'BIN_QUERY', 'RECHARGE', 'INFO_GENERATE'],
  LEVEL_3_PLUS: ['HOME', 'CVV_CHECK', 'BIN_CLASSIFY', 'BIN_QUERY', 'RECHARGE', 'INFO_GENERATE'],
} as const

// 受保护的路由（需要登录）
export const PROTECTED_ROUTES = [
  '/account',
  '/bin-query',
  '/info-generate',

] as const

// 需要特定权限级别的路由
export const PERMISSION_ROUTES = {
  '/bin-query': 1,
  '/info-generate': 2,

} as const
