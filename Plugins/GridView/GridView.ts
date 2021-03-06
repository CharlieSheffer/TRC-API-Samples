// TypeScript
// JScript functions for BasicList.Html. 
// This calls TRC APIs and binds to specific HTML elements from the page.  

/// <reference path="..\..\trc.ts" />

declare var $ :any; // external definition for JQuery 

// Global reference to the current sheet;
var _sheet: ISheetReference;

// Startup function called by the plugin
function PluginMain(sheet: ISheetReference) {
    // clear previous results
    $('#main').empty();

    _sheet = sheet; // Save for when we do Post

    trcGetSheetInfo(sheet,(info) => {
        trcGetSheetContents(sheet,(data) => {
            renderSheet(info, data);
        });
    });        
}

// Helper for setting the cell background color. 
function setColorClass(element, cssColorClass: string) : void {    
    element.
        removeClass('PreUpload').removeClass('OkUpload').removeClass('OtherUpload').
        addClass(cssColorClass);
}

// Get the HTML ID for the element representing this cell. 
// This can be used to colorize the cell on updates. 
function getCellId(recId : string, columnName : string) : string {
    return "row_" + recId + "_" + columnName;
}
// Callback from HTML page when a cell has changed. 
function onCellChange(
    recId: string,
    columnName : string,
    newValue: string
): void {        
    var cellId = getCellId(recId, columnName); 
    var element = $('#' + cellId);
    setColorClass(element, 'PreUpload');

    // Upload to server, turn green on success. 
    trcPostSheetUpdateCell(_sheet, recId, columnName, newValue, () => {
        setColorClass(element, 'OkUpload');
    });
}

// Get an HTML <td> element to describe the given cell. 
function getCellContents(
    columnInfo: IColumnInfo,
    value: string, // current value
    recId : string )  // record ID for this row 
{
    if (columnInfo.IsReadOnly) {
        // Readonly values - just display static text.
        return $('<td>').text(value);
    }

    // Editable values - display an edit control. 
    var columnName = columnInfo.Name;
    var cellId = getCellId(recId, columnName);
    if (columnInfo.PossibleValues != null) {
        // We have a hint about possible values. Use a Combo box 
        // Highlight the currently selected option 

        var selectHtml = '<select id="' + cellId +
            '" value="' + value +
            '" onchange=\"onCellChange(\'' + recId + '\', \'' + columnName + '\', this.value)\">';

        var noneSelected: boolean= true;
        for (var idxOption = 0; idxOption < columnInfo.PossibleValues.length; idxOption ++) {
            var option = columnInfo.PossibleValues[idxOption];

            if (option == value) {
                var selected = "selected";
                noneSelected = false;
            } else {
                var selected = "";
            }
            
            selectHtml += '<option value=\'' + option + '\' ' + selected + '>' + option + '</option>';
        }
        if (noneSelected) {
            // If nothing from the possible values is selected, then add the current value to the list so that it displays. 
            selectHtml += '<option selected>' + value + '</option>';
        }

        var tCell = $('<td>').html(selectHtml);
    }
    else {        
        // No hint. Use an open text box 
        
        var tCell = $('<td>').
            html('<input type="text" id="' + cellId +
            '" value="' + value +
            '" onchange=\"onCellChange(\'' + recId + '\', \'' + columnName + '\', this.value)\" /> ');

    }
    return tCell;
}

function renderSheet(
    info : ISheetInfoResult,
    data: ISheetContents
): void {

    var numRows = info.CountRecords;
    
    // Display header
    {
        var t = $('<thead>').append($('<tr>'));
        for (var i = 0; i < info.Columns.length; i++) {
            var columnInfo = info.Columns[i];
            var displayName = columnInfo.DisplayName;
            var tCell1 = $('<td>').text(displayName);
            t = t.append(tCell1);
        }
        $('#main').append(t);
    }

    // Display contents
    for (var iRow = 0; iRow < numRows; iRow++) {        
        var recId = data["RecId"][iRow];
        var t = $('<tr>');
        for (var i = 0; i < info.Columns.length; i++) {
            var columnInfo = info.Columns[i];

            var columnData : string[] = data[columnInfo.Name];
            var value: string = columnData[iRow];
            var tcell = getCellContents(columnInfo, value, recId);
            t = t.append(tcell);
        }
        $('#main').append(t);
    }
}

