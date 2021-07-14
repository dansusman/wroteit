import DataLoader from "dataloader";
import { Upvote } from "../entities/Upvote";

export const createUpvoteLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Upvote | null>(
    async (keys) => {
      const upvotes = await Upvote.findByIds(keys as any);
      const upvoteIdsToUpvotes: Record<string, Upvote> = {};
      upvotes.forEach((u) => {
        upvoteIdsToUpvotes[`${u.userId}${u.postId}`] = u;
      });
      return keys.map(
        (key) => upvoteIdsToUpvotes[`${key.userId}${key.postId}`]
      );
    }
  );
