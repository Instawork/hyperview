import urlParse from 'url-parse';

const QUERY_SEPARATOR = '?';
const QUERY_PARAM_SEPARATOR = '&';

// Regex for UUID path segments. Example: /550e8400-e29b-41d4-a716-446655440000
const UUID_PATH_SEGMENT_RE = /\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(?=\/|$)/g;
// Regex for integer path segments. Example: /123
const INT_PATH_SEGMENT_RE = /\/\d+(?=\/|$)/g;
// Regex for "token-ish" segments. Example: /oBDew8n / 5YzXjvB
const TOKEN_PATH_SEGMENT_RE = /\/(?=[A-Za-z0-9_-]{6,}(?=\/|$))(?=[^/]*\d)[A-Za-z0-9_-]+(?=\/|$)/g;

/**
 * Turns the href into a fetchable URL.
 * If the href is fully qualified, return it.
 * Otherwise, pull the protocol/domain/port from base URL and append the href.
 */
export const getUrlFromHref = (href: string, baseUrl: string): string => {
  const rootUrl = urlParse(href, baseUrl, false);
  return rootUrl.toString();
};

/**
 * Add dictionary of parameters to an url
 */
export const addParamsToUrl = (
  url: string,
  params: Array<{
    name: string;
    value: string;
  }>,
): string => {
  const [baseUrl, existingParams] = url.split(QUERY_SEPARATOR);
  const query = (existingParams
    ? existingParams.split(QUERY_PARAM_SEPARATOR)
    : []
  ).concat(
    params.map(
      p => `${encodeURIComponent(p.name)}=${encodeURIComponent(p.value)}`,
    ),
  );
  return `${baseUrl}${QUERY_SEPARATOR}${query.join(QUERY_PARAM_SEPARATOR)}`;
};

/**
 * Add FormData as query params to a url. Ignores files in the formdata.
 */

export const addFormDataToUrl = (
  url: string,
  formData?: FormData | null,
): string => {
  if (formData) {
    if ('getParts' in formData && typeof formData.getParts === 'function') {
      const params = formData.getParts();
      type FormDataPart =
        | {
            string: string;
            headers: { [name: string]: string };
            fieldName: string;
          }
        | {
            uri: string;
            headers: { [name: string]: string };
            name?: string | undefined;
            type?: string | undefined;
            fieldName: string;
          };
      return addParamsToUrl(
        url,
        (params as Array<FormDataPart>).map(p => ({
          name: p.fieldName,
          value: 'string' in p ? p.string : '',
        })),
      );
    }
    if ('entries' in formData && typeof formData.entries === 'function') {
      const params = Array.from(formData.entries());
      return addParamsToUrl(
        url,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params.map((p: any) => ({
          name: p[0],
          value: String(p[1]),
        })),
      );
    }
  }
  return url;
};

/**
 * Sanitize the path portion of a URL to remove unique identifiers for error messages.
 *
 * Replaces dynamic-looking segments with placeholders while preserving route structure.
 *
 * Examples:
 * - `https://app.instawork.com/worker_app/shift-transfer/oBDew8n/confirm/9188184`
 *    -> `https://app.instawork.com/worker_app/shift-transfer/:token/confirm/:id`
 */
export const sanitizeUrl = (url: string): string => {
  const parsed = urlParse(url, undefined, false);
  const origin =
    parsed.protocol && parsed.host ? `${parsed.protocol}//${parsed.host}` : '';
  const path = parsed.pathname || '';

  const sanitizedPath = path
    .replaceAll(UUID_PATH_SEGMENT_RE, '/:uuid')
    .replaceAll(INT_PATH_SEGMENT_RE, '/:id')
    .replaceAll(TOKEN_PATH_SEGMENT_RE, '/:token');

  return `${origin}${sanitizedPath}`;
};
