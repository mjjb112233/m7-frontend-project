import { http, HttpResponse, type RequestHandler } from 'msw'
import { AVATAR_SEEDS, DICEBEAR_STYLES } from '@/components/ui/avatar-dicebear'

// BIN分类查询存储（模拟内存数据库）
interface MockQueryInfo {
  cards: string[]
  status: 'processing' | 'completed' | 'failed'
  startTime: number
  totalCount: number
  processedCount: number
}

const mockQueryStorage: Record<string, MockQueryInfo> = {}

// 生成模拟卡片信息
function generateMockCardInfo(cardNumber: string) {
  const bin = cardNumber.substring(0, 6)
  
  const brands = ['Visa', 'Mastercard', 'American Express', 'Discover', 'JCB', 'UnionPay']
  const types = ['Credit', 'Debit', 'Prepaid']
  const levels = ['Standard', 'Classic', 'Gold', 'Platinum', 'Signature', 'World', 'World Elite']
  const banks = [
    'Chase Bank', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One',
    'TD Bank', 'RBC', 'Scotiabank', 'BMO', 'HSBC', 'Barclays', 'Lloyds Bank',
    'Deutsche Bank', 'BNP Paribas', 'Santander', 'ING Bank', 'Commonwealth Bank',
    'ANZ Bank', 'Westpac', 'NAB', 'DBS Bank', 'OCBC Bank', 'UOB'
  ]
  const countries = ['US', 'CA', 'UK', 'DE', 'FR', 'ES', 'AU', 'SG', 'JP', 'CN', 'IN', 'BR']
  const currencies = ['USD', 'CAD', 'GBP', 'EUR', 'AUD', 'SGD', 'JPY', 'CNY', 'INR', 'BRL']
  
  const seed = parseInt(bin) % 1000
  
  return {
    brand: brands[seed % brands.length],
    type: types[seed % types.length],
    level: levels[seed % levels.length],
    bank: banks[seed % banks.length],
    country: countries[seed % countries.length],
    currency: currencies[seed % currencies.length]
  }
}

// 生成随机头像配置
function generateRandomAvatar() {
  const randomSeed = AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)]
  const availableStyles = Object.keys(DICEBEAR_STYLES)
  const randomStyle = availableStyles[Math.floor(Math.random() * availableStyles.length)]
  return { avatarSeed: randomSeed, avatarStyle: randomStyle }
}

// 模拟用户数据 - 匹配实际API结构
const mockUsers = [
  {
    id: "user_admin",
    username: "admin",
    name: "管理员",
    email: "admin@example.com",
    level: 3,
    mCoins: 1000.0,
    avatar: "https://example.com/avatar.jpg",
    avatarSeed: "Felix",
    avatarStyle: "adventurer",
    createdAt: 1704067200
  },
  {
    id: "user_test",
    username: "test",
    name: "测试用户",
    email: "test@example.com",
    level: 2,
    mCoins: 500.0,
    avatar: "https://example.com/avatar.jpg",
    avatarSeed: "Aneka",
    avatarStyle: "avataaars",
    createdAt: 1704067200
  },
  {
    id: "user_user",
    username: "user",
    name: "普通用户",
    email: "user@example.com",
    level: 1,
    mCoins: 100.0,
    avatar: "https://example.com/avatar.jpg",
    avatarSeed: "Trouble",
    avatarStyle: "big-ears",
    createdAt: 1704067200
  }
]

// 模拟公告数据 - 匹配实际API结构
const mockAnnouncements = [
  {
    id: "ann_001",
    title: "系统维护通知",
    message: "系统将于今晚23:00-01:00进行维护升级，期间服务可能短暂中断，请提前做好准备。",
    uiType: "warning",
    carouselDuration: 5000
  },
  {
    id: "ann_002", 
    title: "新功能上线",
    message: "CVV检测功能全新升级，支持更多检测模式和通道，检测准确率提升至99.9%！",
    uiType: "success",
    carouselDuration: 3000
  },
  {
    id: "ann_003",
    title: "版本更新",
    message: "v2.1.0版本已发布，新增BIN分类功能，优化用户体验，欢迎体验！",
    uiType: "info",
    carouselDuration: 4000
  }
]

// 模拟充值包数据 - 匹配实际API结构
const mockRechargePackages = [
  {
    id: "pkg_10",
    name: '入门套餐',
    mCoinAmount: 10,
    usdtPrice: 10,
    discount: 0,
    originalPrice: 10,
    description: '适合新用户体验CVV检测功能',
    isPopular: false,
    isRecommended: false,
    isActive: true
  },
  {
    id: "pkg_20", 
    name: '标准套餐',
    mCoinAmount: 20,
    usdtPrice: 19.6,
    discount: 2,
    originalPrice: 20,
    description: '日常CVV检测的理想选择',
    isPopular: false,
    isRecommended: false,
    isActive: true
  },
  {
    id: "pkg_50",
    name: '推荐套餐', 
    mCoinAmount: 50,
    usdtPrice: 48.02,
    discount: 4,
    originalPrice: 50,
    description: '性价比最高，专业用户首选',
    isPopular: true,
    isRecommended: true,
    isActive: true
  },
  {
    id: "pkg_100",
    name: '专业套餐',
    mCoinAmount: 100,
    usdtPrice: 94.12,
    discount: 6,
    originalPrice: 100,
    description: '专业用户的高效检测方案',
    isPopular: false,
    isRecommended: false,
    isActive: true
  },
  {
    id: "pkg_500",
    name: '企业套餐',
    mCoinAmount: 500,
    usdtPrice: 460,
    discount: 8,
    originalPrice: 500,
    description: '大批量检测的最佳方案',
    isPopular: false,
    isRecommended: false,
    isActive: true
  },
  {
    id: "pkg_1000",
    name: '旗舰套餐',
    mCoinAmount: 1000,
    usdtPrice: 900,
    discount: 10,
    originalPrice: 1000,
    description: '顶级用户的终极检测体验',
    isPopular: false,
    isRecommended: false,
    isActive: true
  }
]

// 模拟检测结果数据 - 匹配实际API结构
const mockDetectionResults = [
  {
    id: 1,
    cardNumber: "4147202688856879",
    cvv: "728",
    expiry: "07/29",
    other: "测试数据1",
    result: "valid",
    confidence: 0.95,
    bank: "Chase Bank",
    country: "United States",
    createdAt: 1704067200,
    detectionCompletedAt: 1704067500
  },
  {
    id: 2,
    cardNumber: "5555555555554444",
    cvv: "123",
    expiry: "12/25",
    other: null, // 可选字段，可以为null
    result: "invalid",
    confidence: 0.12,
    bank: "中国银行",
    country: "China",
    createdAt: 1704067500,
    detectionCompletedAt: 1704067500
  },
  {
    id: 3,
    cardNumber: "378282246310005",
    cvv: "1234",
    expiry: "08/26",
    other: "Amex测试卡",
    result: "valid",
    confidence: 0.88,
    bank: "American Express",
    country: "United States",
    createdAt: 1704067320,
    detectionCompletedAt: 1704067500
  },
  {
    id: 4,
    cardNumber: "6011111111111117",
    cvv: "456",
    expiry: "05/27",
    other: "Discover测试",
    result: "unknown",
    confidence: 0.45,
    bank: "未知银行",
    country: "Unknown",
    createdAt: 1704067380,
    detectionCompletedAt: 1704067500
  },
  {
    id: 5,
    cardNumber: "4000000000000002",
    cvv: "789",
    expiry: "11/25",
    other: "Visa测试卡",
    result: "invalid",
    confidence: 0.08,
    bank: "测试银行",
    country: "Test",
    createdAt: 1704067440,
    detectionCompletedAt: 1704067500
  }
]

// 模拟提取码数据 - 匹配实际API结构
const mockExtractCodes = [
  {
    id: 1,
    code: 'EXT001',
    status: 'active',
    mCoins: 50,
    usedAt: null,
    expiresAt: 1706745600,
    createdAt: 1704067200
  },
  {
    id: 2,
    code: 'EXT002',
    status: 'used',
    mCoins: 100,
    usedAt: 1704067200,
    expiresAt: 1706659200,
    createdAt: 1704067200
  }
]

// 模拟提取历史数据 - 匹配前端ExtractHistory接口
const mockExtractHistories = [
  {
    id: "1",
    extractCode: "EXT001",
    extractTime: 1704067200,
    cardCount: 3,
    dataSource: "CVV检测系统",
    status: "success" as const,
    paymentAmount: 0,
    paymentStatus: "completed" as const,
    paymentWallet: "",
    remarks: "成功提取卡信息"
  },
  {
    id: "2", 
    extractCode: "EXT002",
    extractTime: 1704154200,
    cardCount: 5,
    dataSource: "CVV检测系统",
    status: "success" as const,
    paymentAmount: 0.05,
    paymentStatus: "completed" as const,
    paymentWallet: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
    remarks: "支付后成功提取"
  },
  {
    id: "3",
    extractCode: "EXT003", 
    extractTime: 1704240900,
    cardCount: 2,
    dataSource: "CVV检测系统",
    status: "failed" as const,
    paymentAmount: 0,
    paymentStatus: "pending" as const,
    paymentWallet: "",
    remarks: "验证失败"
  }
]

// 模拟检测任务数据
const mockDetectionTasks = new Map()

// 模拟BIN分类结果
const mockBinResults = {
  "美国": [
    {
      cardNumber: "4147202688856879",
      brand: "Visa",
      type: "Credit",
      level: "Classic",
      bank: "Chase Bank",
      country: "美国",
      currency: "USD"
    }
  ],
  "中国": [
    {
      cardNumber: "5555555555554444",
      brand: "Mastercard",
      type: "Credit", 
      level: "Gold",
      bank: "中国银行",
      country: "中国",
      currency: "CNY"
    }
  ]
}

export const handlers: RequestHandler[] = [
  // 认证相关接口 - 拦截真实API请求并返回模拟数据
  http.post('http://localhost:8080/api/auth/login', async ({ request }) => {
    console.log('[MSW] 拦截登录请求')
    const body = await request.json() as { email: string; password: string }
    console.log('[MSW] 请求体:', body)
    
    // 模拟用户数据库验证
    const mockUserDb = [
      { email: 'admin@example.com', password: 'admin123', level: 3, mCoins: 1000.0, username: 'admin' },
      { email: 'test@example.com', password: 'test123', level: 2, mCoins: 500.0, username: 'test' },
      { email: 'user@example.com', password: 'user123', level: 1, mCoins: 100.0, username: 'user' },
      { email: 'detecting@example.com', password: 'detecting123', level: 2, mCoins: 300.0, username: 'detecting_user' },
      { email: 'completed@example.com', password: 'completed123', level: 2, mCoins: 400.0, username: 'completed_user' }
    ]
    
    console.log('[MSW] 查找用户:', body.email, body.password)
    const user = mockUserDb.find(u => u.email === body.email && u.password === body.password)
    console.log('[MSW] 找到用户:', user)
    
    if (!user) {
      console.log('[MSW] 用户不存在，返回401')
      return HttpResponse.json({
        success: false,
        message: "Invalid email or password"
      }, { status: 401 })
    }

    // 根据用户生成不同的token标识
    let tokenPrefix = 'mock_jwt_'
    if (user.email === 'detecting@example.com') {
      tokenPrefix = 'mock_jwt_detecting_'
    } else if (user.email === 'completed@example.com') {
      tokenPrefix = 'mock_jwt_completed_'
    }
    
    const mockToken = `${tokenPrefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return HttpResponse.json({
      success: true,
      data: {
        token: mockToken,
        expiresIn: 604800, // 7天
        user: {
          id: `user_${user.username}`,
          username: user.username,
          name: user.username === 'admin' ? '管理员' : user.username === 'test' ? '测试用户' : '普通用户',
          email: user.email,
          level: user.level,
          mCoins: user.mCoins,
          avatar: "https://example.com/avatar.jpg"
        }
      },
      message: "Login successful"
    })
  }),

  http.post('http://localhost:8080/api/auth/register', async ({ request }) => {
    console.log('[MSW] 拦截注册请求')
    const body = await request.json() as { username: string; email: string; password: string }
    
    // 模拟验证逻辑
    if (body.username === 'admin' || body.username === 'test') {
      return HttpResponse.json({
        success: false,
        message: "用户名已存在，请选择其他用户名"
      }, { status: 409 })
    }

    if (body.email === 'admin@example.com' || body.email === 'test@example.com') {
      return HttpResponse.json({
        success: false,
        message: "邮箱已被注册，请使用其他邮箱"
      }, { status: 409 })
    }
    
    // 生成随机的 DiceBear 头像配置
    const { avatarSeed, avatarStyle } = generateRandomAvatar()
    
    const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return HttpResponse.json({
      success: true,
      data: {
        token: mockToken,
        user: {
          id: `user_${Date.now()}`,
          username: body.username,
          email: body.email,
          level: 1,
          mCoins: 50.0,
          avatarSeed: avatarSeed,
          avatarStyle: avatarStyle
        }
      },
      message: "Registration successful"
    })
  }),

  http.get('http://localhost:8080/api/auth/user', ({ request }) => {
    console.log('[MSW] 拦截用户信息请求')
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({
        success: false,
        message: "未授权访问"
      }, { status: 401 })
    }

    const token = authHeader.substring(7)
    if (!token.startsWith('mock_jwt_')) {
      return HttpResponse.json({
        success: false,
        message: "无效的token"
      }, { status: 401 })
    }
    
    return HttpResponse.json({
      success: true,
      data: mockUsers[0],
      message: "User information retrieved successfully"
    })
  }),

  // 公告相关接口 - 拦截真实API请求并返回模拟数据
  http.get('http://localhost:8080/api/announcements', () => {
    console.log('[MSW] 拦截公告请求')
    return HttpResponse.json({
      success: true,
      data: mockAnnouncements,
      message: "Announcements retrieved successfully"
    })
  }),

  // 充值相关接口 - 拦截真实API请求并返回模拟数据
  http.get('*/api/recharge/packages', ({ request }) => {
    console.log('[MSW] 拦截充值套餐请求')
    const authHeader = request.headers.get("Authorization")
    
    // 允许未登录用户查看套餐（可选认证）
    if (authHeader && authHeader.startsWith("Bearer ")) {
      console.log('[MSW] 用户已认证，返回完整套餐信息')
    } else {
      console.log('[MSW] 用户未认证，仍允许查看套餐信息')
    }

    const activePackages = mockRechargePackages.filter(pkg => pkg.isActive)
    
    return HttpResponse.json({
      success: true,
      data: {
        packages: activePackages,
        total: activePackages.length
      },
      message: "Recharge packages retrieved successfully"
    })
  }),

  http.post('*/api/recharge/payment', async ({ request }) => {
    const body = await request.json() as { packageId: string; mCoinAmount: number; usdtPrice: number; discount: number }
    
    const selectedPackage = mockRechargePackages.find(pkg => pkg.id === body.packageId)
    
    // 在生成订单时就创建交易哈希
    const transactionHash = "0x" + Math.random().toString(16).substr(2, 16)
    
    return HttpResponse.json({
      success: true,
      data: {
        paymentId: 'mock-payment-' + Date.now(),
        usdtAmount: body.usdtPrice,
        walletAddress: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
        transactionHash: transactionHash, // 在订单创建时就生成交易哈希
        paymentInstructions: [
          "请确保使用TRC20网络转账",
          `转账金额必须精确匹配 ${body.usdtPrice} USDT`,
          "支付完成后，M币将在10分钟内到账",
          "如有问题请联系客服"
        ],
        validUntil: Math.floor((Date.now() + 30 * 60 * 1000) / 1000), // 30分钟后过期（10位时间戳）
        packageInfo: {
          packageId: body.packageId,
          mCoinAmount: body.mCoinAmount,
          usdtPrice: body.usdtPrice,
          discount: body.discount
        }
      },
      message: "Payment order created successfully"
    })
  }),

  // 提取码支付接口
  http.post('*/api/extract-code/payment', async ({ request }) => {
    const body = await request.json() as { "secret-key": string }
    
    if (!body["secret-key"]) {
      return HttpResponse.json({
        success: false,
        message: "secret-key不能为空"
      }, { status: 400 })
    }
    
    // 模拟支付订单创建
    const orderId = 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8).toUpperCase()
    const walletAddress = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
    const transactionHash = "0x" + Math.random().toString(16).substr(2, 16)
    
    return HttpResponse.json({
      success: true,
      data: {
        orderId: orderId,
        amount: 0.05,
        walletAddress: walletAddress,
        transactionHash: transactionHash,
        paymentInstructions: [
          "请确保使用TRC20网络转账",
          "转账金额必须精确匹配 0.05 USDT",
          "支付完成后，M币将在10分钟内到账",
          "如有问题请联系客服"
        ]
      },
      message: "Payment order created successfully"
    })
  }),

  // CVV检测相关接口 - 匹配实际API结构
  http.post('*/api/cvv-check/start-detection', async ({ request }) => {
    console.log('[MSW] 拦截 start-detection 请求')
    const body = await request.json() as { cardDataList: string[]; "mode-id": number; channelId: string; autoStopCount: number; consumption: number }
    console.log('[MSW] start-detection 请求体:', body)
    
    if (!body.cardDataList || body.cardDataList.length === 0) {
      return HttpResponse.json({
        success: false,
        message: "银行卡数据列表不能为空"
      }, { status: 400 })
    }

    if (body.cardDataList.length > 100) {
      return HttpResponse.json({
        success: false,
        message: "单次检测银行卡数量不能超过100个"
      }, { status: 400 })
    }

    if (body.consumption > 100) {
      return HttpResponse.json({
        success: false,
        err: "余额不足，请先充值后再进行检测",
        message: "M币余额不足，请先充值"
      }, { status: 402 })
    }

    // 解析银行卡数据，提取CVV信息用于统计
    const cvvCount = body.cardDataList.length
    const detectionId = `det_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    mockDetectionTasks.set(detectionId, {
      status: "detecting",
      totalCVVs: cvvCount,
      completedCVVs: 0,
      consumption: body.consumption,
      cardDataList: body.cardDataList // 保存完整的银行卡数据
    })
    
    return HttpResponse.json({
      success: true,
      data: {
        detectionId: detectionId,
        status: "detecting",
        totalCVVs: cvvCount,
        consumption: body.consumption,
        "mode-id": body["mode-id"],
        channelId: body.channelId
      },
      message: "Detection started successfully"
    })
  }),

  http.get('*/api/cvv-check/status/:taskId', ({ params }) => {
    const taskId = params.taskId as string
    const task = mockDetectionTasks.get(taskId)
    
    if (!task) {
      return HttpResponse.json({
        success: false,
        message: "检测任务不存在"
      }, { status: 404 })
    }

    return HttpResponse.json({
      success: true,
      data: {
        detectionId: taskId,
        status: task.status,
        totalCVVs: task.totalCVVs,
        completedCVVs: task.completedCVVs,
        progress: Math.round((task.completedCVVs / task.totalCVVs) * 100)
      },
      message: "Detection status retrieved successfully"
    })
  }),

  http.post('*/api/cvv-check/detection-results', async ({ request }) => {
    const body = await request.json() as { detectionId: string; page?: number; pageSize?: number }
    
    if (!body.detectionId) {
      return HttpResponse.json({
        success: false,
        message: "检测ID不能为空"
      }, { status: 400 })
    }
    
    const page = body.page || 1
    const pageSize = body.pageSize || 10
    
    // 根据检测结果分类数据，并格式化每个结果项
    const validResults = mockDetectionResults
      .filter(result => result.result === 'valid')
      .map(result => ({
        id: result.id,
        cardNumber: result.cardNumber,
        cvv: result.cvv,
        expiry: result.expiry,
        other: result.other,
        detectionCompletedAt: result.detectionCompletedAt
      }))
    
    const invalidResults = mockDetectionResults
      .filter(result => result.result === 'invalid')
      .map(result => ({
        id: result.id,
        cardNumber: result.cardNumber,
        cvv: result.cvv,
        expiry: result.expiry,
        other: result.other,
        detectionCompletedAt: result.detectionCompletedAt
      }))
    
    const unknownResults = mockDetectionResults
      .filter(result => result.result === 'unknown')
      .map(result => ({
        id: result.id,
        cardNumber: result.cardNumber,
        cvv: result.cvv,
        expiry: result.expiry,
        other: result.other,
        detectionCompletedAt: result.detectionCompletedAt
      }))
    
    return HttpResponse.json({
      success: true,
      data: {
        // 分类结果数据
        validResults: validResults,
        invalidResults: invalidResults,
        unknownResults: unknownResults,
        
        // 统计信息
        validCount: validResults.length,
        invalidCount: invalidResults.length,
        unknownCount: unknownResults.length,
        
        // 分页信息
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(mockDetectionResults.length / pageSize),
        
        // 消耗信息
        consumedCoins: 15.5,
        
        // 检测时间信息
        detectionStartTime: 1704067200,
        detectionEndTime: 1704067500,
        detectionDuration: "5分钟",
        
        // 提取码生成状态
        isCodeGenerated: false
      },
      message: "Detection results retrieved successfully"
    })
  }),


  // 提取码相关接口 - 匹配实际API结构
  http.get('*/api/extract-code/history', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    
    // 计算分页数据
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedHistories = mockExtractHistories.slice(startIndex, endIndex)
    
    return HttpResponse.json({
      success: true,
      data: {
        histories: paginatedHistories,
        total: mockExtractHistories.length,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(mockExtractHistories.length / pageSize)
      },
      message: "Extract history retrieved successfully"
    })
  }),





  // 1. BIN分类查询接口
  http.post('*/api/bin-classify/query', async ({ request }) => {
    console.log('[MSW] BIN分类查询请求被拦截')
    console.log('[MSW] 请求URL:', request.url)
    console.log('[MSW] 请求头:', Object.fromEntries(request.headers.entries()))
    const body = await request.json() as { cards: string[] }
    console.log('[MSW] 请求体:', body)
    
    if (!body.cards || body.cards.length === 0) {
      return HttpResponse.json({
        success: false,
        data: { queryId: '', status: 'failed' },
        message: "卡片数据不能为空"
      }, { status: 400 })
    }
    
    // 生成查询ID
    const queryId = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 存储查询信息到内存中（实际中应该存储到数据库）
    mockQueryStorage[queryId] = {
      cards: body.cards,
      status: 'processing',
      startTime: Date.now(),
      totalCount: body.cards.length,
      processedCount: 0
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        queryId,
        status: 'processing'
      },
      message: "Query started successfully"
    })
  }),

  // 2. BIN分类结果获取接口
  http.get('*/api/bin-classify/results/:queryId', async ({ params }) => {
    console.log('[MSW] BIN分类结果查询请求被拦截')
    const { queryId } = params
    console.log('[MSW] 查询ID:', queryId)
    
    if (!queryId || typeof queryId !== 'string') {
      return HttpResponse.json({
        success: false,
        data: { queryId: '', status: 'failed' },
        message: "Invalid query ID"
      }, { status: 400 })
    }

    const queryInfo = mockQueryStorage[queryId]
    if (!queryInfo) {
      return HttpResponse.json({
        success: false,
        data: { queryId, status: 'failed' },
        message: "Query not found"
      }, { status: 404 })
    }

    // 模拟处理进度
    const elapsedTime = Date.now() - queryInfo.startTime
    const processingTimePerCard = 200 // 每张卡200ms
    const expectedProcessedCount = Math.min(
      queryInfo.totalCount,
      Math.floor(elapsedTime / processingTimePerCard)
    )

    queryInfo.processedCount = expectedProcessedCount

    // 如果处理完成
    if (queryInfo.processedCount >= queryInfo.totalCount) {
      queryInfo.status = 'completed'
      
      // 生成模拟结果
      const results = queryInfo.cards.map(cardNumber => {
        const mockCard = generateMockCardInfo(cardNumber)
        return {
          CardNumber: cardNumber,
          CardBrand: mockCard.brand,
          Type: mockCard.type,
          CountryName: mockCard.country,
          CardSegmentType: mockCard.level,
          IssuerCurrency: mockCard.currency,
          BankName: mockCard.bank,
          AuthRequired: Math.random() > 0.5,
          AuthenticationName: Math.random() > 0.5 ? '3D Secure' : 'None'
        }
      })

      return HttpResponse.json({
        success: true,
        data: {
          queryId,
          status: 'completed',
          results
        },
        message: "Query completed successfully"
      })
    }

    // 返回处理中状态
    return HttpResponse.json({
      success: true,
      data: {
        queryId,
        status: 'processing',
        totalCount: queryInfo.totalCount,
        processedCount: queryInfo.processedCount
      },
      message: "Query in progress"
    })
  }),

  // 信息生成相关接口 - 匹配实际API结构
  http.post('*/api/info-generate/generate', async ({ request }) => {
    const body = await request.json() as { cardNumbers: string[]; pricePerCard: number }
    
    if (!body.cardNumbers || body.cardNumbers.length === 0) {
      return HttpResponse.json({
        success: false,
        message: "卡号列表不能为空"
      }, { status: 400 })
    }

    if (body.cardNumbers.length > 100) {
      return HttpResponse.json({
        success: false,
        message: "单次生成卡号数量不能超过100个"
      }, { status: 400 })
    }

    // 模拟生成成功和失败的情况
    const successRate = 0.8 // 80%成功率
    const successCount = Math.floor(body.cardNumbers.length * successRate)
    const failedCount = body.cardNumbers.length - successCount
    
    // 生成成功的数据
    const successData = body.cardNumbers.slice(0, successCount).map((cardNumber, index) => {
      // 解析卡号，提取卡号、月份、年份
      const cardParts = cardNumber.split('|')
      const cardNum = cardParts[0] || cardNumber
      const month = cardParts[1] || "06"
      const year = cardParts[2] || "2028"
      
      return {
        cardNumber: cardNum,
        month: month,
        year: year,
        fullName: `John Doe ${index + 1}`,
        phone: `+1-555-${String(index + 1).padStart(3, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        address: `${100 + index} Main St`,
        city: "Boston",
        state: "MA",
        zipCode: `0210${index + 1}`,
        country: "United States"
      }
    })
    
    // 生成失败的卡号
    const failedCardNumbers = body.cardNumbers.slice(successCount)
    
    const totalCost = body.cardNumbers.length * body.pricePerCard // 使用请求中的价格
    
    return HttpResponse.json({
      success: true,
      data: {
        successCount: successCount,
        failedCount: failedCount,
        totalCost: totalCost,
        successData: successData,
        failedCardNumbers: failedCardNumbers,
        generateTime: Math.floor(Date.now() / 1000) // 10位时间戳
      },
      message: "Information generated successfully"
    })
  }),

  // BIN查询相关接口
  http.post('*/api/bin-query/query', async ({ request }) => {
    const body = await request.json() as { bin: string }
    
    if (!body.bin || body.bin.length < 6) {
      return HttpResponse.json({
        success: false,
        message: "BIN码不能少于6位"
      }, { status: 400 })
    }

    // 模拟BIN查询结果 - 使用新的响应格式
    const mockBINData = {
      '414720': {
        bin_length: 6,
        pan_or_token: "PAN",
        card_brand: "Visa",
        type: "Credit",
        funding_source: "Credit",
        prepaid: false,
        card_segment_type: "Classic",
        number_length: 16,
        bank_name: "中国工商银行",
        bank_clean_name: "ICBC",
        issuer_currency: "CNY",
        country_alpha2: "CN",
        country_name: "中国",
        auth_required: true,
        authentication_name: "3D Secure",
        product_name: "Visa Classic",
        domestic_only: false,
        gambling_blocked: true,
        reloadable: false,
        account_updater: true,
        level2: true,
        level3: false,
        alm: true,
        shared_bin: false
      },
      '555555': {
        bin_length: 6,
        pan_or_token: "PAN",
        card_brand: "Mastercard",
        type: "Credit",
        funding_source: "Credit",
        prepaid: false,
        card_segment_type: "Platinum",
        number_length: 16,
        bank_name: "中国建设银行",
        bank_clean_name: "CCB",
        issuer_currency: "CNY",
        country_alpha2: "CN",
        country_name: "中国",
        auth_required: true,
        authentication_name: "3D Secure",
        product_name: "Mastercard Platinum",
        domestic_only: false,
        gambling_blocked: true,
        reloadable: false,
        account_updater: true,
        level2: true,
        level3: true,
        alm: true,
        shared_bin: false
      },
      '622202': {
        bin_length: 6,
        pan_or_token: "PAN",
        card_brand: "UnionPay",
        type: "Debit",
        funding_source: "Debit",
        prepaid: false,
        card_segment_type: "Standard",
        number_length: 16,
        bank_name: "中国农业银行",
        bank_clean_name: "ABC",
        issuer_currency: "CNY",
        country_alpha2: "CN",
        country_name: "中国",
        auth_required: false,
        authentication_name: "None",
        product_name: "UnionPay Standard",
        domestic_only: true,
        gambling_blocked: true,
        reloadable: false,
        account_updater: false,
        level2: false,
        level3: false,
        alm: false,
        shared_bin: false
      }
    }

    const binPrefix = body.bin.substring(0, 6)
    const result = mockBINData[binPrefix as keyof typeof mockBINData] || {
      bin_length: 6,
      pan_or_token: "PAN",
      card_brand: "Unknown",
      type: "Unknown",
      funding_source: "Unknown",
      prepaid: false,
      card_segment_type: "Unknown",
      number_length: 16,
      bank_name: "未知银行",
      bank_clean_name: "Unknown Bank",
      issuer_currency: "USD",
      country_alpha2: "US",
      country_name: "未知国家",
      auth_required: false,
      authentication_name: "None",
      product_name: "Unknown Card",
      domestic_only: false,
      gambling_blocked: false,
      reloadable: false,
      account_updater: false,
      level2: false,
      level3: false,
      alm: false,
      shared_bin: false
    }
    
    return HttpResponse.json({
      success: true,
      data: result,
      message: "BIN查询成功"
    })
  }),

  http.get('*/api/bin-query/history', async ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

    const mockHistory = [
      {
        id: '1',
        bin: '414720',
        result: {
          bin_length: 6,
          pan_or_token: "PAN",
          card_brand: "Visa",
          type: "Credit",
          funding_source: "Credit",
          prepaid: false,
          card_segment_type: "Classic",
          number_length: 16,
          bank_name: "中国工商银行",
          bank_clean_name: "ICBC",
          issuer_currency: "CNY",
          country_alpha2: "CN",
          country_name: "中国",
          auth_required: true,
          authentication_name: "3D Secure",
          product_name: "Visa Classic",
          domestic_only: false,
          gambling_blocked: true,
          reloadable: false,
          account_updater: true,
          level2: true,
          level3: false,
          alm: true,
          shared_bin: false
        },
        status: 'success',
        queryTime: new Date().toLocaleString('zh-CN')
      }
    ]

    return HttpResponse.json({
      success: true,
      data: {
        records: mockHistory,
        total: mockHistory.length,
        page,
        pageSize
      },
      message: "获取历史记录成功"
    })
  }),

  // 卡信息提取相关接口 - 匹配实际API结构
  http.post('*/api/extract-code', async ({ request }) => {
    const body = await request.json() as { extractCode: string }
    
    if (!body.extractCode) {
      return HttpResponse.json({
        success: false,
        message: "提取码不能为空"
      }, { status: 400 })
    }

    const mockCardInfo = [
      {
        cardNumber: "414720**********",
        expiry: "07/29"
      },
      {
        cardNumber: "5555555**********",
        expiry: "12/25"
      }
    ]
    
    // 检查是否为特定提取码，设置不同的支付要求
    const isSpecialExtractCode = body.extractCode === 'EXT123456'
    
    return HttpResponse.json({
      success: true,
      data: {
        cards: mockCardInfo,
        count: mockCardInfo.length,
        detectTime: Math.floor(Date.now() / 1000), // 10位时间戳
        dataSource: "CVV检测系统",
        remarks: "通过提取码获取的卡信息",
        status: "valid",
        requiresPayment: isSpecialExtractCode,
        paymentAmount: isSpecialExtractCode ? 0.05 : 0,
        paymentWallet: isSpecialExtractCode ? "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE" : ""
      },
      message: "Card information extracted successfully"
    })
  }),

  // 提取码支付回调接口
  http.post('*/api/extract-code/payment/callback', async ({ request }) => {
    try {
      const body = await request.json() as { orderId: string; transactionHash: string; amount: number }
      
      console.log('[MSW] 支付回调请求数据:', body)
      
      if (!body.orderId || !body.transactionHash || !body.amount) {
        return HttpResponse.json({
          success: false,
          message: "订单号、哈希值和金额不能为空"
        }, { status: 400 })
      }
      
      // 模拟支付回调处理
      return HttpResponse.json({
        success: true,
        data: {
          paymentStatus: "success",
          "secret-key": "xxxxx123323"
        },
        message: "Payment callback processed successfully"
      })
    } catch (error) {
      console.error('[MSW] Payment callback processing error:', error)
      return HttpResponse.json({
        success: false,
        message: "Payment callback processing failed"
      }, { status: 500 })
    }
  }),

  // 用户状态接口
  http.get('*/api/cvv-check/user-status', ({ request }) => {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({
        success: false,
        error: "UNAUTHORIZED",
        message: "用户未授权，请先登录"
      }, { status: 401 })
    }

    // 模拟不同的用户状态
    const mockStatuses = [
      {
        status: "not_detected",
        detectionId: null,
        isDetecting: false,
        remainingCredits: 100,
        lastDetectionTime: null
      },
      {
        status: "detecting",
        detectionId: "det_1758963288123_j67qc984c",
        isDetecting: true,
        remainingCredits: 95,
        lastDetectionTime: Math.floor(Date.now() / 1000) // 10位时间戳
      },
      {
        status: "completed",
        detectionId: "det_1758963288123_j67qc984c",
        isDetecting: false,
        remainingCredits: 90,
        lastDetectionTime: Math.floor((Date.now() - 300000) / 1000) // 5分钟前（10位时间戳）
      }
    ]

    // 根据token识别用户并返回对应状态
    const token = authHeader.substring(7)
    
    // 模拟根据token获取用户信息
    let selectedStatus
    if (token.includes('detecting')) {
      // 检测中用户
      selectedStatus = mockStatuses[1] // 检测中状态
    } else if (token.includes('completed')) {
      // 已完成用户
      selectedStatus = mockStatuses[2] // 已完成状态
    } else {
      // 其他用户默认为未检测状态
      selectedStatus = mockStatuses[0] // 未检测状态
    }

    return HttpResponse.json({
      success: true,
      data: {
        status: selectedStatus.status,
        detectionId: selectedStatus.detectionId,
      },
      message: "User status retrieved successfully"
    })
  }),

  // 停止检测接口
  http.post('*/api/cvv-check/stop-detection', async ({ request }) => {
    const body = await request.json() as { detectionId: string }
    
    if (mockDetectionTasks.has(body.detectionId)) {
      const task = mockDetectionTasks.get(body.detectionId)
      const actualDetected = task.completedCVVs
      const totalConsumption = actualDetected * task.consumption
      
      // 删除任务
      mockDetectionTasks.delete(body.detectionId)
      
      return HttpResponse.json({
        success: true,
        data: {
          detectionId: body.detectionId,
          actualDetected: actualDetected,
          totalCVVs: task.totalCVVs,
          consumption: totalConsumption,
          status: "已停止"
        },
        message: "检测已停止"
      })
    }

    return HttpResponse.json({
      success: false,
      message: "检测任务不存在"
    }, { status: 404 })
  }),

  // 提取码验证接口
  http.post('*/api/extract-code/verify', async ({ request }) => {
    const body = await request.json() as { extractCode: string; verificationCode: string }
    
    if (!body.extractCode || !body.verificationCode) {
      return HttpResponse.json({
        success: false,
        message: "提取码和验证码不能为空"
      }, { status: 400 })
    }

    // 模拟验证逻辑
    const isValidCode = body.extractCode.startsWith('EXT') && body.extractCode.length >= 6
    
    // 检查验证码是否为纯数字（纯数字验证码一律判断为正确）
    const isNumericVerificationCode = /^\d+$/.test(body.verificationCode)
    const isValidVerificationCode = isNumericVerificationCode || body.verificationCode.length >= 8
    
    // 模拟验证失败的情况（提取码或验证码错误都统一为验证码错误）
    if (!isValidCode || !isValidVerificationCode) {
      // 模拟错误次数统计
      const errorCount = Math.floor(Math.random() * 3) + 1 // 1-3次错误
      
      return HttpResponse.json({
        success: false,
        data: {
          errorCount: errorCount,
          maxErrors: 6,
          remainingAttempts: 6 - errorCount
        },
        message: "Verification code error"
      }, { status: 400 })
    }

    // 模拟验证成功
    return HttpResponse.json({
      success: true,
      data: {
        "secret-key": "xxxxxxxxxxxxxxxxxxxxxxx"
      },
      message: "Verification code verified successfully"
    })
  }),

  // 提取码确认接口
  http.post('*/api/extract-code/confirm', async ({ request }) => {
    const body = await request.json() as { "secret-key": string }
    
    if (!body["secret-key"]) {
      return HttpResponse.json({
        success: false,
        message: "secret-key不能为空"
      }, { status: 400 })
    }

    // 模拟获取完整卡信息成功
    return HttpResponse.json({
      success: true,
      data: {
        cards: [
          {
            cardNumber: "4111111111111111",
            expiry: "12/25",
            cvv: "123",
            other: "名字，地址，邮编等"
          },
          {
            cardNumber: "5555555555554444",
            expiry: "06/26",
            cvv: "456",
            other: "名字，地址，邮编等"
          }
        ],
        count: 2
      },
      message: "Card information retrieved successfully"
    })
  }),

  // 提取码生成价格查询
  http.get('*/api/extract-generate/price', ({ request }) => {
    console.log('[MSW] 拦截提取码生成价格GET请求')
    
    // 模拟根据用户等级返回不同价格
    const userLevel = 2 // 模拟2级用户
    let price = 50.0 // 默认价格
    
    if (userLevel >= 2) {
      price = 40.0 // 2级用户：40 M币/张
    }
    if (userLevel >= 3) {
      price = 30.0 // 3级用户：30 M币/张
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        price: price
      },
      message: "Generation price retrieved successfully"
    })
  }),







  // 信息生成价格查询
  http.get('*/api/info-generate/price', ({ request }) => {
    console.log('[MSW] 拦截信息生成价格请求')
    
    // 模拟根据用户等级返回不同价格
    const userLevel = 2 // 模拟2级用户
    let price = 2.0 // 默认价格
    
    if (userLevel >= 2) {
      price = 1.5 // 2级用户：1.5 M币/张
    }
    
    if (userLevel >= 3) {
      price = 1.0 // 3级用户：1.0 M币/张
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        price: price
      },
      message: "Generation price retrieved successfully"
    })
  }),

  // CVV检测配置接口
  http.get('*/api/cvv-check/config', ({ request }) => {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({
        success: false,
        message: "未授权访问"
      }, { status: 401 })
    }

    return HttpResponse.json({
      success: true,
      data: {
        detectionModes: [
          {
            "mode-id": 1,
            "name": "扣测",
            "channels-data": {
              "description": "扣测模式",
              "channels": [
                {
                  "id": 1,
                  "name": "高速通道",
                  "rate": "2.5",
                  "speed": "fast",
                  "description": "高速检测通道，速度快",
                  "status": "online"
                },
                {
                  "id": 2,
                  "name": "标准通道",
                  "rate": "3.0",
                  "speed": "normal",
                  "description": "标准检测通道，平衡速度与准确率",
                  "status": "online"
                }
              ]
            }
          },
          {
            "mode-id": 2,
            "name": "无c",
            "channels-data": {
              "description": "无c模式",
              "channels": [
                {
                  "id": 1,
                  "name": "高速通道",
                  "rate": "2.5",
                  "speed": "fast",
                  "description": "高速检测通道，速度快",
                  "status": "online"
                },
                {
                  "id": 3,
                  "name": "经济通道",
                  "rate": "3.5",
                  "speed": "slow",
                  "description": "经济检测通道，成本低",
                  "status": "online"
                }
              ]
            }
          },
          {
            "mode-id": 3,
            "name": "有c",
            "channels-data": {
              "description": "有c模式",
              "channels": [
                {
                  "id": 2,
                  "name": "标准通道",
                  "rate": "3.0",
                  "speed": "normal",
                  "description": "标准检测通道，平衡速度与准确率",
                  "status": "online"
                },
                {
                  "id": 3,
                  "name": "经济通道",
                  "rate": "3.5",
                  "speed": "slow",
                  "description": "经济检测通道，成本低",
                  "status": "online"
                }
              ]
            }
          }
        ]
      },
      message: "Configuration retrieved successfully"
    })
  }),

  // 检测进度接口
  http.get('*/api/cvv-check/detection-progress', ({ request }) => {
    const url = new URL(request.url)
    const detectionId = url.searchParams.get('detectionId')
    
    if (!detectionId) {
      return HttpResponse.json({
        success: false,
        message: "检测ID不能为空"
      }, { status: 400 })
    }

    const task = mockDetectionTasks.get(detectionId)
    if (!task) {
      return HttpResponse.json({
        success: false,
        message: "检测任务不存在"
      }, { status: 404 })
    }

    // 模拟进度更新
    const progress = Math.min(task.completedCVVs + Math.floor(Math.random() * 5), task.totalCVVs)
    task.completedCVVs = progress
    
    if (progress >= task.totalCVVs) {
      task.status = "completed"
    }

    // 模拟检测结果统计
    const validCount = Math.floor(task.completedCVVs * 0.6) // 60%有效
    const invalidCount = Math.floor(task.completedCVVs * 0.3) // 30%无效
    const unknownCount = task.completedCVVs - validCount - invalidCount // 剩余为未知

    // 模拟检测数据
    const checkData = []
    for (let i = 0; i < Math.min(task.completedCVVs, 10); i++) {
      checkData.push({
        cardNumber: `****${Math.floor(Math.random() * 9000) + 1000}`,
        startTime: Math.floor((Date.now() - Math.random() * 300000) / 1000) // 10位时间戳（秒）
      })
    }

    // 模拟系统状态
    const concurrentUsers = Math.floor(Math.random() * 50) + 10 // 10-60个用户
    const systemStatus = {
      detectionService: Math.random() > 0.1 ? 'running' : 'error', // 90%概率正常运行
      channel: Math.random() > 0.05 ? 'active' : 'error', // 95%概率通道正常
      concurrentUsers: concurrentUsers
    }

    // 计算消耗的M币数量（基于已完成的CVV数量）
    const consumedMCoins = (task.completedCVVs * 0.3).toFixed(1) // 每个CVV消耗0.3 M币

    return HttpResponse.json({
      success: true,
      data: {
        detectionId: detectionId,
        status: task.status,
        totalCVVs: task.totalCVVs,
        completedCVVs: task.completedCVVs,
        progress: Math.round((task.completedCVVs / task.totalCVVs) * 100),
        validCount: validCount,
        invalidCount: invalidCount,
        unknownCount: unknownCount,
        consumedMCoins: consumedMCoins, // 新增：消耗的M币数量
        checkData: checkData,
        systemStatus: systemStatus
      },
      message: "Detection progress retrieved successfully"
    })
  }),

  // 获取提取码记录列表
  http.get('*/api/extract-code/records', ({ request }) => {
    console.log('[MSW] 拦截提取码记录列表请求')
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const status = url.searchParams.get('status')
    
    console.log('[MSW] 请求参数:', { page, pageSize, status })
    
    // 模拟提取码记录数据
    const mockRecords = [
      {
        id: "EXT001",
        code: "ABC123DEF456",
        verificationCode: "VER789",
        remarks: "测试提取",
        createdAt: 1704067200,
        status: "completed",
        paymentRequired: true,
        usdtAmount: 50,
        walletAddress: "TRX7n...8kL2",
        paymentStatus: "paid",
        validUntil: 1706745600,
        costMCoins: 50,
        dataSource: "CVV检测",
        extractCount: 2
      },
      {
        id: "EXT002", 
        code: "XYZ789GHI012",
        verificationCode: "VER456",
        remarks: "批量处理",
        createdAt: 1704067200,
        status: "pending",
        paymentRequired: false,
        paymentStatus: "none",
        validUntil: 1706659200,
        costMCoins: 25,
        dataSource: "BIN分类",
        extractCount: 1
      },
      {
        id: "EXT003",
        code: "DEF456JKL789",
        verificationCode: "VER123",
        remarks: "多卡提取",
        createdAt: 1704067200,
        status: "completed",
        paymentRequired: true,
        usdtAmount: 75,
        walletAddress: "TRX7n...8kL2",
        paymentStatus: "paid",
        validUntil: 1706659200,
        costMCoins: 75,
        dataSource: "信息生成",
        extractCount: 3
      }
    ]
    
    // 根据状态过滤
    let filteredRecords = mockRecords
    if (status) {
      filteredRecords = mockRecords.filter(record => record.status === status)
    }
    
    // 分页处理
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex)
    
    return HttpResponse.json({
      success: true,
      data: {
        records: paginatedRecords,
        total: filteredRecords.length,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(filteredRecords.length / pageSize)
      },
      message: "Extract records retrieved successfully"
    })
  }),

  // 提取码记录删除
  http.delete('*/api/extract-code/records/delete', async ({ request }) => {
    const body = await request.json() as { recordId: string }
    
    if (!body.recordId) {
      return HttpResponse.json({
        success: false,
        message: "记录ID不能为空"
      }, { status: 400 })
    }

    return HttpResponse.json({
      success: true,
      message: "Record deleted successfully"
    })
  }),

  // 提取历史删除
  http.delete('*/api/extract-code/history', async ({ request }) => {
    const body = await request.json() as { extractCode: string }
    
    if (!body.extractCode) {
      return HttpResponse.json({
        success: false,
        message: "提取码不能为空"
      }, { status: 400 })
    }

    // 从mock数据中删除对应的记录
    const index = mockExtractHistories.findIndex(h => h.extractCode === body.extractCode)
    if (index === -1) {
      return HttpResponse.json({
        success: false,
        message: "未找到对应的历史记录"
      }, { status: 404 })
    }

    // 删除记录
    mockExtractHistories.splice(index, 1)

    return HttpResponse.json({
      success: true,
      message: "Extract history deleted successfully"
    })
  }),

  // 充值回调接口
  http.post('*/api/recharge/callback', async ({ request }) => {
    const body = await request.json() as { 
      paymentId: string; 
      paymentStatus: string; 
      transactionHash: string;
      usdtAmount: number; 
      walletAddress: string; 
      callbackTime: number;
    }
    
    console.log('[MSW] 充值回调请求:', body)
    
    // 模拟支付验证逻辑
    if (body.paymentStatus === 'confirm') {
      // 用户确认支付，模拟后端验证
      const isPaymentValid = Math.random() > 0.2 // 80%概率验证成功
      
      if (isPaymentValid) {
        // 更新用户M币余额
        const mCoinReward = 20 // 模拟充值获得的M币数量
        mockUsers[0].mCoins += mCoinReward
        
        return HttpResponse.json({
          success: true,
          data: {
            paymentId: body.paymentId,
            paymentStatus: "success",
            mCoinAmount: mCoinReward, // 本次充值获得的M币数量
            newBalance: mockUsers[0].mCoins, // 更新后的总余额
            transactionHash: body.transactionHash || "0x" + Math.random().toString(16).substr(2, 16), // 使用前端发送的交易哈希
            confirmTime: Math.floor(Date.now() / 1000) // 10位时间戳
          },
          message: "Payment verification successful"
        })
      } else {
        return HttpResponse.json({
          success: true,
          data: {
            paymentId: body.paymentId,
            paymentStatus: "failed",
            mCoinAmount: 0,
            newBalance: 500,
            transactionHash: "",
            confirmTime: Math.floor(Date.now() / 1000) // 10位时间戳
          },
          message: "Payment verification failed"
        })
      }
    } else if (body.paymentStatus === 'check') {
      // 检查支付状态
      return HttpResponse.json({
        success: true,
        data: {
          paymentId: body.paymentId,
          paymentStatus: "pending", // 模拟还在验证中
          mCoinAmount: 0,
          newBalance: 500
        },
        message: "Payment status query successful"
      })
    }
    
    // 默认处理
    return HttpResponse.json({
      success: true,
      data: {
        paymentId: body.paymentId,
        paymentStatus: body.paymentStatus,
        mCoinAmount: 0,
        newBalance: 500
      },
      message: "Recharge callback processed successfully"
    })
  }),

  // 获取随机奖励范围接口
  http.get('*/api/recharge/random-reward-range', () => {
    return HttpResponse.json({
      success: true,
      data: {
        minRandomReward: 10,
        maxRandomReward: 50,
      },
      message: "Random reward range retrieved successfully"
    })
  }),

  // 兑换码接口
  http.post('*/api/recharge/exchange-code', async ({ request }) => {
    const body = await request.json() as { exchangeCode: string }
    
    if (!body.exchangeCode) {
      return HttpResponse.json({
        success: false,
        message: "兑换码不能为空"
      }, { status: 400 })
    }

    // 模拟兑换码验证
    const validCodes = ['WELCOME2024', 'NEWUSER100', 'SPECIAL50']
    const isValidCode = validCodes.includes(body.exchangeCode.toUpperCase())
    
    if (!isValidCode) {
      return HttpResponse.json({
        success: false,
        message: "兑换码无效或已过期"
      }, { status: 400 })
    }

    // 基础奖励
    const baseReward = body.exchangeCode.toUpperCase() === 'WELCOME2024' ? 50 : 
                      body.exchangeCode.toUpperCase() === 'NEWUSER100' ? 100 : 50
    
    // 随机奖励 (10-50 M币)
    const randomBonus = Math.floor(Math.random() * 41) + 10 // 10-50之间的随机数
    
    // 总奖励 = 基础奖励 + 随机奖励
    const totalReward = baseReward + randomBonus
    
    // 更新用户M币余额
    mockUsers[0].mCoins += totalReward

    return HttpResponse.json({
      success: true,
      data: {
        exchangeCode: body.exchangeCode,
        baseReward: baseReward, // 基础奖励
        randomBonus: randomBonus, // 随机奖励
        mCoinsReward: totalReward, // 总奖励
        newBalance: mockUsers[0].mCoins, // 返回更新后的总余额
        message: `Successfully exchanged ${totalReward} M coins (Base ${baseReward} + Random reward ${randomBonus})`
      },
      message: "Exchange successful"
    })
  }),

  // 获取提取码信息接口
  http.get('*/api/cvv/get-extract-code', ({ request }) => {
    console.log('[MSW] 拦截 get-extract-code 请求')
    const url = new URL(request.url)
    const detectionId = url.searchParams.get('detectionId')
    
    if (!detectionId) {
      return HttpResponse.json({
        success: false,
        message: "检测ID不能为空"
      }, { status: 400 })
    }
    
    // 模拟提取码信息
    const extractCode = `EXT-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    const verificationCode = `V${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    const generatedTime = Math.floor(Date.now() / 1000) // 10位时间戳
    const validTime = Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000) // 24小时后过期（10位时间戳）
    
    return HttpResponse.json({
      success: true,
      data: {
        extractCode: extractCode,
        verificationCode: verificationCode,
        generatedTime: generatedTime,
        validTime: validTime,
        requirePayment: false,
        usdtAmount: 0,
        usdtWallet: "",
        isExtracted: false,
        extractedTime: null,
        extractedUsdtAmount: 0,
        extractedUsdtWallet: "",
        detectionId: detectionId
      },
      message: "Extract code information retrieved successfully"
    })
  }),

  // 生成提取码接口
  http.post('*/api/cvv/generate-extract-code', async ({ request }) => {
    console.log('[MSW] 拦截 generate-extract-code 请求')
    const body = await request.json() as { 
      localDetectionUuid: string; 
      validTime: string; 
      requirePayment: boolean; 
      usdtAmount: number; 
      usdtWallet: string 
    }
    console.log('[MSW] generate-extract-code 请求体:', body)
    
    if (!body.localDetectionUuid) {
      return HttpResponse.json({
        success: false,
        message: "检测ID不能为空"
      }, { status: 400 })
    }

    // 模拟生成提取码
    const extractCode = `EXT-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    const verificationCode = `V${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    const validUntil = Math.floor((Date.now() + parseInt(body.validTime) * 60 * 60 * 1000) / 1000) // 10位时间戳

    return HttpResponse.json({
      success: true,
      data: {
        extractCode: extractCode,
        verificationCode: verificationCode,
        validUntil: validUntil,
        requirePayment: body.requirePayment,
        usdtAmount: body.usdtAmount,
        usdtWallet: body.usdtWallet,
        detectionId: body.localDetectionUuid
      },
      message: "Extract code generated successfully"
    })
  }),

  // 重置检测状态
  http.get('*/api/cvv-check/reset-detection-status', async ({ request }) => {
    console.log('[MSW] 拦截重置检测状态GET请求')
    
    return HttpResponse.json({
      success: true,
      data: {
        message: "Detection status has been reset",
        resetTime: Math.floor(Date.now() / 1000), // 10位时间戳
        userStatus: "not_detected"
      },
      message: "Reset successful"
    })
  })
]
