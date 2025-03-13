export default {
    getItemByID(items, ID) {
        return items.find(i => i.ID == ID);
    },
    getItemsByIDs(items, IDs) {
        let results = [];
        for(let i in IDs) {
            results.push(this.getItemByID(items, IDs[i]));
        }
        return results;
    },
    getItemByTitle(items, Title) {
        return items.find(i => i.Title == Title);
    },
    getItemsRemoveItem(items, item) {
        return items.filter(i => i.ID != item.ID);
    },
    getItemsAddItems(stateItems, addItems, idProp) {
        if(stateItems && addItems) {
            if(!idProp) idProp = "ID";
            for(let i in addItems) {
                const item = addItems[i];
                if(stateItems.find(t => t[idProp] == item[idProp])) {
                    this.setItem(stateItems, item, idProp);
                }
                else {
                    stateItems.push(item);
                }
            }
        }
        return stateItems;
    },
    setItem(items, item, idProp) {
        if(!idProp) idProp = "ID";
        if(items && item && item[idProp]) {
            const _item = items.find(i => i[idProp] && i[idProp] == item[idProp]);
            if(_item) {
                Object.assign(_item, item);
            }
            else {
                items.push(item);
            }
        }
    },
    sortItems(items, field, order) {
        if(!field) field = "Title";
        if(order == "desc") {
            items.sort((a, b) => (a[field] > b[field]) ? -1 : (a[field] < b[field]) ? 1 : 0);
        }
        else {
            items.sort((a, b) => (a[field] < b[field]) ? -1 : (a[field] > b[field]) ? 1 : 0);
        }
    },
    sortItemsMultiple (arr, fields) {
        return arr.sort((a, b) => {
            for (let field of fields) {
                const key = field.key;
                const order = field.order || 'asc';
                if (a[key] < b[key]) {
                    return order === 'asc' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return order === 'asc' ? 1 : -1;
                }
            }
            return 0;
        });
    },
    reorderItems(items, field) {
        if(items && field) {
            for(let i in items) {
                items[i][field] = (i*1 + 1);
            }
        }
    },
    initFieldItems(items, field, getFunction, byItemID) {
        if(items && field && getFunction) {
            for(let i in items) {
                const item = items[i];
                let itemField;
                if(byItemID) {
                    itemField = getFunction(item.ID);
                }
                else {
                    itemField = getFunction(item[field].ID);
                } 
                if(itemField) {
                    item[field] = itemField;
                }
            }
        }
    },
    replaceNullToFalse(value, fields) {
        if(value && fields) {
            const replace = (item, fields) => {
                for(let f in fields) {
                    if(item[fields[f]] == null) {
                        item[fields[f]] = false;
                    }
                }
            }
            if(value instanceof Array) {
                for(let i in value) {
                    replace(value[i], fields);
                }
            }
            else if(typeof value === "object") {
                replace(value, fields);
            }
        }
    },
    getUniqueValues(items, field) {
        var unique_values = [];
        if(items) {
            var hash = {};
            var all_values = [];
            for(let i in items) {
                var fieldValue = field ? items[i][field] : items[i];
                if(fieldValue) {
                    if(fieldValue instanceof Array) {
                        for(let j in fieldValue) {
                            all_values.push(fieldValue[j]);
                        }
                    }
                    else {
                        all_values.push(fieldValue);
                    }
                }
            }
        }
        for (let i in all_values) {
            if (!(all_values[i] in hash)) {
                hash[all_values[i]] = true;
                unique_values.push(all_values[i]);
            }
        }
        // unique_values.sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0);
        return unique_values;
    },
    getLookupValues(items, field, valueExpr) {
        let lookupValues = [];
        if(items && field && valueExpr) {
            let hash = {};
            for (let r in items) {
                const item = items[r];
                let itemValues;
                if(field.includes('.')) {
                    let values = { ...item};
                    const valueSplit = field.split('.');
                    for(let i in valueSplit) {
                        if(values[valueSplit[i]]) {
                            values = values[valueSplit[i]];
                        }
                        else {
                            values = null;
                            break;
                        }
                    }
                    itemValues = values;
                }
                else {
                    itemValues = item[field];
                }
                for(let t in itemValues) {
                    const value = itemValues[t];
                    if (!(value[valueExpr] in hash)) {
                        hash[value[valueExpr]] = true;
                        lookupValues.push(value);
                    }
                }
            }
        }
        lookupValues.sort((a, b) => (a[valueExpr] < b[valueExpr]) ? -1 : (a[valueExpr] > b[valueExpr]) ? 1 : 0);
        return lookupValues;
    },
    getListValues(items, fieldKey, fieldTitle, valueKey, valueTitle) {
        let listValues = [];
        for(let i in items) {
            const listValue = {};
            listValue[valueKey] = items[i][fieldKey];
            listValue[valueTitle] = items[i][fieldTitle];
            if(listValue[valueKey] && !listValues.find(a => a[valueKey] == listValue[valueKey])) {
                listValues.push(listValue);
            }
        }
        listValues.sort((a, b) => (a[valueKey] < b[valueKey]) ? -1 : (a[valueKey] > b[valueKey]) ? 1 : 0);
        return listValues;
    },
    getMinDate(items, field, notNull) {
        let minDate = null;
        if(items && field) {
            for(let i in items) {
                const date = items[i][field];
                if(date instanceof Date) {
                    if(!minDate || minDate.getTime() > date.getTime()) {
                        minDate = new Date(date);
                    }
                }
                else if(notNull) {
                    return null;
                }
            }
        }
        return minDate;
    },
    getMaxDate(items, field, notNull) {
        let maxDate = null;
        if(items && field) {
            for(let i in items) {
                const date = items[i][field];
                if(date instanceof Date) {
                    if(!maxDate || maxDate.getTime() < date.getTime()) {
                        maxDate = new Date(date);
                    }
                }
                else if(notNull) {
                    return null;
                }
            }
        }
        return maxDate;
    },
    geMinNumber(items, field) {
        let minNumber = null;
        if(items && field) {
            for(let i in items) {
                const number = items[i][field];
                if(typeof number === "number") {
                    if(!minNumber || minNumber > number) {
                        minNumber = number;
                    }
                }
            }
        }
        return minNumber;
    },
    getMaxNumber(items, field) {
        let maxNumber = null;
        if(items && field) {
            for(let i in items) {
                const number = items[i][field];
                if(typeof number === "number") {
                    if(!maxNumber || maxNumber < number) {
                        maxNumber = number;
                    }
                }
            }
        }
        return maxNumber;
    },
    getSumNumber(items, field) {
        let sumNumber = 0;
        if(items && field) {
            for(let i in items) {
                const number = items[i][field];
                if(typeof number === "number") {
                    sumNumber += number;
                }
            }
        }
        return sumNumber;
    },
    getFirstValue(items, field) {
        let firstValue = null;
        if(items && items.length > 0 && field) {
            const firstItem = items[0];
            firstValue = firstItem[field];
        }
        return firstValue;
    },
    getLastValue(items, field) {
        let lastValue = null;
        if(items && items.length > 0 && field) {
            const lastItem = items[items.length - 1];
            lastValue = lastItem[field];
        }
        return lastValue;
    },
    getValues(items, field) {
        let values = [];
        if(items && field) {
            for(let i in items) {
                values.push(items[i][field]);
            }
        }
        return values;
    },
    stringToDate (str) {
        if(str) {
            const splt = str.split('.');
            if(splt.length >=3) {
                return new Date(splt[2], splt[1] - 1, splt[0]);
            }
        }
        return null;
    },
    wcfObjectsToObjects(wcfObjs) {
        let objs = [];
        if(wcfObjs && wcfObjs instanceof Array) {
            for(let i in wcfObjs) {
                const wcfObj = wcfObjs[i];
                const obj = this.wcfObjectToObject(wcfObj)
                objs.push(obj);
            }
        }
        return objs;
    },
    wcfObjectToObject(wcfObj) {
        if(wcfObj && typeof wcfObj === "object") {
            const obj = { ...wcfObj };
            for(let prop in obj) {
                const value = obj[prop];
                if(typeof value === "string") {
                    if(value.startsWith('/Date(')) {
                        obj[prop] = this.wcfDateToDate(value);
                    }
                }
                else if(value instanceof Array) {
                    let arr = [];
                    for(let i in value) {
                        const wcfObj = value[i];
                        const obj = this.wcfObjectToObject(wcfObj);
                        arr.push(obj);
                    }
                    obj[prop] = arr;
                }
                else if(typeof value === "object") {
                    obj[prop] = this.wcfObjectToObject(value);
                }
            }
            return obj;
        }
        return wcfObj;
    },
    objectsToWcfObjects(objs) {
        let wcfObjs = [];
        for (let i = 0; i < objs.length; i++) {
            const obj = objs[i];
            wcfObjs.push(this.objectToWcfObject(obj));
        }
        return wcfObjs;
    },
    objectToWcfObject(obj) {
        if(obj && typeof obj === "object") {
            const wcfObj = { };
            for(let prop in obj) {
                const value = obj[prop];
                if(value instanceof Date) {
                    wcfObj[prop] = this.dateToWcfDate(value);
                }
                else if(value instanceof Array) {
                    wcfObj[prop] = [];
                    for(let i in value) {
                        wcfObj[prop].push({ID: value[i].ID});
                    }
                }
                else {
                    wcfObj[prop] = value;
                }
            }
            return wcfObj;
        }
        return obj;
    },
    wcfDateToDate (dateTime) {
        if(dateTime && dateTime.length > 6) {
            return new Date(parseInt(dateTime.substr(6)));
        }
        return dateTime;
    },
    dateToWcfDate (date) {
        if(date && date instanceof Date) {
            var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
            return '/Date(' + utcDate.getTime() + ')/';
        }
        return date;
    },
    apiObjectsToObjects(apiObjs) {
        let objs = [];
        if(apiObjs && apiObjs instanceof Array) {
            for(let i in apiObjs) {
                const apiObj = apiObjs[i];
                const obj = this.apiObjectToObject(apiObj)
                objs.push(obj);
            }
        }
        return objs;
    },
    apiObjectToObject(apiObj) {
        if(apiObj && typeof apiObj === "object") {
            const obj = { ...apiObj };
            for(let prop in obj) {
                const value = obj[prop];
                if(typeof value === "string") {
                    if(value) {
                        if(value.length >= 16) {
                            if(value[4] === "-" && value[7] === "-" && value[10] === "T") {
                                const date = new Date(value);
                                if(date !== "Invalid Date" && !isNaN(date)) {
                                    obj[prop] = date;
                                }
                            }
                        }
                    }
                }
                else if(value instanceof Array) {
                    let arr = [];
                    for(let i in value) {
                        const apiObj = value[i];
                        const obj = this.apiObjectToObject(apiObj);
                        arr.push(obj);
                    }
                    obj[prop] = arr;
                }
                else if(typeof value === "object") {
                    obj[prop] = this.apiObjectToObject(value);
                }
            }
            return obj;
        }
        return apiObj;
    },
    objectsToApiObjects(objs) {
        let apiObjs = [];
        for (let i = 0; i < objs.length; i++) {
            const obj = objs[i];
            apiObjs.push(this.objectToApiObject(obj));
        }
        return apiObjs;
    },
    objectToApiObject(obj) {
        if(obj && typeof obj === "object") {
            const apiObj = { };
            for(let prop in obj) {
                const value = obj[prop];
                if(value instanceof Date) {
                    apiObj[prop] = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds()));
                }
                else if(value instanceof Array) {
                    apiObj[prop] = [];
                    for(let i in value) {
                        apiObj[prop].push(this.objectToApiObject(value[i]));
                    }
                }
                else {
                    apiObj[prop] = value;
                }
            }
            return apiObj;
        }
        return obj;
    },
    stringToNumber (str) {
        if(str) {
            str = str.trim().replace(',','.');
            if(str.indexOf('.') === -1) {
                return parseInt(str);
            }
            return parseFloat(str);
        }
        return 0;
    },
    stringToBoolean (str) {
        if(str) {
            if(str == 1 || str == "+" || str.toLowerCase() == 'да' || str.toLowerCase() == 'истина') {
                return true;
            }
        }
        return false;
    },
    dateToString(date) {
        return date ? date.toLocaleDateString()
                : '';
    },
    dateTimeToString(date) {
        return date ? date.toLocaleDateString() + " " + date.toLocaleTimeString([], {timeStyle: 'short'})
                : '';
    },
    dateTimeToStringFormat(date, format) {
        if(date instanceof Date && format) {
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            month = month.toString().padStart(2, 0);
            day = day.toString().padStart(2, 0);
            hours = hours.toString().padStart(2, 0);
            minutes = minutes.toString().padStart(2, 0);
            return format
            .replace('yyyy', year)
            .replace('MM', month)
            .replace('dd', day)
            .replace('HH', hours)
            .replace('mm', minutes);
        }
        return date;
    },
    getCellText(item, cellInfo) {
        if(item && cellInfo) {
            if(item instanceof Date) {
                return this.dateToString(item);
            }
            else if(cellInfo && cellInfo.column && cellInfo.column.lookup) {
                return cellInfo.column.lookup.calculateCellValue(item);
            }
            else if(typeof item === "object" && item.Title) {
                return item.Title;
            }
            return item;
        }
    },
    getExportedCellValue(value, cellInfo) {
        let cellValue = "";
        if(value && cellInfo) {
            if(value instanceof Array) {
                for(let i in value) {
                    cellValue += (i*1+1) + ") " + (this.getCellText(value[i], cellInfo) || "") + "\r\n";
                }
            }
            else {
                cellValue += "1) " + (this.getCellText(value) || "");
            }
        }
        return cellValue;
    },
    roundSum(value, powCount = 2) {
        if(value) {
            const pow = Math.pow(10, powCount);
            return Math.round(value * pow) / pow;
        }
        return 0;
    },
    sumToText(value, currencyMeasure) {
        let text = '';
        if(!currencyMeasure || !currencyMeasure.value) currencyMeasure = {value: 1};
        if(value) {
            var valStr = this.roundSum(value / currencyMeasure.value).toString();
            var sc = 0;
            if(valStr.length > 0) {
                for(var i = valStr.length - 1; i >= 0; i--) {
                    const chr = valStr[i];
                    if(chr == '.' || chr == ',')
                    {
                        text = ',' + text;
                        sc = 0;
                    }
                    else {
                        if(sc == 3) {
                            text = chr + ' ' + text;
                            sc = 1;
                        }
                        else {
                            text = chr + text;
                            sc ++;
                        }
                    }
                }
            }
            const valueSplit = valStr.split(".");
            const rightLength = valueSplit.length == 2 ? valueSplit[1].length : 0;
            if(rightLength == 0) {
                text += ",00";
            }
            else if(rightLength == 1) {
                text += "0";
            }
        }
        return text;
    },
    ceilPercent(value) {
        if(value) {
            const ceilValue = Math.ceil(value * 100) / 100;
            if(ceilValue == 1 && value < 1) return 0.99;
            return ceilValue;
        }
        return 0;
    },

    addQueryParam(first, paramName, fieldName, selectedAll, selectedItems) {
        let param = "";
        if(paramName && !selectedAll && selectedItems && selectedItems.length > 0) {
            param += (first ? "?" : "&");
            param += (paramName + "=" + selectedItems.map(item => {return fieldName ? item[fieldName] : item }).join(','));
        }
        return param;
    },

    getDayStartDate(date) {
        if(date instanceof Date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        }
        return null;
    },
    getDayFinishDate(date) {
        if(date instanceof Date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        }
        return null;
    },
    getDayStartTime(date) {
        if(date instanceof Date) {
            return this.getDayStartDate(date).getTime();
        }
        return null;
    },
    getDayFinishTime(date) {
        if(date instanceof Date) {
            return this.getDayFinishDate(date).getTime();
        }
        return null;
    },
    getTodayStartTime() {
        return this.getDayStartDate(new Date()).getTime();
    },
    getTodayFinishTime() {
        return this.getDayFinishDate(new Date()).getTime();
    },
    getMonthStartDate(date, day = 1) {
        return new Date(date.getFullYear(), date.getMonth(), day, 0, 0, 0, 0);
    },
    getMonthStartTime(date, day = 1) {
        var monthStartDate = date ? new Date(date.getFullYear(), date.getMonth(), day, 0, 0, 0, 0) : null;
        return monthStartDate ? monthStartDate.getTime() : null;
    },
    getMonths(year) {
        let months = [];
        if(year) {
            for(let i = 0; i < 12; i++) {
                const StartDate = new Date(year, i, 1);
                const month = this.getMonth(StartDate);
                months.push(month);
            }
        }
        return months;
    },
    getMonth(date) {
        const StartDate = new Date(date.getFullYear(), date.getMonth(), 1);
        if(StartDate instanceof Date) {
            const StartTime = StartDate.getTime();
            let DiffDate = new Date(StartTime);
            DiffDate.setMonth(DiffDate.getMonth() + 1);
            const FinishTime = DiffDate.getTime() - 1;
            const FinishDate = new Date(FinishTime);
            const Month = StartDate.getMonth();
            const Year = StartDate.getFullYear();
            const Title = this.getMonthTitle(StartDate);
            const ShortTitle = StartDate.toLocaleString("ru", { month: 'short' });
            const FullTitle = Title + " " + Year;
            return {
                ID: Month + 1,
                Index: Month,
                Year,
                Title,
                ShortTitle,
                FullTitle,
                StartDate,
                StartTime,
                FinishDate,
                FinishTime
            };
        }
        return null;
    },
    getMonthTitle(value) {
        if(typeof(value) == "number" && value >= 1 && value <= 12) {
            value = new Date(new Date().getFullYear(), value - 1, 1);
        }
        if(value instanceof Date) {
            return value.toLocaleString("ru", { month: 'long' });
        }
        return null;
    },
    getDateDiff(dayDiff) {
        const timeNow = new Date().getTime();
        const timeMonthDiff = 1000 * 60 * 60 * 24 * dayDiff;
        const dateDiff = new Date(timeNow - timeMonthDiff);
        return dateDiff.toLocaleDateString();
    },
    isExpiredDate(date1, date2) {
        return date1 && date2 && date1.getTime() < date2.getTime();
    },
}