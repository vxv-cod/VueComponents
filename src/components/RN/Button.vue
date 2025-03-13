<template>
    <button
        class="rn-button"
        :style="buttonStyle"
        :icon="icon"
        :disabled="!enabled"
        :width="width"
        :type="type"
        :styling-mode="stylingMode"
        @click="onClick">
        {{text}}
    </button>
</template>

<script>


export default {
  components: { 
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
  },
  computed: {
    buttonStyle() {
      return this.width ? ("width:" + this.width + "px") : "";
    }
  }
}
</script>