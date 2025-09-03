<template>
  <div class="custom-select-wrapper" ref="selectWrapper">
    <div 
      class="custom-select"
      :class="{ 'is-open': isOpen, 'is-focused': isFocused }"
      @click="toggleDropdown"
      @blur="handleBlur"
      tabindex="0"
    >
      <span class="select-value">{{ displayValue }}</span>
      <div class="select-arrow" :class="{ 'is-rotated': isOpen }">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 6l4 4 4-4H4z"/>
        </svg>
      </div>
    </div>
    
    <transition name="dropdown">
      <div 
        v-if="isOpen" 
        class="dropdown-menu"
        :style="dropdownStyle"
      >
        <div class="dropdown-content">
          <div 
            v-for="(option, index) in options"
            :key="index"
            class="dropdown-item"
            :class="{ 'is-selected': option.value === modelValue, 'is-highlighted': highlightedIndex === index }"
            @click="selectOption(option)"
            @mouseenter="highlightedIndex = index"
          >
            <span>{{ option.label }}</span>
            <svg 
              v-if="option.value === modelValue" 
              class="check-icon" 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="currentColor"
            >
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'CustomSelect',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: 'Select an option'
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isOpen: false,
      isFocused: false,
      highlightedIndex: -1,
      dropdownStyle: {}
    }
  },
  computed: {
    displayValue() {
      if (this.modelValue) {
        const selectedOption = this.options.find(option => option.value === this.modelValue)
        return selectedOption ? selectedOption.label : this.modelValue
      }
      return this.placeholder
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick)
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
    document.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
      this.isFocused = true
      
      if (this.isOpen) {
        this.$nextTick(() => {
          this.calculateDropdownPosition()
          this.highlightSelectedOption()
        })
      }
    },
    
    selectOption(option) {
      this.$emit('update:modelValue', option.value)
      this.isOpen = false
      this.isFocused = false
      this.highlightedIndex = -1
    },
    
    handleBlur() {
      // 延迟执行，让点击事件先触发
      setTimeout(() => {
        this.isFocused = false
      }, 150)
    },
    
    handleOutsideClick(event) {
      if (!this.$refs.selectWrapper.contains(event.target)) {
        this.isOpen = false
        this.isFocused = false
      }
    },
    
    handleKeydown(event) {
      if (!this.isOpen) return
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          this.highlightNext()
          break
        case 'ArrowUp':
          event.preventDefault()
          this.highlightPrevious()
          break
        case 'Enter':
          event.preventDefault()
          if (this.highlightedIndex >= 0) {
            this.selectOption(this.options[this.highlightedIndex])
          }
          break
        case 'Escape':
          this.isOpen = false
          this.isFocused = false
          break
      }
    },
    
    highlightNext() {
      if (this.highlightedIndex < this.options.length - 1) {
        this.highlightedIndex++
      } else {
        this.highlightedIndex = 0
      }
    },
    
    highlightPrevious() {
      if (this.highlightedIndex > 0) {
        this.highlightedIndex--
      } else {
        this.highlightedIndex = this.options.length - 1
      }
    },
    
    highlightSelectedOption() {
      const selectedIndex = this.options.findIndex(option => option.value === this.modelValue)
      if (selectedIndex >= 0) {
        this.highlightedIndex = selectedIndex
      }
    },
    
    calculateDropdownPosition() {
      const rect = this.$refs.selectWrapper.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const dropdownHeight = Math.min(300, this.options.length * 44 + 16)
      
      // 检查是否有足够空间向下显示
      const spaceBelow = windowHeight - rect.bottom
      const spaceAbove = rect.top
      
      if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
        // 向下显示
        this.dropdownStyle = {
          top: '100%',
          bottom: 'auto',
          marginTop: '4px'
        }
      } else {
        // 向上显示
        this.dropdownStyle = {
          top: 'auto',
          bottom: '100%',
          marginBottom: '4px'
        }
      }
    }
  }
}
</script>

<style scoped>
.custom-select-wrapper {
  @apply relative;
}

.custom-select {
  @apply px-4 py-2.5 border-2 border-slate-300 rounded-lg bg-gradient-to-b from-white to-slate-50 cursor-pointer font-medium text-slate-700 transition-all duration-200 flex items-center justify-between min-h-[44px];
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.custom-select:hover {
  @apply border-slate-400 bg-gradient-to-b from-slate-50 to-slate-100;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.custom-select.is-focused,
.custom-select.is-open {
  @apply ring-2 ring-blue-500 border-blue-500 bg-white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-value {
  @apply flex-1 text-left truncate;
}

.select-arrow {
  @apply ml-2 text-slate-500 transition-transform duration-200 flex-shrink-0;
}

.select-arrow.is-rotated {
  @apply rotate-180 text-blue-600;
}

.dropdown-menu {
  @apply absolute left-0 right-0 z-50;
}

.dropdown-content {
  @apply bg-white border-2 border-slate-200 rounded-lg shadow-xl max-h-[300px] overflow-y-auto py-2;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dropdown-item {
  @apply px-4 py-3 cursor-pointer transition-all duration-150 flex items-center justify-between text-slate-700;
}

.dropdown-item:hover,
.dropdown-item.is-highlighted {
  @apply bg-blue-50 text-blue-700;
}

.dropdown-item.is-selected {
  @apply bg-blue-100 text-blue-800 font-medium;
}

.check-icon {
  @apply text-blue-600 ml-2 flex-shrink-0;
}

/* 下拉动画 */
.dropdown-enter-active {
  transition: all 0.2s ease;
}

.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

/* 滚动条样式 */
.dropdown-content::-webkit-scrollbar {
  width: 6px;
}

.dropdown-content::-webkit-scrollbar-track {
  @apply bg-slate-100 rounded;
}

.dropdown-content::-webkit-scrollbar-thumb {
  @apply bg-slate-300 rounded hover:bg-slate-400;
}
</style>
