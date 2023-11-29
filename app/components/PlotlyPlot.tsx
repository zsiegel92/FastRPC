'use client'
import React, { useEffect, useState } from 'react';
import { Spinner, Button } from 'react-bootstrap'


// import Plot from 'react-plotly.js';
// const Plot = require('react-plotly.js').default;
// const Plot = require('react-plotly.js');
// https://github.com/plotly/react-plotly.js/issues/272

import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

export function PlotlyPlot({ plot_json_object }: { plot_json_object: any }) {
	const [initialized, setInitialized] = useState(false);
	return (
		<div>
			{!initialized && <Spinner
				as="span"
				animation="border"
				size="sm"
				role="status"
				aria-hidden="true"
			/>}
			<Plot
				// data={plot_json_object.data}
				// layout={plot_json_object.layout}
				onInitialized={() => setInitialized(true)}
				{...plot_json_object}

			/>
			<br/>
		</div>
	)
}