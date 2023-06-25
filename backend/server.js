const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const httpServer = require("http").createServer(app);
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { ApolloServer } = require("@apollo/server");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { applyMiddleware } = require("graphql-middleware");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const connectToDatabase = require("./config/database.js");
const whiteList = require("./config/whiteList.js");
const { typeDefs, resolvers } = require("./graphQL");

// Import Middleware for JWT authentication
const authenticationMiddleware = require("./middleware/authentication.js");

// Set the port number
const port = process.env.BLOG_PORT_EXPRESS || 4001;

async function mountServer() {
  // Setting up the connection with database
  await connectToDatabase();

  // Import graphqlUploadExpressMiddleware
  const { default: graphqlUploadExpress } = await import(
    "graphql-upload/graphqlUploadExpress.mjs"
  );

  // Body-Parser and Cors Policies
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: whiteList,
      credentials: true,
      methods: ["GET", "PUT", "POST", "OPTIONS", "PATCH", "DELETE"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Apollo-Require-Preflight",
      ],
    })
  );

  // Mount TypeDefs, Resolvers and Middleware
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const schemaWithMiddleware = applyMiddleware(
    schema,
    authenticationMiddleware
  );

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: "/api/graphql",
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  // Set up Apollo Server
  const server = new ApolloServer({
    schema: schemaWithMiddleware,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
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

  // Apply graphqlUploadExpressMiddleware
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  // Put the api endpoint
  app.get("/api", async (req, res) => res.send("Blog's API").status(200));
  app.use(
    "/api/graphql",
    expressMiddleware(server, {
      context: ({ req }) => ({ headers: req.headers }),
    })
  );

  // Serve frontend if PRODUCTION Node Environment
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) =>
      res.sendFile(
        path.resolve(__dirname, "../", "frontend", "dist", "index.html")
      )
    );
  } else {
    app.get("/", async (req, res) => res.send("Please set to production"));
  }

  console.log(process.env.NODE_ENV);
  console.log(process.env.BLOG_MONGODB_URI_ATLAS);
  console.log(process.env.BLOG_ACCESS_TOKEN_SECRET);
  console.log(process.env.BLOG_PORT_EXPRESS);

  // Lunch Server
  try {
    await new Promise((resolve) => httpServer.listen(port, resolve));
  } catch (error) {
    console.log("Something went wrong during lunching the server.", error);
  }
  console.log(`=> Server is ready at port: ${port}`);
}

mountServer().then(() => console.log("Everything seems to be working ^_^"));
