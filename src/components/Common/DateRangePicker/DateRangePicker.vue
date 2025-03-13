<template>
  <div class="container-year">
      <div><input type="date" v-if="selectionMode == 'single'" ref="dateResult" v-model="inputValue" /></div>
      <div><button @click="reset" class="btn-reset">{{'Reset'|localize}}</button></div>
      <div class="constainer-year-title">
        <!-- @input="setValue" -->
        <div class="container-year-title-block">
          <YearSelectBox
            v-if="selectedYear"
            :year="selectedYear"
            :on-changed="yearValueChanged"
            :min-value="minValue"
            :max-value="maxValue" />
        </div>
      </div>
      <div
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp">
        <Month 
          v-for="(month, index) in months"
          :ref="`month_${index}`"
          :data="`month_${index}`"
          :key="month"
          :year="selectedYear"
          :month="month"
          :init-selected-dates="selectedDates"
          :on-selection-changed="onDaySelectionChanged"
          :onHovering="onHovering"
          :enable-hovering-detecting="mouseDown"
          :min-value="minValue"
          :max-value="maxValue"
        />
      </div>
  </div>
</template>
<script>

import Month from "@/components/Common/DateRangePicker/Month.vue";
import YearSelectBox from "@/components/Common/YearSelectBox.vue";
import utils from '@/utils';

export default {
  components: { 
    Month,
    YearSelectBox
  },
  data() {
    return {
      mouseDown: false,
      finalChild: null,      
      firstSelectedDay: null,
      lastSelectedDay: null,      
      selectedYear: null,
      selectedDates: [],
      months: [...Array(12).keys()],
      inputValue: null
    }
  },
  props: {
    value: {      
      default: () => []
    },
    minValue: {
      type: Date,
      default: () => null
    },
    maxValue: {
      type: Date,
      default: () => null
    },
    onValueChanged: {
      type: Function,
      default: () => function() {}
    },
    selectionMode: {
      type: String,
      default: () => "single" // "single/range"
    },
    /*showClearButton: {
      type: Boolean,
      default: () => false
    },
    displayFormatValue: {
      type: String      
    },
    options: {
      type: Object,
      default: () => {}
    },
    width: {
    },
    placeholder: {
      type: String,
      default: () => ""
    },
    zoomLevel: {
      type: String,
      default: () => "month" // "month/year"
    }*/
  },
  methods: {
    setValue(event) {
      this.selectedDates = [event.target.valueAsDate];
    },
    yearValueChanged(year) {
      if (this.selectedYear > year && this.minValue) {
        const minYear = (this.minValue).getFullYear();        
        this.selectedYear = minYear > year ? minYear : year;
      }
      
      if (this.selectedYear < year && this.maxValue) {
        const maxYear = (this.maxValue).getFullYear();
        this.selectedYear = year > maxYear ? maxYear : year;
      } 
      
      if (!this.maxValue || !this.minValue) {
        this.selectedYear = year;
      }      
    },
    handleMouseDown() {
      if (this.selectionMode == "range") {
        this.firstSelectedDay = null;
        this.mouseDown = true;
      }
    },
    async handleMouseUp() {
      if (this.selectionMode == "range") {
        this.mouseDown = false;
        const selectedRange = {
          first: this.firstSelectedDay,
          last: this.lastSelectedDay
        }
        this.firstSelectedDay?.setIsRegion(false);
        this.lastSelectedDay?.setIsRegion(false);
        this.firstSelectedDay = null;
        this.lastSelectedDay = null;
        this.selectRangeDates(selectedRange.first, selectedRange.last);
      }      
    },
    reset() {
      this.selectedDates = [];
      this.deselectDates();
      this.onValueChanged(this.selectedDates);
    },
    selectRangeDates(firstDay, lastDay) {
      if (firstDay == lastDay || !firstDay || !lastDay) {
        return;
      }
      
      const firstDate = firstDay.getDate();
      const lastDate = lastDay.getDate();
      const firstMonth = firstDate.getMonth();
      const lastMonth = lastDate.getMonth();
      const monthRefs = Object.keys(this.$refs).filter(r => r.includes("month_"));

      const selectedMonthRefs = [];
      for(const monthRef of monthRefs) {
        const monthIndex = +monthRef.replace("month_", "");
        if(monthIndex >= firstMonth && monthIndex <= lastMonth ) {
          selectedMonthRefs.push(monthRef);
        }
      }
      for(const monthRef of selectedMonthRefs) {
        const month = this.$refs[monthRef][0];
        const dayRefs = Object.keys(month.$refs).filter(r => r.includes("day_"));

        for(const dayRef of dayRefs) {
          const day = month.$refs[dayRef][0];
          if (!day) {
            continue;
          }         
          if (day.getDate() >= firstDate && day.getDate() <= lastDate ) {        
            day.setIsRegion(false);
            day.toggleSelection();
          }
        }        
      }
    },
    selectDates() {
      const monthRefs = Object.keys(this.$refs).filter(r => r.includes("month_"));
      //const formatDate = (date) => { return date.getFullYear() + "_" + date.getMonth() + "_" + date.getDate()};

      for(const monthRef of monthRefs) {
        const month = this.$refs[monthRef][0];
        const dayRefs = Object.keys(month.$refs).filter(r => r.includes("day_"));

        for(const dayRef of dayRefs) {
          const day = month.$refs[dayRef][0];
          if (!day ) {
            continue;
          }

          if (this.selectedDates?.find(d => utils.dateToString(d) == utils.dateToString(day.getDate()))) {
            day.select();
          }
        } 
      }
    },
    deselectDates() {
      const monthRefs = Object.keys(this.$refs).filter(r => r.includes("month_"));
      //const formatDate = (date) => { return date.getFullYear() + "_" + date.getMonth() + "_" + date.getDate()};

      for(const monthRef of monthRefs) {
        const month = this.$refs[monthRef][0];
        const dayRefs = Object.keys(month.$refs).filter(r => r.includes("day_"));

        for(const dayRef of dayRefs) {
          const day = month.$refs[dayRef][0];
          if (!day || !day.isDaySelected()) {
            continue;
          }

          if (!this.selectedDates || !this.selectedDates.length) {
            day.deselect();
          } else if (!this.selectedDates.find(d => utils.dateToString(d) == utils.dateToString(day.getDate()))) {
            day.deselect();
          }
        } 
      }
    },
    onDaySelectionChanged(e) {
      if (e.isDaySelected()) {
        if (this.selectionMode == "single") {
          this.selectedDates = [e.getDate()];
        } else if (this.selectionMode == "range") {
          const date = this.selectedDates?.find(d => utils.dateToString(d) == utils.dateToString(e.getDate()));
          if (!date) {
            this.selectedDates.push(e.getDate());
          }
        }
      } else {        
        this.selectedDates = this.selectedDates?.filter(d => utils.dateToString(d) != utils.dateToString(e.getDate()));
      }

      if (this.selectionMode == "single") {
        //this.deselectDates();
        this.inputValue = this.selectedDates && this.selectedDates.length ? utils.dateToIsoString(this.selectedDates[0]) : null; 
        //this.onValueChanged(this.selectedDates && this.selectedDates.length ? this.selectedDates[0] : null);
      } else if (this.selectionMode == "range") {
        this.onValueChanged(this.selectedDates);
      }
    },
    onHovering(e) {
      if (!this.firstSelectedDay) {
        this.firstSelectedDay = e;
        e.setIsRegion(true);
      } 
      if (e != this.firstSelectedDay) {
        this.lastSelectedDay = e;
      }
    }    
  },
  computed: {
    getSingleValue() {      
      const value =  this.selectedDates && this.selectedDates.length ? this.selectedDates[0] : null;
      const valueStr = utils.dateToIsoString(value);
      return valueStr;
    }
  },
  watch: {
    async lastSelectedDay(newValue, oldValue) {
      oldValue?.setIsRegion(false);
      newValue?.setIsRegion(true);
    },
    value(newValue) {
      this.selectedDates = newValue;
      this.selectDates();
      this.onValueChanged(this.selectedDates);
    },
    inputValue(newValue) {      
      if (this.selectionMode == "single") {
        if (newValue) {
          const inputValues = newValue.split("-");
          const inputDate = new Date(inputValues[0], inputValues[1] - 1, inputValues[2]);

          this.selectedDates = [inputDate];
          this.deselectDates();
          this.selectDates();
        } else {
          this.selectedDates = [];
          this.deselectDates();   
        }
        this.onValueChanged(this.selectedDates);      
      }      
    }
  },
  mounted() {  
    if (this.value) {
      if (Array.isArray(this.value) && this.value.length) {
        if (this.selectionMode == "single") {
          this.selectedDates = [this.value[0]];
        } else if (this.selectionMode == "range"){
          this.selectedDates = this.value;          
        }this.selectedYear = (this.selectedDates[0]).getFullYear();
      } else if (this.value instanceof Date) {
        this.selectedDates = [this.value];
        this.selectedYear = (this.value).getFullYear();
      } else {
        this.selectedYear = (new Date()).getFullYear();
      }
    } else {
       this.selectedYear = (new Date()).getFullYear();
    }
  }
}
</script>

<style>
  .container-year {
    border: 1px solid #eee;
    padding: 10px;    
  }

  .container-year .container-month {
    margin: 10px;
  }

  .constainer-year-title {
    font-size: 14pt;
    text-align: center;
    color: #555;
    position: relative;
    height: 30px;
  }

  .container-year-title-block {
    /*display: inline-block;*/
    position: absolute;
    left: 50%;
    transform: translateX(-50%);    
  }

  .btn-reset {
    background: #fff;
    border: 1px solid #e8eaeb;
    padding: 5px;
    border-radius: 2px;
    color: #555
  }

  .btn-reset:hover {
    background: rgb(243, 242, 242);
  }
</style>