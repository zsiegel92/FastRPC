'use client'
import React, { useState } from 'react';
import { PlotlyPlot } from '@/components/PlotlyPlot'
import { Tabs, Tab } from 'react-bootstrap'

// type ExperimentDetails = {
// 	experiment_id: string,
// 	experiment_details: string,
// 	plot_json_objects: any[],
// }

// import Plot from 'react-plotly.js';
// const Plot = require('react-plotly.js').default;
// const Plot = require('react-plotly.js');
// https://github.com/plotly/react-plotly.js/issues/272

export function PlotlyPlots({ plot_json_objects }: { plot_json_objects: any[] }) {

	return (
		<Tabs>
			{
				plot_json_objects.map((plot_json_object, plot_json_object_index) => (
					<Tab
						eventKey={plot_json_object_index}
						title={`Plot ${plot_json_object_index + 1}`}
						key={plot_json_object_index}
						mountOnEnter={true}
						unmountOnExit={true}
					>
						<PlotlyPlot
							plot_json_object={plot_json_object}
						/>
					</Tab>
				))
			}
		</Tabs>
	)
}