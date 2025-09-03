<template>
  <div class="card">
    <!-- File Upload Section -->
    <div v-if="!tableData.length" class="mb-12 text-center">
      <div class="upload-area p-16">
        <div class="flex flex-col items-center space-y-6">
          <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-medium text-slate-900 mb-2">{{ t('uploadTitle') }}</h3>
            <p class="text-slate-500 mb-6">{{ t('uploadSubtitle') }}</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-4">
            <input 
              type="file" 
              @change="handleFileUpload" 
              accept=".xlsx,.xls" 
              class="hidden"
              ref="fileInput"
            />
            <button 
              @click="$refs.fileInput.click()" 
              class="btn btn-primary"
            >
              {{ t('chooseFile') }}
            </button>
            <button 
              @click="loadExcelData" 
              class="btn btn-secondary"
            >
              {{ t('loadExcelData') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Controls -->
    <div v-if="tableData.length" class="mb-8">
      <div class="bg-white border border-slate-200 rounded-xl p-6">
        <div class="grid grid-cols-1 xl:grid-cols-4 gap-6 items-end">
          <!-- ID Search -->
          <div class="xl:col-span-1">
            <label class="block text-sm font-medium text-slate-700 mb-2">{{ t('idSearch') }}</label>
            <input 
              v-model="searchId" 
              type="text" 
              :placeholder="t('idSearchPlaceholder')"
              class="input w-full"
            />
          </div>

          <!-- Numeric Filter -->
          <div class="xl:col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-2">{{ t('numericFilter') }}</label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <CustomSelect
                v-model="filterColumn"
                :options="columnOptions"
                :placeholder="t('selectColumn')"
                class="min-w-0"
              />
              <CustomSelect
                v-model="filterOperator"
                :options="operatorOptions"
                :placeholder="t('operator')"
                class="min-w-0"
              />
              <input 
                v-model.number="filterValue" 
                type="number" 
                step="any"
                :placeholder="t('valuePlaceholder')"
                class="input min-w-0"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="xl:col-span-1 flex flex-col sm:flex-row xl:flex-col gap-3">
            <button @click="clearFilters" class="btn btn-secondary whitespace-nowrap">
              {{ t('clearFilters') }}
            </button>
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-slate-700 whitespace-nowrap">{{ t('perPage') }}</label>
              <CustomSelect
                v-model="pageSize"
                :options="pageSizeOptions"
                class="min-w-[120px] flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div v-if="tableData.length" class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="table-header">
            <tr>
              <th 
                v-for="column in columns" 
                :key="column"
                @click="sortBy(column)"
                class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none"
              >
                <div class="flex items-center justify-between">
                  <span>{{ column }}</span>
                  <div class="flex flex-col space-y-0.5">
                    <svg 
                      v-if="sortColumn === column && sortDirection === 'asc'" 
                      class="w-3 h-3 text-slate-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/>
                    </svg>
                    <svg 
                      v-else-if="sortColumn === column && sortDirection === 'desc'" 
                      class="w-3 h-3 text-slate-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                    <div v-else class="w-3 h-3 flex items-center justify-center">
                      <svg class="w-2 h-2 text-slate-300" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="1"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(row, index) in paginatedData" 
              :key="index"
              class="table-row"
            >
              <td 
                v-for="column in columns" 
                :key="column"
                class="px-6 py-4 text-sm"
                :class="column === 'ID' ? 'font-medium text-slate-900' : 'font-mono text-slate-700'"
              >
                <span v-if="typeof row[column] === 'number'">
                  {{ formatNumber(row[column]) }}
                </span>
                <span v-else-if="row[column] === 'NA'" class="text-slate-400 font-normal">
                  N/A
                </span>
                <span v-else class="text-slate-900">
                  {{ row[column] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="tableData.length" class="mt-8 bg-white border border-slate-200 rounded-xl p-6">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-slate-600 font-medium">
          {{ paginationText }}
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="currentPage = 1"
            :disabled="currentPage === 1"
            class="btn btn-secondary btn-sm"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          >
            {{ t('first') }}
          </button>
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="btn btn-secondary btn-sm"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          >
            {{ t('previous') }}
          </button>
          <div class="flex items-center gap-1">
            <span class="text-sm text-slate-600">{{ t('page') }}</span>
            <span class="px-3 py-1 bg-slate-900 text-white text-sm font-medium rounded-lg">
              {{ currentPage }}
            </span>
            <span class="text-sm text-slate-600">{{ t('of') }} {{ totalPages }}</span>
          </div>
          <button 
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="btn btn-secondary btn-sm"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
          >
            {{ t('next') }}
          </button>
          <button 
            @click="currentPage = totalPages"
            :disabled="currentPage === totalPages"
            class="btn btn-secondary btn-sm"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
          >
            {{ t('last') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import CustomSelect from './CustomSelect.vue'
import { useLanguage } from '../composables/useLanguage.js'

export default {
  name: 'DynamicTable',
  components: {
    CustomSelect
  },
  setup() {
    const { t } = useLanguage()
    return { t }
  },
  data() {
    return {
      tableData: [],
      columns: [],
      currentPage: 1,
      pageSize: 10,
      sortColumn: '',
      sortDirection: 'asc',
      searchId: '',
      filterColumn: '',
      filterOperator: '',
      filterValue: null
    }
  },
  computed: {
    numericColumns() {
      if (!this.tableData.length) return []
      
      const firstRow = this.tableData[0]
      return this.columns.filter(col => {
        const value = firstRow[col]
        return !isNaN(value) && value !== null && value !== ''
      })
    },
    
    columnOptions() {
      return [
        { value: '', label: this.t('selectColumn') },
        ...this.numericColumns.map(col => ({ value: col, label: col }))
      ]
    },
    
    operatorOptions() {
      return [
        { value: '', label: this.t('operator') },
        { value: '>', label: this.t('greaterThan') },
        { value: '<', label: this.t('lessThan') },
        { value: '>=', label: this.t('greaterEqual') },
        { value: '<=', label: this.t('lessEqual') },
        { value: '=', label: this.t('equalTo') }
      ]
    },
    
    pageSizeOptions() {
      return [
        { value: 10, label: this.t('perPageOptions.10') },
        { value: 20, label: this.t('perPageOptions.20') },
        { value: 50, label: this.t('perPageOptions.50') }
      ]
    },
    
    paginationText() {
      const start = (this.currentPage - 1) * this.pageSize + 1
      const end = Math.min(this.currentPage * this.pageSize, this.filteredData.length)
      const total = this.filteredData.length
      
      return `${this.t('showing')} ${start} ${this.t('to')} ${end} ${this.t('of')} ${total} ${this.t('entries')}`
    },
    
    filteredData() {
      let data = [...this.tableData]
      
      // ID搜索
      if (this.searchId.trim()) {
        data = data.filter(row => {
          const id = String(row.ID || row.id || '').toLowerCase()
          return id.includes(this.searchId.toLowerCase())
        })
      }
      
      // 数值过滤
      if (this.filterColumn && this.filterOperator && this.filterValue !== null) {
        data = data.filter(row => {
          const value = Number(row[this.filterColumn])
          const filterVal = Number(this.filterValue)
          
          if (isNaN(value) || isNaN(filterVal)) return true
          
          switch (this.filterOperator) {
            case '>': return value > filterVal
            case '<': return value < filterVal
            case '>=': return value >= filterVal
            case '<=': return value <= filterVal
            case '=': return value === filterVal
            default: return true
          }
        })
      }
      
      // 排序
      if (this.sortColumn) {
        data.sort((a, b) => {
          let aVal = a[this.sortColumn]
          let bVal = b[this.sortColumn]
          
          // 处理数字类型
          const aNum = Number(aVal)
          const bNum = Number(bVal)
          if (!isNaN(aNum) && !isNaN(bNum)) {
            aVal = aNum
            bVal = bNum
          } else {
            aVal = String(aVal || '').toLowerCase()
            bVal = String(bVal || '').toLowerCase()
          }
          
          if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1
          if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1
          return 0
        })
      }
      
      return data
    },
    
    totalPages() {
      return Math.ceil(this.filteredData.length / this.pageSize)
    },
    
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredData.slice(start, end)
    }
  },
  watch: {
    pageSize() {
      this.currentPage = 1
    },
    filteredData() {
      if (this.currentPage > this.totalPages) {
        this.currentPage = Math.max(1, this.totalPages)
      }
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          
          if (jsonData.length > 0) {
            this.tableData = jsonData
            this.columns = Object.keys(jsonData[0])
            this.currentPage = 1
          }
        } catch (error) {
          alert(this.t('parseError'))
          console.error('Excel parsing error:', error)
        }
      }
      reader.readAsArrayBuffer(file)
    },
    
    loadExcelData() {
      // 使用真实的Excel数据
      const excelData = [
        {
          "ID": "FBgn0000003",
          "baseMean": 0,
          "log2FoldChange": "NA",
          "lfcSE": "NA",
          "stat": "NA",
          "pvalue": "NA",
          "padj": "NA"
        },
        {
          "ID": "FBgn0000008",
          "baseMean": 762.300732344264,
          "log2FoldChange": -3.70002468822981,
          "lfcSE": 0.609792653864519,
          "stat": -6.0676767172926,
          "pvalue": 1.29773792219001e-9,
          "padj": 3.28161665180423e-8
        },
        {
          "ID": "FBgn0000014",
          "baseMean": 9.48534582035717,
          "log2FoldChange": -0.0595753687634876,
          "lfcSE": 0.872691027178831,
          "stat": -0.068266278566056,
          "pvalue": "NA",
          "padj": "NA"
        },
        {
          "ID": "FBgn0000015",
          "baseMean": 6.99107846152664,
          "log2FoldChange": -1.85480100659913,
          "lfcSE": 0.891258402704284,
          "stat": -2.08110352841694,
          "pvalue": 0.0374244309645814,
          "padj": 0.134992779848034
        },
        {
          "ID": "FBgn0000017",
          "baseMean": 28132.3689573327,
          "log2FoldChange": -0.38513302548658,
          "lfcSE": 0.347096919505331,
          "stat": -1.10958353083472,
          "pvalue": 0.267178531329499,
          "padj": 0.498003093904195
        }
      ];
      
      // 加载完整数据
      fetch('/excel-data.json')
        .then(response => response.json())
        .then(data => {
          this.tableData = data
          this.columns = Object.keys(data[0])
          this.currentPage = 1
        })
        .catch(error => {
          console.error(this.t('loadError') + ':', error)
          // 使用示例数据作为后备
          this.tableData = excelData
          this.columns = Object.keys(excelData[0])
          this.currentPage = 1
        })
    },
    
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortColumn = column
        this.sortDirection = 'asc'
      }
    },
    
    clearFilters() {
      this.searchId = ''
      this.filterColumn = ''
      this.filterOperator = ''
      this.filterValue = null
      this.currentPage = 1
    },
    
    formatNumber(value) {
      if (typeof value !== 'number' || isNaN(value)) return 'N/A'
      
      // 科学记数法格式
      if (Math.abs(value) < 0.0001 && value !== 0) {
        return value.toExponential(3)
      }
      
      // 普通数字格式
      if (Math.abs(value) < 1000) {
        return value.toFixed(3)
      }
      
      // 大数字格式
      return value.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })
    }
  }
}
</script>
