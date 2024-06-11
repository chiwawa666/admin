import defaultSettings from '@/settings'

const title = defaultSettings.title || '智慧殡葬数字监管平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
