import QRCode from 'qrcode';

export interface USDTQRCodeOptions {
  address: string;
  amount: string;
  token?: string;
  chain?: 'ERC20' | 'TRC20' | 'BEP20';
}

export class USDTQRCodeGenerator {
  /**
   * 生成USDT支付URI
   * @param options 支付选项
   * @returns USDT支付URI字符串
   */
  static generatePaymentURI(options: USDTQRCodeOptions): string {
    const { address, amount, token = 'USDT', chain = 'TRC20' } = options;
    
    // 根据不同的链类型生成不同的URI格式
    if (chain === 'TRC20') {
      // TRC20格式: trc20:地址?amount=金额&token=USDT
      return `trc20:${address}?amount=${amount}&token=${token}`;
    } else if (chain === 'ERC20') {
      // ERC20格式: ethereum:地址@1/transfer?address=地址&uint256=金额
      return `ethereum:${address}@1/transfer?address=${address}&uint256=${amount}`;
    } else if (chain === 'BEP20') {
      // BEP20格式: bsc:地址@56/transfer?address=地址&uint256=金额
      return `bsc:${address}@56/transfer?address=${address}&uint256=${amount}`;
    }
    
    // 默认使用通用格式
    return `usdt:${address}?amount=${amount}&token=${token}&chain=${chain}`;
  }

  /**
   * 生成二维码数据URL
   * @param options 支付选项
   * @returns Promise<string> 返回base64格式的二维码图片URL
   */
  static async generateQRCodeDataURL(options: USDTQRCodeOptions): Promise<string> {
    const paymentURI = this.generatePaymentURI(options);
    
    try {
      return await QRCode.toDataURL(paymentURI, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
    } catch (error) {
      console.error('生成二维码失败:', error);
      throw new Error('生成二维码失败');
    }
  }

  /**
   * 生成二维码SVG字符串
   * @param options 支付选项
   * @returns Promise<string> 返回SVG格式的二维码字符串
   */
  static async generateQRCodeSVG(options: USDTQRCodeOptions): Promise<string> {
    const paymentURI = this.generatePaymentURI(options);
    
    try {
      return await QRCode.toString(paymentURI, {
        type: 'svg',
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
    } catch (error) {
      console.error('生成二维码SVG失败:', error);
      throw new Error('生成二维码SVG失败');
    }
  }

  /**
   * 生成二维码Canvas元素
   * @param options 支付选项
   * @param canvas Canvas元素
   * @returns Promise<void>
   */
  static async generateQRCodeCanvas(options: USDTQRCodeOptions, canvas: HTMLCanvasElement): Promise<void> {
    const paymentURI = this.generatePaymentURI(options);
    
    try {
      await QRCode.toCanvas(canvas, paymentURI, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
    } catch (error) {
      console.error('生成二维码Canvas失败:', error);
      throw new Error('生成二维码Canvas失败');
    }
  }
}

/**
 * 生成USDT支付二维码的便捷函数
 * @param address 钱包地址
 * @param amount 支付金额
 * @param chain 链类型，默认为TRC20
 * @returns Promise<string> 返回base64格式的二维码图片URL
 */
export async function generateUSDTQRCode(
  address: string, 
  amount: string, 
  chain: 'ERC20' | 'TRC20' | 'BEP20' = 'TRC20'
): Promise<string> {
  return USDTQRCodeGenerator.generateQRCodeDataURL({
    address,
    amount,
    chain
  });
}
