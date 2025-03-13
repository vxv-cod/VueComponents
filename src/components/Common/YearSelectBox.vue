<template>
    <div class="year-select-box-component">
     <div class="year-select-box-button">
       <Button
          icon="chevrondoubleleft"
          :on-click="() => changeYear(-1)"
        />
      </div>
     <div class="year-select-box-text">
       <h3>{{selectedYear}}</h3>
      </div>
      <div class="year-select-box-button">
       <Button
          icon="chevrondoubleright"
          :on-click="() => changeYear(1)"
        />
      </div>
    </div>
</template>

<script>

import Button from "@/components/Common/Button.vue";

export default {
  components: { 
    Button
  },
  props: {
    year: {
      type: Number,
    },
    onChanged: {
      type: Function,
      default: () => function() {}
    },
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
      selectedYear: null
    }
  },
  methods: {
    changeYear(diff) {
      if (!diff) {
        return;
      }
      const newYear = this.selectedYear + diff;

      if (this.selectedYear > newYear && this.minValue) {
        const minYear = (this.minValue).getFullYear();        
        this.selectedYear = minYear > newYear ? minYear : newYear;
      }

      if (this.selectedYear < newYear && this.maxValue) {
        const maxYear = (this.maxValue).getFullYear();
        this.selectedYear = newYear > maxYear ? maxYear : newYear;
      } 

      if (!this.maxValue || !this.minValue) {
        this.selectedYear += diff;
      }

      this.onChanged(this.selectedYear);
    },

  },
  mounted() {
    this.selectedYear = this.year;
    
  }
}
</script>


<style>
  .year-select-box-component {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .year-select-box-button {
    flex: 0 0 auto;
    padding: 1px 2px;
    font-size: 10px;
  }
  .year-select-box-text {
    flex: 0 0 auto;
    padding: 1px 10px;
    font-size: 12px;
  }
</style>