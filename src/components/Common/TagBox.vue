<template>
  <DxTagBox
    ref="tagRef"
    :data-source="dataSource"
    :value="value && value.length ? value.map(item => { return item[this.valueExpr] || item }) : null"
    :show-selection-controls="true"
    :max-displayed-tags="maxDisplayedTags"
    :show-multi-tag-only="showMultiTagOnly"
    :value-expr="valueExpr"
    :display-expr="displayExpr"
    :search-enabled="true"
    apply-value-mode="useButtons"

    @selection-changed="onSelectionChanged"
    @value-changed="onValueChanged"
    @multiTagPreparing="onMultiTagPreparing"
  />
</template>
<script>
// 
import DxTagBox from 'devextreme-vue/tag-box';
import localizeFilter from '@/localize';

export default {
  components: { DxTagBox },
  props: {
    dataSource: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    valueExpr: {
      type: String,
      default: () => "ID"
    },
    displayExpr: {
      type: String,
      default: () => "Title"
    },
    onValueChanged: {
      type: Function,
      default: () => function() {}
    },
    onSelectionChanged: {
      type: Function,
      default: () => function() {}
    },
    useMultiTagForAllItems: {
      type: Boolean,
      default: () => false
    },
    maxDisplayedTags: {
      type: Number,
      default: () => 5
    },
    showMultiTagOnly: {
      type: Boolean,
      default: () => false
    },
  },
  computed: {
    instance () {
      return this.$refs["tagRef"].instance;
    }
  },
  data() {
    return {
      //currentValue: this.value ? this.value.map(item => { return item[this.valueExpr] }) : null
      currentValue: null
    };
  },
  watch: {
   /*value(newValues) {
      this.currentValue = newValues ? newValues.map(item => { return item[this.valueExpr] || item }) : null      
    }*/
  },
  methods: {
    onMultiTagPreparing(args) {
      if (this.useMultiTagForAllItems) {
        const selectedItemsLength = args.selectedItems.length;        
        if (selectedItemsLength == this.dataSource.length) {
          const text = localizeFilter("AllSelected");
          args.text =  text;
        } else if (selectedItemsLength > this.maxDisplayedTags) {          
          args.text =  `${localizeFilter("SelectedCount")} ${selectedItemsLength} ${localizeFilter("SelectedFrom")} ${this.dataSource.length}`;
        } else {
          args.cancel = true;
        }
      }
    }
  }
};
</script>
