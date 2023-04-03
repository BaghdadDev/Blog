import mockedUser from "./mockedUser.jsx";

export const mockedComment = [
  {
    __typename: "Comment",
    _id: "6408dc8f0c6094c44703a85f",
    comment: "This is amazing",
    user: mockedUser,
    post: {
      _id: "6404f58866b23d4205abe2c6",
    },
    likes: [
      { _id: "6404efbef08e39e56aa7c4af" },
      { _id: "6401e882f8231e3015e93054" },
    ],
  },
];
