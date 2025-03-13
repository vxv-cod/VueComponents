<template>
    <div v-if="!!columnsWithEdit">
        <DxDataGrid
            :data-source="dataItems"
            :show-borders="true"
            :show-row-lines="true"
            :column-auto-width="false"
            :hover-state-enabled="true"
            :word-wrap-enabled="false"
            :columns="columnsWithEdit"
            @content-ready="onContentReady"
            @toolbar-preparing="onToolbarPreparing"
            @editor-preparing="onEditorPreparing"
            @row-validating="onRowValidating"
            @row-inserted="onRowEdited"
            @row-updated="onRowEdited"
            @row-removed="onRowEdited"
            key-expr="ID">
            <DxHeaderFilter :visible="true"/>
            <DxEditing
                :allow-adding="allowAdding"
                :allow-updating="allowUpdating"
                :allow-deleting="allowDeleting"
                :use-icons="true"
                :mode="editingMode">
            </DxEditing>
        </DxDataGrid>

        <DxPopup
            :visible.sync="popupVisible"
            :drag-enabled="true"
            :hide-on-outside-click="true"
            :show-title="true"
            width="90%"
            height="400"
            :title="title">
            <DxDataGrid
                :data-source="filteredDataItems"
                :show-borders="true"
                :show-row-lines="true"
                :column-auto-width="false"
                :hover-state-enabled="true"
                :word-wrap-enabled="false"
                :columns="columns"
                @selection-changed="onSelectionChanged"
                key-expr="ID">
                <DxHeaderFilter :visible="true"/>
                <DxSelection
                    mode="multiple"
                />
            </DxDataGrid>
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

import { 
    DxDataGrid, 
    // DxColumn, 
    DxHeaderFilter,
    DxEditing,
    DxSelection
} from 'devextreme-vue/data-grid';

import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';

import localizeFilter from '@/localize';

export default {
  components: {
    DxDataGrid, 
    // DxColumn, 
    DxHeaderFilter,
    DxEditing,
    DxSelection,
    DxPopup,
    DxToolbarItem
  },
  props: {
    columns: {
        type: Array,
        default: () => null
    },
    dataSource: {
      default: () => null
    },
    title: {
      type: String,
      default: () => null
    },
    value: {
      type: Array,
      default: () => []
    },
    allowEditing: {
      type: Boolean,
      default: () => false
    },
    allowAdding: {
      type: Boolean,
      default: () => false
    },
    allowUpdating: {
      type: Boolean,
      default: () => false
    },
    allowDeleting: {
      type: Boolean,
      default: () => false
    },
    editingMode: {
      type: String,
      default: () => null
    },
    onContentReady: {
      type: Function,
      default: () => function() {}
    },
    onEditorPreparing: {
      type: Function,
      default: () => function() {}
    },
    onRowValidating: {
      type: Function,
      default: () => function() {}
    },
    onValueChanged: {
      type: Function,
      default: () => function() {}
    }
  },
  methods: {
    setDataItems() {
      if(this.value) {
        this.dataItems = [].concat(this.value);
      }
      else {
          this.dataItems = [];
      }
    },
    onToolbarPreparing: function(e) {
        if(this.allowEditing && !this.editingMode) {
            e.toolbarOptions.items.unshift({
                location: "after",
                widget: "dxButton",
                options: {
                    icon: "plus",
                    hint: localizeFilter("Add"),
                    onClick: () => {
                        this.popupVisible = true;
                    }
                }
            });
        }
    },
    onSelectionChanged(e) {
        this.selectedDataItems = e.selectedRowsData;
    },
    onRowEdited() {
        this.onValueChanged(this.dataItems);
    }
  },
  computed: {
    filteredDataItems() {
        let filteredDataSource = [];
        if(this.dataSource) {
            for(let i in this.dataSource) {
                const item = this.dataSource[i];
                if(this.dataItems) {
                    if(!this.dataItems.find(a => a.ID == item.ID)) {
                        filteredDataSource.push(item);
                    }
                }
            }
        }
        for(let i in this.removedDataItems) {
            const removedItem = this.removedDataItems[i];
            if(!filteredDataSource.find(a => a.ID == removedItem.ID)) {
                filteredDataSource.push(removedItem);
            }
        }
        return filteredDataSource;
    },
  },
  data() {
    return {
        grid: null,
        columnsWithEdit: null,
        dataItems: [],
        selectedDataItems: [],
        removedDataItems: [],
        popupVisible: false,
        popupButtonOptions: {
            text: localizeFilter("AddSelected"),
            visible: this.allowEditing,
            onClick: () => {
                this.dataItems = this.dataItems.concat(this.selectedDataItems);
                this.removedDataItems = this.removedDataItems.filter(ri => !this.selectedDataItems.find(i => i.ID == ri.ID));
                this.onValueChanged(this.dataItems);
                this.popupVisible = false;
            }
        },
        editButtons: [{
            hint: localizeFilter("Remove"),
            visible: this.allowEditing,
            icon: 'minus',
            onClick: (e) => {
                if(!this.removedDataItems.find(ri => ri.ID == e.row.data.ID)) {
                    this.removedDataItems.push(e.row.data);
                }
                this.dataItems = this.dataItems.filter(a => a.ID != e.row.data.ID);
                this.onValueChanged(this.dataItems);
                e.event.preventDefault();
            }
        }],
    };
  },
  watch: {
    value() {
      this.setDataItems();
    }
  },
  mounted() {
    this.columnsWithEdit = [].concat(this.columns);
    if(!this.editingMode) {
        this.columnsWithEdit.push({width: 100, buttons: this.editButtons, type:"buttons"});
    }
    this.setDataItems();
  }
};

</script>