import { AzureFunction, Context } from "@azure/functions";
import * as express from "express";
import { secureExpressApp } from "@pagopa/io-functions-commons/dist/src/utils/express";
import { setAppContext } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler";
import { startWorker } from "../temporal/worker";
import { StartWorkflow } from "./handler";

// Setup Express
const app = express();
secureExpressApp(app);

// Add express route
app.get("/api/v1/start", StartWorkflow());

const azureFunctionHandler = createAzureFunctionHandler(app);

const httpStart: AzureFunction = (context: Context): void => {
  setAppContext(app, context);
  azureFunctionHandler(context);
};

void startWorker();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default httpStart;
