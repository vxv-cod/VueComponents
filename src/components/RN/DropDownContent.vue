<template>
  <transition name="drop-down">
    <div v-if="dropDownVisible" @mouseover="dropDownActivate" @mouseleave="dropDownLeave" :style="dropDownStyle" :id="`drop-down-${positionX}`">
      <div class="rn-drop-down-content">
        <slot name="content">
        </slot>
      </div>
    </div>
  </transition>
</template>
<script>
 
  export default {
    components: {
    },
    props: {
      align: {
        type: String,
        default: () => "left"
      },
      positionX: {
        type: Number,
        default: () => null
      },
      positionY: {
        type: Number,
        default: () => null
      },
      onClose: {
        type: Function,
        default: () => {}
      }
    },
    data() {
      return {
        element: null,
        dropDownVisible: false,
        dropDownActive: false
      }
    },
    methods: {
      dropDownShow() {
        this.dropDownActive = false;
        if(this.dropDownVisible) {
          setTimeout(() => {
            if(!this.dropDownActive) {
              this.dropDownVisible = false;
              setTimeout(() => {
                this.onClose();
              }, 0);
            }
          }, 2000);
        }
      },
      dropDownClose() {
        this.dropDownVisible = false;
          setTimeout(() => {
            this.onClose();
          }, 0);
      },
      dropDownActivate() {
        this.dropDownActive = true;
      },
      dropDownLeave() {
        setTimeout(() => {
          this.dropDownClose();
        }, 2000);
      },
      okClick() {
        this.dropDownClose();
      }
    },
    computed: {
      dropDownStyle() {
        if(this.element) {
          if(this.align === 'right') {
            return `position: fixed; z-index:1000; left:${this.positionX - this.element.offsetWidth + 20 }px; top:${this.positionY - 5 }px;`;
          }
          return `position: fixed; z-index:1000; left:${this.positionX - 20 }px; top:${this.positionY - 5 }px;`;
        }
        return "position: fixed;";
      }
    },
    mounted() {
      this.dropDownVisible = true;
      this.dropDownShow();
      setTimeout(() => {
        this.element = document.getElementById(`drop-down-${this.positionX}`);
      });
    }
  }
  </script>

  <style scoped>
    .drop-down-enter-active,
    .drop-down-leave-active {
      transition: opacity 0.8s ease;
    }
    .drop-down-enter-from,
    .drop-down-leave-to {
      opacity: 0;
    }

  </style>
