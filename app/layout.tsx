import type { Metadata, Viewport } from 'next'
import './globals.css'
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper'
// 导入初始化工具（在开发环境中可用）
import '@/utils/initializeStatistics'

export const metadata: Metadata = {
  title: 'MBTIテスト - あなたの魂の色彩を探しましょう',
  description: '3分で終わる、ぞっとするほどの正確さのMBTI性格テスト。あなたの魂の色彩を探しましょう。',
  openGraph: {
    title: 'MBTIテスト - あなたの魂の色彩を探しましょう',
    description: '3分で終わる、ぞっとするほどの正確さのMBTI性格テスト。',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MBTIテスト - あなたの魂の色彩を探しましょう',
    description: '3分で終わる、ぞっとするほどの正確さのMBTI性格テスト。',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var isNightTime = (function() {
                    var now = new Date();
                    var jstTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
                    var hour = jstTime.getHours();
                    return hour >= 21 || hour < 5;
                  })();
                  
                  if (theme === 'dark' || (!theme && isNightTime)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </body>
    </html>
  )
}
