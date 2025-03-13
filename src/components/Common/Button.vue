<template>
    <DxButton
        :text="text"
        :icon="icon"
        :disabled="!enabled"
        :width="width"
        :type="type"
        :styling-mode="stylingMode"
        @click="onClick"
    />
</template>

<script>

import DxButton from 'devextreme-vue/button';

export default {
  components: { 
    DxButton
  },
  props: {
    text: {
      type: String,
      default: () => null
    },
    icon: {
      type: String,
      default: () => null
    },
    enabled: {
      type: Boolean,
      default: () => true
    },
    width: {
      default: () => undefined 
    },
    onClick: {
      type: Function,
      default: () => function() {}
    },
    type: {
    },
    stylingMode: {
    }
  }
}
</script>