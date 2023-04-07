import mockedUser from "./mockedUser.jsx";

export const mockedComments = [
  {
    __typename: "Comment",
    _id: "6408dc8f0c6094c44703a85f",
    comment: "This is amazing",
    user: mockedUser,
    post: { __typename: "Post", _id: "6421c6a966b1bb36d7d3879c" },
    likes: [{ __typename: "User", _id: "6404efbef08e39e56aa7c4af" }],
  },
  {
    __typename: "Comment",
    _id: "6408dc8f0c6094c4470a358b",
    comment: "New Comment",
    user: mockedUser,
    post: { __typename: "Post", _id: "6421c6a966b1bb36d7d3879c" },
    likes: [],
  },
];
