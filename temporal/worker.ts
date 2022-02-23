import { Worker } from "@temporalio/worker";
import * as activities from "./activities";
import * as activities_it from "./activities.it";

// eslint-disable-next-line functional/no-let
let worker: Worker;

export const startWorker = async (): Promise<Worker> => {
  if (worker) {
    return worker;
  }

  worker = await Worker.create({
    activities,
    taskQueue: "tutorial0",
    workflowsPath: require.resolve("./workflows")
  });

  // Worker connects to localhost by default and uses console.error for logging.
  // Customize the Worker by passing more options to create():
  // https://typescript.temporal.io/api/classes/worker.Worker
  // If you need to configure server connection parameters, see docs:
  // https://docs.temporal.io/docs/typescript/security#encryption-in-transit-with-mtls

  // Step 2: Start accepting tasks on the `tutorial` queue
  await worker.run();

  const dd = await Worker.create({
    activities: activities_it,
    taskQueue: "tutorial1",
    workflowsPath: require.resolve("./workflows")
  });
  await dd.run();

  return worker;
};
