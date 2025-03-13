export default {
  setLookupDataSource(options, columnName, keyExpr = "ID", displayExpr = "Title") {  
    options.dataSource.paginate = false;  
    let columnDataSource = (options.dataSource.store._array && options.dataSource.store._array.length) ? options.dataSource.store._array : []; // DataSource столбца

    const dataGrid = options.component;
    const gridDataSource = dataGrid.getDataSource()._store._array; // Grid dataSource
    const columnValues = gridDataSource.filter(item => item[columnName]).map(item => item[columnName]);    
    
    let lookupValues = [];
    if (columnDataSource && columnDataSource.length) {
      lookupValues = this.getLookupValues(columnDataSource, this.getKeys(columnValues, keyExpr), keyExpr, displayExpr);
    } 

    options.dataSource = {
      store: {
        type: "array",
        data: lookupValues,
        key: ["value", keyExpr]
      }
    }
  },
  getKeys(columnValues, keyExpr) {
    let selectedValues = [];
    if (Array.isArray(columnValues[0])) { // Вариант 1. Значение = массив объектов
      for (const rowValues of columnValues) {
        selectedValues = selectedValues.concat(rowValues.map(item => item[keyExpr]));
      }
    } else if (!Object.is(columnValues[0])) { // Вариант 2. Значение = keyExpr
      selectedValues = columnValues;
    } else if (Object.is(columnValues[0])) { // Вариант 3. Значение = Объект
      for (const rowValue of columnValues) {
        selectedValues.push(rowValue[keyExpr]);
      }
    }
    return selectedValues;
  },
  getLookupValues(filterArray, selectedValues, keyExpr, displayExpr) {
    if (!selectedValues || !filterArray) {
      return [];
    }
    let result = filterArray.filter(item => selectedValues.indexOf(item[keyExpr]) > -1);
    // сортировка
    const compare = (a, b) => {
      if (a[displayExpr] < b[displayExpr]) {
        return -1;
      }
      if (a[displayExpr] > b[displayExpr]) {
        return 1;
      }
      return 0;
    }
    return result.sort(compare);
  }
}