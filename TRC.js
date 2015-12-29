// TypeScript
// General purpose TypeScript definitions for using TRC
// Update a single cell in the sheet. 
function trcPostSheetUpdateCell(sheetRef, recId, colName, newValue, successFunc) {
    // We can post either application/json or text/csv
    var url = sheetRef.Server + "/sheets/" + sheetRef.SheetId;
    var body = {};
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
        error: function (data) {
            alert("Failed to Update cell (" + recId + ", " + colName + ") to value '" + newValue + "'.");
        }
    });
}
// Get metadata information about the sheet (such as name). 
// This is separate from retrieving the actual contents. 
function trcGetSheetInfo(sheetRef, successFunc) {
    var url = sheetRef.Server + "/sheets/" + sheetRef.SheetId + "/info";
    $.ajax({
        url: url,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + sheetRef.AuthToken);
        },
        success: function (info) {
            successFunc(info);
        },
        error: function (data) {
            alert("Failed to get sheet Info");
        }
    });
}
// Get sheet contents as a JSon object. 
function trcGetSheetContents(sheetRef, successFunc) {
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
        success: function (sheet) {
            successFunc(sheet);
        },
        error: function (data) {
            alert("Failed to get sheet contents");
        }
    });
}
function trcGetSheetDeltas(sheetRef, successFunc) {
    var url = sheetRef.Server + "/sheets/" + sheetRef.SheetId + "/deltas";
    $.ajax({
        url: url,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + sheetRef.AuthToken);
        },
        success: function (segment) {
            successFunc(segment);
        },
        error: function (data) {
            alert("Failed to get history Info");
        }
    });
}
// Do a login to convert a canvas code to a sheet reference. 
function trcPostLogin(loginUrl, canvasCode, successFunc) {
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
        success: function (sheetRef) {
            successFunc(sheetRef);
        },
        error: function (data) {
            alert("Failed to do initial login at: " + loginUrl + " for code " + canvasCode);
        }
    });
}
//# sourceMappingURL=trc.js.map