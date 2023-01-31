const { GraphQLUpload } = require("graphql-upload");
const { createWriteStream } = require("fs");

const resolveFunction = {
  Upload: GraphQLUpload,
  Query: {
    uploads: (parent, args, context) => {
      return context.uploads;
    },
  },
  Mutation: {
    singleUpload: async (parent, args, context) => {
      const { file } = args;
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();
      const path = `files/${filename}`;
      const myFile = { filename, mimetype, encoding };
      context.uploads.push(myFile);
      stream.pipe(createWriteStream(path));
      return file;
    },
  },
};

module.exports = resolveFunction;
