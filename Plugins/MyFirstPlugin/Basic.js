// TypeScript
// JScript functions for BasicList.Html. 
// This calls TRC APIs and binds to specific HTML elements from the page.  
/// <reference path="..\..\trc.ts" />
// Global reference to the current sheet;
var _sheet;
// Startup function called by the plugin
function PluginMain(sheet) {
    // clear previous results
    $('#main').empty();
    _sheet = sheet; // Save for when we do Post
    trcGetSheetInfo(sheet, function (info) {
        updateInfo(info);
    });
}
// Display sheet info on HTML page
function updateInfo(info) {
    $("#SheetName").text(info.Name);
    $("#ParentSheetName").text(info.ParentName);
    $("#SheetVer").text(info.LatestVersion);
    $("#RowCount").text(info.CountRecords);
}
//# sourceMappingURL=Basic.js.map