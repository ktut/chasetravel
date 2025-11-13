<script lang="ts">
interface DateInfo {
  date: number
  month: number
  year: number
  isCurrentMonth: boolean
}

export default {
  name: 'Calendar',
  data() {
    return {
      checkIn: null as Date | null,
      checkOut: null as Date | null,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      isOpen: false,
      focusedDate: null as Date | null,
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      dayNames: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeyDown)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  },
  computed: {
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

      // If no check-in or both dates are set, start new selection
      if (!this.checkIn || (this.checkIn && this.checkOut)) {
        this.checkIn = selectedDate
        this.checkOut = null
      } else {
        // If check-in is set but not check-out
        if (selectedDate < this.checkIn) {
          // If selected date is before check-in, make it the new check-in
          this.checkOut = this.checkIn
          this.checkIn = selectedDate
        } else {
          this.checkOut = selectedDate
        }

        // Emit the date range and close the dropdown
        this.$emit('date-range-selected', {
          checkIn: this.checkIn,
          checkOut: this.checkOut
        })
        this.isOpen = false
      }
    },
    openCalendar() {
      this.isOpen = true
      // Set initial focused date
      if (!this.focusedDate) {
        this.focusedDate = this.checkIn || new Date()
      }
    },
    closeCalendar() {
      this.isOpen = false
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
    isSameDate(date1: Date | null, date2: Date | null): boolean {
      if (!date1 || !date2) return false
      return date1.getFullYear() === date2.getFullYear() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getDate() === date2.getDate()
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
      this.$emit('date-range-selected', {
        checkIn: null,
        checkOut: null
      })
    },
    done() {
      if (this.checkIn && this.checkOut) {
        this.$emit('date-range-selected', {
          checkIn: this.checkIn,
          checkOut: this.checkOut
        })
        this.isOpen = false
      }
    }
  }
}
</script>

<template>
  <div class="calendar">
    <div class="date-inputs">
      <div class="date-input" @click="openCalendar" tabindex="0">
        <div class="label">Check-in</div>
        <div class="value">{{ checkInFormatted || 'Select date' }}</div>
      </div>
      <div class="date-input" @click="openCalendar" tabindex="0">
        <div class="label">Check-out</div>
        <div class="value">{{ checkOutFormatted || 'Select date' }}</div>
      </div>
    </div>

    <div v-if="isOpen" class="calendar-grid">
      <div class="month-view">
        <div class="month-header">
          <button class="nav-btn" @click="previousMonth" tabindex="0" aria-label="Previous month">&lt;</button>
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
              'selected': isSelected(dateInfo),
              'focused': isFocused(dateInfo),
              'in-range': isInRange(dateInfo)
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
              'selected': isSelected(dateInfo),
              'focused': isFocused(dateInfo),
              'in-range': isInRange(dateInfo)
            }"
            @click="selectDate(dateInfo)"
          >
            {{ dateInfo.date }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="isOpen" class="actions">
      <button class="reset-btn" @click="reset" tabindex="0">Reset</button>
      <button class="done-btn" @click="done" tabindex="0">Done</button>
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
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: border-color 0.2s;
    outline: none;

    &:hover {
      border-color: #2563eb;
    }

    &:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .label {
      font-size: 14px;
      color: #666;
    }

    .value {
      font-size: 15px;
      font-weight: 500;
      color: #000;
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

    &:hover {
      background: #f5f5f5;
    }

    &:focus {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
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

    &.selected {
      background: #2563eb;
      color: white;
      font-weight: 600;

      &:hover {
        background: #2563eb;
      }
    }

    &.focused {
      outline: 2px solid #2563eb;
      outline-offset: -2px;
      z-index: 1;
    }

    &.in-range {
      background: #e6f0ff;

      &:hover {
        background: #d6e6ff;
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
</style>
