<template>
    <DxTooltip
        :visible.sync="visible"
        :hide-on-outside-click="hideOnOutsideClick"
        :position="position"
        :target="target">
        <slot name="content">
        </slot>
    </DxTooltip>
</template>

<script>

import { DxTooltip } from 'devextreme-vue/tooltip';

export default {
  components: { 
    DxTooltip
  },
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    hideOnOutsideClick: {
      type: Boolean,
      default: () => false
    },
    position: {
      type: String,
      default: () => "left"
    },
    target: {
      type: String,
    }
  }
}
</script>