import { List } from "@mantlebee/ts-core";

import { setRelationDateFromValues } from "../utils";

type Post = { createdOn: Date; id: number };
type PostComment = { createdOn: Date; id: number; postId: number };

const incrementYear = (date: Date) => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + 1);
  return newDate;
};

describe("RelationDateFrom", () => {
  describe("utils", () => {
    describe("setRelationDateFromValues", () => {
      it("Set the correct Date, starting from a value picked by the target row.", () => {
        const invalidDate = new Date();
        const comments: List<PostComment> = [];
        const posts: List<Post> = [];
        [2020, 2021, 2022, 2023, 2024].forEach((year, index) => {
          comments.push({ createdOn: invalidDate, id: index, postId: index });
          posts.push({ createdOn: new Date(year, 0, 1), id: index });
        });
        setRelationDateFromValues<PostComment, Post>(
          "createdOn",
          "createdOn",
          (c, p) => c.postId === p.id,
          comments,
          posts,
          (c, p) => ({ to: incrementYear(p.createdOn) })
        );
        comments.forEach((comment, index) => {
          const post = posts[index];
          expect(comment.createdOn).not.toBe(invalidDate);
          expect(comment.createdOn.getTime()).toBeGreaterThanOrEqual(
            post.createdOn.getTime()
          );
          expect(comment.createdOn.getTime()).toBeLessThanOrEqual(
            incrementYear(post.createdOn).getTime()
          );
        });
      });
    });
  });
});
