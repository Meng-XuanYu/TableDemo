<template>
  <div id="app" class="min-h-screen bg-slate-50">
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <!-- Header Card -->
      <div class="card mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-semibold text-slate-900 tracking-tight">
              {{ t('appTitle') }}
            </h1>
            <p class="mt-2 text-slate-600 font-light">
              {{ t('appSubtitle') }}
            </p>
          </div>
          
          <!-- Language Switcher -->
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-slate-600">{{ t('language') }}:</label>
            <CustomSelect
              v-model="currentLanguage"
              :options="languageOptions"
              class="min-w-[120px]"
              @update:modelValue="switchLanguage"
            />
          </div>
        </div>
      </div>
      
      <!-- Dynamic Table -->
      <DynamicTable />
    </main>
  </div>
</template>

<script>
import DynamicTable from './components/DynamicTable.vue'
import CustomSelect from './components/CustomSelect.vue'
import { useLanguage } from './composables/useLanguage.js'

export default {
  name: 'App',
  components: {
    DynamicTable,
    CustomSelect
  },
  setup() {
    const { currentLanguage, switchLanguage, t, initLanguage, languageOptions } = useLanguage()
    
    // 初始化语言
    initLanguage()
    
    return {
      currentLanguage,
      switchLanguage,
      t,
      languageOptions,
      
    }
  }
}
</script>
