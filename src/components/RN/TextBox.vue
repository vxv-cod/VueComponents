<template>l
    <!-- <DxTextBox
        ref="textBoxRef"
        :value="value"
        :placeholder="placeholder"
        :width="width"
        :buttons="buttons"
        :show-clear-button="showClearButton"
        @value-changed="onValueChanged"
    /> -->
  <div class="rn-input" :style="{ width: props.width }">
    <input autocomplete="false" v-model="value" :placeholder="props.placeholder" :disabled="disabled" >
  </div>
  <div>value: {{ value }}</div>
</template>

<script setup>
  import { ref, defineProps, provide, onMounted } from 'vue'  
  const props = defineProps({
    value: {
      type: String,
      default: () => ""
    },
    placeholder: {
      type: String,
      default: () => ""
    },
    width: {
    },
    buttons: {
      type: Array,
      default: () => null
    },
    showClearButton: {
      type: Boolean,
      default: () => false
    },
    showInFocus: {
      type: Boolean,
      default: () => false
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    onValueChanged: {
      type: Function,
      default: () => function() {}
    }
  })

  const value = ref(null);

  onMounted(() => {
    if (props.value) {
      value.value = props.value
    }
  })

</script>

<style scoped>
  .rn-input

  .rn-input {
    background: #fff;
    border: 1px solid #e8eaeb;
    border-radius: 2px;    
  }

  .rn-input {
    background: #fff;
    border: 1px solid #e8eaeb;
    border-radius: 2px;    
  }

  .rn-input input {
    border: none;
    width: calc(100% - 5px);
    line-height: 1.33334;    
    outline: none;
    font-size: 9pt;
    height: 24px;
    padding-left: 4px;
  } 

  .rn-input input:focus {
    border: 1px solid #196083;
    border-radius: 2px; 
    outline: none;
  } 

  .rn-input input::placeholder {
    color: #999;
    font-size: 8pt;
  }
</style>