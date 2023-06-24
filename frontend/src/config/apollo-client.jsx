import {
  ApolloClient,
  ApolloLink,
  from,
  InMemoryCache,
  split,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context/index.js";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import PATH from "../utils/route-path.jsx";

const baseUrl = "/api/graphql";

const contextLink = setContext(async (_, { headers }) => {
  const accessToken =
    JSON.parse(localStorage.getItem("userBlog"))?.token?.accessToken ?? null;
  return {
    headers: {
      ...headers,
      "Apollo-Require-Preflight": true,
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    },
  };
});

const errorNotAuthenticatedLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((data) => {
    if (data?.errors)
      if (data.errors[0]?.extensions?.code === "NOT-AUTHENTICATED") {
        console.log(data.errors[0]?.extensions?.code);
        console.log(data.errors[0]?.message);
        localStorage.removeItem("userBlog");
        window.location.replace(PATH.SIGN_IN);
      }
    return data;
  });
});

const terminateLink = createUploadLink({
  uri: baseUrl,
});

const wsLink = new GraphQLWsLink(
  createClient({
    // url: `ws://${String(import.meta.env.VITE_BLOG_URL_HOST).split("//")[1]}`,
    url: `ws://${window.location.host}${baseUrl}`,
  })
);

console.log(baseUrl);
console.log(`ws://${window.location.host}${baseUrl}`);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  terminateLink
);

const compositeLinks = from([errorNotAuthenticatedLink, splitLink]);

const apolloClient = new ApolloClient({
  ssrMode: false,
  link: contextLink.concat(compositeLinks),
  cache: new InMemoryCache(),
});

export default apolloClient;
