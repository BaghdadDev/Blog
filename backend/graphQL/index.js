const path = require("path");
const {buildSchema, print} = require("graphql");

// *** Use GraphQL Tools to import and merge all types and resolvers
const {mergeTypeDefs, mergeResolvers} = require("@graphql-tools/merge");
const {loadFilesSync} = require("@graphql-tools/load-files");

//*** Import all resolvers
const resolvers = loadFilesSync(path.join(__dirname, "./**/*.resolver.*"));

//*** Import all types
const types = loadFilesSync(path.join(__dirname, "./**/*.type.*"), {
  extensions: ["graphql"],
});

//*** Export schema (types) and resolvers
module.exports = {
  typeDefs: buildSchema(print(mergeTypeDefs(types))),
  resolvers: mergeResolvers(resolvers),
};
