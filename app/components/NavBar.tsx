import getConfig from "next/config";
import { NavComponent } from "@/components/Nav";

export async function NavBar({ assetPrefix }: { assetPrefix: string }) {
  // const response: Response = await fetch('http://localhost:8000/api/python/get_experiments', { next: { revalidate: 30 } })
  // let experiment_ids: any[] = await response.json()
  let experiment_ids = [1, 2, 3];
  // let experiment_ids: any[] = ['experiment_1', 'experiment_2']
  let experiment_links = experiment_ids.map((experiment_id) => ({
    link: `${assetPrefix}/${experiment_id}.html`,
    text: experiment_id,
  }));
  return <NavComponent links={experiment_links} />;
}
