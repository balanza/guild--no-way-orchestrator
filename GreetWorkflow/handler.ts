/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as express from "express";
import { wrapRequestHandler } from "@pagopa/io-functions-commons/dist/src/utils/request_middleware";

import {
  IResponseSuccessJson,
  ResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";

import { Connection, WorkflowClient } from "@temporalio/client";

type InfoHandler = () => Promise<
  IResponseSuccessJson<{
    readonly msg: string;
    readonly id: string;
    readonly queue: string;
  }>
>;

export const createStartWorkflow = (): InfoHandler => async (): Promise<
  IResponseSuccessJson<{
    readonly msg: string;
    readonly id: string;
    readonly queue: string;
  }>
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
  const id = `wf-id-${Math.floor(Math.random() * 1000)}`;
  const queue = `tutorial${Date.now() % 2}`;
  const handle = await client.start("example", {
    args: ["Temporal"], // type inference works! args: [name: string]
    taskQueue: queue,
    // in practice, use a meaningful business id, eg customerId or transactionId
    workflowId: id
  });
  console.log(`Started workflow ${handle.workflowId}`);

  // optional: wait for client result
  const result = await handle.result(); // Hello, Temporal!

  return ResponseSuccessJson({ msg: result, id, queue });
};

export const StartWorkflow = (): express.RequestHandler => {
  const handler = createStartWorkflow();

  return wrapRequestHandler(handler);
};
