/*
 * IBM Confidential
 * OCO Source Materials
 * 5900-A1Y
 *
 * © Copyright IBM Corp. 2018, 2019
 *
 * The source code for this program is not published or
 * otherwise divested of its trade secrets, irrespective of
 * what has been deposited with the U.S. Copyright Office.
 */

import * as express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as http from 'http';

export const config = {
  ift_url: 'https://food.ibm.com/ift/api/outbound/v2', // The URL of the IFT environment you are running against
  host: 'https://localhost',
  port: 5474
};

const app = express();

// Version Routers
import { TraceAssistantRouter } from './recall-assistant/router';
const baseUrl = '/ift/api-samples';

// Configure recall assistant
const recallAssistantPathV1 = `${baseUrl}/recall-assistant/v1`;
app.use(recallAssistantPathV1, TraceAssistantRouter.getRouter());
console.info(`Recall assistant v1 endpoints configured at ${recallAssistantPathV1}`);
const swaggerPath = `${recallAssistantPathV1}/swagger`;
app.use(`${swaggerPath}/`, express.static('static'));
app.use(swaggerPath, swaggerUi.serve, swaggerUi.setup(
  null,
  {
    swaggerOptions: {
      url: './v1/swagger.yaml',
    },
    explorer: true,
    // tslint:disable-next-line:max-line-length
    customCss: `.info .description::before { content: "Service Version: ${process.env.npm_package_version}"; font-weight: bold; }`
  }
));
console.info(`swagger configured at ${swaggerPath}`);

// Start server
http.createServer(app).listen(config.port);
console.info(`server is up at ${config.port}`);

module.exports = {};
