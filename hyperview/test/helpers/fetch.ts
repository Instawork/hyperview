export const fetchFactory = (
  endpoints: Array<[string, string] | [string, string, number]>,
) => {
  const mock = jest.fn();
  mock.mockImplementation(async url => {
    const endpoint = endpoints.find(e => url.includes(e[0]));
    if (endpoint) {
      return new Response(endpoint[1], { status: endpoint[2] ?? 200 });
    }
    return new Response('Not found', { status: 404 });
  });
  return mock;
};
