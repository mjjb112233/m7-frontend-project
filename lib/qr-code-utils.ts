import QRCode from 'qrcode';

/**
 * 从URL生成二维码的便捷函数
 * @param url 要生成二维码的URL
 * @returns Promise<string> 返回base64格式的二维码图片URL
 */
export async function generateQRCodeFromURL(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
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
 * @param url 要生成二维码的URL
 * @returns Promise<string> 返回SVG格式的二维码字符串
 */
export async function generateQRCodeSVG(url: string): Promise<string> {
  try {
    return await QRCode.toString(url, {
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
 * @param url 要生成二维码的URL
 * @param canvas Canvas元素
 * @returns Promise<void>
 */
export async function generateQRCodeCanvas(url: string, canvas: HTMLCanvasElement): Promise<void> {
  try {
    await QRCode.toCanvas(canvas, url, {
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