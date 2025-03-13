<template>
    <DxNumberBox
        ref="numberBoxRef"
        :value="value"
        :width="width"
        @value-changed="onValueChanged"
    />
</template>

<script>

import DxNumberBox from 'devextreme-vue/number-box';

export default {
  components: { 
    DxNumberBox
  },
  props: {
    value: {
      type: String,
      default: () => ""
    },
    width: {
    },
    onValueChanged: {
      type: Function,
      default: () => function() {}
    }
  },
  mounted() {
    if(this.showInFocus) {
      this.$refs["numberBoxRef"].instance.focus();
    }
  }
}
</script>