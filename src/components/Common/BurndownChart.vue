<template>
  <div class="burndown-chart-container">
    <DxChart
      id="chart"
      :data-source="dataSource"
      :rotated="true"
      :series="serieSources"
      @point-hover-changed="pointHoverChanged" 
    >
      <DxCommonSeriesSettings
        type="line"
      >
        <DxLabel :visible="false"  format="MMM yyyy" :font="{size: 11}" :connector="{visible: true}"/>
      </DxCommonSeriesSettings>
      <DxSize
        :width="width"
        :height="height"
      />
      <DxMargin :top="0" :right="0" :bottom="0" :left="0" />
      <DxArgumentAxis
        :inverted="true"
      >
        <DxGrid :visible="true"/>
        <DxLabel :visible="false"/>
      </DxArgumentAxis>
      <DxValueAxis
        value-type="datetime"
        position="top"
        :tick-interval="{months: 1}"
      >
        <!-- 
        :minor-tick="{visible:true}"
        :minor-tick-interval="{months: 1}"
      >
        <DxMinorGrid :visible="true" color="#ccc" /> -->
        <DxGrid :visible="true" color="#ddd" />
        <DxLabel 
          :visible="true" 
          format="MM.yyyy" 
          word-wrap="none" 
          display-mode="rotate" 
          :rotation-angle="290" 
          alignment="left" />
      </DxValueAxis>
      <DxLegend
        :visible="false"
        vertical-alignment="bottom"
        horizontal-alignment="center"
        item-text-position="bottom"
      />
      <DxTooltip :enabled="true" format="MM.yyyy" />
    </DxChart>
  </div>
</template>

<script>


import {
  DxChart,
  // DxSeries,
  DxArgumentAxis,
  DxValueAxis,
  DxCommonSeriesSettings,
  DxGrid,
  // DxMinorGrid,
  DxMargin,
  DxLegend,
  DxTooltip,
  DxSize,
  DxLabel
} from 'devextreme-vue/chart';



export default {
  components: {
    DxChart,
    // DxSeries,
    DxArgumentAxis,
    DxValueAxis,
    DxCommonSeriesSettings,
    DxGrid,
    // DxMinorGrid,
    DxMargin,
    DxLegend,
    DxTooltip,
    DxSize,
    DxLabel
  },
  props: {
    dataSource: {
      type: Array,
      default: () => null
    },
    width: {
      type: Number,
      default: () => null
    },
    height: {
      type: Number,
      default: () => null
    },
    serieSources: {
      type: Array,
      default: () => null
    },
    onPointHoverChanged: {
        type: Function,
        default: () => function() {}
    },
  },
  methods: {
    pointHoverChanged(e) {
      this.onPointHoverChanged(e.target.data);
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  async mounted() {
  }
};
</script>

<style scoped>
  .burndown-chart-container {
    margin: 0;
    padding: 0px 5px;
  }
</style>