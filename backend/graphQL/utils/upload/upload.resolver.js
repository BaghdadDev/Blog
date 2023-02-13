const { GraphQLError } = require("graphql");
const GraphQLUpload = import("graphql-upload/GraphQLUpload.mjs");
const shortId = require("shortid");

const FileModel = require("../../../models/FileModel.js");

const resolveFunction = {
  Upload: GraphQLUpload,
  Query: {
    retrieveFile: async (parent, { idFile }) => {
      console.log("resolver: retrieveFile");
      try {
        const file = await FileModel.findById(idFile);
        if (!file)
          return new GraphQLError("There is no such file with id: " + idFile, {
            extensions: { code: "NOT-FOUND" },
          });
        return {
          _id: file._id,
          filename: file.filename,
          contentType: file.contentType,
          data: file.data.toString("base64"),
        };
      } catch (errorRetrieveSingleFile) {
        console.log(
          "Something went wrong during retrieving file.",
          errorRetrieveSingleFile
        );
        return new GraphQLError(
          "Something went wrong during retrieving file.",
          errorRetrieveSingleFile,
          { extensions: { code: "ERROR-SERVER" } }
        );
      }
    },
  },

  Mutation: {
    singleUpload: async (parent, { file: { file } }) => {
      console.log("Resolver: singleUpload");
      try {
        // const { file } = file;
        console.log(file);
        const { createReadStream, filename, mimetype } = await file;
        const stream = createReadStream();
        const chunks = [];

        for await (const chunk of stream) {
          chunks.push(chunk);
        }

        const fileData = Buffer.concat(chunks);

        const newFile = await FileModel.create({
          filename,
          contentType: mimetype,
          data: fileData,
        });

        // console.log(newFile);

        return {
          _id: newFile._id,
          filename: newFile.filename,
          contentType: newFile.contentType,
          data: newFile.data.toString("base64"),
        };
      } catch (errorUploadSingleFile) {
        console.log(
          "Something went wrong during upload file.",
          errorUploadSingleFile
        );
        return new GraphQLError(
          "Something went wrong during upload file.",
          errorUploadSingleFile,
          { extensions: { code: "ERROR-SERVER" } }
        );
      }
    },
  },
};

module.exports = resolveFunction;
