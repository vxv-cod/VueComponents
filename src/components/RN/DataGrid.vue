<template>
    <div class="rn-data-grid rn-fonts" v-if="gridState" :style="gridStyle">
        <div class="rn-data-grid-toolbar">
          <div class="rn-data-grid-toolbar-left">
            <div class="rn-data-grid-group-panel" v-if="allowGrouping">
                <GroupPanel
                  :groups="gridRowGroups"
                  :allow-grouping="allowGrouping"
                  :on-sort-order-changed="columnSortOrderChanged"
                  :on-filter-changed="columnFilterChanged"
                  :on-grouping-removed="groupingRemoved"
                  :on-column-context-menu-item-click="columnContextMenuItemClick" />
            </div>
          </div>
          <div class="rn-data-grid-toolbar-right">
            <div class="rn-data-grid-control-panel">
                <ControlPanel
                  :columns="gridColumns"
                  :allow-adding="allowAdding"
                  :show-word-wrap-button="showWordWrapButton"
                  :show-column-chooser="showColumnChooser"
                  :show-reset-filters-button="showResetFiltersButton"
                  :on-word-wrap-changed="wordWrapChanged"
                  :on-selected-columns-changed="selectedColumnsChanged"
                  :on-filter-reset="columnFilterReset" />
            </div>
            <div class="rn-data-grid-search-panel" v-if="showSearchPanel">
                <SearchPanel
                  :on-search-text-changed="searchTextChanged" />
            </div>
          </div>
        </div>
        <div class="rn-data-grid-table rn-thin-scrollbar">
            <table v-if="gridRenderRows">
                <thead>
                    <DataGridHeader
                      :columns="gridHeaderColumns"
                      :allow-updating="allowUpdating"
                      :allow-deleting="allowDeleting"
                      :rows-check="headerRowsCheck"
                      :selection-mode="selectionMode"
                      :allow-column-resizing="allowColumnResizing"
                      :allow-column-fixing="allowColumnFixing"
                      :allow-grouping="allowGrouping"
                      :on-rows-checked="headerRowsChecked"
                      :on-sort-order-changed="columnSortOrderChanged"
                      :on-filter-changed="columnFilterChanged"
                      :on-column-resized="columnResized"
                      :on-column-context-menu-item-click="columnContextMenuItemClick" />
                </thead>
                <tbody>
                    <DataGridRow v-for="(row, index) in gridRenderRows" v-bind:key="index"
                      :columns="gridRowColumns"
                      :row="row"
                      :word-wrap="wordWrap"
                      :allow-updating="allowUpdating"
                      :allow-deleting="allowDeleting"
                      :selection-mode="selectionMode"
                      :on-row-click="rowClick"
                      :on-row-context-menu-item-click="rowContextMenuItemClick" />
                </tbody>
            </table>
        </div>
        <div class="rn-data-grid-pager-panel" v-if="allowPaging">
            <PagerPanel
              :pager="gridState.pager"
              :show-page-selector="showPageSelector"
              :on-selecion-page-size="selectionPageSize"
              :on-selecion-page="selectionPage" />
        </div>
    </div>
</template>
<script>
  const includesCaseInsensitive = (str, searchString) => new RegExp(searchString, 'i').test(str);
  
  import GroupPanel from './GroupPanel.vue';
  import ControlPanel from './ControlPanel.vue';
  import SearchPanel from './SearchPanel.vue';
  import DataGridHeader from './DataGridHeader.vue';
  import DataGridRow from './DataGridRow.vue';
  import PagerPanel from './PagerPanel.vue';
  import utils from '@/utils';
  
  export default {
    components: {
        GroupPanel,
        ControlPanel,
        SearchPanel,
        DataGridHeader,
        DataGridRow,
        PagerPanel
    },
    props: {
        userStateKey: {
            type: String,
            default: () => null
        },
        logMenuEnabled: {
            type: Boolean,
            default: () => false
        },
        logTypeName: {
            type: String,
            default: () => null
        },
        logTypeFieldName: {
            type: String,
            default: () => "LogTypeName"
        },
        logKeyExpr: {
            type: String,
            default: () => "Id"
        },
        width: {
            //type: Number,
            default: () => null
        },
        height: {
            // type: Number,
            default: () => null
        },
        showColumnChooser: {
            type: Boolean,
            default: () => false
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
        showSearchPanel: {
            type: Boolean,
            default: () => false
        },
        showFilterRow: {
            type: Boolean,
            default: () => false
        },
        showPageSelector: {
            type: Boolean,
            default: () => false
        },
        showEditorByRowClick: {
            type: Boolean,
            default: () => false
        },
        /*allowGraphTaskStyles: {
            type: Boolean,
            default: () => false
        },*/
        allowColumnResizing: {
            type: Boolean,
            default: () => false
        },
        allowColumnFixing: {
            type: Boolean,
            default: () => false
        },
        allowPaging: {
            type: Boolean,
            default: () => true
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
        allowGrouping: {
            type: Boolean,
            default: () => false
        },
        allowMasterDetail: {
            type: Boolean,
            default: () => false
        },
        parentData: {
            type: Object,
            default: () => null
        },
        columns: {
            type: Array,
            default: () => []
        },
        buttonsColumns: {
            type: Object,
            default: () => null
        },
        summary: {
            type: Object,
            default: () => null
        },
        dataSource: {
            default: () => null
        },
        selectedRowKeys: {
            type: Array,
            default: () => []
        },
        keyExpr: {
            type: String,
            default: () => "Id"
        },
        editingMode: {
            type: String,
            default: () => "popup"
        },
        editingFormTitle: {
            type: String,
            default: () => null
        },
        editingFormWidth: {
            type: String,
            default: () => null
        },
        editingFormHeight: {
            type: String,
            default: () => null
        },
        selectionMode: {
            type: String,
            default: () => "single"
        },
        selectFirstRow: {
            type: Boolean,
            default: () => false
        },
        exportEnabled: {
            type: Boolean,
            default: () => false
        },
        exportFileName: {
            type: String,
            default: () => null
        },
        wordWrapEnabled: {
            type: Boolean,
            default: () => true
        },
        pageSize: {
            type: Number,
            default: () => 20
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
            default: () => function () { }
        },
        onToolbarPreparing: {
            type: Function,
            default: () => function () { }
        },
        onContextMenuPreparing: {
            type: Function,
            default: () => function () { }
        },
        onContentReady: {
            type: Function,
            default: () => function () { }
        },
        onRowPrepared: {
            type: Function,
            default: () => function () { }
        },
        onCellPrepared: {
            type: Function,
            default: () => function () { }
        },
        onCellHoverChanged: {
            type: Function,
            default: () => function () { }
        },
        onCellClick: {
            type: Function,
            default: () => function () { }
        },
        onIndicatorCounterClick: {
            type: Function,
            default: () => function () { }
        },
        onInitNewRow: {
            type: Function,
            default: () => function () { }
        },
        onEditingStart: {
            type: Function,
            default: () => function () { }
        },
        onEditCanceling: {
            type: Function,
            default: () => function () { }
        },
        onOptionChanged: {
            type: Function,
            default: () => function () { }
        },
        onSaving: {
            type: Function,
            default: () => function () { }
        },
        onEditorPreparing: {
            type: Function,
            default: () => function () { }
        },
        onRowValidating: {
            type: Function,
            default: () => function () { }
        },
        onRowExpanded: {
            type: Function,
            default: () => function () { }
        },
        onRowExpanding: {
            type: Function,
            default: () => function () { }
        },
        onRowCollapsed: {
            type: Function,
            default: () => function () { }
        },
        onRowInserting: {
            type: Function,
            default: () => function () { }
        },
        onRowInserted: {
            type: Function,
            default: () => function () { }
        },
        onRowUpdating: {
            type: Function,
            default: () => function () { }
        },
        onRowUpdated: {
            type: Function,
            default: () => function () { }
        },
        onRowRemoving: {
            type: Function,
            default: () => function () { }
        },
        onRowRemoved: {
            type: Function,
            default: () => function () { }
        },
        onReordering: {
            type: Function,
            default: () => function () { }
        },
        onRefreshing: {
            type: Function,
            default: () => function () { }
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
            default: () => function () { }
        },
        formOptions: {
            type: Object,
            //   default: () => null
        },
        editingPopupResizeEnabled: {
            type: Boolean,
            dafault: () => true
        },
        allowEditCustomCell: {
            type: Function,
            default: () => function () { }
        },
        onOperationButtonsPreparing: {
            type: Function,
            dafault: () => null
        },
        allowColumnReordering: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            gridComponent: null,
            gridState: null,
            gridColumns: null,
            gridRows: null,
            gridFilterRows: null,
            gridSortingRows: null,
            gridPageRows: null,
            gridRenderRows: null,
            gridRowGroups: null,
            gridSearchText: null,
            gridColumnsFilter: null,
            headerRowsCheck: false,
            wordWrap: this.wordWrapEnabled,
            maxGroupCount: 5
        }
    },
    methods: {
        // Подготовка состояния
        initState() {
          this.gridState = {
            columns: [],
            rows: [],
            pager: {
              rowsCount: 0,
              pageSize: this.pageSize,
              pageCount: 0,
              currentPageIndex: 0
            },
          }
        },
        
        // Подготовка столбцов
        initColumns() {
          let gridColumns = [];

          let headerRowsCount = 1;

          const addColumn = (column, headerRowNumber) => {
            column.headerRowNumber = headerRowNumber;
            if(headerRowsCount < headerRowNumber) {
              headerRowsCount = headerRowNumber;
            }
            if(!column.dataField && column.columns && column.columns.length > 0) {
              column.type = "group";
              column.name = column.caption;
              for(let childColumn of column.columns) {
                childColumn.parent = column;
                addColumn(childColumn, headerRowNumber+1);
              }
            }
            else if(column.dataField) {
              column.type = "data";
              if(!column.name) {
                column.name = column.dataField;
              }
            }
            gridColumns.push(column);
          }

          let originalIndex = 0;
          for(let column of this.columns) {
            let gridColumn = {...column};
            gridColumn.originalIndex = originalIndex;
            addColumn(gridColumn, 1);
            originalIndex++;
          }

          for(let rowNumber = headerRowsCount; rowNumber >= 1; rowNumber--) {
            for(let column of gridColumns.filter(c => c.headerRowNumber === rowNumber)) {
              if(column.type === "group") {
                column.headerRowspan = 1;
                column.headerColspan = 0;
                for(let childColumn of gridColumns.filter(c => c.parent === column)) {
                  column.headerColspan = column.headerColspan + childColumn.headerColspan;
                }
              }
              if(column.type === "data") {
                column.headerRowspan = headerRowsCount - rowNumber + 1;
                column.headerColspan = 1;
              }
            }
          }

          this.gridColumns = gridColumns;

          // console.log("gridColumns", this.gridColumns)
        },

        // Подготовка видимых столбцов (для заголовков и строк)
        initVisibleColumns() {
        
          utils.sortItems(this.gridColumns, "originalIndex");

          for(let column of this.gridColumns) {
            const stateColumn = this.gridState.columns.find(c => c.name === column.name);
            if(stateColumn) {
              column.filterItems = stateColumn.filterItems;
              column.selectedValues = stateColumn.selectedValues;
              column.visible = stateColumn.visible;
              column.fixed = stateColumn.fixed;
              column.fixedPosition = stateColumn.fixedPosition;
              column.width = stateColumn.width;
            }
            else {
              column.filterItems = [];
              column.selectedValues = [];
              this.gridState.columns.push(column);
            }
            column.selected = column.visible;
          }

          if(this.gridColumns.find(c => c.fixed)) {
            let gridColumns = [];
            gridColumns = gridColumns.concat(this.gridColumns.filter(c => c.fixed && c.fixedPosition !== 'right'));
            gridColumns = gridColumns.concat(this.gridColumns.filter(c => !c.fixed));
            gridColumns = gridColumns.concat(this.gridColumns.filter(c => c.fixed && c.fixedPosition === 'right'));
            this.gridColumns = gridColumns;
          }

          let visibleIndex = 0;
          for(let column of this.gridColumns) {
            if(column.type === "group") {
              column.visible = !!column?.columns.find(c => c.visible);
            }
            
            if(column.visible && column.groupIndex == null && !column.parent) {
              column.visibleIndex = visibleIndex;
              visibleIndex++;
            }
          }

          // console.log("gridColumns", this.gridColumns)
        },

        // Подготовка групп (при наличии группировок по столбцам)
        initRowGroups() {
          if(this.gridColumns) {
            let gridRowGroups = [];
            let level = 0;
            let groupColumns = this.gridColumns.filter(column => column.groupIndex != null);
            utils.sortItems(groupColumns, "groupIndex");
            for (let column of groupColumns) {
              if(column.visible) {
                gridRowGroups.push({
                  level,
                  column
                });
                level++;
              }
            }
            this.gridRowGroups = gridRowGroups;
            // console.log("gridRowGroups", gridRowGroups)
          }
        },

        // Подготовка строк (создание из dataSource массива строк с доп.атрибутами) добавление ячеек
        initRows() {
          let gridRows = [];
          if(this.gridColumns && this.dataSource) {
            for (let data of this.dataSource) {
              // Новая строка
              let gridRow = {
                key: data[this.keyExpr],
                type: 'data',
                data,
                cells: []
              };
              // Добавление ячеек в новую строку
              for(let column of this.gridColumns) {
                const cell = this.getCell(column, data[column.dataField]);
                gridRow.cells.push(cell);
              }
              gridRows.push(gridRow);
            }
          }
          this.gridRows = gridRows;
          // console.log("gridRows", gridRows)
        },

        // Группировка строк
        groupingRows() {
          for (let gridRow of this.gridRows) {
            gridRow.groupKeys = [];
            gridRow.groups = [];
            gridRow.groupCells = [];
            for(let cell of gridRow.cells) {
              cell.groupIndex = cell.column.groupIndex;
            }
            if(this.gridRowGroups.length > 0) {
              for(let group of this.gridRowGroups) {
                const groupCell = gridRow.cells.find(cell => cell.groupIndex === group.column.groupIndex);
                if(groupCell) {
                  let groupKey = "";
                  if(group.column.groupIndex > 0) {
                    groupKey = `${gridRow.groupKeys[group.column.groupIndex - 1]},`;
                  }
                  groupKey += groupCell.value?.toString() ?? "";
                  gridRow.groupKeys.push(groupKey);
                  gridRow.groups.push(group)
                  gridRow.groupCells.push(groupCell);
                  groupCell.groupKey = groupKey;
                }
              }
            }
            gridRow.level = gridRow.groups.length;
          }
        },

        // Фильтрация строк
        filteringRows() {
          let gridFilterRows = [];
          let filteredColumns = [];
          // Подготовка столбцов из данных состояния
          for (let column of this.gridColumns) {
            const stateColumn = this.getStateColumn(column.name);
            if(stateColumn.selectedValues && stateColumn.selectedValues.length) {
              column.selectedValues = stateColumn.selectedValues;
              filteredColumns.push(column);
            }
            else {
              column.selectedValues = [];
            }
          }
          for(let gridRow of this.gridRows) {
            // Проверка вхождения по строке Искать...
            let includeSearch;
            if(this.gridSearchText) {
              const searchRowText = gridRow.cells.map(cell => cell.displayValue).join("");
              includeSearch = includesCaseInsensitive(searchRowText, this.gridSearchText);
            }
            else {
              includeSearch = true;
            }

            const setCellFilterObject = (cell, value, sortValue, displayValue) => {
              if(cell.column.filterObject == null) {
                cell.column.filterObject = {};
              }
              if(cell.column.filterObject[value] == null) {
                cell.column.filterObject[value] = {
                  value,
                  sortValue,
                  displayValue,
                  selected: !!cell.column.selectedValues.find(v => v === value),
                  rowsCount: 0,
                  disabled: true
                }
              }
            }

            if(includeSearch) {
              // Формирование списка уникальных значений для фильтра столбца
              let includeCell = 0;
              for(let cell of gridRow.cells) {
                // Значение ячейки это массив значений
                if(cell.values) {
                  let includeValue = false;
                  for(let i in cell.values) {
                    const value = cell.values[i];
                    const sortValue = cell.sortValues[i];
                    const displayValue = cell.displayValues[i];
                    setCellFilterObject(cell, value, sortValue, displayValue);
                    if(cell.column.selectedValues.length === 0 || cell.column.filterObject[value].selected) {
                      includeValue = true;
                    }
                    cell.column.filterObject[value].rowsCount++;
                  }
                  if(includeValue) {
                    includeCell++;
                  }
                }
                // Значение ячейки это одно значение
                else {
                  const value = cell.value;
                  const sortValue = cell.sortValue;
                  const displayValue = cell.displayValue;
                  setCellFilterObject(cell, value, sortValue, displayValue);
                  if(cell.column.selectedValues.length === 0 || cell.column.filterObject[value].selected) {
                    includeCell++;
                  }
                  cell.column.filterObject[value].rowsCount++;
                }
              }
              // Если значения всех ячеек строки соответствуют критерию фильтрации
              if(includeCell === gridRow.cells.length) {
                for(let cell of gridRow.cells) {
                  if(cell.values) {
                    for(let value of cell.values) {
                      cell.column.filterObject[value].disabled = false;
                    }
                  }
                  else {
                    cell.column.filterObject[cell.value].disabled = false;
                  }
                }
                gridFilterRows.push(gridRow);
              }
            }
          }
          // Завершение подготовки фильтров столбцов
          for (let column of this.gridColumns) {
            column.filterItems = column.filterObject ? Object.values(column.filterObject) : [];
            delete column.filterObject;
          }

          this.gridFilterRows = gridFilterRows;
          // console.log("gridFilterRows", gridFilterRows)
        },

        // Сортировка строк
        sortingRows() {
          let gridSortingRows = [];
          let sortOrder;
          
          // Сортировка списка уникальных значений фильтра столбца
          for (let column of this.gridColumns) {
            const stateColumn= this.getStateColumn(column.name);
            if(stateColumn) {
              if(stateColumn.sortIndex >= 0 && !!stateColumn.sortOrder) {
                column.sortIndex = stateColumn.sortIndex;
                column.sortOrder = stateColumn.sortOrder;
                for(let row of this.gridFilterRows) {
                  const sortCell = row.cells.find(cell => cell.column === column);
                  row.sortValue = sortCell?.sortValue;
                }
                sortOrder = column.sortOrder;
                // utils.sortItems(this.gridFilterRows, "sortValue", column.sortOrder);
                // console.log("sortItems", column)
              }
              else {
                column.sortIndex = null;
                column.sortOrder = null;
              }
            }
            utils.sortItems(column.filterItems, "sortValue");
          }

          // При наличии группировок
          if(this.gridRowGroups.length > 0) {
            const groupResults = {};

            for(let row of this.gridFilterRows) {
              const groupKey = row.groupCells.map(cell => cell.value).join(",");
              if(groupResults[groupKey] === undefined) {
                groupResults[groupKey] = {
                  rows: []
                };
              }
              for(let cell of row.groupCells) {
                groupResults[groupKey][cell.column.dataField] = cell.sortValue;
              }
              groupResults[groupKey].rows.push(row);
            }

            const groupResultArray = Object.values(groupResults);
            const sortFields = this.gridRowGroups.map(group => { return { key: group.column.dataField}});

            utils.sortItemsMultiple(groupResultArray, sortFields);

            for(let groupResult of groupResultArray) {
              utils.sortItems(groupResult.rows, "sortValue", sortOrder);
              gridSortingRows = gridSortingRows.concat(groupResult.rows);
            }
          }
          // При отсутствии группировок
          else {
            // Сортировка всех строк по столбцу сортировки
            utils.sortItems(this.gridFilterRows, "sortValue", sortOrder);
            
            gridSortingRows = this.gridFilterRows;
          }

          this.gridSortingRows = gridSortingRows;

          // console.log("gridSortingRows", gridSortingRows);
        },

        // Пагинация строк
        pagingRows() {
          let gridPageRows = [];
          const pager = {...this.gridState.pager};

          if(this.allowPaging) {
            pager.rowsCount = this.gridSortingRows.length;
            pager.pageCount = Math.ceil(pager.rowsCount / pager.pageSize, 0);
            if(pager.currentPageIndex > pager.pageCount - 1) {
              pager.currentPageIndex = 0;
            }
            const startRowIndex = pager.pageSize * pager.currentPageIndex;
            let endRowIndex = startRowIndex + pager.pageSize - 1;
            if(endRowIndex > pager.rowsCount - 1) endRowIndex = pager.rowsCount - 1;
            let rowIndex = 0;
            for(let row of this.gridSortingRows) {
              if(rowIndex >= startRowIndex && rowIndex <= endRowIndex) {
                row.RowNumber = rowIndex + 1;
                gridPageRows.push(row);
              }
              rowIndex++;
            }
          }
          else {
            gridPageRows = this.gridSortingRows;
          }

          this.gridState.pager = pager;

          this.gridPageRows = gridPageRows;
          // console.log("gridPageRows", {pager, gridPageRows})
        },

        // Вставка строк группировки и детализации
        renderRows() {
          let gridRenderRows = [];
          let gridGroupRows = [];

          const newGroupRow = (group, key, cell) => {
            const filterItem = group.column.filterItems.find(item => item.value === cell.value);
            const groupRow = {
              key,
              type: 'group',
              group,
              value: cell.value,
              dataField: group.column.dataField,
              caption: cell.displayValue,
              level: group.level,
              pageRowsCount: 0,
              childRowsCount: filterItem?.rowsCount ?? 0
            };
            return groupRow;
          }

          const renderingRow = (row) => {
            const stateRow = this.getStateRow(row.key);
            row.selected = stateRow.selected ?? false;
            row.fixed = stateRow.fixed;
            row.fixedPosition = stateRow.fixedPosition;
            gridRenderRows.push(row);
          }

          for(let row of this.gridPageRows) {
            // При наличии группировок
            if(this.gridRowGroups.length > 0) {
              row.groupRows = [];
              for(let group of this.gridRowGroups) {
                const key = row.groupKeys[group.level];
                const cell = row.groupCells[group.level];
                if(key && cell) {
                  let isNewGroupRow = false;
                  let groupRow = gridGroupRows.find(r => r.key === key);
                  if(!groupRow) {
                    groupRow = newGroupRow(group, key, cell);
                    gridGroupRows.push(groupRow);
                    isNewGroupRow = true;
                  }
                  
                  const stateGroupRow = this.getStateRow(groupRow.key);
                  groupRow.expanded = group.column.expandedGroupRows != null ? group.column.expandedGroupRows : stateGroupRow.expanded ?? true;
                  groupRow.pageRowsCount++;

                  if(!row.groupRows.find(r => !r.expanded)) {
                    row.groupRows.push(groupRow);
                    if(isNewGroupRow) {
                      gridRenderRows.push(groupRow);
                    }
                  }
                }
              }
              if(!row.groupRows.find(r => !r.expanded)) {
                renderingRow(row);
              }
            }
            // При отсутствии группировок
            else {
              renderingRow(row);
            }
          }

          // const renderingGroupRows = (level) => {
          //     const group = this.gridRowGroups.find(g => g.level === level);
          //     if(group) {
          //       for(let filterItem of group.column.filterItems) {
          //         const groupValue = filterItem.value;
          //         const childRows = this.gridPageRows.filter(row => row.groupValue === groupValue);
          //         const allChildRows = this.gridPageRows.filter(row => row.groupValues[group.level] === groupValue);

          //         if(allChildRows.length > 0) {
          //           const groupRow = {
          //             key: group.column.name + group.groupIndex + groupValue,
          //             type: 'group',
          //             group,
          //             caption: filterItem.displayValue,
          //             childRows,
          //             allChildRows,
          //             level: group.level
          //           };
                    
          //           const stateGroupRow = this.getStateRow(groupRow.key);
          //           groupRow.expanded = group.column.expandedGroupRows != null ? group.column.expandedGroupRows : stateGroupRow.expanded ?? true;
          //           gridRenderRows.push(groupRow);

          //           if(groupRow.expanded && childRows.length > 0) {
          //             for(let childRow of childRows) {
          //               renderingRow(childRow);
          //             }
          //           }

          //           // console.log("childRows", {filterItem, groupRow, groupValue, childRows, allChildRows})

          //         }

          //         const nextGroupIndex = level + 1;
          //         if(nextGroupIndex < this.gridRowGroups.length) {
          //           renderingGroupRows(nextGroupIndex);
          //         }
          //       }
          //     }
          // }

          // if(this.gridRowGroups.length > 0) {
          //   renderingGroupRows(0);
          // }
          // else {
          //   for(let row of this.gridPageRows) {
          //     renderingRow(row);
          //   }
          // }

          this.gridRenderRows = gridRenderRows;
          this.setRowsCounters();

          // console.log("gridRenderRows", gridRenderRows);


          setTimeout(() => {
            
            let offsetLeftWidth = 0;
            let offsetRightWidth = 0;

            const setLeftElements = (query) => {
              const elements = document.querySelectorAll(query);
              if(elements.length > 0) {
                for(let element of elements) {
                  element.style.left = `${offsetLeftWidth}px`;
                }
                offsetLeftWidth += elements[0].offsetWidth;
              }
            }

            const setRightElements = (query) => {
              const elements = document.querySelectorAll(query);
              if(elements.length > 0) {
                for(let element of elements) {
                  element.style.right = `${offsetRightWidth}px`;
                }
                offsetRightWidth += elements[0].offsetWidth;
              }
            }
            
            setLeftElements(".rn-fixed-left-checking");
            setLeftElements(".rn-fixed-left-control");
            
            const leftFixedColumns = this.gridColumns.filter(c => c.fixed && c.fixedPosition !== 'right' && c.visibleIndex >= 0);
            for(let i = 0; i < leftFixedColumns.length; i++) {
              const column = leftFixedColumns[i];
              setLeftElements(`.rn-fixed-left-cell[data-index='${column.visibleIndex}']`);
            }
            
            setRightElements(".rn-fixed-right-control");
            
            const rightFixedColumns = this.gridColumns.filter(c => c.fixed && c.fixedPosition === 'right' && c.visibleIndex >= 0);
            for(let i = rightFixedColumns.length - 1; i >= 0; i--) {
              const column = rightFixedColumns[i];
              setRightElements(`.rn-fixed-right-cell[data-index='${column.visibleIndex}']`);
            }
          });
        },




        getCell(column, value) {
          let displayValue = value;
          let sortValue = value;
          let values;
          let displayValues;
          let sortValues;

          if(column) {
            // Дата-время
            if(column.dataType === "date") {
              if(value instanceof Date) {
                displayValue = utils.dateTimeToStringFormat(value, column.format)
                sortValue = value.getTime();
              }
            }
            // Булевое
            else if(column.dataType === "boolean") {
              displayValue = value ? this.$filters.localize("Yes") : this.$filters.localize("No");
            }
            // Числовое
            else if(column.dataType === "number") {
              displayValue = value ? value.toString() : "";
            }
            // Массив
            else if(value instanceof Array) {
              if(column.lookup && column.lookup.displayExpr) {
                displayValue = value.map(v => v[column.lookup.displayExpr]).join(', ');
                displayValues = value.map(v => v[column.lookup.displayExpr]);
                sortValue = displayValue.toLowerCase();
                sortValues = displayValues.map(v => v.toLowerCase());
                if(column.lookup.valueExpr) {
                  values = value.map(v => v[column.lookup.valueExpr]);
                  value = values.join(',');
                }
              }
            }
            // Справочник
            else if(column.lookup && column.lookup.dataSource) {
              if(column.lookup.displayExpr && column.lookup.valueExpr) {
                let dataSource = [];
                if(column.lookup.dataSource instanceof Array) {
                  dataSource = column.lookup.dataSource;
                }
                else if(typeof column.lookup.dataSource === 'function') {
                  dataSource = column.lookup.dataSource();
                }
                const data = dataSource.find(r => r[column.lookup.valueExpr] === value);
                if(data) {
                  displayValue = data[column.lookup.displayExpr];
                  sortValue = displayValue;
                }
              }
            }
            // Строка
            else if(typeof value === "string") {
              sortValue = value.toLowerCase();
            }
          }
          if(values) {
            return { column, value, values, displayValue, displayValues, sortValue, sortValues };
          }
          return { column, value, displayValue, sortValue };
        },
        getStateColumn(name) {
          let stateColumn = this.gridState.columns.find(column => column.name === name);
          if(!stateColumn) {
            stateColumn = { 
              name,
              visible: false,
              filterItems: [],
              selectedValues: [] };
            this.gridState.columns.push(stateColumn);
          }
          return stateColumn;
        },
        getStateRow(key) {
          let stateRow = this.gridState.rows.find(row => row.key === key);
          if(!stateRow) {
            stateRow = { key, expanded: true };
            this.gridState.rows.push(stateRow);
          }
          return stateRow;
        },
        headerRowsChecked(rowsCheck) {
          // console.log("headerRowsChecked", rowsCheck)
          for(let row of this.gridRows) {
            let stateRow = this.getStateRow(row.key);
            stateRow.selected = rowsCheck;
            row.selected = rowsCheck;
          }
          this.selectionChanged();
        },
        rowClick(e) {
          if(e.row) {
            if(e.row.type === 'group') {
              const stateRow = this.getStateRow(e.row.key);
              stateRow.expanded = !stateRow.expanded;
              e.row.group.column.expandedGroupRows = null;
              this.renderRows();
            }
            else if(e.row.type === 'data') {
              if(this.selectionMode === 'single') {
                for(let row of this.gridRows) {
                  let stateRow = this.getStateRow(row.key);
                  if(row.key === e.row.key) {
                    stateRow.selected = e.row.selected;
                    row.selected = e.row.selected;
                  }
                  else {
                    stateRow.selected = false;
                    row.selected = false;
                  }
                }
              }
              else if(this.selectionMode === 'multiple') {
                let stateRow = this.getStateRow(e.row.key);
                stateRow.selected = e.row.selected;
              }
              this.selectionChanged();
            }
          }
        },
        rowContextMenuItemClick(e) {
          const stateRow = this.getStateRow(e.row.key);

          console.log("columnContextMenuItemClick", e.item.Name, e.row.key, {e, stateRow})

          if(e.item.Name === "Ungrouping") {
            if(e.row.group && e.row.group.column) {
              e.row.group.column.groupIndex = null;
              this.initVisibleColumns();
              this.initRowGroups();
              // this.initRows();
              this.groupingRows();
              // this.filteringRows();
              this.sortingRows();
              this.pagingRows();
              this.renderRows();
            }
          }
        },
        selectionChanged() {
          const selectedRowsData = this.gridRows.filter(row => row.selected).map(row => row.data);
          this.onSelectionChanged({
            selectedRowsData
          });
          if(selectedRowsData.length === 0) {
            this.headerRowsCheck = false;
          }
          else if(selectedRowsData.length === this.gridRows.length) {
            this.headerRowsCheck = true;
          }
          else {
            this.headerRowsCheck = null;
          }
          this.setRowsCounters();
        },
        setRowsCounters() {
          const pager = this.gridState.pager;
          pager.selectedRowsCount = this.gridRows.filter(row => row.selected).length;
          pager.selectedPageRowsCount = this.gridPageRows.filter(row => row.selected).length;
        },
        columnSortOrderChanged(e) {
          // console.log("columnSortOrderChanged", e.column)
          if(e.column) {
            for(let column of this.gridColumns) {
              const stateColumn= this.getStateColumn(column.name);
              if(column.name === e.column.name) {
                stateColumn.sortOrder = stateColumn.sortOrder == "asc" ? "desc" : "asc";
                stateColumn.sortIndex = 0;
              }
              else {
                stateColumn.sortOrder = null;
                stateColumn.sortIndex = null;
              }
              // console.log("stateColumn", stateColumn)
            }
          }
          this.sortingRows();
          this.pagingRows();
          this.renderRows();
        },
        columnFilterChanged(e) {
          // console.log("columnFilter", e.column)
          if(e.column) {
            const stateColumn= this.getStateColumn(e.column.name);
            stateColumn.selectedValues = e.column.filterItems.filter(item => item.selected).map(item => item.value);
            this.filteringRows();
            this.sortingRows();
            this.pagingRows();
            this.renderRows();
          }
        },
        wordWrapChanged() {
          this.wordWrap = !this.wordWrap;
        },
        selectedColumnsChanged(e) {
          for(let gridColumn of this.gridColumns) {
            const stateColumn= this.getStateColumn(gridColumn.name);
            stateColumn.visible = !!e.selectedColumns.find(c => c.name === gridColumn.name);
          }

          this.initVisibleColumns();
          this.initRowGroups();
          // this.initRows();
          this.groupingRows();
          // this.filteringRows();
          this.sortingRows();
          this.pagingRows();
          this.renderRows();
        },
        columnFilterReset() {
          for(let stateColumn of this.gridState.columns) {
            stateColumn.selectedValues = [];
          }
          this.filteringRows();
          this.sortingRows();
          this.pagingRows();
          this.renderRows();
        },
        columnResized(e) {
          if(e.column) {
            const stateColumn= this.getStateColumn(e.column.name);
            stateColumn.width = e.width;
          }
        },
        columnContextMenuItemClick(e) {
          const stateColumn= this.getStateColumn(e.column.name);

          console.log("columnContextMenuItemClick", e.item.Name, e.column.name, {e, stateColumn, stateRows: this.gridState.rows})

          if(e.item.Name === "Grouping") {
            let maxGroupIndex = null;
            for(let column of this.gridColumns.filter(c => c.groupIndex != null)) {
              if(maxGroupIndex == null || maxGroupIndex < column.groupIndex) {
                maxGroupIndex = column.groupIndex;
              }
            }
            e.column.groupIndex = maxGroupIndex != null ? (maxGroupIndex + 1) : 0;
            this.initVisibleColumns();
            this.initRowGroups();
            // this.initRows();
            this.groupingRows();
            // this.filteringRows();
            this.sortingRows();
            this.pagingRows();
            this.renderRows();
          }
          else if(e.item.Name === "GroupExpandAllRows") {
            e.column.expandedGroupRows = true;
            this.groupingRows();
            this.renderRows();
          }
          else if(e.item.Name === "GroupCollapseAllRows") {
            e.column.expandedGroupRows = false;
            this.groupingRows();
            this.renderRows();
          }
          else if(e.item.Name === "Invisible") {
            stateColumn.visible = false;
            this.initVisibleColumns();
            this.initRowGroups();
            // this.initRows();
            this.groupingRows();
            // this.filteringRows();
            this.sortingRows();
            this.pagingRows();
            this.renderRows();
          }
          else if(e.item.Name === "FixedLeft") {
            stateColumn.fixed = true;
            stateColumn.fixedPosition = "left";
            this.initVisibleColumns();
            this.renderRows();
          }
          else if(e.item.Name === "FixedRight") {
            stateColumn.fixed = true;
            stateColumn.fixedPosition = "right";
            this.initVisibleColumns();
            this.renderRows();
          }
          else if(e.item.Name === "Unfixed") {
            stateColumn.fixed = false;
            stateColumn.fixedPosition = null;
            this.initVisibleColumns();
            this.renderRows();
          }
        },
        searchTextChanged(searchText) {
          // console.log("searchTextChanged", searchText)
          this.gridSearchText = searchText;
          this.filteringRows();
          this.sortingRows();
          this.pagingRows();
          this.renderRows();
        },
        selectionPageSize(size) {
          const pager = this.gridState.pager;
          pager.pageSize = size;
          this.pagingRows();
          this.renderRows();
        },
        selectionPage(index) {
          const pager = this.gridState.pager;
          pager.currentPageIndex = index;
          this.pagingRows();
          this.renderRows();
        },
        groupingRemoved(group) {
          if(group && group.column) {
            group.column.groupIndex = null;
            this.initVisibleColumns();
            this.initRowGroups();
            // this.initRows();
            this.groupingRows();
            // this.filteringRows();
            this.sortingRows();
            this.pagingRows();
            this.renderRows();
          }
        }
    },
    computed: {
      gridStyle() {
        let style = "";
        if(typeof this.width === "number") {
          style += "width:" + this.width + "px;";
        }
        else if(typeof this.width === "string") {
          style += "width:" + this.width + ";"
        }
        else {
          style += "width:100%;"
        }
        if(typeof this.height === "number") {
          style += "height:" + this.height + "px;";
        }
        else if(typeof this.height === "string") {
          style += "height:" + this.height + ";"
        }
        return style;
      },
      gridHeaderColumns() {
        return this.gridColumns?.filter(column => column.visible && column.groupIndex == null) ?? [];
      },
      gridRowColumns() {
        return this.gridColumns?.filter(column => column.visible && column.groupIndex == null && column.type === 'data') ?? [];
      },
    },
    watch: {
        // columns() {
        // },
        dataSource() {
          this.initRows();
          this.groupingRows();
          this.filteringRows();
          this.sortingRows();
          this.pagingRows();
          this.renderRows();
        }
    },
    mounted() {
      this.initState();
      if(this.columns && this.columns.length > 0) {
        this.initColumns();
        this.initVisibleColumns();
        this.initRowGroups();
        if(this.dataSource && this.dataSource.length > 0) {
          this.initRows();
          this.groupingRows();
          this.filteringRows();
          this.sortingRows();
          this.pagingRows();
          this.renderRows();
        }
      }
    }
};
</script>
<style>
.rn-data-grid {
  margin: 0;
  padding: 0;
  border: 0;
  display: flex;
  flex-direction: column;
}
.rn-data-grid-toolbar {
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin: 3px 0;
  padding: 0
}
.rn-data-grid-toolbar-left {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: nowrap;
}
.rn-data-grid-toolbar-right {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex-wrap: nowrap;
}
.rn-group-panel,
.rn-control-panel,
.rn-search-panel {
  padding: 2px, 0;
}
.rn-data-grid-table {
    flex: 1 1 auto;
    overflow: auto;
    margin: 0;
    padding: 0;
    border-collapse: collapse;
    table-layout: fixed;
}
.rn-data-grid-table table,
.rn-data-grid-table thead,
.rn-data-grid-table tbody,
.rn-data-grid-table th,
.rn-data-grid-table tr,
.rn-data-grid-table td {
    border-spacing: 0;
    margin: 0;
    padding: 0;
    border: 0;
}

.rn-data-grid-table table {
  overflow: hidden;
}

.rn-data-grid-table th {
  overflow: hidden;
}

.rn-data-grid-table th,
.rn-data-grid-table tr,
.rn-data-grid-table td {
    height: 100%;
}

.rn-data-grid-table table thead
 {
  position: sticky;
  z-index: 100;
  top: 0;
}

.rn-data-grid-pager-panel {
  flex: 0 0 30px;
}

.rn-data-grid-header,
.rn-data-grid-row {
  position: relative;
}

.rn-fixed-left-checking,
.rn-fixed-left-control,
.rn-fixed-left-cell,
.rn-fixed-right-control,
.rn-fixed-right-cell {
    position: sticky !important;
    z-index: 1;
}
.rn-fixed-left-checking,
.rn-fixed-left-control,
.rn-fixed-left-cell {
    left: 0;
}
.rn-fixed-right-control,
.rn-fixed-right-cell {
    right: 0;
}

</style>
