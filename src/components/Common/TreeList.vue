<template>
    <div class="data-grid-container">      
        <DxTreeList 
          id="treeList"
          :autoExpandAll="autoExpandAll"
          :allow-column-resizing="true"
          :data-source="dataSource"
          :key-expr="keyExpr"
          :parent-id-expr="keyParentExpr"
          :columns="gridColumns"
          :scrolling="scrolling"
          column-resizing-mode="widget"
          :selection-mode="selectionMode"
          :show-borders="showBorders"
          :paging="paging"
          :showColumnHeaders="showColumnHeaders"
          :showColumnLines="showColumnLines"
          :showRowLines="showRowLines"
          :height="height"
          :has-items-expr="hasItemsExpr"
          @row-expanding="onRowExpanding"
        >
        <DxSearchPanel :visible="showSearchPanel"/>
        <DxHeaderFilter :visible="true"/>
        <DxFilterRow :visible="showFilterRow"/>
        <!-- <DxGroupPanel :visible="allowGrouping"/> -->
        <DxRowDragging
            :allow-reordering="allowReordering"
            :on-reorder="onReorder"
            :show-drag-icons="true"
        />
        <DxSelection mode="single"/>
        <DxColumnChooser 
            :enabled="showColumnChooser"
            :allow-search="true"
            mode="select"
        />
        <DxColumnFixing 
            :enabled="allowColumnFixing"
        />
        <DxEditing
            :allow-adding="allowAdding"
            :allow-updating="allowUpdating"
            :allow-deleting="allowDeleting"
            :use-icons="true"
            :mode="editingMode"
            :form="formOptions">
            <DxPopup
                :show-title="!!editingFormTitle"
                :title="editingFormTitle"
                :width="editingFormWidth"
                :height="editingFormHeight"
                :toolbar-items="toolbarItems"
                :drag-enabled="true"
                :resize-enabled="editingPopupResizeEnabled"      
                />
        </DxEditing>
        <!-- <DxPaging 
            :enabled="allowPaging"
            :page-size="pageSize"
        /> -->
        <DxPager
            :show-page-size-selector="showPageSelector"
            display-mode="full"
            :allowed-page-sizes="[10, 20, 50, 100, 200, 500, 1000]"
            :show-info="showPageSelector"
            :visible="pagerVisible"
        />
        <!-- <DxExport
            :enabled="exportEnabled"
            :customize-excel-cell="customizeExcelCell"
            :file-name="exportFileName"
        /> -->
        <!-- <DxExport
            :enabled="exportEnabled"
            :file-name="exportFileName"
        /> -->
        <!-- <DxMasterDetail
            :enabled="allowMasterDetail"
            template="masterDetailTemplate"
        /> -->
            <!-- Configuration goes here -->
            <template #masterDetailTemplate="{ data }">
            <slot name="masterDetail" v-bind:data="data">
            </slot>
        </template>
        <template #headerCellTemplate="{ data }">
            <slot name="headerCellTemplate" v-bind:data="data">
            </slot>
        </template>
        <template #titlesTemplate="{ data: cellInfo }">
            <div v-if="wordWrapEnabledValue">
                <div v-for="(item, index) in cellInfo.value" v-bind:key="index">
                    {{ getItemTitle(cellInfo, item) }}
                </div>
            </div>
            <div v-else>
                <span v-for="(item, index) in cellInfo.value" v-bind:key="index">{{index > 0 ? ", " : ""}}{{ getItemTitle(cellInfo, item) }}</span>
            </div> 
        </template>
        <template #numericTitlesTemplate="{ data: cellInfo }">
            <div v-if="cellInfo.value && cellInfo.value.length == 1">
                {{ getItemTitle(cellInfo, cellInfo.value[0]) }}
            </div>
            <div v-else-if="wordWrapEnabledValue">
                <div v-for="(item, index) in cellInfo.value" v-bind:key="index">
                    {{ (index + 1) }}) {{ getItemTitle(cellInfo, item) }}
                </div>
            </div>
            <div v-else>
                <span v-for="(item, index) in cellInfo.value" v-bind:key="index">{{index > 0 ? "; " : ""}}{{ (index + 1) }}) {{ getItemTitle(cellInfo, item) }}</span>
            </div> 
        </template>
        <template #multilineTextTemplate="{ data }">
            <div v-if="wordWrapEnabledValue">
                <span v-for="(line, index) in data.text.split('\n')"  v-bind:key="index">{{line}}<br></span>
            </div>
            <div v-else>
                {{data.text}}
            </div>
        </template>
        <template #hyperlinkTemplate="{ data }">
            <a v-if="hyperLinkIsWeb(data.text)" :title="data.text" class="data-grid-hyperlink" :href="data.text" target="_blank">{{data.text}}</a>
            <span v-else @click="hyperLinkClick" :title="data.text" class="data-grid-hyperlink">{{data.text}}</span>
        </template>
        <template #dataGridBoxEditTemplate="{ data: cellInfo }">
            <div class="data-grid-box-editor">
                <DataGridBox
                    :columns="cellInfo.column.lookup ? cellInfo.column.lookup.columns : null"
                    :data-source="cellInfo.column.lookup ? cellInfo.column.lookup.dataSource : null"
                    :value="cellInfo.value"
                    :allow-editing="allowEditing"
                    :allow-adding="cellInfo.column.lookup ? cellInfo.column.lookup.allowAdding : null"
                    :allow-updating="cellInfo.column.lookup ? cellInfo.column.lookup.allowUpdating : null"
                    :allow-deleting="cellInfo.column.lookup ? cellInfo.column.lookup.allowDeleting : null"
                    :editing-mode="cellInfo.column.lookup ? cellInfo.column.lookup.editingMode : null"
                    :on-content-ready="cellInfo.column.lookup ? cellInfo.column.lookup.onContentReady : null"
                    :on-editor-preparing="cellInfo.column.lookup ? cellInfo.column.lookup.onEditorPreparing : null"
                    :on-row-validating="cellInfo.column.lookup ? cellInfo.column.lookup.onRowValidating : null"
                    :on-value-changed="(value) => cellValueChanged(value, cellInfo)"
                />
            </div>
        </template>
        <template #listEditTemplate="{ data: cellInfo }">
            <div class="list-editor">
                <List
                    :data-source="listEditorOption(cellInfo, 'dataSource')"
                    :items="listEditorOption(cellInfo, 'items')"
                    :selected-items="listEditorOption(cellInfo, 'selectedItems')"
                    :show-selection-controls="true"
                    :display-expr="cellInfo.column.lookup ? cellInfo.column.lookup.displayExpr : null"
                    :key-expr="cellInfo.column.lookup ? cellInfo.column.lookup.keyExpr : null"
                    :search-enabled="cellInfo.column.lookup ? cellInfo.column.lookup.searchEnabled : false"
                    :height="cellInfo.column.lookup ? cellInfo.column.lookup.height : null"
                    :selection-mode="listEditorSelectionMode(cellInfo)"
                    :on-selection-changed="(e) => listSelectionChanged(cellInfo, e.addedItems, e.removedItems)"
                />
            </div>
        </template>
        <template #graphBandTemplate="{ data: cellInfo }">
            <GraphBand
                :task="cellInfo.data"
                :month="cellInfo.column.month"
                :minimizied="!wordWrapEnabledValue"
            />
        </template>
        <template #fileUploadTemplate="{ data: cellInfo }">
            <div v-if="fileUploadUrl && fileDownloadUrl && fileDownloadNameExpr">
                <div v-if="cellInfo.data[fileDownloadNameExpr]">
                    <h4>
                        <a :href="fileDownloadUrl(cellInfo.data[fileDownloadNameExpr])">{{cellInfo.data[fileDownloadNameExpr]}}</a>
                    </h4>
                </div>
                <div>
                    <DxFileUploader
                        accept="*"
                        :multiple="false"
                        upload-mode="instantly"
                        :upload-url="fileUploadUrl()"
                        @uploaded="(e) => onFileUploaded({cellInfo, fileInfo: e.file})"
                    />
                </div>
            </div>
        </template>
        </DxTreeList>
    </div>
</template>
     
<script>
   
import {
  DxTreeList,
  DxColumnChooser,
  DxColumnFixing,
  DxEditing,
  //DxGroupPanel,
  DxHeaderFilter,
  DxFilterRow,
  DxSearchPanel,
  DxPopup,
  DxSelection,
  DxRowDragging,
  //DxMasterDetail,
  //DxPaging,
  DxPager,
  //DxExport
} from 'devextreme-vue/tree-list';
import localizeFilter from '@/localize';
import utils from '@/utils';
import componentUtils from '@/utils/components';
//import componentUtils from '@/utils/components';

export default {
  components: {
    DxTreeList,
    DxColumnChooser,
    DxColumnFixing,
    DxEditing,
    //DxGroupPanel,
    DxHeaderFilter,
    DxFilterRow,
    DxSearchPanel,
    DxPopup,
    DxSelection,
    DxRowDragging,
    //DxMasterDetail,
    //DxPaging,
    DxPager,
    //DxExport
  },
  data() {
    return {
      allowReordering: false,
      gridColumns: null,
      wordWrapEnabledValue: this.wordWrapEnabled,
      toolbarItems: [{
        toolbar: 'bottom',
        location: 'after',
        widget: "dxButton",
        options: {
          text: localizeFilter("Save"),
          onClick: (args) => {
            this.onSaving({
              component: this.grid,
              row: this.gridEditRow,
              args
            });
            this.grid.saveEditData();
          }
        }
      }, {
        toolbar: 'bottom',
        location: 'after',
        widget: "dxButton",
        options: {
          text: localizeFilter("DoNotSave"),
          onClick: (args) => {
            this.grid.cancelEditData({
              component: this.grid,
              row: this.gridEditRow,
              args
            });
          }
        }
      }]
    }
  },
  props: {
    onRowExpanding: {
      type: Function, 
      default: () => null
    },
    autoExpandAll: {
      type: Boolean,
      default: () => false
    },
    hasItemsExpr: {
      type: String,
      default: () => "ChildrenTaskCount"
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    keyExpr: {
      type: String,
      default: () => "ID"
    },
    keyParentExpr: {
      type: String,
      default: () => "ParentID"
    },
    allowPaging: {
      type: Boolean,
      default: () => true
    },
    pageSize: {
      type: Number,
      default: () => 20
    },
    showSearchPanel: {
      type: Boolean,
      default: () => false
    },
    exportFileName: {
      type: String,
      default: () => null
    },
    exportEnabled: {
      type: Boolean,
      default: () => false
    },
    showPageSelector: {
      type: Boolean,
      default: () => false
    },
    editingPopupResizeEnabled: {
      type: Boolean,
      dafault: () => true
    },
    showFilterRow: {
      type: Boolean,
      default: () => false
    },
    allowGrouping: {
      type: Boolean,
      default: () => false
    },
    onReordering: {
      type: Function,
      default: () => function () {}
    },
    showColumnChooser: {
      type: Boolean,
      default: () => false
    },
    allowColumnFixing: {
      type: Boolean,
      default: () => false
    },
    allowAdding: {
      type: Boolean,
      default: () => false
    },
    allowUpdating: {
      default: () => false
    },
    allowDeleting: {
      default: () => false
    },
    editingFormWidth: {
      type: String,
      default: () => null
    },
    editingFormHeight: {
      type: String,
      default: () => null
    },
    height: {
        type: Number,
        default: () => null
    },
    editingFormTitle: {
      type: String,
      default: () => null
    },
    allowMasterDetail: {
      type: Boolean,
      default: () => false
    },
    editingMode: {
      type: String,
      default: () => "popup"
    },
    formOptions: {
      type: Object,
      //   default: () => null
    },
    wordWrapEnabled: {
        type: Boolean,
        default: () => true
    },
    logTypeName: {
        type: String,
        default: () => null
    },
    showColumnHeaders: {
        type: Boolean,
        default: () => true
    },
    showColumnLines: {
        type: Boolean,
        default: () => true
    },
    showRowLines: {
        type: Boolean,
        default: () => true
    },
     userStateKey: {
        type: String,
        default: () => null
    },

    logMenuEnabled: {
        type: Boolean,
        default: () => false
    },
    logTypeFieldName: {
        type: String,
        default: () => "LogTypeName"
    },
    logKeyExpr: {
        type: String,
        default: () => "ID"
    },

    width: {
        //type: Number,
        default: () => null
    },
    showReorderButton: {
        type: Boolean,
        default: () => false
    },
    showWordWrapButton: {
        type: Boolean,
        default: () => false
    },
    showRefreshButton: {
        type: Boolean,
        default: () => false
    },
    showResetFiltersButton: {
        type: Boolean,
        default: () => false
    },

    showEditorByRowClick: {
        type: Boolean,
        default: () => false
    },

    allowGraphTaskStyles: {
        type: Boolean,
        default: () => false
    },
    allowColumnResizing: {
        type: Boolean,
        default: () => false
    },
    parentData: {
        type: Object,
        default: () => null
    },

    summary: {
        type: Object,
        default: () => null
    },

    selectedRowKeys: {
        type: Array,
        default: () => null
    },
    selectFirstRow: {
        type: Boolean,
        default: () => false
    },


    fileDownloadNameExpr: {
        type: String,
        default: () => null
    },
    fileDownloadUrl: {
        type: Function,
        default: () => null
    },
    fileUploadUrl: {
        type: Function,
        default: () => null
    },

    onFileUploaded: {
        type: Function,
        default: () => function() {}
    },
    onToolbarPreparing: {
        type: Function,
        default: () => function() {}
    },
    onContextMenuPreparing: {
        type: Function,
        default: () => function() {}
    },
    onContentReady: {
        type: Function,
        default: () => function() {}
    },
    onRowPrepared: {
        type: Function,
        default: () => function() {}
    },
    onCellPrepared: {
        type: Function,
        default: () => function() {}
    },
    onCellClick: {
        type: Function,
        default: () => function() {}
    },

    onInitNewRow: {
        type: Function,
        default: () => function() {}
    },
    onEditingStart: {
        type: Function,
        default: () => function() {}
    },
    onOptionChanged: {
        type: Function,
        default: () => function() {}
    },
    onSaving: {
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

    onRowExpanded: {
        type: Function,
        default: () => function() {}
    },
    onRowCollapsed: {
        type: Function,
        default: () => function() {}
    },

    onRowInserting: {
        type: Function,
        default: () => function() {}
    },
    onRowInserted: {
        type: Function,
        default: () => function() {}
    },
    onRowUpdating: {
        type: Function,
        default: () => function() {}
    },
    onRowUpdated: {
        type: Function,
        default: () => function() {}
    },
    onRowRemoving: {
        type: Function,
        default: () => function() {}
    },
    onRowRemoved: {
        type: Function,
        default: () => function() {}
    },
    onRefreshing: {
        type: Function,
        default: () => function() {}
    },
    onSelectionChanged: {
        type: Function,
        default: () => null
    },
    onResetFiltersButton: {
        type: Function,
        default: () => null
    },
    onExported: {
        type: Function,
        default: () => function() {}
    },
    scrolling: {
      type: Object,
      default: () => {
        return {
          columnRenderingMode: "standard",
          mode: "standard",
          preloadEnabled: false,
          renderAsync: undefined,
          rowRenderingMode: "standard",
          scrollByContent: false,
          scrollByThumb: false,
          showScrollbar: "onHover",
          useNative: "auto"
        }
      }
    },
    selectionMode: {
      type: String,
      default: () => "selectionMode"
    },
    showBorders: {
      type: Boolean,
      default: () => true
    },
  },
  computed: {
    pagerVisible() {
      if (this.showPageSelector) return true;
      return "auto";
    },
    paging() {
      return {
        enabled: this.allowPaging,
        pageIndex: 0,
        pageSize: this.pageSize
      }
    } 
  },
  methods: {
    getItemTitle(cellInfo, item) {
        if(cellInfo.column.lookup) {
            const displayExpr = cellInfo.column.lookup.displayExpr;
            let value;
            if(displayExpr) {
                if(displayExpr.includes('.')) {
                    value = { ...item};
                    const displaySplit = displayExpr.split('.');
                    for(let i in displaySplit) {
                        value = value[displaySplit[i]];
                    }
                }
                else {
                    value = item[displayExpr];
                }
            }
            if(value instanceof Date) {
                value = utils.dateToString(value);
            }
            return value;
        }
        return item.Title;
    },
    onReorder(e) {
      const visibleRows = e.component.getVisibleRows();
      const toIndex = this.dataSource.indexOf(visibleRows[e.toIndex].data);
      const fromIndex = this.dataSource.indexOf(e.itemData);
      const items = [...this.dataSource];

      items.splice(fromIndex, 1);
      items.splice(toIndex, 0, e.itemData);

      let reorderItems = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.SortIndex != i + 1) {
          item.SortIndex = i + 1;
          reorderItems.push({
            key: item[this.keyExpr],
            values: item
          });
        }
      }
      this.onReordering(reorderItems);
    },   
    setGridColumns() {
      let gridColumns = [];

      if (this.columns) {
        gridColumns = this.columns.map(column => {
          if (column.isRequired) {
            column.validationRules = [{
              type: "required"
            }];
          }

          if ((column.cellTemplate == "titlesTemplate" || column.cellTemplate == "numericTitlesTemplate") && column.lookup && column.lookup.valueExpr) {
            const valueExpr = column.lookup.valueExpr;
            column.calculateFilterExpression = function (filterValue, operation, target) {

              const dataField = this.dataField;
              if (target === 'search' && typeof (filterValue) === 'string') {
                return [dataField, 'contains', filterValue];
              } else {
                return function (data) {
                  let values = [];
                  if (data) {
                    if (dataField.includes('.')) {
                      values = {
                        ...data
                      };
                      const valueSplit = dataField.split('.');
                      for (let i in valueSplit) {
                        values = values[valueSplit[i]] || [];
                      }
                    } else {
                      values = data[dataField] || [];
                    }
                  }
                  if (filterValue) {
                    const result = values.find(v => v[valueExpr] == filterValue) !== undefined;
                    return result;
                  } else {
                    return values.length == 0;
                  }
                };
              }
            }
            if (column.dataField && column.lookup.displayExpr && !column.lookup.dataSource) {
              column.lookup.dataSource = () => {
                return utils.getLookupValues(this.dataSource, column.dataField, column.lookup.displayExpr);
              }
            }
          } else if (column.cellTemplate == "multilineTextTemplate") {
            column.editorType = "dxTextArea";

            if (!column.editorOptions) {
              column.editorOptions = {
                inputAttr: {
                  rows: 5
                },
              };
            }

            if (!column.formItem) {
              column.formItem = {
                // colSpan: 2,
                visible: true,
                editorType: "dxTextArea"
              };
            }
          }

          if (this.showFilterRow) {
            if (column.dataField == "SortIndex") {
              column.allowFiltering = false;
              column.allowHeaderFiltering = false;
            }
            if (column.lookup) {
              column.allowFiltering = false;
              column.allowHeaderFiltering = true;
            }
          }
          return column;
        });

        let buttonsColumnsWidth = 0;
        if (this.allowUpdating && this.editingMode != "batch") buttonsColumnsWidth += 40;
        if (this.allowDeleting) buttonsColumnsWidth += (buttonsColumnsWidth ? 20 : 40);
        if (buttonsColumnsWidth > 0) {
          gridColumns.push({
            type: "buttons",
            width: buttonsColumnsWidth,
          });
        }
      }
      this.gridColumns = gridColumns;
    },
        contextMenuPreparing(e) {
        if(this.grid) {            
            this.grid.cancelEditData();
        }
        if(this.showColumnChooser) {
            if(e.target == 'header') {
                if(!e.items) e.items = [];
                e.items.push({
                    text: localizeFilter("HideColumn"),
                    onItemClick: () => {
                        e.component.columnOption(e.column.dataField, "visible", false);
                    }
                });
            }
        }
        this.onContextMenuPreparing(e);

        if(e.target == 'content' && e.row && e.row.data) {
            if(!e.items) e.items = [];
            if(this.logMenuEnabled) {
                if(this.$store.getters.currentUserIsAllowedAction("LoadPageAppLogs")) {
                    const logObjectID = e.row.data[this.logKeyExpr];
                    const logTypeName = this.logTypeName ? this.logTypeName : this.logTypeFieldName ? e.row.data[this.logTypeFieldName] : null;
                    if(logObjectID && logTypeName) {
                        const logType = this.$store.getters.getTypes.find(t => t.Name == logTypeName) 
                        if(logType) {
                            const query = {type: logType.ID, id: logObjectID};
                            const routeData = this.$router.resolve({name: 'AppLogs', query});
                            componentUtils.contextMenuAddLink(e, routeData.href, "AppLogs", "event");
                        }
                    }
                }
            }
        }
    },
  },
  watch: {
      columns() {
          this.setGridColumns();
      }
  },
  mounted() {
      this.setGridColumns();
  }
}
</script>
     
<style>

    .data-grid-container {
        margin: 0;
        padding: 0;
    }

    .data-grid-container .tag-box-editor {
        display: block;
    }
    .data-grid-container .data-grid-box-editor {
        display: block;
        padding-bottom: 20px;
    }

    .data-grid-container .dx-datagrid {
        font-size: 11px;
    }

    .data-grid-container .dx-toolbar-items-container {
        border-top: 2px solid #fff;
    }

    .data-grid-container .dx-datagrid-rowsview .dx-row > .dx-master-detail-cell {
        padding: 0;
    }

    .data-grid-container .dx-invalid-message {
        display: none;
    }

    .data-grid-details-container {
        background-color: rgb(253, 252, 251);
        padding: 5px 10px 10px 20px;
    }

    .data-grid-sub-details-container {
        background-color: rgb(243, 242, 241);
        padding: 5px 10px 10px 20px;
    }

    .data-grid-container .rows-is-filtered {
        background-color: rgb(255, 196, 196);
        border: 1px solid rgb(255, 86, 86);
        border-radius: 3px;
    }

    .data-grid-container .rows-is-not-filtered {
        border: 1px solid rgb(212, 212, 212);
        border-radius: 3px;
    }

    .data-grid-hyperlink {
        text-decoration: underline;
        color: blue;
        cursor: pointer;
    }

</style>