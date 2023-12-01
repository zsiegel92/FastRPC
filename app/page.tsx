import { PythonClient } from "@/py_client/PythonClient";
import { Message } from "@/py_client/models/Message"; // Typescript knows the Pydantic types!

const py = new PythonClient({
  BASE: "http://localhost:8000",
  TOKEN: "1234",
});

export default async function Home() {
  let resp: Message = await py.default.getPythonMessage({
    message: "typescript knows what the type of this input should be! OKAY",
    message2: "okay, typescript, here's the new input!",
  });

  return (
    <main>
      <div>
        <div>
          <h3>OUTPUT</h3>
          <pre>{JSON.stringify(resp, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}
