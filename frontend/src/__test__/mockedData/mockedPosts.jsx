import mockedPicture from "./mockedPicture.jsx";
import mockedUser from "./mockedUser.jsx";
import { mockedComments } from "./mockedComments.jsx";

export default [
  {
    __typename: "Post",
    _id: "6421c6a966b1bb36d7d3879c",
    title: "Brothers",
    story: '[{"type":"paragraph","children":[{"text":"Me and Hamza"}]}]',
    picture: mockedPicture,
    user: mockedUser,
    likes: [],
    comments: [{ __typename: "Comment", _id: mockedComments[0]._id }],
  },
  {
    __typename: "Post",
    _id: "6421c6a966b1bb36d7d38999",
    title: "Enemies",
    story:
      '[{"type":"paragraph","children":[{"text":"They are my motivation"}]}]',
    picture: mockedPicture,
    user: mockedUser,
    likes: [
      { __typename: "User", _id: "6404efbef08e39e56aa7c4af" },
      { __typename: "User", _id: "6401e882f8231e3015e93054" },
    ],
    comments: [{ __typename: "Comment", _id: mockedComments[1]._id }],
  },
];
