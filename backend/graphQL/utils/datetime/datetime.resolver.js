const { GraphQLDateTime, GraphQLDate } = require("graphql-iso-date");

const resolveFunction = {
  DateTime: GraphQLDateTime,
  Date: GraphQLDate,
};

module.exports = resolveFunction;
