import mockedPicture from "./mockedPicture.jsx";
import mockedUser from "../mockedUser.jsx";

export const mockedPosts = [
  {
    __typename: "Post",
    _id: "6421c6a966b1bb36d7d3879c",
    title: "Brothers",
    story:
      '[{"type":"paragraph","children":[{"text":"Me and my brother Hamza"}]}]',
    picture: mockedPicture,
    user: mockedUser,
    likes: [
      { _id: "6404efbef08e39e56aa7c4af" },
      { _id: "6401e882f8231e3015e93054" },
    ],
    comments: [{ _id: "6421c6c666b1bb36d7d387b1" }],
  },
  {
    __typename: "Post",
    _id: "6421c6a966b1bb36d7d38999",
    title: "Enemies",
    story:
      '[{"type":"paragraph","children":[{"text":"My enemies are my motivation"}]}]',
    picture: mockedPicture,
    user: mockedUser,
    likes: [
      { _id: "6404efbef08e39e56aa7c4af" },
      { _id: "6401e882f8231e3015e93054" },
    ],
    comments: [{ _id: "6421c6c666b1bb36d7d387b1" }],
  },
];
