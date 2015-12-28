// TypeScript
// JScript functions for BasicList.Html. 
// This calls TRC APIs and binds to specific HTML elements from the page.  

/// <reference path="trc.ts" />

declare var $ :any; // external def for JQuery 

function Init()
{
    $(function() {
        // On document load. 
        $("#ver").html("27");
    });
}

// Global reference to the current sheet;
var _sheet : ISheetReference;

// Helper for setting the cell background color. 
function setColorClass(element, cssColorClass: string) : void {    
    element.
        removeClass('PreUpload').removeClass('OkUpload').removeClass('OtherUpload').
        addClass(cssColorClass);
}

// Callback from HTML page when a comment cell has changed. 
function onCommentChange(recId : string, newValue : string) : void {        
    var element = $('#row_' + recId);
    setColorClass(element, 'PreUpload');

    // Upload to server, turn green on success. 
    postSheetUpdate(_sheet, recId, "Comments", newValue, () => {
        setColorClass(element, 'OkUpload');
    });
}

function updateSheet(data : ISheetContents) : void {

    // FirstName	LastName
    var recIds : string[] = data["RecId"]; // Get primary record ID (the SOS IDs)
    var fnames : string[] = data["FirstName"];
    var lnames : string[] = data["LastName"];
    var lats : string[] = data["Lat"];
    var longs : string[] = data["Long"];
    var comments : string[] = data["Comments"];

    for(var i in recIds)
    {
        var recId : string = recIds[i];
        var fname : string = fnames[i];
        var lname : string = lnames[i];
        var comment : string = comments[i];

        var tRow = $('<tr>');

        // Static cells just display data
        var tCell1 = $('<td>').text(recId);
        var tCell2 = $('<td>').text(fname);
        var tCell3 = $('<td>').text(lname);
        var tCell4 = $('<td>').text(lats[i]);
        var tCell5 = $('<td>').text(longs[i]);
        
        // 'comment' cell is special since it's editable. On any change, it will upload to server.      
        var tCell6= $('<td>').html('<input type="text" id="row_' + recId +'" value="' + comment +'" onchange=\"onCommentChange(\'' + recId + '\', this.value)\" /> ');

        tRow.append(tCell1).append(tCell2).append(tCell3).append(tCell4).append(tCell5).append(tCell6);

        $('#main').append(tRow);
    }   
}

// Display sheet info on HTML page
function updateInfo(info : ISheetInfoResult) : void
{
    $("#SheetName").text(info.Name);
    $("#ParentSheetName").text(info.ParentName);
    $("#SheetVer").text(info.LatestVersion);
    $("#RowCount").text(info.CountRecords);    
}


// When button on main page is clicked.
// This will access the canvas code, load the sheet, and render it onto the HTML page. 
function OnClick_AccessCodeAndLoadSheet()
{
    var loginUrl = $("#loginurl").val();
    var code = $("#code").val();
    
    postLogin(loginUrl, code, (login) => {
        _sheet = login; // Save for when we do Post
        getSheetContents(login, (sheet) => updateSheet(sheet));
        getSheetInfo(login, (info) => updateInfo(info));
    }); 
}