<template>
    <DxDateBox
        ref="dateRef"
        :value="value"
        :width="width"
        :calendar-options="calendarOptions"
        :show-clear-button="showClearButton"
        :use-mask-behavior="true"         
        :display-format="displayFormat"
        :multi-view="false"
        :placeholder="placeholder"
        :min="min"
        :max="max"          
        @value-changed="onValueChanged"
    />
</template>


<script>

import DxDateBox from 'devextreme-vue/date-box';


export default {
  components: { 
    DxDateBox
  },
  data() {
    return {
      calendarOptions: null,
      displayFormat: null,
      min: null,
      max: null
    }
  },
  props: {
    value: {
      type: Date,
      default: () => null
    },
    showClearButton: {
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
    onValueChanged: {
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
    zoomLevel: {
      type: String,
      default: () => "month"
    }
  },
  methods:{

  },
  computed: {
    instance () {
      return this.$refs["dateRef"].instance;
    }
  },
  watch: {
    minValue(value) {
      this.min = value;
    },
    maxValue(value) {
      this.max = value;
    }
  },
  mounted() {   
    if (this.options) {
      this.calendarOptions = this.options;      
    } else {
      this.calendarOptions = {
        zoomLevel: this.zoomLevel,
        maxZoomLevel: this.zoomLevel,
        minZoomLevel: this.zoomLevel
      }
    }

    if (this.displayFormatValue){
      this.displayFormat = this.displayFormatValue;
    }
  }
}
</script>