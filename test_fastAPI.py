from fastapi import FastAPI, APIRouter, Query
from typing import Annotated
from pydantic import BaseModel
import json
import numpy as np
import plotly.express as px
from plotly.utils import PlotlyJSONEncoder


app = FastAPI()
router =APIRouter(prefix='/api/python')


def encode_plotly_fig(fig):
	return json.loads(json.dumps(fig.to_plotly_json(), cls=PlotlyJSONEncoder))


class Hello(BaseModel):
	message: str


class HelloWorld(Hello):
	message: str = 'Hello World'


@router.get("/{message}")
async def hello(message: str) -> Hello:
	'''Retuns a message depending on the route.'''
	return {"message": message}

@router.get('/')
async def hello_world() -> HelloWorld:
	'''Retuns a Hello World message'''
	return HelloWorld()


@router.get('/get_records')
async def get_records() -> list[str]:
	'''Get list of record names. These should all be valid inputs to `get_record`.'''
	return ['record_1', 'record_2']


class RecordDetails(BaseModel):
	'''
	Details for an record.
	:param str mirror_message: message to be returned in a response if sent in a request
	'''
	record_id: str
	record_details: str
	plot_json_objects: list[dict]
	mirror_message: str
	'''message to be returned in a response if sent in a request'''
	mirror_n_rows: int



def get_random_fig(n_points):
	x = list(range(n_points))
	y = np.random.rand(n_points)
	color = np.random.rand(n_points)
	fig = px.scatter(
		x=x,
		y=y,
		color=color,
		title=f'random scatter plot with {n_points} points',
	)
	return fig


@router.get('/get_record/{record_id}')
async def get_record(
	record_id: str,
	n_points: int = 100,
	n_figs: int = 3,
	mirror_message: str = 'default mirror message',
	n_rows: int = 1,
) -> RecordDetails:
	'''Get record details and plots'''
	print(f'get_record: record_id={record_id}, n_points={n_points}, n_figs={n_figs}')
	return {
		'record_id': record_id,
		'record_details': f'details for record {record_id}',
		'plot_json_objects': [encode_plotly_fig(get_random_fig(n_points)) for _ in range(n_figs)],
		'mirror_message': mirror_message,
		'mirror_n_rows': n_rows,
	}

app.include_router(router)

if __name__ == '__main__':
	import uvicorn
	# uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)
	uvicorn.run(
		'test_fastAPI:app',
		host='0.0.0.0',
		port=8000,
		reload=True,
	)
