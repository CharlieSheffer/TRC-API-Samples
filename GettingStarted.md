# REST API for talking to TRC Server

## Concepts
All data in TRC is conceptually viewed as a CSV. 
Structured data is content-type:application/json 
CSV data is content-type: application/text

## Login 
Calls to read/write to sheets are protected with an Authorization header containing a JSON Web Token (JWT).
Given a sheet, you can get a short “access code” (such as “ABC2-DEAS”) which can be distributed to volunteers to enable them to access a sheet.  
The REST API lets apps convert an access code to a JWT to access a sheet. 

Converts an canvas code into a JWT.  This is a public endpoint and requires no authentication. 
Sample request:

```
POST https://TRC-login.voter-science.com/login/code2

{
    "Code" : "1234"
}
```

Sample Response:
```
HTTP/1.1 200 OKcache
Cache-Control: no-
Pragma: no-cache
Content-Type: application/json; charset=utf-8
Content-Length: 266

{
    "AuthToken": "eyJ0...",
    "SheetId" : "5939871231",
    "Server": "https://server-1.Voter-Science.com"
}
```

The AuthToken should be passed to all future requests as a Authorization bearer token. 
The Server specifies the server endpoint for accessing the sheet. 
The sheetId specifies the unique sheet identifier for the target sheet. If a single sheet is shated my many volunteers, then there may be many login codes pointing to the same sheet. 
Clients can cache the sheetId value.

## Reading a sheet


## Writing a sheet
