from fastapi import FastAPI, APIRouter, Query
from typing import Annotated, Callable

from contextlib import asynccontextmanager
import inspect
from inspect import Parameter
import json
import os


class FastRPC(FastAPI):

    def __init__(
        self,
        *args,
        prefix=None,
        openapi_filename='openapi.json',
        openapi_dir=None,
        quiet=True,
        **kwargs,
    ):
        super().__init__(*args, lifespan=lifespan, **kwargs)
        self.router__ = APIRouter(prefix=prefix)
        self.quiet = quiet

        if openapi_dir is None:
            openapi_dir = __file__.rsplit('/', 1)[0]
        openapi_path = os.path.join(openapi_dir, openapi_filename)
        self.openapi_path = openapi_path
        self.route_signatures = set()
        # self.on_event('startup')(self.export_openapi_spec) # deprecated - use lifespan API

    def get_route(self, fn, sibling=None):
        if sibling is not None:
            route_base = sibling.__name__
        else:
            route_base = fn.__name__

        arg_names = get_required_argument_names(
            fn)  # fn(a, b, c=5, d=None) -> ['a', 'b']
        bracketed_arg_names = bracketed(arg_names)
        route = '/'.join((f'/{route_base}',
                          *bracketed_arg_names))  # fn(a, b, c=5, d=None) -> '/fn/a/b'
        route_name_uses = 1
        while route in self.route_signatures:
            route_name_uses += 1
            route = '/'.join((f'/{route_base}{route_name_uses}',
                              *bracketed_arg_names))  # -> '/fn2/a/b'
        self.route_signatures.add(route)
        return route

    def get_RPC(self, *args, sibling=None, **kwargs):
        if len(args) > 0:
            fn_or_route = args[0]
            args = args[1:]
        else:
            fn_or_route = None
        if isinstance(fn_or_route, str):
            # using `@app.get_RPC('...')` like `app.get('...')` is supported
            route = fn_or_route
            decorator = self.router__.get(route, *args, **kwargs)
            return decorator
        elif fn_or_route is None:
            # using `@app.get_RPC(**kwargs)`, e.g. `@app.get_RPC(sibling=other_fn)`
            decorator = lambda fn: self.get_RPC(
                fn, sibling=sibling, *args, **kwargs)
            return decorator
        else:
            # using `@app.get_RPC` with default config is also supported
            fn = fn_or_route
            route = self.get_route(fn, sibling=sibling)
            wrapped = self.router__.get(route)(fn)
            return wrapped

    def export_openapi_spec(self):
        print(f"Exporting OpenAPI spec to '{self.openapi_path}")
        openapi = self.openapi()
        with open(self.openapi_path, 'w') as f:
            json.dump(openapi, f, indent=2)

    async def startup(self):
        if not self.quiet:
            print("Lifespan: starting application")
        self.include_router(self.router__)
        self.export_openapi_spec()

    async def shutdown(self):
        if not self.quiet:
            print("Lifespan: quitting application")


def get_required_argument_names(fn: Callable) -> list[str]:
    # https://docs.python.org/3/library/inspect.html
    # if param.kind in [param.KEYWORD_ONLY, param.POSITIONAL_ONLY, param.POSITIONAL_OR_KEYWORD, param.VAR_POSITIONAL, param.VAR_KEYWORKD]
    return [
        arg_name
        for arg_name, param in inspect.signature(fn).parameters.items()
        if param.default is Parameter.empty
    ]
    
def bracketed(args: list[str]) -> list[str]:
    return [f'{{{arg}}}' for arg in args]
     
@asynccontextmanager
async def lifespan(application: FastAPI):
    await application.startup()
    yield
    await application.shutdown()
