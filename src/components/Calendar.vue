<script lang="ts">
// @ts-ignore
import getDayValueCategory from '@/data/getDayValueCategory.js'

interface DateInfo {
  date: number
  month: number
  year: number
  isCurrentMonth: boolean
}

type PriceLevel = 'cheap' | 'normal' | 'expensive'
type FlexibilityOption = 'exact' | 'day-after' | 'day-before' | '1-day' | '2-days' | '3-days'

export default {
  name: 'Calendar',
  data() {
    return {
      checkIn: null as Date | null,
      checkOut: null as Date | null,
      checkInFlexibility: 'exact' as FlexibilityOption,
      checkOutFlexibility: 'exact' as FlexibilityOption,
      showCheckInFlexMenu: false,
      showCheckOutFlexMenu: false,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      isOpen: false,
      focusedDate: null as Date | null,
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      dayNames: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      flexibilityOptions: [
        { value: 'exact', label: 'Exact date' },
        { value: 'day-after', label: '+ day after' },
        { value: 'day-before', label: '+ day before' },
        { value: '1-day', label: '± 1 day' },
        { value: '2-days', label: '± 2 days' },
        { value: '3-days', label: '± 3 days' }
      ]
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('click', this.handleOutsideClick)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('click', this.handleOutsideClick)
    // Restore body scroll if component unmounts while modal is open
    document.body.style.overflow = ''
  },
  computed: {
    today(): Date {
      const now = new Date()
      return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    },
    canNavigateToPreviousMonth(): boolean {
      const currentViewDate = new Date(this.currentYear, this.currentMonth, 1)
      const todayFirstOfMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1)
      return currentViewDate > todayFirstOfMonth
    },
    leftMonthName(): string {
      return `${this.monthNames[this.currentMonth]} ${this.currentYear}`
    },
    rightMonthName(): string {
      const nextMonth = this.currentMonth + 1
      if (nextMonth > 11) {
        return `${this.monthNames[0]} ${this.currentYear + 1}`
      }
      return `${this.monthNames[nextMonth]} ${this.currentYear}`
    },
    leftMonthDays(): DateInfo[] {
      return this.getDaysInMonth(this.currentMonth, this.currentYear)
    },
    rightMonthDays(): DateInfo[] {
      const nextMonth = this.currentMonth + 1
      if (nextMonth > 11) {
        return this.getDaysInMonth(0, this.currentYear + 1)
      }
      return this.getDaysInMonth(nextMonth, this.currentYear)
    },
    checkInFormatted(): string {
      if (!this.checkIn) return ''
      return this.formatDateShort(this.checkIn)
    },
    checkOutFormatted(): string {
      if (!this.checkOut) return ''
      return this.formatDateShort(this.checkOut)
    },
    checkInFlexibilityLabel(): string {
      const option = this.flexibilityOptions.find(opt => opt.value === this.checkInFlexibility)
      return option ? option.label : 'Exact date'
    },
    checkOutFlexibilityLabel(): string {
      const option = this.flexibilityOptions.find(opt => opt.value === this.checkOutFlexibility)
      return option ? option.label : 'Exact date'
    },
    availableCheckInFlexibilityOptions() {
      if (!this.checkIn || !this.checkOut) {
        return this.flexibilityOptions
      }

      const daysBetween = Math.floor((this.checkOut.getTime() - this.checkIn.getTime()) / (1000 * 60 * 60 * 24))

      return this.flexibilityOptions.filter(option => {
        switch (option.value) {
          case 'exact':
            return true
          case 'day-after':
            // Need at least 2 days between (checkIn + 1 day must not reach checkOut)
            return daysBetween >= 2
          case 'day-before':
            // day-before only goes backward, always safe for checkIn
            return true
          case '1-day':
            // Need at least 2 days (checkIn + 1 must not reach checkOut)
            return daysBetween >= 2
          case '2-days':
            // Need at least 3 days (checkIn + 2 must not reach checkOut)
            return daysBetween >= 3
          case '3-days':
            // Need at least 4 days (checkIn + 3 must not reach checkOut)
            return daysBetween >= 4
          default:
            return true
        }
      })
    },
    availableCheckOutFlexibilityOptions() {
      if (!this.checkIn || !this.checkOut) {
        return this.flexibilityOptions
      }

      const daysBetween = Math.floor((this.checkOut.getTime() - this.checkIn.getTime()) / (1000 * 60 * 60 * 24))

      return this.flexibilityOptions.filter(option => {
        switch (option.value) {
          case 'exact':
            return true
          case 'day-after':
            // day-after only goes forward, always safe for checkOut
            return true
          case 'day-before':
            // Need at least 2 days between (checkOut - 1 day must not reach checkIn)
            return daysBetween >= 2
          case '1-day':
            // Need at least 2 days (checkOut - 1 must not reach checkIn)
            return daysBetween >= 2
          case '2-days':
            // Need at least 3 days (checkOut - 2 must not reach checkIn)
            return daysBetween >= 3
          case '3-days':
            // Need at least 4 days (checkOut - 3 must not reach checkIn)
            return daysBetween >= 4
          default:
            return true
        }
      })
    }
  },
  methods: {
    getDaysInMonth(month: number, year: number): DateInfo[] {
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const daysInMonth = lastDay.getDate()
      const startingDayOfWeek = firstDay.getDay()

      const days: DateInfo[] = []

      // Add empty cells for days before the first of the month
      for (let i = 0; i < startingDayOfWeek; i++) {
        const prevMonthLastDay = new Date(year, month, 0).getDate()
        days.push({
          date: prevMonthLastDay - startingDayOfWeek + i + 1,
          month: month - 1,
          year: month === 0 ? year - 1 : year,
          isCurrentMonth: false
        })
      }

      // Add days of current month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push({
          date: day,
          month: month,
          year: year,
          isCurrentMonth: true
        })
      }

      // Add days from next month to complete the grid
      const remainingCells = 42 - days.length // 6 rows * 7 days
      for (let day = 1; day <= remainingCells; day++) {
        days.push({
          date: day,
          month: month + 1,
          year: month === 11 ? year + 1 : year,
          isCurrentMonth: false
        })
      }

      return days
    },
    selectDate(dateInfo: DateInfo) {
      if (!dateInfo.isCurrentMonth) return

      const selectedDate = new Date(dateInfo.year, dateInfo.month, dateInfo.date)

      // Don't allow selecting past dates
      if (this.isPastDate(dateInfo)) return

      // If no check-in or both dates are set, start new selection
      if (!this.checkIn || (this.checkIn && this.checkOut)) {
        this.checkIn = selectedDate
        this.checkOut = null

        // If the selected start date is today, set flexibility to exact
        if (this.isSameDate(selectedDate, this.today)) {
          this.checkInFlexibility = 'exact'
        }
      } else {
        // If check-in is set but not check-out
        if (selectedDate < this.checkIn) {
          // If selected date is before check-in, make it the new check-in
          this.checkOut = this.checkIn
          this.checkIn = selectedDate

          // If the new start date is today, set flexibility to exact
          if (this.isSameDate(selectedDate, this.today)) {
            this.checkInFlexibility = 'exact'
          }
        } else {
          this.checkOut = selectedDate
        }

        // Validate and reset flexibility options if they're no longer valid
        this.validateFlexibilityOptions()

        // Emit the date range and close the dropdown
        this.$emit('date-range-selected', {
          checkIn: this.checkIn,
          checkOut: this.checkOut
        })
        this.isOpen = false
      }
    },
    validateFlexibilityOptions() {
      // Check if current checkIn flexibility is still valid
      const validCheckInOptions = this.availableCheckInFlexibilityOptions
      const checkInStillValid = validCheckInOptions.some(opt => opt.value === this.checkInFlexibility)
      if (!checkInStillValid) {
        this.checkInFlexibility = 'exact'
      }

      // Check if current checkOut flexibility is still valid
      const validCheckOutOptions = this.availableCheckOutFlexibilityOptions
      const checkOutStillValid = validCheckOutOptions.some(opt => opt.value === this.checkOutFlexibility)
      if (!checkOutStillValid) {
        this.checkOutFlexibility = 'exact'
      }
    },
    handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement
      // Check if click is outside flexibility selector
      if (!target.closest('.flexibility-selector')) {
        this.showCheckInFlexMenu = false
        this.showCheckOutFlexMenu = false
      }
    },
    openCalendar() {
      this.isOpen = true
      // Set initial focused date
      if (!this.focusedDate) {
        const initialDate = this.checkIn || new Date()
        // Ensure focused date is not in the past
        this.focusedDate = initialDate < this.today ? this.today : initialDate
      }
      // Prevent body scroll on mobile when modal is open
      if (window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden'
      }
    },
    closeCalendar() {
      this.isOpen = false
      // Restore body scroll
      document.body.style.overflow = ''
    },
    handleKeyDown(event: KeyboardEvent) {
      if (!this.isOpen) {
        // Open calendar on Enter or Space when focused on inputs
        if (event.key === 'Enter' || event.key === ' ') {
          const target = event.target as HTMLElement
          if (target.closest('.date-input')) {
            event.preventDefault()
            this.openCalendar()
          }
        }
        return
      }

      // Handle keyboard navigation when calendar is open
      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          this.closeCalendar()
          break
        case 'ArrowLeft':
          event.preventDefault()
          this.moveFocusedDate(-1)
          break
        case 'ArrowRight':
          event.preventDefault()
          this.moveFocusedDate(1)
          break
        case 'ArrowUp':
          event.preventDefault()
          this.moveFocusedDate(-7)
          break
        case 'ArrowDown':
          event.preventDefault()
          this.moveFocusedDate(7)
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (this.focusedDate) {
            this.selectDateByDate(this.focusedDate)
          }
          break
        case 'Tab':
          // Allow default tab behavior but keep calendar open
          break
      }
    },
    moveFocusedDate(days: number) {
      if (!this.focusedDate) {
        this.focusedDate = new Date()
      }
      const newDate = new Date(this.focusedDate)
      newDate.setDate(newDate.getDate() + days)

      // Don't allow focusing on past dates
      if (newDate < this.today) {
        return
      }

      this.focusedDate = newDate

      // Update current month view if focused date is in a different month
      if (newDate.getMonth() !== this.currentMonth || newDate.getFullYear() !== this.currentYear) {
        this.currentMonth = newDate.getMonth()
        this.currentYear = newDate.getFullYear()
      }
    },
    selectDateByDate(date: Date) {
      const dateInfo: DateInfo = {
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: true
      }
      this.selectDate(dateInfo)
    },
    isSelected(dateInfo: DateInfo): boolean {
      if (!dateInfo.isCurrentMonth) return false
      const date = new Date(dateInfo.year, dateInfo.month, dateInfo.date)
      return this.isSameDate(date, this.checkIn) || this.isSameDate(date, this.checkOut)
    },
    isFocused(dateInfo: DateInfo): boolean {
      if (!this.focusedDate || !dateInfo.isCurrentMonth) return false
      const date = new Date(dateInfo.year, dateInfo.month, dateInfo.date)
      return this.isSameDate(date, this.focusedDate)
    },
    isInRange(dateInfo: DateInfo): boolean {
      if (!this.checkIn || !this.checkOut || !dateInfo.isCurrentMonth) return false
      const date = new Date(dateInfo.year, dateInfo.month, dateInfo.date)
      return date > this.checkIn && date < this.checkOut
    },
    isInFlexibleRange(dateInfo: DateInfo): boolean {
      if (!dateInfo.isCurrentMonth) return false
      const date = new Date(dateInfo.year, dateInfo.month, dateInfo.date)

      // Check if date is in check-in flexible range
      if (this.checkIn && this.isDateInFlexibleRange(date, this.checkIn, this.checkInFlexibility)) {
        return true
      }

      // Check if date is in check-out flexible range
      if (this.checkOut && this.isDateInFlexibleRange(date, this.checkOut, this.checkOutFlexibility)) {
        return true
      }

      return false
    },
    isDateInFlexibleRange(date: Date, baseDate: Date, flexibility: FlexibilityOption): boolean {
      if (flexibility === 'exact') {
        return this.isSameDate(date, baseDate)
      }

      const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))

      switch (flexibility) {
        case 'day-after':
          return daysDiff === 0 || daysDiff === 1
        case 'day-before':
          return daysDiff === 0 || daysDiff === -1
        case '1-day':
          return Math.abs(daysDiff) <= 1
        case '2-days':
          return Math.abs(daysDiff) <= 2
        case '3-days':
          return Math.abs(daysDiff) <= 3
        default:
          return false
      }
    },
    getFlexibleRangePosition(dateInfo: DateInfo, type: 'checkIn' | 'checkOut'): string | null {
      if (!dateInfo.isCurrentMonth) return null

      const date = new Date(dateInfo.year, dateInfo.month, dateInfo.date)
      const baseDate = type === 'checkIn' ? this.checkIn : this.checkOut
      const flexibility = type === 'checkIn' ? this.checkInFlexibility : this.checkOutFlexibility

      if (!baseDate || !this.isDateInFlexibleRange(date, baseDate, flexibility)) {
        return null
      }

      if (flexibility === 'exact') return null

      const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))

      // Determine range bounds based on flexibility
      let minDiff = 0
      let maxDiff = 0

      switch (flexibility) {
        case 'day-after':
          minDiff = 0
          maxDiff = 1
          break
        case 'day-before':
          minDiff = -1
          maxDiff = 0
          break
        case '1-day':
          minDiff = -1
          maxDiff = 1
          break
        case '2-days':
          minDiff = -2
          maxDiff = 2
          break
        case '3-days':
          minDiff = -3
          maxDiff = 3
          break
      }

      // Determine position
      if (daysDiff === minDiff) return 'start'
      if (daysDiff === maxDiff) return 'end'
      return 'middle'
    },
    isSameDate(date1: Date | null, date2: Date | null): boolean {
      if (!date1 || !date2) return false
      return date1.getFullYear() === date2.getFullYear() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getDate() === date2.getDate()
    },
    isPastDate(dateInfo: DateInfo): boolean {
      const date = new Date(dateInfo.year, dateInfo.month, dateInfo.date)
      return date < this.today
    },
    formatDateShort(date: Date): string {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}`
    },
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11
        this.currentYear--
      } else {
        this.currentMonth--
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0
        this.currentYear++
      } else {
        this.currentMonth++
      }
    },
    reset() {
      this.checkIn = null
      this.checkOut = null
      this.checkInFlexibility = 'exact'
      this.checkOutFlexibility = 'exact'
      this.$emit('date-range-selected', {
        checkIn: null,
        checkOut: null,
        checkInFlexibility: 'exact',
        checkOutFlexibility: 'exact'
      })
    },
    done() {
      if (this.checkIn && this.checkOut) {
        this.$emit('date-range-selected', {
          checkIn: this.checkIn,
          checkOut: this.checkOut,
          checkInFlexibility: this.checkInFlexibility,
          checkOutFlexibility: this.checkOutFlexibility
        })
        this.isOpen = false
      }
    },
    toggleCheckInFlexMenu() {
      if (!this.checkIn) return
      this.showCheckInFlexMenu = !this.showCheckInFlexMenu
      this.showCheckOutFlexMenu = false
    },
    toggleCheckOutFlexMenu() {
      if (!this.checkOut) return
      this.showCheckOutFlexMenu = !this.showCheckOutFlexMenu
      this.showCheckInFlexMenu = false
    },
    selectCheckInFlexibility(option: FlexibilityOption) {
      this.checkInFlexibility = option
      this.showCheckInFlexMenu = false
    },
    selectCheckOutFlexibility(option: FlexibilityOption) {
      this.checkOutFlexibility = option
      this.showCheckOutFlexMenu = false
    },
    getPriceLevel(dateInfo: DateInfo): PriceLevel {
      if (!dateInfo.isCurrentMonth) return 'cheap'

      const date = new Date(dateInfo.year, dateInfo.month, dateInfo.date)
      return getDayValueCategory(date)
    }
  }
}
</script>

<template>
  <div class="calendar">
    <div class="date-inputs">
      <div class="date-input" @click="openCalendar" tabindex="0">
        <div v-if="!checkIn" class="placeholder">Start date</div>
        <div v-if="checkIn" class="value">{{ checkInFormatted }}</div>
        <div v-if="checkIn" class="flexibility-selector">
          <button
            class="flex-button"
            @click.stop="toggleCheckInFlexMenu"
            tabindex="0"
          >
            {{ checkInFlexibilityLabel }} ▾
          </button>
          <div v-if="showCheckInFlexMenu" class="flex-menu">
            <div
              v-for="option in availableCheckInFlexibilityOptions"
              :key="option.value"
              class="flex-option"
              :class="{ active: checkInFlexibility === option.value }"
              @click="selectCheckInFlexibility(option.value as FlexibilityOption)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
      </div>
      <div class="date-input" @click="openCalendar" tabindex="0">
        <div v-if="!checkOut" class="placeholder">End date</div>
        <div v-if="checkOut" class="value">{{ checkOutFormatted }}</div>
        <div v-if="checkOut" class="flexibility-selector">
          <button
            class="flex-button"
            @click.stop="toggleCheckOutFlexMenu"
            tabindex="0"
          >
            {{ checkOutFlexibilityLabel }} ▾
          </button>
          <div v-if="showCheckOutFlexMenu" class="flex-menu">
            <div
              v-for="option in availableCheckOutFlexibilityOptions"
              :key="option.value"
              class="flex-option"
              :class="{ active: checkOutFlexibility === option.value }"
              @click="selectCheckOutFlexibility(option.value as FlexibilityOption)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop calendar grid -->
    <div v-if="isOpen" class="calendar-grid desktop-calendar">
      <div class="month-view">
        <div class="month-header">
          <button
            class="nav-btn"
            :disabled="!canNavigateToPreviousMonth"
            @click="previousMonth"
            tabindex="0"
            aria-label="Previous month"
          >&lt;</button>
          <div class="month-name">{{ leftMonthName }}</div>
          <div class="spacer"></div>
        </div>
        <div class="day-names">
          <div v-for="day in dayNames" :key="day" class="day-name">{{ day }}</div>
        </div>
        <div class="days">
          <div
            v-for="(dateInfo, index) in leftMonthDays"
            :key="index"
            class="day"
            :class="{
              'other-month': !dateInfo.isCurrentMonth,
              'past-date': isPastDate(dateInfo),
              'selected': isSelected(dateInfo),
              'focused': isFocused(dateInfo),
              'in-range': isInRange(dateInfo),
              'flexible-range': isInFlexibleRange(dateInfo) && !isSelected(dateInfo),
              'flex-start': getFlexibleRangePosition(dateInfo, 'checkIn') === 'start' || getFlexibleRangePosition(dateInfo, 'checkOut') === 'start',
              'flex-middle': getFlexibleRangePosition(dateInfo, 'checkIn') === 'middle' || getFlexibleRangePosition(dateInfo, 'checkOut') === 'middle',
              'flex-end': getFlexibleRangePosition(dateInfo, 'checkIn') === 'end' || getFlexibleRangePosition(dateInfo, 'checkOut') === 'end',
              'price-cheap': getPriceLevel(dateInfo) === 'cheap',
              'price-normal': getPriceLevel(dateInfo) === 'normal',
              'price-expensive': getPriceLevel(dateInfo) === 'expensive'
            }"
            @click="selectDate(dateInfo)"
          >
            {{ dateInfo.date }}
          </div>
        </div>
      </div>

      <div class="month-view">
        <div class="month-header">
          <div class="spacer"></div>
          <div class="month-name">{{ rightMonthName }}</div>
          <button class="nav-btn" @click="nextMonth" tabindex="0" aria-label="Next month">&gt;</button>
        </div>
        <div class="day-names">
          <div v-for="day in dayNames" :key="day" class="day-name">{{ day }}</div>
        </div>
        <div class="days">
          <div
            v-for="(dateInfo, index) in rightMonthDays"
            :key="index"
            class="day"
            :class="{
              'other-month': !dateInfo.isCurrentMonth,
              'past-date': isPastDate(dateInfo),
              'selected': isSelected(dateInfo),
              'focused': isFocused(dateInfo),
              'in-range': isInRange(dateInfo),
              'flexible-range': isInFlexibleRange(dateInfo) && !isSelected(dateInfo),
              'flex-start': getFlexibleRangePosition(dateInfo, 'checkIn') === 'start' || getFlexibleRangePosition(dateInfo, 'checkOut') === 'start',
              'flex-middle': getFlexibleRangePosition(dateInfo, 'checkIn') === 'middle' || getFlexibleRangePosition(dateInfo, 'checkOut') === 'middle',
              'flex-end': getFlexibleRangePosition(dateInfo, 'checkIn') === 'end' || getFlexibleRangePosition(dateInfo, 'checkOut') === 'end',
              'price-cheap': getPriceLevel(dateInfo) === 'cheap',
              'price-normal': getPriceLevel(dateInfo) === 'normal',
              'price-expensive': getPriceLevel(dateInfo) === 'expensive'
            }"
            @click="selectDate(dateInfo)"
          >
            {{ dateInfo.date }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="isOpen" class="actions desktop-actions">
      <button class="reset-btn" @click="reset" tabindex="0">Reset</button>
      <button class="done-btn" @click="done" tabindex="0">Done</button>
    </div>

    <!-- Modal overlay for mobile -->
    <div v-if="isOpen" class="calendar-modal-overlay" @click.self="closeCalendar">
      <div class="calendar-modal">
        <div class="modal-header">
          <h3 class="modal-title">Select dates</h3>
          <button class="close-btn" @click="closeCalendar" aria-label="Close calendar">×</button>
        </div>

        <div class="modal-date-inputs">
          <div class="modal-date-input">
            <label>Start date</label>
            <div class="date-display">
              <span v-if="checkIn">{{ checkInFormatted }}</span>
              <span v-else class="placeholder-text">Select start date</span>
            </div>
            <div v-if="checkIn" class="modal-flexibility">
              <button
                class="flex-button"
                @click.stop="toggleCheckInFlexMenu"
                tabindex="0"
              >
                {{ checkInFlexibilityLabel }} ▾
              </button>
              <div v-if="showCheckInFlexMenu" class="flex-menu">
                <div
                  v-for="option in availableCheckInFlexibilityOptions"
                  :key="option.value"
                  class="flex-option"
                  :class="{ active: checkInFlexibility === option.value }"
                  @click="selectCheckInFlexibility(option.value as FlexibilityOption)"
                >
                  {{ option.label }}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-date-input">
            <label>End date</label>
            <div class="date-display">
              <span v-if="checkOut">{{ checkOutFormatted }}</span>
              <span v-else class="placeholder-text">Select end date</span>
            </div>
            <div v-if="checkOut" class="modal-flexibility">
              <button
                class="flex-button"
                @click.stop="toggleCheckOutFlexMenu"
                tabindex="0"
              >
                {{ checkOutFlexibilityLabel }} ▾
              </button>
              <div v-if="showCheckOutFlexMenu" class="flex-menu">
                <div
                  v-for="option in availableCheckOutFlexibilityOptions"
                  :key="option.value"
                  class="flex-option"
                  :class="{ active: checkOutFlexibility === option.value }"
                  @click="selectCheckOutFlexibility(option.value as FlexibilityOption)"
                >
                  {{ option.label }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="calendar-grid">
          <div class="month-view">
            <div class="month-header">
              <button
                class="nav-btn"
                :disabled="!canNavigateToPreviousMonth"
                @click="previousMonth"
                tabindex="0"
                aria-label="Previous month"
              >&lt;</button>
              <div class="month-name">{{ leftMonthName }}</div>
              <div class="spacer"></div>
            </div>
            <div class="day-names">
              <div v-for="day in dayNames" :key="day" class="day-name">{{ day }}</div>
            </div>
            <div class="days">
              <div
                v-for="(dateInfo, index) in leftMonthDays"
                :key="index"
                class="day"
                :class="{
                  'other-month': !dateInfo.isCurrentMonth,
                  'past-date': isPastDate(dateInfo),
                  'selected': isSelected(dateInfo),
                  'focused': isFocused(dateInfo),
                  'in-range': isInRange(dateInfo),
                  'flexible-range': isInFlexibleRange(dateInfo) && !isSelected(dateInfo),
                  'flex-start': getFlexibleRangePosition(dateInfo, 'checkIn') === 'start' || getFlexibleRangePosition(dateInfo, 'checkOut') === 'start',
                  'flex-middle': getFlexibleRangePosition(dateInfo, 'checkIn') === 'middle' || getFlexibleRangePosition(dateInfo, 'checkOut') === 'middle',
                  'flex-end': getFlexibleRangePosition(dateInfo, 'checkIn') === 'end' || getFlexibleRangePosition(dateInfo, 'checkOut') === 'end',
                  'price-cheap': getPriceLevel(dateInfo) === 'cheap',
                  'price-normal': getPriceLevel(dateInfo) === 'normal',
                  'price-expensive': getPriceLevel(dateInfo) === 'expensive'
                }"
                @click="selectDate(dateInfo)"
              >
                {{ dateInfo.date }}
              </div>
            </div>
          </div>

          <div class="month-view">
            <div class="month-header">
              <div class="spacer"></div>
              <div class="month-name">{{ rightMonthName }}</div>
              <button class="nav-btn" @click="nextMonth" tabindex="0" aria-label="Next month">&gt;</button>
            </div>
            <div class="day-names">
              <div v-for="day in dayNames" :key="day" class="day-name">{{ day }}</div>
            </div>
            <div class="days">
              <div
                v-for="(dateInfo, index) in rightMonthDays"
                :key="index"
                class="day"
                :class="{
                  'other-month': !dateInfo.isCurrentMonth,
                  'past-date': isPastDate(dateInfo),
                  'selected': isSelected(dateInfo),
                  'focused': isFocused(dateInfo),
                  'in-range': isInRange(dateInfo),
                  'flexible-range': isInFlexibleRange(dateInfo) && !isSelected(dateInfo),
                  'flex-start': getFlexibleRangePosition(dateInfo, 'checkIn') === 'start' || getFlexibleRangePosition(dateInfo, 'checkOut') === 'start',
                  'flex-middle': getFlexibleRangePosition(dateInfo, 'checkIn') === 'middle' || getFlexibleRangePosition(dateInfo, 'checkOut') === 'middle',
                  'flex-end': getFlexibleRangePosition(dateInfo, 'checkIn') === 'end' || getFlexibleRangePosition(dateInfo, 'checkOut') === 'end',
                  'price-cheap': getPriceLevel(dateInfo) === 'cheap',
                  'price-normal': getPriceLevel(dateInfo) === 'normal',
                  'price-expensive': getPriceLevel(dateInfo) === 'expensive'
                }"
                @click="selectDate(dateInfo)"
              >
                {{ dateInfo.date }}
              </div>
            </div>
          </div>
        </div>

        <div class="actions">
          <button class="reset-btn" @click="reset" tabindex="0">Reset</button>
          <button class="done-btn" @click="done" tabindex="0">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  max-width: 640px;
}

.date-inputs {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  .date-input {
    flex: 1;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    padding: 8px 12px;
    display: flex;
    @media (max-width: $breakpoint-mobile) {
      display: block;
    }
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    cursor: pointer;
    transition: border-color 0.2s;
    outline: none;
    position: relative;

    &:hover {
      border-color: #2563eb;
    }

    &:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .placeholder {
      font-size: 15px;
      color: #999;
      flex: 1;
    }

    .value {
      font-size: 15px;
      font-weight: 500;
      color: #000;
      flex: 1;
    }
  }

  .flexibility-selector {
    position: relative;
    flex-shrink: 0;
  }

  .flex-button {
    padding: 4px 8px;
    background: transparent;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    font-size: 12px;
    color: #666;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;

    &:hover {
      background: #f5f5f5;
      border-color: #2563eb;
      color: #2563eb;
    }

    &:focus {
      outline: 2px solid #2563eb;
      outline-offset: 1px;
    }
  }

  .flex-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 4px;
    background: white;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 100;
    overflow: hidden;
    min-width: 140px;
  }

  .flex-option {
    padding: 10px 12px;
    font-size: 13px;
    color: #333;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;

    &:hover {
      background: #f5f5f5;
    }

    &.active {
      background: #e6f0ff;
      color: #2563eb;
      font-weight: 500;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #f0f0f0;
    }
  }
}

.calendar-grid {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.month-view {
  flex: 1;
}

.month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  height: 32px;

  .month-name {
    font-size: 16px;
    font-weight: 600;
    color: #000;
  }

  .nav-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
    color: #333;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #f5f5f5;
    }

    &:focus:not(:disabled) {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
    }

    &:disabled {
      color: #d0d0d0;
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .spacer {
    width: 32px;
  }
}

.day-names {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;

  .day-name {
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #666;
    padding: 4px;
  }
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;

  .day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 4px;
    color: #000;
    position: relative;

    &:hover {
      background: #f5f5f5;
    }

    &.other-month {
      color: #ccc;
      cursor: default;

      &:hover {
        background: transparent;
      }
    }

    &.past-date {
      color: #d0d0d0 !important;
      cursor: not-allowed;
      background: #f9f9f9 !important;
      pointer-events: none;

      &:hover {
        background: #f9f9f9 !important;
      }
    }

    // Price indicator styles
    &.price-cheap:not(.other-month):not(.selected):not(.past-date) {
      background: #dcfce7;
      color: #000;

      &:hover {
        background: #bbf7d0;
        color: #000;
      }
    }

    &.price-normal:not(.other-month):not(.selected):not(.past-date) {
      background: #fef3c7;
      color: #000;

      &:hover {
        background: #fde68a;
        color: #000;
      }
    }

    &.price-expensive:not(.other-month):not(.selected):not(.past-date) {
      background: #fee2e2;
      color: #000;

      &:hover {
        background: #fecaca;
        color: #000;
      }
    }

    &.selected {
      background: $color-text !important;
      color: white !important;
      font-weight: 600;
      border-radius: 0;

      &:hover {
        background: $color-text !important;
        color: white !important;
      }
    }

    &.focused {
      outline: 2px solid $color-grey;
      outline-offset: -2px;
      z-index: 1;
    }

    &.in-range {
      background: $color-light-grey;

      &:hover {
        background: color.adjust($color-light-grey, $lightness: -5%);
      }
    }

    &.flexible-range {
      position: relative;
      border-radius: 0;
      background: $color-grey !important;
      color: white !important;

      &:hover {
        background: color.adjust($color-grey, $lightness: -5%) !important;
      }

      // Default: all borders
      &.flex-start {
        border-left: 2px solid $color-grey;
        border-top: 2px solid $color-grey;
        border-bottom: 2px solid $color-grey;
        border-right: none;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }

      &.flex-middle {
        border-top: 2px solid $color-grey;
        border-bottom: 2px solid $color-grey;
        border-left: none;
        border-right: none;
      }

      &.flex-end {
        border-right: 2px solid $color-grey;
        border-top: 2px solid $color-grey;
        border-bottom: 2px solid $color-grey;
        border-left: none;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }
}

.actions {
  display: flex;
  gap: 12px;

  button {
    flex: 1;
    padding: 12px;
    border-radius: 4px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid #d0d0d0;
    transition: all 0.2s;
  }

  .reset-btn {
    background: white;
    color: #000;

    &:hover {
      background: #f5f5f5;
    }

    &:focus {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
    }
  }

  .done-btn {
    background: #2563eb;
    color: white;
    border-color: #2563eb;

    &:hover {
      background: #1d4ed8;
    }

    &:focus {
      outline: 2px solid #1d4ed8;
      outline-offset: 2px;
    }
  }
}

// Mobile modal styles - hidden on desktop
.calendar-modal-overlay {
  display: none;
}

// Desktop styles - show by default
.desktop-calendar {
  display: flex;
}

.desktop-actions {
  display: flex;
}

@media (max-width: 768px) {
  .calendar {
    border: none;
    padding: 0;
    max-width: 100%;
  }

  .date-inputs {
    margin-bottom: 0;
  }

  // Hide desktop calendar grid on mobile
  .desktop-calendar {
    display: none !important;
  }

  .desktop-actions {
    display: none !important;
  }

  // Show mobile modal
  .calendar-modal-overlay {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    align-items: flex-end;
    animation: fadeIn 0.2s ease-out;

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }

  .calendar-modal {
    background: white;
    width: 100%;
    max-height: 90vh;
    border-radius: 16px 16px 0 0;
    overflow-y: auto;
    animation: slideUp 0.3s ease-out;
    display: flex;
    flex-direction: column;

    @keyframes slideUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #000;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 32px;
    line-height: 1;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;

    &:hover {
      background: #f5f5f5;
      color: #000;
    }

    &:active {
      background: #e0e0e0;
    }
  }

  .modal-date-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 16px;
    background: #f9f9f9;
    border-bottom: 1px solid #e0e0e0;
  }

  .modal-date-input {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;

    label {
      font-size: 11px;
      font-weight: 500;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .date-display {
      font-size: 13px;
      font-weight: 500;
      color: #000;
      padding: 4px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .placeholder-text {
        color: #999;
        font-weight: 400;
        font-size: 12px;
      }
    }
  }

  .modal-flexibility {
    position: relative;
    margin-top: 4px;
    min-width: 0;

    .flex-button {
      padding: 5px 8px;
      background: white;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      font-size: 11px;
      color: #666;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: all 0.2s;
      width: 100%;
      text-align: left;

      &:hover {
        background: #f5f5f5;
        border-color: #2563eb;
        color: #2563eb;
      }

      &:active {
        background: #e6f0ff;
      }
    }

    .flex-menu {
      position: fixed;
      top: auto;
      left: 50%;
      bottom: 50%;
      transform: translateX(-50%) translateY(50%);
      margin-top: 0;
      background: white;
      border: 1px solid #d0d0d0;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: 1001;
      overflow: hidden;
      min-width: 200px;
      max-width: 90vw;
    }

    .flex-option {
      padding: 14px 18px;
      font-size: 15px;
      color: #333;
      cursor: pointer;
      transition: background 0.2s;
      white-space: nowrap;
      touch-action: manipulation;

      &:active {
        background: #f5f5f5;
      }

      &.active {
        background: #e6f0ff;
        color: #2563eb;
        font-weight: 500;
      }

      &:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
      }
    }
  }

  // Adjust calendar grid for mobile
  .calendar-modal .calendar-grid {
    display: block;
    padding: 20px;
    overflow-x: auto;

    .month-view {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .month-header {
      margin-bottom: 16px;
    }

    .day {
      font-size: 15px;
      min-height: 44px;
      touch-action: manipulation;

      &:active {
        transform: scale(0.95);
      }
    }
  }

  // Mobile actions
  .calendar-modal .actions {
    display: flex;
    padding: 20px;
    gap: 12px;
    border-top: 1px solid #e0e0e0;
    position: sticky;
    bottom: 0;
    background: white;
    z-index: 10;

    button {
      padding: 14px;
      font-size: 16px;
      border-radius: 8px;
      flex: 1;
      touch-action: manipulation;

      &:active {
        transform: scale(0.98);
      }
    }

    .reset-btn {
      background: white;
      border: 2px solid #d0d0d0;

      &:active {
        background: #f5f5f5;
      }
    }

    .done-btn {
      background: #2563eb;
      border: 2px solid #2563eb;

      &:active {
        background: #1d4ed8;
      }
    }
  }
}
</style>
