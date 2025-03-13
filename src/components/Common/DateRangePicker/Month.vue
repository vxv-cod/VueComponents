<template>
  <div class="container-month"> 
    <div class="container-month-header">
      <h4>{{monthTitle}}</h4>
    </div>
    <div class="container-month-days">
      <table class="drp-month-block">
        <thead>
        <tr class="header-row">
          <th v-for="dayTitle in getDayTitles" :key="dayTitle" class="cell">
            {{dayTitle}}
          </th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="`${year}_${index}`" class="row">
            <td v-for="(day, dayIndex) in row" :key="day.key" class="cell">
              <Day
                v-if="day.type!='empty'"
                :ref="`day_${index}_${dayIndex}`"
                :date="day.date"
                :on-selection-changed="onDaySelectionChanged"
                :on-hovering="onDayHovering"
                :enable-hovering-detecting="enableHoveringDetecting"
                :is-selected-on-init="day.selected"
                :disabled="day.disabled"
              />
              <!-- :on-selection="onDaySelection"-->
            </td>          
          </tr>
         </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import utils from '@/utils';
import Day from "@/components/Common/DateRangePicker/Day.vue";
import localizeFilter from '@/localize';


export default {
  components: { 
    Day
  },
  props: {
    year: {
      type: Number,
      default: () => null
    },
    month: {
      type: Number,
      default: () => null
    },
    onSelectionChanged: {
      type: Function,
      default: () => function() { }
    },
    onHovering: {
      type: Function,
      default: () => function() { }
    },
    enableHoveringDetecting: {
      type: Boolean,
      default: () => false 
    },
    initSelectedDates: {},
    minValue: {
      type: Date,
      default: () => null
    },
    maxValue: {
      type: Date,
      default: () => null
    },
  },
  data() {
    return {
      rows: [],
      detectHovering: false
    }
  },
  computed: {
    monthTitle() {
      const date = new Date(this.year, this.month, 1);
      return date.toLocaleString('default', { month: 'long' });
    },
    getDayTitles() {
      return [
        localizeFilter('Mon'), 
        localizeFilter('Tue'), 
        localizeFilter('Wed'), 
        localizeFilter('Thu'), 
        localizeFilter('Fri'), 
        localizeFilter('Sat'), 
        localizeFilter('Sun')];
    }
  },
  methods: {
    getSelectedDays() {
      const dayRefs = Object.keys(this.$refs).filter(r => r.includes("day_"));
      let selectedDays = [];
      for(const dayRef of dayRefs) {
        const day = this.$refs[dayRef][0];
        if (day.isDaySelected()) {
          selectedDays = selectedDays.concat(day);
        }
      }

      return selectedDays;
    },
    onDayHovering(e) {
      this.onHovering(e);
    },
    onDaySelectionChanged(e) {
      this.onSelectionChanged(e);      
    },
    setRows() {
      //const formatDate = (date) => { return date.getFullYear() + "_" + date.getMonth() + "_" + date.getDate()};
      const dayPerWeek = 7;
      const firstDay = (new Date(this.year, this.month, 1)).getDay();
      const lastDate = new Date(this.year, this.month + 1, 0).getDate();
      const lastDay = (new Date(this.year, this.month,  lastDate)).getDay();
      const startOffset = firstDay == 0 ? 6 : firstDay - 1;
      
      const days = [];
      const endOffset = lastDay == 0 ? 0 : dayPerWeek - lastDay;

      for(let i = 0; i < startOffset + lastDate + endOffset; i++ ) {
        if (i < startOffset) {
          days.push({
            type: "empty",
            key: this.year + "_" + this.month + "_" + i          
          })
        } else if (i >= startOffset && i < (startOffset + lastDate )) {
          const date = new Date(this.year, this.month, i - startOffset + 1);          
          const selected = !!this.initSelectedDates.find(d => utils.dateToString(d) == utils.dateToString(date));
          const disabled = (this.minValue ? date <= this.minValue : false) || (this.maxValue ? date >= this.maxValue : false);          
          days.push({
            type: "date",
            key: this.year + "_" + this.month + "_" + i,
            value: i - startOffset + 1,
            date: date,
            selected: selected,
            disabled: disabled
          })
        } else {
          days.push({
            type: "empty",
            key: this.year + "_" + this.month + "_" + i,    
          })
        }
      }
      
      const rows = [];
      const rowCount = Math.ceil((startOffset + lastDate) / dayPerWeek);
      for (let r = 0; r < rowCount; r++ ) {
        rows.push(days.slice(r * dayPerWeek, r * dayPerWeek + dayPerWeek));
      }

      this.rows = rows;
      this.detectHovering = this.enableHoveringDetecting;
    }
  },
  watch: {
    year() {      
      this.setRows();
    },
    async enableHoveringDetecting(value) {
      this.detectHovering = value;      
    }
  },
  async mounted() {
    this.setRows();
  } 
}
</script>


<style>
  .drp-month-block {
    border-collapse: collapse;
  }

  .drp-month-block td {
    height: 20px;
    width: 20px;
    text-align: center;
  }

  .container-month {
    width: 182px;
  }

  .container-month-header {
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: #aaaaaa;
    user-select: none;
  }

  .container-month-days th{
    font-size: 10pt;  
  }

  .container-month {
    display: inline-block;
  }

  .header-row {
    background-color: rgb(249, 189, 39);
    color: white;
    text-align: center;
    user-select: none;
  }
  
</style>