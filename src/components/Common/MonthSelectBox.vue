<template>
    <div class="month-select-box-component" v-if="selectedMonth">
     <div class="month-select-box-button">
       <Button
          icon="chevrondoubleleft"
          :on-click="() => changeMonth(-1)"
        />
      </div>
     <div class="month-select-box-text">
       <h3>{{selectedMonth.FullTitle}}</h3>
      </div>
      <div class="month-select-box-button">
       <Button
          icon="chevrondoubleright"
          :on-click="() => changeMonth(1)"
        />
      </div>
    </div>
</template>

<script>

import Button from "@/components/Common/Button.vue";
import utils from '@/utils';

export default {
  components: { 
    Button
  },
  props: {
    month: {
      type: Object,
    },
    onChanged: {
      type: Function,
      default: () => function() {}
    }
  },
  data() {
    return {
      selectedMonth: null
    }
  },
  methods: {
    changeMonth(diff) {
      if(diff) {
        let time;
        if(diff < 0) {
          time = this.selectedMonth.StartTime - 1;
        }
        else {
          time = this.selectedMonth.FinishTime + 1;
        }
        this.selectedMonth = utils.getMonth(new Date(time));
        this.onChanged(this.selectedMonth);
      }
    }
  },
  computed: {
  },
  mounted() {
    this.selectedMonth = this.month;
  }
}
</script>


<style>
  .month-select-box-component {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .month-select-box-button {
    flex: 0 0 auto;
    padding: 1px 2px;
    font-size: 10px;
  }
  .month-select-box-text {
    flex: 0 0 auto;
    padding: 1px 10px;
    font-size: 12px;
  }
</style>