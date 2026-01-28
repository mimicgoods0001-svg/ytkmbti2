/**
 * 应用商店链接和智能跳转
 */

export const APP_STORE_LINKS = {
  ios: 'https://apps.apple.com/app/id6741682429',
  android: 'https://play.google.com/store/apps/details?id=com.ola.yoitoki&pcampaignid',
  web: 'https://yoitoki.jp/ja',
}

/**
 * 检测设备类型
 */
export function detectDevice(): 'ios' | 'android' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'

  const userAgent = window.navigator.userAgent.toLowerCase()

  // iOS检测
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios'
  }

  // Android检测
  if (/android/.test(userAgent)) {
    return 'android'
  }

  return 'desktop'
}

/**
 * 获取下载链接（根据设备类型）
 */
export function getDownloadLink(): string {
  const device = detectDevice()

  switch (device) {
    case 'ios':
      return APP_STORE_LINKS.ios
    case 'android':
      return APP_STORE_LINKS.android
    default:
      return APP_STORE_LINKS.web
  }
}
