 
// Hook for local debugging to inject a Login page 

declare var $: any; // external definition for JQuery 

// Add 
// Take optional arg for login, canvas code?
function LocalDebug()
{
    $(function () {
        // Various techniques for including HTML from JS
        // http://stackoverflow.com/questions/676394/how-to-include-an-html-page-into-another-html-page-without-frame-iframe
        // Modifying document.body needs to happen after the initial load 
        var elemDiv = document.createElement('div');
        //elemDiv.style.cssText = 'width:100%;height:10%;background:rgb(192,192,192);';
        elemDiv.innerHTML =
            '<div style="background-color:lightyellow; border:dashed">' +
            '<h2>Self-hosted debugging</h2>' +
            '<p>View more doucmenation and samples at <a href="https://github.com/Voter-Science/TRC-API-Samples">https://github.com/Voter-Science/TRC-API-Samples</a></p>' +
            '<p>Enter your canvas code:</p>'+
            '<table>' +
            '<tr><td>Login URL</td><td><input size=80 type=text id="LocalDbgloginurl" value="https://trc-login.voter-science.com"/></td></tr>' +
            '<tr><td>Canvas code:</td><td><input type=text id="LocalDbgcode" placeholder="abc123" value="SGYZC4CH" /></td></tr>' +
            '</table>' +
            '<button onclick="LocalDebug_OnClick_AccessCodeAndLoadSheet()" value="Load">Load sheet!</button>' +
            '</div>';

        window.document.body.insertBefore(elemDiv, window.document.body.firstChild);
    });
}


declare function PluginMain(sheetRef : any): void;

// When button on main page is clicked.
// This will access the canvas code, load the sheet, and render it onto the HTML page. 
function LocalDebug_OnClick_AccessCodeAndLoadSheet() {
    var loginUrl = $("#LocalDbgloginurl").val();
    var code = $("#LocalDbgcode").val();

    trcPostLogin(loginUrl, code,(sheetRef) => {
        //alert(sheetRef.AuthToken + "|" + sheetRef.Server + "|" + sheetRef.SheetId);
        PluginMain(sheetRef);
    });
}


// On startup
LocalDebug();