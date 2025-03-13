import utils from '@/utils';
import { confirm } from 'devextreme/ui/dialog';
import store from '@/store';
// import router from '@/router';
import localizeFilter from '@/localize';

export default {

    parentMenuIcons() {
        return [{
                "parent": "ProductionProgram",
                "name": "hierarchy"
            }, {
                "parent": "PrognosFactActs",
                "name": "money"
            }, {
                "parent": "Planning",
                "name": "clock"
            }, {
                "parent": "Purchases",
                "name": "cart"
            }, {
                "parent": "Infographics",
                "name": "chart"
            }, {
                "parent": "Dictionaries",
                "name": "folder"
            }, {
                "parent": "Service",
                "name": "warning"
            }, {
                "parent": "Reports",
                "name": "export"
            }, {
                "parent": "Logs",
                "name": "event"
            }, {
                "parent": "Administration",
                "name": "group"
            }
        ]
    },

    toolbarInsertItem(e, item) {
        item.locateInMenu = "auto";
        e.toolbarOptions.items.unshift(item);
    },
    toolbarInsertButton(e, options) {
        if("text" in options) options.text = localizeFilter(options.text);
        if("hint" in options) options.hint = localizeFilter(options.hint);
        this.toolbarInsertItem(e, {
            location: "after",
            widget: "dxButton",
            options
        });
    },
    toolbarAddItem(e, item) {
        item.locateInMenu = "auto";
        let itemPosition;
        if(e.toolbarOptions.items.find(item => item.name == "searchPanel")) {
            itemPosition = e.toolbarOptions.items.length - 1;
        }
        else {
            itemPosition = e.toolbarOptions.items.length;
        }
        e.toolbarOptions.items.splice(itemPosition, 0, item);
    },
    toolbarAddButton(e, options) {
        if("text" in options) options.text = localizeFilter(options.text);
        if("hint" in options) options.hint = localizeFilter(options.hint);
        this.toolbarAddItem(e, {
            location: "after",
            widget: "dxButton",
            options
        });
    },
    toolbarAddRefreshButton(e, callback) {
        this.toolbarAddButton(e, {
            icon: "refresh",
            hint: "Refresh",
            onClick: () => {
              if(callback) callback();
            }
        });
    },
    toolbarAddResetFiltersButton(e, callback) {
        this.toolbarAddButton(e, {
            icon: "clear",
            hint: "ClearFilters",
            onClick: async () => {
                e.component.state(null);
                if(callback) callback();
            }
        });
    },
    toolbarAddDownloadButton(e, path, text, icon = "download") {
        this.toolbarAddButton(e, {
            icon,
            hint: text,
            onClick: () => {
                window.open(store.getters.getConfigServiceUrl + path);
            }
        });
    },


    contextMenuAddItem(e, text, icon, onItemClick) {
        e.items.push({
            icon,
            text: localizeFilter(text),
            onItemClick
        });
    },
    contextMenuAddLink(e, href, text, icon = "link") {
        e.items.push({
            icon,
            text: localizeFilter(text),
            onItemClick: async () => {
                window.open(href, '_blank');
            }
        });
    },
    // contextMenuAddContractLink(e, CONTRACT_S) {
    //     const query = {contract: CONTRACT_S};
    //     const routeData = router.resolve({name: 'Contracts', query});
    //     this.contextMenuAddLink(e, routeData.href, "ContractLink");
    // },
    // contextMenuAddContractSudLink(e, CONTRACT_S) {
    //     const href = store.getters.getConfigSetting("sudSiteUrl") + "contract.jsp?contract_s=" + CONTRACT_S;
    //     this.contextMenuAddLink(e, href, "ContractSudLink");
    // },
    // contextMenuAddProjectLink(e, projectID) {
    //     const query = {project: projectID};
    //     const routeData = router.resolve({name: 'Projects', query});
    //     this.contextMenuAddLink(e, routeData.href, "ProjectLink");
    // },
    // contextMenuAddGraphEditorLink(e, projectID) {
    //     const query = {project: projectID};
    //     const routeData = router.resolve({name: 'GraphEditor', query});
    //     this.contextMenuAddLink(e, routeData.href, "GraphEditorLink");
    // },
    // contextMenuAddProductionProgramLink(e, graphStageKey) {
    //     const routeData = router.resolve({name: 'ProductionProgram', query:{key: graphStageKey}});
    //     this.contextMenuAddLink(e, routeData.href, "GoToProductionProgram");
    // },


    setGraphTaskCellStyle(e, fieldType, planStartDate, planFinishDate, prognosStartDate, prognosFinishDate, factStartDate, factFinishDate) {
        if(e.rowType === "data") {
            if(e.value instanceof Date) {
                const timeNow = utils.getDayStartDate(new Date()).getTime();
                const timeNear = timeNow + 1000 * 60 * 60 * 24 * 7; // через 7 дней
                const completedColor = "rgb(0, 163, 0)";
                const nearColor = "rgb(255, 200, 40)";
                const expiredColor = "rgb(255, 29, 29)";
                
                if(fieldType === undefined) fieldType = e.column.dataField;
                if(planStartDate === undefined) planStartDate = e.data.PlanStartDate;
                if(planFinishDate === undefined) planFinishDate = e.data.PlanFinishDate;
                if(prognosStartDate === undefined) prognosStartDate = e.data.PrognosStartDate;
                if(prognosFinishDate === undefined) prognosFinishDate = e.data.PrognosFinishDate;
                if(factStartDate === undefined) factStartDate = e.data.FactStartDate;
                if(factFinishDate === undefined) factFinishDate = e.data.FactFinishDate;

                switch(fieldType) {
                    case "PlanStartDate":
                        if(!factStartDate) {
                            if(planStartDate) {
                                if(planStartDate.getTime() < timeNow) {
                                    e.cellElement.style.color = expiredColor;
                                }
                                else if(planStartDate.getTime() < timeNear) {
                                    e.cellElement.style.color = nearColor;
                                }
                            }
                        }
                        else {
                            e.cellElement.style.color = completedColor;
                        }
                        break;
                    case "PlanFinishDate":
                        if(!factFinishDate) {
                            if(planFinishDate) {
                                if(planFinishDate.getTime() < timeNow) {
                                    e.cellElement.style.color = expiredColor;
                                }
                                else if(planFinishDate.getTime() < timeNear) {
                                    e.cellElement.style.color = nearColor;
                                }
                            }
                        }
                        else {
                            e.cellElement.style.color = completedColor;
                        }
                        break;
                    case "PrognosStartDate":
                        if(!factStartDate) {
                            if(prognosStartDate) {
                                if(prognosStartDate.getTime() < timeNow) {
                                    e.cellElement.style.color = expiredColor;
                                }
                                else if(prognosStartDate.getTime() < timeNear) {
                                    e.cellElement.style.color = nearColor;
                                }
                            }
                        }
                        else {
                            e.cellElement.style.color = completedColor;
                        }
                        break;
                    case "PrognosFinishDate":
                        if(!factFinishDate) {
                            if(prognosFinishDate) {
                                if(prognosFinishDate.getTime() < timeNow) {
                                    e.cellElement.style.color = expiredColor;
                                }
                                else if(prognosFinishDate.getTime() < timeNear) {
                                    e.cellElement.style.color = nearColor;
                                }
                            }
                        }
                        else {
                            e.cellElement.style.color = completedColor;
                        }
                        break;
                    case "FactStartDate":
                        if(factStartDate) {
                            e.cellElement.style.color = completedColor;
                        }
                        break;
                    case "FactFinishDate":
                        if(factFinishDate) {
                            e.cellElement.style.color = completedColor;
                        }
                        break;
                }
            }
            else if(e.column.month !== undefined) {
                e.cellElement.style.margin = 0;
                e.cellElement.style.padding = 0;
            }
        }
    },

    getRowDataValue(e, fieldName, defaultValue, stateName) {
        const value = ((!stateName || stateName == "newData") && 
                        e.newData && (fieldName in e.newData) == true) ? 
                            (e.newData[fieldName] != null ? 
                                e.newData[fieldName] : defaultValue) : 
                      ((!stateName || stateName == "oldData") && 
                        e.oldData && e.oldData[fieldName] != null) ? 
                            e.oldData[fieldName] : defaultValue;
        return value;
    },

    setCellSelectValueEditorOptions(e, dataSource, dataField, displayExpr) {
        displayExpr = displayExpr ? displayExpr : "Title";
        e.editorName = "dxSelectBox"; 
        e.editorOptions.displayExpr = displayExpr;  
        e.editorOptions.valueExpr = "ID";
        e.editorOptions.dataSource = dataSource;
        e.editorOptions.value = e.row.data[dataField];
        e.editorOptions.showClearButton = true;
        e.editorOptions.onValueChanged = (i) => {
            if(i.value) {
                const item = dataSource.find(s => s.ID == i.value);
                if(item) {
                    e.setValue(item[displayExpr]);
                }
            }
            else {
                e.setValue(null);
            }
        }
    },

    setUpdatingValueByTitle(e, dataSource, dataField, titleField, displayExpr) {
        if(e && dataSource && dataField && titleField && e.newData && titleField in e.newData) {
            displayExpr = displayExpr ? displayExpr : "Title";
            const title = e.newData[titleField];
            const item = dataSource.find(s => title && s[displayExpr] == title);
            e.newData[dataField] = (item ? item.ID : null);
        }
    },

    setGraphTaskRowStyle(e) {
        if(e.rowType === "data") {
            if(e.data.IsNotTakePart) {
                e.rowElement.style.color = '#888';
                e.rowElement.style.backgroundColor = '#ddd';  
                // e.rowElement.className += " ";
            }
            else if(e.data.IsCompleted) {
                // e.rowElement.style.color = '#8F8';
                e.rowElement.style.backgroundColor = '#dFd'; 
            }
        }
    },
    getGraphPreEditingMessage(e, graphLevel) {
        if(e.parentType === "dataRow" && e.row.data) {
            if(e.dataField == "PlanStartDate" || e.dataField == "PlanFinishDate") {
                if(store.getters.getSystemSetting("GraphBlockPlanDate").Value == "true") {
                    // Редактирование временно заблокировано Руководителем ГИПов
                    return "GraphBlockPlanDate";
                }
            }
            else if(e.row.data.TypeName == "GraphPsd" && (e.dataField == "PrognosStartDate" || e.dataField == "PrognosFinishDate")) {
                if(store.getters.getSystemSetting("GraphPsdBlockPrognosDate").Value == "true") {
                    // Редактирование временно заблокировано Руководителем проектировщиков
                    return "GraphPsdBlockPrognosDate";
                }
            }
            else if(e.row.data.TypeName == "GraphIi" && (e.dataField == "PrognosStartDate" || e.dataField == "PrognosFinishDate")) {
                if(store.getters.getSystemSetting("GraphIiBlockPrognosDate").Value == "true") {
                    // Редактирование временно заблокировано Руководителем изыскателей
                    return "GraphIiBlockPrognosDate";
                }
            }
            else if(e.row.data.PerformerIsSub === true && (e.dataField == "Executors" || e.dataField == "Executor")) {
                // Редактирование сотрудников по с/п работам не требуется
                return "GraphNotEditExecutorsIsSub";
            }
            
            if(graphLevel) {
                const options = store.getters.getGraphTypeOptions(e.row.data.TypeName);
                if(options) {
                    if(graphLevel == 2 && !!options.allowEditTask) {
                        if(!options.allowEditTask(e.row.data)) {
                            // Редактирование доступно только руководителям отдела
                            return "GraphEditOnlyDepartmentMembers";
                        }
                        if(e.row.data.PerformerIsSub !== true) {
                            if(options.prognosEditOnlyExecutorLevel && (e.dataField == "PrognosStartDate" || e.dataField == "PrognosFinishDate") ||
                            options.factEditOnlyExecutorLevel && (e.dataField == "FactStartDate" || e.dataField == "FactFinishDate" || e.dataField == "WorkVolume" || e.dataField == "Executors")) {                              
                                // Редактирование доступно только в уровне сотрудника-исполнителя
                                return "GraphEditOnlyExecutorLevel";
                            }
                        }
                    }
                    else if(graphLevel == 3 && !!options.allowEditExecutorTask) {
                        if(!options.allowEditExecutorTask(e.row.data)) {
                          if(e.row.data.Confirmed) {
                            // Редактирование доступно только НО, т.к. задача завершена
                            return "GraphEditOnlyChiefUser";
                          } else {
                            // Редактирование доступно только сотруднику-исполнителю
                            return "GraphEditOnlyExecutorUser";
                          }                            
                        }
                    }
                }
            }
        }
        return null;
    },
    blockPrognoseDateMessage(graphType) {      
      if(graphType == "GraphPsd") {
        if(store.getters.getSystemSetting("GraphPsdBlockPrognosDate").Value == "true") {
          // Редактирование временно заблокировано Руководителем проектировщиков
          return "GraphPsdBlockPrognosDate";
        }    
      } else if(graphType == "GraphIi") {        
        if(store.getters.getSystemSetting("GraphIiBlockPrognosDate").Value == "true") {
            // Редактирование временно заблокировано Руководителем изыскателей
            return "GraphIiBlockPrognosDate";
        }
      }
      return null;
    },
    setGraphRowStyle(e, graphLevel) {
        if(e.rowType === "data") {
            if(graphLevel == 1) {
                e.rowElement.style.fontWeight = 700;
                e.rowElement.style.color = "#666";
                // e.rowElement.style.fontFamily = "'trebuchet ms' 'tahoma'";
                // e.rowElement.style.fontSize = '12px';
            }
            else if(graphLevel == 3) {
                e.rowElement.style.fontStyle = 'italic';
            }
        }
    },

    setGraphPreEditingDate(e) {
        if(e.row && e.row.data && !e.value) {
            this.setGraphPreEditorOptions(e, "PlanFinishDate", e.row.data.PlanStartDate);
            this.setGraphPreEditorOptions(e, "PrognosStartDate", e.row.data.PlanStartDate);
            this.setGraphPreEditorOptions(e, "PrognosFinishDate", e.row.data.PlanFinishDate);
            this.setGraphPreEditorOptions(e, "FactStartDate", e.row.data.PrognosStartDate);
            this.setGraphPreEditorOptions(e, "FactFinishDate", e.row.data.FactStartDate);
        }
    },
    setGraphPreEditorOptions(e, dataField, value) {
        if(e.dataField == dataField && value) {
            e.editorOptions = { 
                onOpened: (dateBox) => { 
                    dateBox.component.option("value", value) 
                },
                onValueChanged: (dateBox) => {
                    e.setValue(dateBox.value);
                }
            };
        }
    },

    getRowDataValidValue(e, field) {
        return   e.newData[field] !== undefined ? 
                 e.newData[field] : 
                 e.oldData ? e.oldData[field] : null;
    },

    getRowDataValidTime(e, field) {
        return   e.newData[field] !== undefined ? 
                (e.newData[field] ? utils.getDayStartTime(e.newData[field]) : null) : 
                ((e.oldData && e.oldData[field]) ? utils.getDayStartTime(e.oldData[field]) : null);
    },

    getGraphValidationMessage(e, checkWorkVolume, checkStatus) {
        const timeNow = new Date().getTime();
        if(e.newData.PlanStartDate || e.newData.PlanFinishDate) {
            // Валидация запросов Кор, ИУ, АН
            if(!e.oldData && e.newData.DepartmentsIsRequired) {
                if(!e.newData.Departments) {
                    // Необходимо выбрать хотябы один отдел ПСД
                    return "ReqDepartmentsIsRequired";
                }
            }
        }
        if(e.newData.PrognosStartDate || e.newData.PrognosFinishDate || e.newData.FactStartDate || e.newData.FactFinishDate) {
            // Валидация задачи графика ИИ
            if(e.oldData && e.oldData.PerformerID == 3 && !e.oldData.PerformerOrganization) {
                // Для с/п исполнителя необходимо выбрать контрагента
                return "GraphPerformerIsSubReqPerformerOrganization";
            }
        }
        if(e.newData.PlanStartDate !== undefined || 
           e.newData.PlanFinishDate !== undefined || 
           e.newData.PrognosStartDate !== undefined || 
           e.newData.PrognosFinishDate !== undefined || 
           e.newData.FactStartDate !== undefined || 
           e.newData.FactFinishDate !== undefined) {
            
            const planStartTime = e.newData.PlanStartDate !== undefined ? 
                                (e.newData.PlanStartDate ? e.newData.PlanStartDate.getTime() : null) : 
                    (e.oldData && e.oldData.PlanStartDate ? e.oldData.PlanStartDate.getTime() : null);

            const planFinishTime = e.newData.PlanFinishDate !== undefined ? 
                                (e.newData.PlanFinishDate ? e.newData.PlanFinishDate.getTime() : null) : 
                    (e.oldData && e.oldData.PlanFinishDate ? e.oldData.PlanFinishDate.getTime() : null);
            
            const prognosStartTime = e.newData.PrognosStartDate !== undefined ? 
                                (e.newData.PrognosStartDate ? e.newData.PrognosStartDate.getTime() : null) : 
                    (e.oldData && e.oldData.PrognosStartDate ? e.oldData.PrognosStartDate.getTime() : null);
                                
            const prognosFinishTime = e.newData.PrognosFinishDate !== undefined ? 
                                (e.newData.PrognosFinishDate ? e.newData.PrognosFinishDate.getTime() : null) : 
                    (e.oldData && e.oldData.PrognosFinishDate ? e.oldData.PrognosFinishDate.getTime() : null);

            const factStartTime = e.newData.FactStartDate !== undefined ? 
                                (e.newData.FactStartDate ? e.newData.FactStartDate.getTime() : null) : 
                    (e.oldData && e.oldData.FactStartDate ? e.oldData.FactStartDate.getTime() : null);

            const factFinishTime = e.newData.FactFinishDate !== undefined ? 
                                (e.newData.FactFinishDate ? e.newData.FactFinishDate.getTime() : null ) : 
                    (e.oldData && e.oldData.FactFinishDate ? e.oldData.FactFinishDate.getTime() : null);

            const newFactStartTime = e.newData.FactStartDate ? utils.getDayStartDate(e.newData.FactStartDate).getTime() : null;
            const newFactFinishTime = e.newData.FactFinishDate ? utils.getDayStartDate(e.newData.FactFinishDate).getTime() : null;

            if(planFinishTime && !planStartTime) {
                // Дата окончания (план) не может быть указана без даты начала (план)
                return "GraphPlanFinishDateReqStartDateValidText";
            }
            
            if(planFinishTime && planStartTime) {                    
                if(planFinishTime < planStartTime) {
                    // Дата окончания (план) не может быть меньше даты начала (план)"
                    return "GraphPlanFinishDateVsStartDateValidText";
                }
            }

            if(prognosFinishTime && !prognosStartTime) {
                // Дата окончания (прогноз) не может быть указана без даты начала (прогноз)
                return "GraphPrognosFinishDateReqStartDateValidText";
            }

            if(prognosFinishTime && prognosStartTime) {                    
                if(prognosFinishTime < prognosStartTime) {
                    // Дата окончания (прогноз) не может быть меньше даты начала (прогноз)
                    return "GraphPrognosFinishDateVsStartDateValidText";
                }
            }

            if(factStartTime && !prognosStartTime) {
                // Дата начала (факт) не может быть указана без даты начала (прогноз)
                return "GraphFactStartDateReqPrognosDateValidText";
            }

            if(factFinishTime && !prognosFinishTime) {
                // Дата окончания (факт) не может быть указана без даты окончания (прогноз)
                return "GraphFactFinishDateReqPrognosDateValidText";
            }

            if(factFinishTime && !factStartTime) {    
                // Дата окончания (факт) не может быть указана без даты начала (факт)
                return "GraphFactFinishDateReqStartDateValidText";
            }

            if(factFinishTime && factStartTime) {    
                if(factFinishTime < factStartTime) {
                    // Дата окончания (факт) не может быть меньше даты начала (факт)
                    return "GraphFactFinishDateVsStartDateValidText";
                }
            }

            if(newFactStartTime && newFactStartTime > timeNow) {
                // Дата начала (факт) не может быть больше текущей даты
                return "GraphFactStartDateVsNowDateValidText";
            }

            if(newFactFinishTime && newFactFinishTime > timeNow) {
                // Дата окончания (факт) не может быть больше текущей даты
                return "GraphFactFinishDateVsNowDateValidText";
            }
        }
        if(checkWorkVolume) {
            // Валидация трудозатрат, даты окончания факт и сторудников-исполнителей
            const workVolume =  e.newData.WorkVolume !== undefined ? 
                                e.newData.WorkVolume : 
                                e.oldData && e.oldData.WorkVolume ? e.oldData.WorkVolume : 0;

            const factFinishDate = e.newData.FactFinishDate !== undefined ? 
                                   e.newData.FactFinishDate : 
                                   e.oldData && e.oldData.FactFinishDate ? e.oldData.FactFinishDate : null;

            const executors = e.newData.Executors  !== undefined ? 
                                e.newData.Executors : 
                                e.oldData && e.oldData.Executors ? e.oldData.Executors : [];

            const executor = e.newData.Executor  !== undefined ? 
                                e.newData.Executor : 
                                e.oldData && e.oldData.Executor ? e.oldData.Executor : null;

            if(factFinishDate) {
                if(workVolume == 0) {
                    // Дата окончания (факт) не может быть указана без трудозатрат чел/ч
                    return "GraphFactFinishDateReqWorkVolumeValidText";
                }
                else if(executors.length == 0 && executor == null) {
                    // Дата окончания (факт) не может быть указана без сотрудников-исполнителей
                    return "GraphFactFinishDateReqExecutorsValidText";
                }
            }
            if(workVolume > 0) {
                if(!factFinishDate) {
                    // Трудозатраты чел/ч не могут быть указаны без даты окончания (факт)
                    return "GraphWorkVolumeReqFactFinishDateValidText";
                }
                else if(executors.length == 0 && executor == null) {
                    // Трудозатраты чел/ч не могут быть указаны без сотрудников-исполнителей
                    return "GraphWorkVolumeReqExecutorsValidText";
                }
            }
            
        }
        if(checkStatus) {
            // Валидация статуса запроса
            const workVolume =  e.newData.WorkVolume !== undefined ? 
                                e.newData.WorkVolume : 
                                e.oldData && e.oldData.WorkVolume ? e.oldData.WorkVolume : 0;

            const statusID = e.newData.CorrectionStatusID  !== undefined ? 
                                e.newData.CorrectionStatusID : 
                                e.oldData && e.oldData.CorrectionStatusID ? e.oldData.CorrectionStatusID : null;

            if(statusID == 7) {
                if(workVolume == 0) {
                    // Для перевода запроса в статус Согласовано должны быть указаны трудозатраты УИПИР
                    return "GraphStatusCompleteReqWorkVolumeValidText";
                }
            }
        }
        return null;
    },

    setGridColumnGroupFilter(grid, columnGroups) {
        if(grid) {
            grid.beginUpdate();
            for(let i = 0; i < grid.columnCount(); i++) {
                const columnGroupIndex = grid.columnOption(i, "columnGroupIndex");
                if(columnGroupIndex) {
                    let columnVisible = grid.columnOption(i, "columnVisible");
                    if(columnVisible == null) {
                        columnVisible = grid.columnOption(i, "visible");
                        grid.columnOption(i, "columnVisible", columnVisible);
                    }
                    let groupVisible = columnGroups.find(columnGroup => columnGroup.index == columnGroupIndex);
                    const visible = groupVisible ? columnVisible : false;
                    grid.columnOption(i, "visible", visible);
                }
            }
            grid.endUpdate();
        }
    },
    setGridColumnGroupHeaderBgColor(e, columnGroups, columns) {
        if(e.rowType === "header") {
            let bgColor;
            if(e.column.bgColor) {
                bgColor = e.column.bgColor;
            }
            if(e.column.columnGroupIndex) {
                const columnGroup = columnGroups.find(c => c.index == e.column.columnGroupIndex);
                if(columnGroup) {
                    bgColor = columnGroup.bgColor;
                }
            }
            else {
                const columnGroup = columns.find(gc => gc.columns && gc.columns.find(c => c.dataField == e.column.dataField));
                if(columnGroup) {
                    bgColor = columnGroup.bgColor;
                }
            }
            if(bgColor) {
                e.cellElement.style.backgroundColor = bgColor;
                e.cellElement.style.color = "#111";
            }
        }
    },

    confirm(oneText, oneTitle, moreText, moreTitle, titles) {
        if(oneText && oneTitle && moreText && moreTitle && titles) {
            if(titles.length == 1) {
                return confirm(titles[0] + ". " +
                                localizeFilter(oneText),
                                localizeFilter(oneTitle));
            }
            else {
                return confirm(titles.join(", ") + ". " +
                                localizeFilter(moreText),
                                localizeFilter(moreTitle));
            }
        }
        else if(oneText && oneTitle && titles) {
            return confirm(titles + ". " + 
                                localizeFilter(oneText),
                                localizeFilter(oneTitle));
        }
        else if(oneText && oneTitle) {
            return confirm(localizeFilter(oneText),
                           localizeFilter(oneTitle));
        }
        else if(oneText) {
            return confirm(localizeFilter(oneText));
        }
    },

    hideSaveButton() {
        const btnLabel = localizeFilter("Save");
        setTimeout(function() {
            var elems = document.getElementsByClassName("dx-button");
            if(elems) {
                for(let i in elems){  
                    const elem = elems[i];
                    if(elem instanceof HTMLDivElement) {
                        const label = elem.getAttribute("aria-label");
                        if(label == btnLabel) {
                            elem.setAttribute("style", "visibility: hidden"); 
                        }
                    }
                }
            }
        }, 0);
    },

    scrollTo(sender, element){
        var el = sender.$el.querySelector(element);
        if (el) {
            el.scrollIntoView({behaviour: 'smooth'});
        }
    },

    copyToClipboard(text) {
        const el = document.createElement('textarea');  
        el.value = text;                    
        el.setAttribute('readonly', '');                
        el.style.position = 'absolute';                     
        el.style.left = '-9999px';                      
        document.body.appendChild(el);                  
        const selected =  document.getSelection().rangeCount > 0  ? document.getSelection().getRangeAt(0) : false;                                    
        el.select();                                    
        document.execCommand('copy');                   
        document.body.removeChild(el);                  
        if (selected) {                                 
          document.getSelection().removeAllRanges();    
          document.getSelection().addRange(selected);   
        }
    }

}