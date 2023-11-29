import Image from "next/image";
import Link from "next/link";
import { Suspense, lazy } from "react";

import { PlotlyPlots } from "@/components/PlotlyPlots";
import { PythonClient } from "@/py_client/PythonClient";
import { RecordDetails } from "@/py_client/models/RecordDetails";

const py = new PythonClient({
  BASE: "http://localhost:8000",
  TOKEN: "1234",
});
const N_FIGS_PER_EXPERIMENT = Number(process.env.N_FIGS_PER_EXPERIMENT) || 5;

const N_POINTS_PER_PLOT = Number(process.env.N_POINTS_PER_PLOT) || 10000;

export default async function Home() {
  // const output = await (await fetch('http://localhost:8000/api/python')).json()
  let resp: RecordDetails =
    await py.default.getRecordApiPythonGetRecordRecordIdGet({
      recordId: "1",
      nPoints: 5000,
      nFigs: 20,
      mirrorMessage: "JAVASCRIPT-ORIGINATED MESSAGE",
      nRows: 5,
    });
  let plot_json_objects = resp.plot_json_objects;
  console.log("MIRROR MESSAGE");
  console.log(resp.mirror_message);
  return (
    <main>
      <div>
        HERE
        {/* {JSON.stringify(output, null, 2)} */}
        HERE!
        <div>
          <h3>PLOTS</h3>
          {[...Array(resp.mirror_n_rows).keys()].map((replicate_index) => (
            <PlotlyPlots
              key={replicate_index}
              plot_json_objects={plot_json_objects}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
