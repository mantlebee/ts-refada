import { List } from "@mantlebee/ts-core";

import { setRelationMultiselectionValues } from "../utils";

describe("RelationMultiselection", () => {
  describe("utils", () => {
    describe("setRelationMultiselectionValues", () => {
      type Post = { id: number; blogId: number; tags: List<number> };
      type Tag = { id: number; blogId: number };
      const posts: List<Post> = [
        { id: 1, blogId: 1, tags: [] },
        { id: 2, blogId: 1, tags: [] },
        { id: 3, blogId: 2, tags: [] },
        { id: 4, blogId: 2, tags: [] },
      ];
      const tags: List<Tag> = [
        { id: 1, blogId: 1 },
        { id: 2, blogId: 1 },
        { id: 3, blogId: 2 },
        { id: 4, blogId: 2 },
      ];
      it("Correct count", () => {
        setRelationMultiselectionValues<Post, Tag>("tags", "id", posts, tags);
        posts.forEach((a) => {
          expect(a.tags.length).toBeLessThanOrEqual(tags.length);
        });
      });
      it("Some values are null, if column is nullable", () => {
        setRelationMultiselectionValues<Post, Tag>("tags", "id", posts, tags, {
          nullable: true,
        });
        expect(posts.some((a) => a.tags === null)).toBeTruthy();
      });
      it("Uses only filtered target rows, for setting source rows' values", () => {
        setRelationMultiselectionValues<Post, Tag>("tags", "id", posts, tags, {
          filter: (post, tag) => tag.blogId === post.blogId,
        });
        posts.forEach((post) => {
          const postTags = tags.filter((a) => post.tags.includes(a.id));
          expect(postTags.every((a) => a.blogId === post.blogId)).toBeTruthy();
        });
      });
    });
  });
});
