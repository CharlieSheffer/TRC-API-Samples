# How to write a TRC Plugin 

A “TRC plugin” is a static package that can run in the TRC site and extends TRC functionality. 
Plugins are HTML, JScript (TypeScript), and static content like images. They run 100% on the client and make AJax calls to the REST API from the backend server . 

See the REST API reference and trc.ts wrappers for availability functionality. 


# Basic lifecyle for creating a plugin 

- Copy a template from an existing plugin, such as in https://github.com/Voter-Science/TRC-API-Samples/tree/master/Plugins/MyFirstPlugin
- Develop the plugin locally. You can test it against a sample sandbox or your own sheets. 
  Since the plugin is 100% HTML and Jscript, it can run locally without any hosting. 
- Contact Info@Voter-Science.com to get your plugin published to the gallery so that other users can see it. 

# Anatomy of a plugin 

A plugin is a static set of files living in a directory. There are some well-known conventions for the files

## PluginManifest.Json
Plugins have a manifest file that looks like this:

```
{
    "Id": "MyFirstPlugin", // ID must be unique on the gallery
    "Name": "My first plugin", // friendly name
    "Author" :  "John Doe", 
    "Website" :  "https://github.com/Voter-Science/TRC-API-Samples", // your site
    "Description": "Longer description when browsing a gallery",        
    "Version": "1.0.0", // User SemVer
    "Tags": [ "demo" ]
}
```
## Logo.png
Plugins can a logo which is displayed in the gallery 


## Index.html 

A plugins main entry point is called 'Index.html'. This setups the basic HTML frame for the plugin. 

The file should include these well known scripts 
```
<script src="https://trcanvasdata.blob.core.windows.net/code/trc.js"> </script>
<script src="https://trcanvasdata.blob.core.windows.net/code/plugin.js"></script>
```
It should also include a JQuery reference since plugin.js will use $() for running a function after document load. 

trc.js defines JScript wrappers and functions for accessing the REST apis. It is technically optional.
plugin.js is where the magic happens. When you run index.html locally (outside of the TRC Web App host), plugin.js will detect 
it's being self-hosted and inject a basic toolbar at the top of your HTML page for login and basic diagnostics. 
The login will let you enter the 'canvas code' for the sheet you want to access.  This lets you easily develop a plugin on your local 
machine. 

When the plugin is hosted in the real Web host, it has access to the session cookies and will use your current login credentials. 

## PluginMain(sheetRef: ISheetRefence) 
Your plugin must define a function, PluginMain() that takes in an ISheetReference. ISheetReference is defined in trc.ts and looks like this:

```jscript
interface ISheetReference
{
    AuthToken : string;
    Server: string;
    SheetId: string;
}
```
This provides the credentials to call the backend server and access the REST apis. 

The host (either plugin.js or the web app) will invoke PluginMain() for you after the document is loaded. 
This function can then call the REST server and modify the HTML DOM  accordingly. 



