import { isNil } from 'ramda';
import getIconFromMime from './getIconFromMime';
import urls from './urls';

export default ({ name, contentType, namespace, runId, taskId }) => {
  if (/^public\//.test(name)) {
    const icon = getIconFromMime(contentType);

    // If we have a namespace, use a URL with that namespace to make it
    // easier for users to copy/paste index URLs
    if (namespace) {
      return {
        icon,
        name,
        url: urls.api('index', 'v1', `task/${namespace}/artifacts/${name}`),
      };
    }

    // We could use queue.buildUrl, but this creates URLs where the artifact
    // name has slashes encoded. For artifacts we specifically allow slashes
    // in the name unencoded, as this make things like `wget ${URL}` create
    // files with nice names.

    if (!isNil(runId)) {
      return {
        icon,
        name,
        url: urls.api(
          'queue',
          'v1',
          `task/${taskId}/runs/${runId}/artifacts/${name}`
        ),
      };
    }

    return {
      icon,
      name,
      url: urls.api('queue', 'v1', `task/${taskId}/artifacts/${name}`),
    };
  }

  // TODO: If we have a userSession we should create a signed URL

  return {
    name,
    url: null,
  };
};
