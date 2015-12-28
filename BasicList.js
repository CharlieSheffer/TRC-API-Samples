// TypeScript
// JScript functions for BasicList.Html. 
// This calls TRC APIs and binds to specific HTML elements from the page.  
/// <reference path="trc.ts" />
function Init() {
    $(function () {
        // On document load. 
        $("#ver").html("27");
    });
}
// Global reference to the current sheet;
var _sheet;
// Helper for setting the cell background color. 
function setColorClass(element, cssColorClass) {
    element.
        removeClass('PreUpload').removeClass('OkUpload').removeClass('OtherUpload').
        addClass(cssColorClass);
}
// Callback from HTML page when a comment cell has changed. 
function onCommentChange(recId, newValue) {
    var element = $('#row_' + recId);
    setColorClass(element, 'PreUpload');
    // Upload to server, turn green on success. 
    postSheetUpdate(_sheet, recId, "Comments", newValue, function () {
        setColorClass(element, 'OkUpload');
    });
}
function updateSheet(data) {
    // FirstName	LastName
    var recIds = data["RecId"]; // Get primary record ID (the SOS IDs)
    var fnames = data["FirstName"];
    var lnames = data["LastName"];
    var lats = data["Lat"];
    var longs = data["Long"];
    var comments = data["Comments"];
    for (var i in recIds) {
        var recId = recIds[i];
        var fname = fnames[i];
        var lname = lnames[i];
        var comment = comments[i];
        var tRow = $('<tr>');
        // Static cells just display data
        var tCell1 = $('<td>').text(recId);
        var tCell2 = $('<td>').text(fname);
        var tCell3 = $('<td>').text(lname);
        var tCell4 = $('<td>').text(lats[i]);
        var tCell5 = $('<td>').text(longs[i]);
        // 'comment' cell is special since it's editable. On any change, it will upload to server.      
        var tCell6 = $('<td>').html('<input type="text" id="row_' + recId + '" value="' + comment + '" onchange=\"onCommentChange(\'' + recId + '\', this.value)\" /> ');
        tRow.append(tCell1).append(tCell2).append(tCell3).append(tCell4).append(tCell5).append(tCell6);
        $('#main').append(tRow);
    }
}
// Display sheet info on HTML page
function updateInfo(info) {
    $("#SheetName").text(info.Name);
    $("#ParentSheetName").text(info.ParentName);
    $("#SheetVer").text(info.LatestVersion);
    $("#RowCount").text(info.CountRecords);
}
// When button on main page is clicked.
// This will access the canvas code, load the sheet, and render it onto the HTML page. 
function OnClick_AccessCodeAndLoadSheet() {
    var loginUrl = $("#loginurl").val();
    var code = $("#code").val();
    postLogin(loginUrl, code, function (login) {
        _sheet = login; // Save for when we do Post
        getSheetContents(login, function (sheet) { return updateSheet(sheet); });
        getSheetInfo(login, function (info) { return updateInfo(info); });
    });
}
