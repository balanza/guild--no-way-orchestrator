import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";

export const greet = async (name: string): Promise<string> => `Ciao, ${name}!`;

export const greet2 = async (name: string): Promise<E.Either<Error, string>> =>
  pipe(TE.of(`Ciao, ${name}!`))();

export const sleep = async (ms: number): Promise<void> =>
  new Promise(done => setTimeout(done, ms));
