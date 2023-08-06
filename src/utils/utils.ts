/**
 * Retrieves the value of a specified query parameter from the current URL
 * @param param - the name of the query parameter to retrieve
 * @returns the value of the specified query parameter, or null if it does not exist
 */
export function getUrlParam(param: string) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  return urlParams.get(param);
}
