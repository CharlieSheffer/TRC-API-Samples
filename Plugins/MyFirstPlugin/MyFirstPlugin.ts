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
        updateInfo(info);
    });        
}

// Display sheet info on HTML page
function updateInfo(info: ISheetInfoResult): void {
    $("#SheetName").text(info.Name);
    $("#ParentSheetName").text(info.ParentName);
    $("#SheetVer").text(info.LatestVersion);
    $("#RowCount").text(info.CountRecords);
}


