# REST API for talking to TRC Server

## Concepts
All data in TRC is conceptually viewed as a CSV. 
Structured data is content-type:application/json 
CSV data is content-type: application/text


## Login 
Calls to read/write to sheets are protected with an Authorization header containing a JSON Web Token (JWT).
Given a sheet, you can get a short “access code” (such as “ABC2-DEAS”) which can be distributed to volunteers to enable them to access a sheet.  The REST API lets apps convert an access code to a JWT to access a sheet. 

Converts an canvas code into a JWT.  This is a public endpoint and requires no authentication. 
Sample request:

```
POST http://Canvas.Voter-Science.com/login/code?code=12345
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
    "Server": "https://bailey-api.Voter-Science.com"
}
```

## Error Responses
Error codes from the server are JSON objects in the format:

```
{
    "Code": 400,
    "Message": "The first column must be the primary key for this table ('address'). Not 'recid'."
}
```

Commonly used error codes are:

*	400 – Bad request. 
*	404 – Not Found 
*	409 – Conflict. 
*	429 – Server contention. Client should try again later. 
*	500 – Internal server error. This is a bug in Bailey. 

