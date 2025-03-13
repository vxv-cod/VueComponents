<template>
  <div>
    <DxPopup
      ref="popupRef"
      :visible="show"
      :drag-enabled="false"
      :hide-on-outside-click="true"
      :show-title="true"
      width="500"
      height="300"
      :title="title"
      @hiding="popupHiding">
      <DxList
        ref="reorderListRef"
        :items="items"
        :repaint-changes-only="true"
        key-expr="ID"
        :display-expr="displayExpr">
          <DxItemDragging
            :data="items"
            :allow-reordering="true"
            :on-drag-start="onDragStart"
            :on-drag-change="onDragEnd"
          />
      </DxList>
      <DxToolbarItem 
          widget="dxButton"
          toolbar="bottom"
          :options="popupButtonOptions"
          location="after">
      </DxToolbarItem>
    </DxPopup>
  </div>
</template>
<script>

import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';
import DxList, { DxItemDragging } from 'devextreme-vue/list';

import localizeFilter from '@/localize';

export default {
  components: {
    DxPopup,
    DxList,
    DxItemDragging,
    DxToolbarItem
  },
  props: {
    title: {
      type: String,
      default: () => null
    },
    show: {
      type: Boolean,
      default: () => false
    },
    items: {
      type: Array,
      default: () => []
    },
    displayExpr: {
      type: String,
      default: () => "Title"
    },
    sortIndexExpr: {
      type: String,
      default: () => "SortIndex"
    },
    onHiding: {
      type: Function,
      default: () => function() {}
    }
  },
  data() {
    return {
      orderChanged: false,
      saveChanges: false,
      popupButtonOptions: {
          text: localizeFilter("SaveReorderList"),
          onClick: async () => {
            if(this.orderChanged) {
              let reorderItems = [];
              const items = this.$refs["reorderListRef"].instance.option("items");
              for(let i in items) {
                const item = items[i];
                const key = item.ID;
                const values = {};
                const newIndex = i*1 + 1;
                if(item[this.sortIndexExpr] !== newIndex) {
                  values[this.sortIndexExpr] = newIndex; 
                  reorderItems.push({item, key, values});
                }
              }
              this.onHiding(reorderItems);
              this.saveChanges = true;
              this.popup.hide();
            }
          }
      },
    }
  },
  methods: {
    onDragStart(e) {
      e.itemData = e.fromData[e.fromIndex];
    },
    onDragEnd() {
      this.orderChanged = true;
    },
    popupHiding() {
      if(!this.saveChanges) {
          this.onHiding();
      }
      this.orderChanged = false;
      this.saveChanges = false;
    }
  },
  computed: {
    popup() {
        return this.$refs["popupRef"].instance;
    }
  }
};
</script>
