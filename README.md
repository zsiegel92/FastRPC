# FastRPC

> This project is a WIP but the core implementation works.
> 
> There is outstanding work on the API in Javascript client function names, which do not indicate request type ('GET', 'POST').
> 
> A possible killer feature would be merging multiple endpoints with the same name (e.g. `GET /api/records/{record_id}` and `GET /api/records`) into one Javascript client method `pythonClient.records(...)` where `record_id` is optional, hitting different endpoints based on parameters provided (which is how web routing works). Currently, each web endpoint has one client method.
> 
>  This project requires packaging and is not on Pypi.

The hardest part about "full-stack" web development may not be understanding both frontend and backend languages and frameworks. In some cases, the biggest hurdle is routing and networking.

FastRPC is a thin abstraction over FastAPI that turns the web server framework into an RPC ("remote procedure call") framework.

## Motivation

### Type specifications in routers

The Python web framework Flask has used the dead-simple route decorator pattern pattern since 2004:

```python
from flask import Flask

app = flask.Flask(__name__)

@app.get('/api/getrecords/<artist>/<int:year>')
def get_records(artist, year):
	return [...]
```

Most routers have mini-languages for routes, and Flask's ensures that the `year` parameter is passed to `get_records` as an `int`, and that a non-integer route won't hit this endpoint, taking advantage of *types*.

FastAPI simplifies the routing mini-language by inferring types instead from Python and Pydantic type annotations during runtime, again ensuring endpoints are accessed with the desired parameter types:

```python
from fastapi import FastAPI
from dataclasses import dataclass

app=FastAPI()

@app.get('/api/getrecords/{artist}/{year}')
def get_records(artist: str, year: int) -> Record[]:
	return [...]

@dataclass
class Record:
	title: str
	artist: str
	year: int
```

A Python programmer may not want to define or annotate types, and in particular, annotating a web endpoint's return value could be a total waste of time, since it is not called from Python anyway. That is, you won't benefit from your IDE's knowledge that:
```python
[record.title for record in get_records('The Beatles', '1970')]
```
is valid Python if you're really calling `get_records` from Javascript using `fetch('/api/getrecords/The%20Beatles/1970')`.

FastAPI requires type annotation in exchange for simple and robust endpoint routing, but the annotations yield much more. FastAPI has built-in support for OpenAPI and can both export an OpenAPI spec (in json or yaml) and host a full Swagger UI that documents and tests your endpoints.

By consuming an OpenAPI spec with a Typescript code-gen tool called [`openapi-typescript-sdk-generator`](https://github.com/triggerdotdev/openapi-typescript-sdk-generator), we create a type-aware `pythonClient` object in Typescript that can call all our Python endpoints.

> With FastRPC, your Typescript LSP will know that the following is valid Typescript:
> 
> ```javascript
> import { pythonClient } from 'fastrpc'
> 
> pythonClient.getRecords({artist: 'The Beatles', year: 1970}).map(record => record.title)
> ```
> Your IDE wil autocomplete `record.title` and complain about extraneous arguments!

Exporting an `openapi.json` file is so fast that we can do it on every live-reload of the FastAPI server. Consuming the `openapi.json` file to code-gen a type-aware `pythonClient` SDk in Typescript is so fast that we can do it every time `openapi.json` is generated.

As soon as we save our Python server definition, our Typescript SDK object is aware of the routes (as client methods), route parameters and their types (signatures of those methods), and return types of those routes (as return types of methods), even if those return types are classes containing data structures. All in exchange for type annotating Python functions!



## Abstracting away route definitions

If we have a Javascript SDK that can call Python functions without worrying about routing web requests, why manually define routes at all?

FastRPC takes away route definitions in route decorators so that developers don't have to think about calling routes via web requests. That is,

```python
app = FastAPI()

@app.get('/api/getrecords/{artist}/{year}')
def get_records(artist: str, year: int) -> Record[]:
	...
```
becomes

```python
app = FastRPC()

@app.getRPC
def get_records(artist: str, year: int) -> Record[]:
	...
```

Internally, FastRPC defines a route by introspecting the function's name and signature (`/get_records/{artist}/{year}` in this case).

With this decorator and type annotations, our Typescript client immediately knows that the following is valid:

```javascript
pythonClient.get_records({artist: 'The Beatles', year: 1970}).map(record => record.title)
```


## Features


### Optional parameters

Any Python keyword parameters (with a default value) will automatically become optional parameters in the Tpescript client.

Internally, they become *query parameters*:

```python
@app.getRPC
def get_records(artist: str, year: int, format: str = 'cd', remastered: bool = False) -> Record[]:
	...
```
will allow the following Typescript function calls:

```javascript
pythonClient.get_records({ artist: 'The Beatles', year: 1970 }) 
//  becomes `fetch('/api/getrecords/The%20Beatles/1970')`
// then  becomes `get_records(artist='The Beatles', year=1970)`

pythonClient.get_records({ artist: 'The Beatles', year: 1970, format: 'vinyl', remastered: true })
//  becomes `fetch('/api/getrecords/The%20Beatles/1970?format=vinyl&remastered=true')``
// then  becomes `get_records(artist='The Beatles', year=1970, format='vinyl', remastered=True)`
```

### OpenAPI and Swagger UI

Internally, FastRPC creates a fully-functional FastAPI router. FastRPC is an extremely thin layer, combined with Typescript codegen for an SDK.

This means the FastAPI Swagger UI is absolutely accessible for a FastRPC server, and a FastRPC server can absolutely be used with or without a Javascript client object.

### Route siblings and manually-defined routes

A well-designed web API has many very similar routes:

```
GET /api/records
POST /api/records
GET /api/records/{record_id}
DELETE /api/records/{record_id}
```
and by using Python function names to construct routes, we necessarily lose this functionality, since we can't name multiple functions the same thing (we actually could but we won't). There are two disadvantages to mangling our router with function names:
1. The Javascript client's auto-generated function names may need to be strange, e.g. `pythonClient.getRecords` and `pythonClient.getRecords__record_id`.
2. The internal routes will lack the clarity of a manually-defined web API. The FastRPC server should be a valid and first-class web server in addition to supporting an easy SDK.

There are two possible solutions:
1. Use the underlying FastAPI methods to define routes. That is, `@app.get('/...')` is still valid for a FastRPC `app`.
2. Use a "sibling" for routes that should have the same function names. That is, `@app.getRPC(sibling=getRecords)` will create two routes that begin with `/getrecords`, regardless of the name of the decorated function. Note that if the two functions have otherwise identical signatures, they will define the same underlying route and FastRPC will either allow or prevent this router collision.

These both fully solve the second issue (the web API can have a desired consistency), but the Javascript client function names may still be strange. Thankfully, a good IDE will autocomplete functions beginning with the same name and their Python docstrings will disambiguate them in the Javascript client.

### Complete routing 

Currently, there is only a `@app.getRPC` decorator, but `@app.postRPC`, and generic `@app.RPC('GET')` decorators are planned.


### Router prefix

```python
app = FastRPC(prefix='/api')
# or
app = FastRPC(prefix='/rpc')
```

Multiple FastAPI `APIRouter` objects can be added to a `FastRPC` object in the same way they are added to `FastAPI` object.


### Runtimes

The resulting `pythonClient` object can be used in any Javascript runtime (NodeJS, browser, etc.), since it just uses web requests. 


### Custom `fetch`

Any custom `fetch` function can be substituted into the client (e.g. to route to remote services or over a unix domain socket if on the same machine). The default is the runtime's default `fetch`; an overriden default `fetch` will be used by the client.

