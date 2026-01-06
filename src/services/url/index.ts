import urlParse from 'url-parse';

const QUERY_SEPARATOR = '?';
const QUERY_PARAM_SEPARATOR = '&';

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
