const { GraphQLError } = require("graphql");
const FileModel = require("../models/FileModel.js");

async function storeFile(file) {
  try {
    const { createReadStream, filename, mimetype } = await file;
    const stream = createReadStream();
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const fileData = Buffer.concat(chunks);
    const storedFile = await FileModel.create({
      filename,
      contentType: mimetype,
      data: fileData.toString("base64"),
    });
    return { ...storedFile._doc };
  } catch (errorStoreFile) {
    console.log("Something went wrong while storing file.", errorStoreFile);
    return new GraphQLError("Something went wrong while storing file", {
      extensions: { code: "ERROR-SERVER" },
    });
  }
}

module.exports = storeFile;
