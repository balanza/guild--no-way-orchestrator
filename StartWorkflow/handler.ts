/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as express from "express";
import { wrapRequestHandler } from "@pagopa/io-functions-commons/dist/src/utils/request_middleware";

import {
  IResponseSuccessAccepted,
  ResponseSuccessAccepted
} from "@pagopa/ts-commons/lib/responses";

import { Connection, WorkflowClient } from "@temporalio/client";

type InfoHandler = () => Promise<IResponseSuccessAccepted>;

export const createStartWorkflow = (): InfoHandler => async (): Promise<
  IResponseSuccessAccepted
> => {
  const connection = new Connection({
    //  Connect to localhost with default ConnectionOptions.
    //  In production, pass options to the Connection constructor to configure TLS and other settings:
    // address: 'foo.bar.tmprl.cloud',  as provisioned
    // tls: {} as provisioned
  });

  const client = new WorkflowClient(connection.service, {
    // namespace: 'default', // change if you have a different namespace
  });

  const handle = await client.start("example", {
    args: ["Temporal"], // type inference works! args: [name: string]
    taskQueue: "tutorial",
    // in practice, use a meaningful business id, eg customerId or transactionId
    workflowId: `wf-id-${Math.floor(Math.random() * 1000)}`
  });
  console.log(`Started workflow ${handle.workflowId}`);

  // optional: wait for client result
  console.log(await handle.result()); // Hello, Temporal!

  return ResponseSuccessAccepted();
};

export const StartWorkflow = (): express.RequestHandler => {
  const handler = createStartWorkflow();

  return wrapRequestHandler(handler);
};
