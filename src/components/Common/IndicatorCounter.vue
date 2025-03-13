<template>
  <div class="total-indicator" v-if="!!counter && counter.IsTotal" 
    :title="totalTitle" 
    @click="valueClick()">
    {{totalCountTitle}}
  </div>
  <div class="indicator" v-else-if="counter && indicatorValue && indicatorOverValue">
    <div class="value-percent"
      :style="'color:' + valueColor" 
      :title="indicatorValue.title"
      @click="valueClick()">
        {{indicatorValue.displayValue}}
    </div>
    <div class="band-size" 
      :style="'width:' + valuePercent + '%; background-color:' + valueBgColor"
      :title="indicatorValue.title" 
      @click="valueClick()">
    </div>
    <div class="band-size" 
      :style="'width:' + overValuePercent + '%; background-color:' + overValueBgColor" 
      :title="indicatorOverValue.title"
      @click="overValueClick()">
    </div>
    <div class="over-value-percent" 
      :style="'color:' + overValueColor" 
      :title="indicatorOverValue.title"
      @click="overValueClick()">
        {{indicatorOverValue.displayValue}}
    </div>
  </div>
</template>

<script>

import { mapGetters } from "vuex"
// import localizeFilter from '@/localize';

export default {
  props: {
    counter: {
      type: Object,
      default: () => null
    },
    onClick: {
      type: Function,
      default: () => function() {}
    }
  },
  data() {
    return {  
      indicatorValue: null,
      indicatorOverValue: null    
    };
  },
  methods: {
    valueClick() {
      let counter = {...this.counter};
      counter.OverIndicatorID = null;
      this.onClick(counter)
    },
    overValueClick() {
      if(!this.overIndicator.ID) return;
      let counter = {...this.counter};
      counter.OverIndicatorID = this.overIndicator.ID;
      this.onClick(counter)
    },
    setIndicatorValue() {
       if (this.getAppTaskUnits == "percents") {
        this.indicatorValue = {
          displayValue: this.valuePercentTitle,
          title: this.indicator?.Title ? this.indicator?.Title + ": " + this.valueTitle : ""
        }

      } else if (this.getAppTaskUnits == "quantity") {
        this.indicatorValue = {
          displayValue:  this.valueQuantityTitle ,
          title: this.indicator?.Title  ? this.indicator?.Title + ": " + this.valuePercentTitle : ""
        }
      }
    },
    setIndicatorOverValue() {
      if (this.getAppTaskUnits == "percents") {
        this.indicatorOverValue = {
          displayValue: this.overValuePercentTitle,
          title: this.overIndicator?.Title ? this.overIndicator?.Title + ": " + this.overValueTitle : ""
        }

      } else if (this.getAppTaskUnits == "quantity") {
        this.indicatorOverValue = {
          displayValue: this.overValuePercentTitle ? (this.counter.TotalCount - this.counter.ValueCount) : "",
          title: this.overValuePercentTitle ? this.overIndicator?.Title + ": " +  this.overValuePercentTitle : ""
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      "getUsers",
      "getDepartments",
      "getAppTaskIndicators",
      "getAppTaskCounters",
      "getAppTaskUnits"
    ]),
    indicator() {
      if (this.counter){
        return this.getAppTaskIndicators.find(i => i.ID == this.counter.IndicatorID);
      } else {
        return null;
      }
    },
    overIndicator() {
      return this.getAppTaskIndicators.find(i => i.ID == this.indicator?.OverIndicatorID);
    },
    totalTitle() {     
      return this.counter?.TotalCount;
    },
    totalCountTitle() {
      return this.counter ? this.counter.TotalCount : 0;
    },
    valuePercent() {
      if(!this.counter.TotalCount) return 0;
      //return Math.ceil(this.counter.ValueCount * 100 / this.counter.TotalCount);
      let value = this.counter.ValueCount * 100 / this.counter.TotalCount
      value = value <= 1 ? Math.ceil(value) : value >= 99 ? Math.floor(value) : Math.round(value);
      return value;
    },
    valueColor() {
      return this.indicator.Color;
    },
    valueBgColor() {
      if(this.indicator.BgColor) return this.indicator.BgColor;
      return this.indicator?.OverIndicatorID ? "#7ab8eb" : "#ffcd82"
    },
    valueTitle() {
      return this.counter?.ValueCount;
    },
    valuePercentTitle() {
      if (!this.counter) return null;
      if(!this.indicator?.OverIndicatorID && !this.counter.ValueCount || !this.counter.TotalCount) return null;
      return this.valuePercent + "%";
    },
    valueQuantityTitle() {
      if (!this.counter) return null;
      if(!this.indicator?.OverIndicatorID && !this.counter.ValueCount || !this.counter.TotalCount) return null;
      return this.counter.ValueCount;
    },
    overValuePercent() {
      return 100 - this.valuePercent;
    },
    overValueColor() {
      if(this.overIndicator && this.overIndicator.Color) return this.overIndicator.Color;
      return "#ff0000";
    },
    overValueBgColor() {
      if(this.overIndicator && this.overIndicator.BgColor) return this.overIndicator.BgColor;
      if(!this.indicator?.OverIndicatorID || !this.counter.TotalCount) return null;
      return "#ffcd82";
    },
    overValueTitle() {
      if(!this.indicator?.OverIndicatorID || !this.counter.TotalCount) return null;
      return (this.counter.TotalCount - this.counter.ValueCount);
    },
    overValuePercentTitle() {
      if(!this.indicator?.OverIndicatorID || !this.counter.TotalCount || this.counter.ValueCount == this.counter.TotalCount) return null;
      return this.overValuePercent + "%";
    },    
  },
  watch: {
    getAppTaskUnits() {
      this.setIndicatorValue();
      this.setIndicatorOverValue();
    },
  },
  mounted() {
    this.setIndicatorValue();
    this.setIndicatorOverValue();
  }
};
</script>

<style scoped>
  .total-indicator {
    text-align: center;
    cursor: pointer;
  }
  .indicator {
    margin-top: 0;
    border: 0;
    display: flex;
    cursor: pointer;
    position: relative;
  }
  .indicator .value-percent {
    position: absolute;
    padding-top: 2px;
    padding-left: 2px;
  }
  .indicator .over-value-percent {
    position: absolute;
    right: 0;
    padding-top: 2px;
    padding-right: 2px;
  }
  .indicator .band-size {
    height: 20px;
  }

</style>