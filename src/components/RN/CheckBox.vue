<template>
  <span class="rn-checkbox" @click="checkChanged">
    <span class="rn-checkbox-not-all-checked" v-if="allowNotAllChecked && checkedValue == null">
    </span>
    <input type="checkbox" :checked="checkedValue">
  </span>
</template>

<script>

  export default {
    components: {
    },
    props: {
      value: {
          type: Boolean,
          default: () => false
      },
      allowNotAllChecked: {
          type: Boolean,
          default: () => false
      },
      onCheckChanged: {
        type: Function,
        default: () => {}
      }
    },
    data() {
      return {
        checkedValue: false
      }
    },
    methods: {
      checkChanged() {
        if(this.allowNotAllChecked && this.checkedValue == null) {
          this.checkedValue = true;
        }
        else {
          this.checkedValue = !this.checkedValue;
        }
        this.onCheckChanged(this.checkedValue);
      }
    },
    watch: {
      value(v) {
        this.checkedValue = v;
      }
    },
    mounted() {
      this.checkedValue = this.value;
    }
  }
</script>
<style scoped>
  .rn-checkbox {
    position: relative;
  }
  .rn-checkbox-not-all-checked {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: #2a7cb6;
    top: 4px;
    left: 7px;
    cursor: pointer;
  }
</style>
