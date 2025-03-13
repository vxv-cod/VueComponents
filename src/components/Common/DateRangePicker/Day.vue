<template>
  <div class="container-day" 
    :class="сlassList"
    @click="toggleSelection"    
    @mousemove="handleMouseMove">
    {{getDay}}
    <!-- @mousemove="detectHovering ? handleMouseMove : function(){}" -->
  </div>
</template>

<script>

export default {
  components: { 
  },
  data() {
    return {
      /*lastDate: null,*/
      isSelected: false,
      isRegion: false,
      detectHovering: false
    }
  }, 
  props: {
    date: {
      type: Date,
      default: () => null
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    isSelectedOnInit: {
      type: Boolean,
      default: () => false
    },
    onSelectionChanged: {
      type: Function,
      default: () => function() { }
    },
    onHovering: {
      type: Function,
      default: () => function() { }
    },
    enableHoveringDetecting: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    getDate() {
      return this.date;
    },
    isDaySelected() {
      return this.isSelected;
    },
    toggleSelection() {      
      this.isSelected = !this.isSelected;
      this.onSelectionChanged(this);
    },
    handleMouseMove() {
      if (this.detectHovering) {
        this.onHovering(this);
      }
    },
    select() {      
      this.isSelected = true;
    },
    setIsRegion(value) { // День является началом или концом региона для выделения
      this.isRegion = value;
    },
    deselect() {
      this.isSelected = false;
    },
  },
  computed: {
    getDay() {
      return this.date ? this.date.getDate() : "";
    },
    сlassList() {
      const modificators = [];

      if (this.disabled) {
        modificators.push("container-day--disabled");
      } else if(this.isSelected) {
        modificators.push("container-day--selected");
      }

      if (this.isRegion) {
        modificators.push("container-day--region");
      }
      
      return modificators.join(" ");
    }
  },
  watch: {
    async enableHoveringDetecting(value) {     
      this.detectHovering = this.disabled ? false : value
    }
  },
  async mounted() {    
    this.isSelected = this.isSelectedOnInit;
    this.detectHovering = this.enableHoveringDetecting;
  }
}
</script>


<style>
  .container-day {
    font-size: 10pt;
    background-color: #f7f7f7;
    padding: 5px;
    color: #444;
    cursor: pointer;
    user-select: none;
  }

  .container-day--selected {
    background-color: rgb(250, 157, 16);
  }

  .container-day--disabled {
    background-color: #ccc7c7;
    color: #aaaaaa;
  }

  .container-day--region {
    background-color: rgb(71, 91, 121);
  }
</style>