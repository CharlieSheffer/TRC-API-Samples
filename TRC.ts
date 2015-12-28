// TypeScript
// General purpose TypeScript definitions for using TRC

declare var $ :any; // external def for JQuery 

// The response back from a login. This provides access to a sheet. 
interface ISheetReference
{
    // The auth parameter for accessing this sheet. scheme is 'Bearer'
    AuthToken : string;

    // The URL endpoint to access this sheet at. This may be different than the login server. 
    Server: string;

    // The unique Sheet Identifier for accessing this sheet. 
    SheetId: string;
}

// The sheet contents. 
// Dictionary ColumnNames(string) --> values (string[int i])
interface ISheetContents {
    [colName: string]: string[];
}

// Result of /sheet/{id}/info
interface ISheetInfoResult {
    Name : string; // name of this sheet (ie, the precinct)
    ParentName : string;  // name of the group (ie, the campaign)
    LatestVersion : number; 
    CountRecords : number; // number of rows. 
}

// Update a single cell in the sheet. 
function postSheetUpdate(
    sheetRef : ISheetReference, 
    recId : string, 
    colName : string,     
    newValue: string,
    successFunc : () => void 
    ) : void 
{
     var url = sheetRef.Server + "/sheets/" + sheetRef.SheetId;

     // cheap way to Csv-Escape newval. 
     var escaped = newValue.replace('\"', '\'');
     var contents = "RecId, " + colName +"\r\n" + recId + ", \"" + newValue +"\"";

    $.ajax({
        url : url,
        type: 'POST',        
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + sheetRef.AuthToken);
        },
        contentType: "text/csv; charset=utf-8",
        data: contents, // content-type is application/csv. 
        success: function () {
            successFunc();
        },
        error: function (data: any) {
            alert("Failed to Update cell (" + recId + ", " + colName + ") to value '" + newValue + "'.");
        }});
}

// Get metadata information about the sheet (such as name). 
// This is separate from retrieving the actual contents. 
function getSheetInfo(
    sheetRef : ISheetReference,
    successFunc: (data: ISheetInfoResult) => void
    ) : void
{
    var url = sheetRef.Server + "/sheets/" + sheetRef.SheetId + "/info";
        
    $.ajax({
        url : url,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + sheetRef.AuthToken);
        },
        success: function (info: ISheetInfoResult) {
            successFunc(info);
        },
        error: function (data: any) {
            alert("Failed to get sheet Info");
        }});
}

// Get sheet contents as a JSon object. 
function getSheetContents(
    sheetRef : ISheetReference,
    successFunc: (data: ISheetContents) => void
    ) : void
{    
    var url = sheetRef.Server + "/sheets/" + sheetRef.SheetId;
        
    $.ajax({
        url : url,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + sheetRef.AuthToken);

            // include the accept json header to get a response as ISheetContents. 
            // If we omit this, we get it back as a CSV. 
            xhr.setRequestHeader ("accept", "application/json");
        },
        success: function (sheet: ISheetContents) {
            successFunc(sheet);
        },
        error: function (data: any) {
            alert("Failed to get sheet contents");
        }});
}

// Do a login to convert a canvas code to a sheet reference. 
function postLogin(
    loginUrl : string, 
    canvasCode :string, 
    successFunc : (ISheetReference) => void
    ) :void 
{
    var url = loginUrl + "/login/code2";
    var loginBody = {
        Code: canvasCode,
        AppName : "Demo"
    };
    $.support.cors = true;    
    $.ajax({
        url : url,
        type : 'POST',
        contentType: "application/json",
        data: JSON.stringify(loginBody),
        success : function (sheetRef: ISheetReference) {
            successFunc(sheetRef);
        },
        error: function (data: any) {
            alert("Failed to do initial login at: " + loginUrl + " for code " + canvasCode);
        }});
}