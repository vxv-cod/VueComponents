<template>
  <div>
    <div class="task-menu-container" :class="objectsIsHidden ? 'task-menu-container-hidden' : ''"  :style="{width: objectsIsHidden ? 0 : width + 'px'}">
      <div class="task-menu-objects-list-container">
        <div class="task-menu-header" :style="{width: width + 'px'}">
          <div class="task-menu-list-title" v-show="!objectsIsHidden">
            <h4>{{ objectsListCaption }}</h4>
          </div>
          <div class="task-menu-list-hiding">
            <i v-if="objectsIsHidden" class="dx-icon-chevronright" :title="'Show'|localize" @click="objectsHideControlClick"></i>
            <i v-else class="dx-icon-chevronleft" :title="'Hide'|localize" @click="objectsHideControlClick"></i>
          </div>
        </div>
        <div class="task-menu-objects-list-container" v-show="!objectsIsHidden">
          <slot name="topBlock"></slot>
          <slot name="bottomBlock"></slot>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  data(){
    return {      
      objectsIsHidden: false,
    }
  },
  methods: {
    objectsHideControlClick() {
      this.objectsIsHidden = !this.objectsIsHidden;      
      //this.$emit('toggleMenu');
    }
  },
  props: {
    objectsListCaption: {
      type: String,
      default: () => ""
    },
    width: {
      default: () => "150"
    },
    isOpen: {
      type: Boolean,
      default: () => true
    }
  },
  watch:{
    isOpen(value) {
      this.objectsIsHidden = !value;
    }
  },
  
  mounted(){
    this.objectsIsHidden = !this.isOpen;
  }
}
</script>

<style>

  .task-menu-list-hiding {
      margin-top: 7px;
      text-align: right;
      color: #555;
      font-size: 12px;
      cursor: pointer;
    }

  .task-menu-list-hiding .dx-icon-chevronleft {
      cursor: pointer;
      /* margin-top: 7px; */
  }

  .task-menu-container {
    border-right: 1px solid rgb(245, 245, 245) ;
    display: flex;
    position: relative;
    height: calc(100vh - 81px);
    overflow-y: auto;
    overflow-x: hidden;
    /* scrollbar-color: red orange; */
    scrollbar-width: thin;
    padding: 2px 20px 2px 2px;
  }

  .task-menu-container-hidden {
    width:0;
  }  
  
  .task-menu-header {    
    display: flex;
  }

  .task-menu-list-title {    
    flex: 1;
  }

  .task-menu-list-hiding {    
    display: flex;
    width: 20px;
  }

</style>
