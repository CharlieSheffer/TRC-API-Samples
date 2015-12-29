// TypeScript
// General purpose TypeScript definitions for using TRC

declare var $: any; // external def for JQuery 

// The response back from a login. This provides access to a sheet. 
interface ISheetReference {
    // The auth parameter for accessing this sheet. scheme is 'Bearer'
    AuthToken: string;

    // The URL endpoint to access this sheet at. This may be different than the login server. 
    Server: string;

    // The unique Sheet Identifier for accessing this sheet. 
    SheetId: string;
}

// The sheet contents. 
// Column-major order. 
// Dictionary ColumnNames(string) --> values (string[int i])
interface ISheetContents {
    [colName: string]: string[];
}

// Type information about columns in the sheet.
// To aid editors. 
interface IColumnInfo {
    Name: string; // Unique ID for this column. 
    DisplayName: string;
    Description: string;
    PossibleValues: string[]; // Important for multiple choice
    IsReadOnly: boolean;
    Type: string; // Text, MultipleChoice
}

// Result of /sheet/{id}/info
interface ISheetInfoResult {
    Name: string; // name of this sheet (ie, the precinct)
    ParentName: string;  // name of the group (ie, the campaign)
    LatestVersion: number;
    CountRecords: number; // number of rows. 

    // approximate coordinate for this sheet's average Lat/Long.
    // 0 if unavailable. 
    Latitute: number;
    Longitude: number;

    // unordered. Describes the columns in the sheet
    Columns: IColumnInfo[];
}

// Update a single cell in the sheet. 
function trcPostSheetUpdateCell(
    sheetRef: ISheetReference,
    recId: string,
    colName: string,
    newValue: string,
    successFunc: () => void
    ): void {
    // We can post either application/json or text/csv

    var url = sheetRef.Server + "/sheets/" + sheetRef.SheetId;

    var body: ISheetContents = {};
    body["RecId"] = [recId];
    body[colName] = [newValue];

    $.ajax({
        url: url,
        type: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + sheetRef.AuthToken);
        },
        contentType: "application/json",
        data: JSON.stringify(body),
        success: function () {
            successFunc();
        },
        error: function (data: any) {
            alert("Failed to Update cell (" + recId + ", " + colName + ") to value '" + newValue + "'.");
        }
    });
}

// Get metadata information about the sheet (such as name). 
// This is separate from retrieving the actual contents. 
function trcGetSheetInfo(
    sheetRef: ISheetReference,
    successFunc: (data: ISheetInfoResult) => void
    ): void {
    var url = sheetRef.Server + "/sheets/" + sheetRef.SheetId + "/info";

    $.ajax({
        url: url,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + sheetRef.AuthToken);
        },
        success: function (info: ISheetInfoResult) {
            successFunc(info);
        },
        error: function (data: any) {
            alert("Failed to get sheet Info");
        }
    });
}

// Get sheet contents as a JSon object. 
function trcGetSheetContents(
    sheetRef: ISheetReference,
    successFunc: (data: ISheetContents) => void
    ): void {
    var url = sheetRef.Server + "/sheets/" + sheetRef.SheetId;

    $.ajax({
        url: url,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + sheetRef.AuthToken);

            // include the accept json header to get a response as ISheetContents. 
            // If we omit this, we get it back as a CSV. 
            xhr.setRequestHeader("accept", "application/json");
        },
        success: function (sheet: ISheetContents) {
            successFunc(sheet);
        },
        error: function (data: any) {
            alert("Failed to get sheet contents");
        }
    });
}



// Represents a delta to the sheet
interface IDeltaInfo {
    Version: number;
    User: string; // user (as identified by email address) that made this change
    App: string; // App name (passed in login) being used to make the change. 

    Timestamp: string; // time of modification. Serialized from a C# DateTime

    GeoLat: number; // lat,long where change was made
    GeoLong: number;

    Value: ISheetContents; // delta applied to the sheet
}

interface IHistorySegment {
    NextLink: string;
    Results: IDeltaInfo[];
}

function trcGetSheetDeltas(
    sheetRef: ISheetReference,
    successFunc: (IHistorySegment) => void
    ): void {
    var url = sheetRef.Server + "/sheets/" + sheetRef.SheetId + "/deltas";

    $.ajax({
        url: url,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + sheetRef.AuthToken);
        },
        success: function (segment: IHistorySegment) {
            successFunc(segment);
        },
        error: function (data: any) {
            alert("Failed to get history Info");
        }
    });
}

// Do a login to convert a canvas code to a sheet reference. 
function trcPostLogin(
    loginUrl: string,
    canvasCode: string,
    successFunc: (ISheetReference) => void
    ): void {
    var url = loginUrl + "/login/code2";
    var loginBody = {
        Code: canvasCode,
        AppName: "Demo"
    };
    $.support.cors = true;
    $.ajax({
        url: url,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(loginBody),
        success: function (sheetRef: ISheetReference) {
            successFunc(sheetRef);
        },
        error: function (data: any) {
            alert("Failed to do initial login at: " + loginUrl + " for code " + canvasCode);
        }
    });
}