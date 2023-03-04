import { ApolloClient, ApolloLink, from, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context/index.js";

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
    // if (data?.errors)
    //   if (data.errors[0]?.extensions?.code === "NotAuthenticated") {
    //     console.log(data.errors[0]?.extensions?.code);
    //     console.log(data.errors[0]?.message);
    //   }
    return data;
  });
});

const terminateLink = createUploadLink({
  uri: import.meta.env.VITE_URL_HOST,
});

const compositeLinks = from([errorNotAuthenticatedLink, terminateLink]);

const apolloClient = new ApolloClient({
  ssrMode: false,
  link: contextLink.concat(compositeLinks),
  cache: new InMemoryCache(),
});

export default apolloClient;
