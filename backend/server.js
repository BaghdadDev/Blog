const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const httpServer = require("http").createServer(app);
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { ApolloServer } = require("@apollo/server");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { applyMiddleware } = require("graphql-middleware");

const connectToDatabase = require("./config/database.js");
const whiteList = require("./config/whiteList.js");
const { typeDefs, resolvers } = require("./graphQL");

// Import Middleware for JWT authentication
const authenticationMiddleware = require("./middleware/authentication.js");

// Set the port number
const port = process.env.PORT || process.env.EXPRESS_PORT;

async function mountServer() {
  // Setting up the connexion with database
  await connectToDatabase();

  // Body-Parser and Cors Policies
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(
    cors({
      origin: whiteList,
      // credentials: true,
      // methods: ["GET", "PUT", "POST", "OPTIONS", "PATCH", "DELETE"],
      // allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    })
  );

  // Mount TypeDefs, Resolvers and Middleware
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const schemaWithMiddleware = applyMiddleware(
    schema,
    authenticationMiddleware
  );

  // Set up Apollo Server
  const server = new ApolloServer({
    schema: schemaWithMiddleware,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    includeStacktraceInErrorResponses: process.env.NODE_ENV !== "production",
    introspection: process.env.NODE_ENV !== "production",
    // formatError: (formatError) => {
    // if (formattedError.extensions.code === "GRAPHQL_VALIDATION_FAILED")
    //   return {
    //     ...formattedError,
    //     message: "Your query doesn't match the schema. Try double-checking it !"
    //   }
    //   return {
    //     code: formatError.extensions.code,
    //     message: formatError.message
    //   };
    // }
  });

  // Lunch the Apollo Server
  await server.start();

  // Put the api endpoint
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: ({ req }) => ({ headers: req.headers }),
    })
  );

  // Lunch Server
  try {
    await new Promise((resolve) => httpServer.listen(port, resolve));
  } catch (error) {
    console.log("Something went wrong during lunching the server.", error);
  }
  console.log(`=> Server is ready at port: ${port}`);
}

mountServer().then(() => console.log("Everything seems to be working ^_^"));
