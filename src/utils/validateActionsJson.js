import { schema } from 'taskcluster-lib-urls';
import ajv from './ajv';

let actionsJsonSchemaResponse;
let validateActionsJson;

export default async () => {
  if (!validateActionsJson) {
    actionsJsonSchemaResponse = await fetch(
      schema(
        process.env.TASKCLUSTER_ROOT_URL,
        'common',
        'action-schema-v1.json'
      )
    );

    validateActionsJson = ajv.compile(await actionsJsonSchemaResponse.json());
  }

  return validateActionsJson;
};
