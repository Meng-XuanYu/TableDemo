import { ref, computed } from 'vue'

// 语言状态
const currentLanguage = ref('en') // 默认英文

// 翻译字典
const translations = {
  en: {
    // Header
    appTitle: 'Dynamic Table',
    appSubtitle: 'Excel Data Visualization · Pagination · Sorting · Filtering · Search',
    
    // Upload Section
    uploadTitle: 'Upload Excel File',
    uploadSubtitle: 'Drop your front-end-dynamic-table.xlsx file here or click to browse',
    chooseFile: 'Choose File',
    loadExcelData: 'Load Excel Data',
    
    // Table Controls
    idSearch: 'ID Search',
    idSearchPlaceholder: 'Enter ID to search...',
    numericFilter: 'Numeric Filter',
    selectColumn: 'Select column',
    operator: 'Operator',
    greaterThan: 'Greater than (>)',
    lessThan: 'Less than (<)',
    greaterEqual: 'Greater equal (>=)',
    lessEqual: 'Less equal (<=)',
    equalTo: 'Equal to (=)',
    valuePlaceholder: 'Value',
    clearFilters: 'Clear Filters',
    perPage: 'Per page:',
    perPageOptions: {
      10: '10 per page',
      20: '20 per page',
      50: '50 per page'
    },
    
    // Pagination
    showing: 'Showing',
    to: 'to',
    of: 'of',
    entries: 'entries',
    page: 'Page',
    first: 'First',
    previous: 'Previous',
    next: 'Next',
    last: 'Last',
    
    // Messages
    noData: 'No data available. Please upload an Excel file.',
    parseError: 'Failed to parse file. Please ensure you upload a valid Excel file.',
    loadError: 'Error loading Excel data',
    
    // Language
    language: 'Language',
    english: 'English',
    chinese: '中文'
  },
  zh: {
    // Header
    appTitle: '动态表格',
    appSubtitle: 'Excel数据可视化 · 分页 · 排序 · 过滤 · 搜索',
    
    // Upload Section
    uploadTitle: '上传Excel文件',
    uploadSubtitle: '将 front-end-dynamic-table.xlsx 文件拖放到此处或点击浏览',
    chooseFile: '选择文件',
    loadExcelData: '加载Excel数据',
    
    // Table Controls
    idSearch: 'ID搜索',
    idSearchPlaceholder: '输入ID进行搜索...',
    numericFilter: '数值过滤',
    selectColumn: '选择列',
    operator: '操作符',
    greaterThan: '大于 (>)',
    lessThan: '小于 (<)',
    greaterEqual: '大于等于 (>=)',
    lessEqual: '小于等于 (<=)',
    equalTo: '等于 (=)',
    valuePlaceholder: '数值',
    clearFilters: '清除过滤',
    perPage: '每页显示:',
    perPageOptions: {
      10: '每页10条',
      20: '每页20条',
      50: '每页50条'
    },
    
    // Pagination
    showing: '显示第',
    to: '-',
    of: '条，共',
    entries: '条记录',
    page: '第',
    first: '首页',
    previous: '上一页',
    next: '下一页',
    last: '末页',
    
    // Messages
    noData: '暂无数据，请上传Excel文件。',
    parseError: '文件解析失败，请确保上传的是有效的Excel文件。',
    loadError: '加载Excel数据失败',
    
    // Language
    language: '语言',
    english: 'English',
    chinese: '中文'
  }
}

export function useLanguage() {
  // 切换语言
  const switchLanguage = (lang) => {
    currentLanguage.value = lang
    // 保存到本地存储
    localStorage.setItem('language', lang)
  }
  
  // 获取翻译文本
  const t = (key) => {
    const keys = key.split('.')
    let result = translations[currentLanguage.value]
    
    for (const k of keys) {
      result = result?.[k]
    }
    
    return result || key
  }
  
  // 初始化语言（从本地存储读取）
  const initLanguage = () => {
    const saved = localStorage.getItem('language')
    if (saved && ['en', 'zh'].includes(saved)) {
      currentLanguage.value = saved
    }
  }
  
  // 语言选项
  const languageOptions = computed(() => [
    { value: 'en', label: t('english') },
    { value: 'zh', label: t('chinese') }
  ])
  
  return {
    currentLanguage,
    switchLanguage,
    t,
    initLanguage,
    languageOptions
  }
}
