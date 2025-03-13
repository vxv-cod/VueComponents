<template>
  <div class="page">
    <div class="header">
      <div class="menu">
        <div :class="`menuItem ${selectedGridIndex === 0 ? 'selected' : ''}`">
          <a @click="menuClick(0)">RnDataGrid</a>
        </div>
        <div :class="`menuItem ${selectedGridIndex === 1 ? 'selected' : ''}`">
          <a @click="menuClick(1)">DxDataGrid</a>
        </div>
      </div>
    </div>
    <div class="body">
      <RnDataGrid 
        v-if="selectedGridIndex === 0"
        :columns="columns"
        :data-source="getProjects"
        :height="650"
        :show-column-chooser="showColumnChooser"
        :show-refresh-button="false"
        :show-reset-filters-button="showResetFiltersButton"
        :show-search-panel="showSearchPanel"
        :show-word-wrap-button="showWordWrapButton"
        :show-page-selector="showPageSelector"
        selection-mode="single"
        :allow-adding="allowEditing"
        :allow-updating="allowEditing"
        :allow-deleting="allowEditing"
        :allow-grouping="allowGrouping"
        :allow-paging="allowPaging"
        :allow-column-resizing="allowColumnResizing"
        :allow-column-fixing="allowColumnFixing"
        :word-wrap-enabled="wordWrapEnabled"
        :page-size="pageSize"
        key-expr="ID"/>
      <DxDataGrid 
        v-else-if="selectedGridIndex === 1"
        :columns="columns"
        :data-source="getProjects"
        :height="650"
        :show-column-chooser="showColumnChooser"
        :show-refresh-button="false"
        :show-reset-filters-button="showResetFiltersButton"
        :show-search-panel="showSearchPanel"
        :show-word-wrap-button="showWordWrapButton"
        :show-page-selector="showPageSelector"
        selection-mode="single"
        :allow-adding="allowEditing"
        :allow-updating="allowEditing"
        :allow-deleting="allowEditing"
        :allow-grouping="allowGrouping"
        :allow-paging="allowPaging"
        :allow-column-resizing="allowColumnResizing"
        :allow-column-fixing="allowColumnFixing"
        :word-wrap-enabled="wordWrapEnabled"
        :page-size="pageSize"
        key-expr="ID"/>
    </div>
  </div>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import RnDataGrid from "@/components/RN/DataGrid.vue";
import DxDataGrid from "@/components/Common/DataGrid.vue";
import localizeFilter from '@/localize';

export default {
  components: {
    RnDataGrid,
    DxDataGrid
  },
  methods: {
    ...mapActions([
        "loadUsers",
        "loadFields",
        "loadCustomers",
        "loadProjects"
    ]),
    onResize(e) {
        console.log(e.detail.height)
    },
    menuClick(selectedGridIndex) {
      this.selectedGridIndex = selectedGridIndex;
    }
  },
  data() {
    return {
      showColumnChooser: true,
      showResetFiltersButton: true,
      showWordWrapButton: true,
      showSearchPanel: true,
      showPageSelector: true,
      allowEditing: false,
      allowGrouping: true,
      allowColumnResizing: true,
      allowColumnFixing: true,
      allowPaging: true,
      selectedGridIndex: 0,
      wordWrapEnabled: false,
      pageSize: 50
    }
  },
  computed: {
    ...mapGetters([
        "getUsers",
        "getFields",
        "getCustomers",
        "getProjects"
    ]),
    columns() {
      return [
        {
          dataField: "ID",
          dataType: "number",
          visible: false,
          width: 100,
          caption: localizeFilter('Id')
        }, {
          dataField: "Shifr",
          dataType: "string",
          visible: true,
          width: 100,
          headerFilter: {allowSearch: true },
          caption: localizeFilter('ProjectShifr'),
          isRequired: true,
        }, {
          dataField: "Title",
          dataType: "string",
          visible: true,
          width: 200,
          headerFilter: {allowSearch: true },
          caption: localizeFilter('ProjectTitle'),
          isRequired: true,
        }, {
          dataField: "CustomerID",
          visible: true,
          width :  150,
          caption: localizeFilter('TechCustomer'),
          isRequired: true,
          groupIndex: 0,
          lookup: {
            dataSource: () => this.getCustomers,
            valueExpr: "ID",
            displayExpr: "Title"
          },
        }, {
          dataField: "FieldID",
          visible: true,
          width :  150,
          groupIndex: 1,
          caption: localizeFilter('Field'),
          isRequired: true,
          lookup: {
            dataSource: () => this.getFields,
            valueExpr: "ID",
            displayExpr: "Title"
          }
        }, {
          dataField: "GipID",
          visible: true,
          width :  150,
          caption: localizeFilter('Gip'),
          isRequired: true,
          lookup: {
            dataSource: () => this.getUsers,
            valueExpr: "ID",
            displayExpr: "Title"
          }
        }, {
          // caption: localizeFilter('Contract'),
          // alignment: "center",
          // visible: true,
          // columns: [{
              name: "ContractShifr",
              dataField: "Contracts",
              visible: true,
              width :  150,
              cellTemplate: "titlesTemplate",
              caption: localizeFilter('ContractShifr'),
              lookup: {
                valueExpr: "CONTRACT_S",
                displayExpr: "SHIFR"
              }
            }, {
              name: "ContractName",
              dataField: "Contracts",
              visible: true,
              width :  350,
              cellTemplate: "titlesTemplate",
              caption: localizeFilter('ContractName'),
              lookup: {
                valueExpr: "CONTRACT_S",
                displayExpr: "NAME"
              }
          //   }
          // ]
        }, {
          // caption: localizeFilter('ActionTitle'),
          // alignment: "center",
          // visible: true,
          // columns: [{
          //     caption: localizeFilter('Created'),
          //     alignment: "center",
          //     visible: true,
          //     columns: [{
                  dataField: "Created",
                  dataType: "date",
                  format: "dd.MM.yyyy HH:mm",
                  visible: true,
                  width :  150,
                  caption: localizeFilter('Created'),
                }, {
                  dataField: "AuthorID",
                  visible: true,
                  width :  150,
                  caption: localizeFilter('Author'),
                  lookup: {
                    dataSource: () => this.getUsers,
                    valueExpr: "ID",
                    displayExpr: "Title"
                  }
                // }
          //     ]
            }, {
          //     caption: localizeFilter('Modified'),
          //     alignment: "center",
          //     visible: true,
          //     // columns: [
          //     //   {
                  dataField: "Modified",
                  dataType: "date",
                  format: "dd.MM.yyyy HH:mm",
                  visible: true,
                  width :  150,
                  caption: localizeFilter('Modified'),
                }, {
                  dataField: "EditorID",
                  visible: true,
                  width :  150,
                  caption: localizeFilter('Editor'),
                  lookup: {
                    dataSource: () => this.getUsers,
                    valueExpr: "ID",
                    displayExpr: "Title"
                  }
          //     //   }
          //     // ]
          //   }
          // ]
        }
      ];
    }
  },
  async mounted() {
    await this.loadUsers();
    await this.loadFields();
    await this.loadCustomers();
    await this.loadProjects();
  }
}

</script>

<style scoped>
  .menu {
    padding: 5px 0;
    text-align: center;
    display: flex;
    align-items: stretch;
    width: 100%;
  }
  .menuItem {
    margin: 0 10px 0 0;
    cursor: pointer;
  }
  .menuItem.selected {
    font-weight: bold;
  }
</style>
