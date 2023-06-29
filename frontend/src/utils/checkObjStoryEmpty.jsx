export default function checkObjStoryEmpty(objStory) {
  return !(
    objStory.length === 1 &&
    Object.entries(objStory[0]).length === 2 &&
    objStory[0].type === "paragraph" &&
    objStory[0].children[0].text === ""
  );
}
