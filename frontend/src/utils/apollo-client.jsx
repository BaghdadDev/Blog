import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  from,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// const contextLink = setContext(async (_, { headers }) => {
//   const session = await getSession();
//   return {
//     headers: {
//       ...headers,
//       Authorization: session?.accessToken
//         ? `Bearer ${session.accessToken}`
//         : "",
//     },
//   };
// });

const errorNotAuthenticatedLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((data) => {
    if (data?.errors)
      if (data.errors[0]?.extensions?.code === "NotAuthenticated") {
        console.log(data.errors[0]?.extensions?.code);
        console.log(data.errors[0]?.message);
      }
    return data;
  });
});

const httpLink = createHttpLink({
  uri: process.env.URL_HOST,
});

const compositeLinks = from([errorNotAuthenticatedLink, httpLink]);

const apolloClient = new ApolloClient({
  ssrMode: false,
  // link: contextLink.concat(compositeLinks),
  link: compositeLinks,
  cache: new InMemoryCache(),
});

export default apolloClient;
