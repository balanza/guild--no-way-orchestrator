import { proxyActivities } from "@temporalio/workflow";
// Only import the activity types

import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as activities from "./activities";

const { greet2, sleep } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute"
});

const taskifiedGreet = (name: string): TE.TaskEither<Error, string> =>
  pipe(
    TE.tryCatch(() => greet2(name), E.toError),
    TE.chain(TE.fromEither)
  );

const taskifiedSleep = (ms: number): TE.TaskEither<Error, void> =>
  pipe(TE.tryCatch(() => sleep(ms), E.toError));
/** A workflow that simply calls an activity */
export const example = async (name: string): Promise<string> =>
  pipe(
    name,
    taskifiedGreet,
    TE.chain(d =>
      pipe(
        taskifiedSleep(1000),
        TE.map(_ => d)
      )
    ),
    TE.chain(d => taskifiedGreet(d + "-bis")),
    TE.mapLeft(err => err.message),
    TE.toUnion
  )();

export const exampleAwait = async (name: string): Promise<string> =>
  pipe(
    name,
    taskifiedGreet,
    TE.chain(d =>
      pipe(
        taskifiedSleep(1000),
        TE.map(_ => d)
      )
    ),
    TE.chain(d => taskifiedGreet(d + "-bis")),
    TE.mapLeft(err => err.message),
    TE.toUnion
  )();
