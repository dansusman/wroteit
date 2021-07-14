import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpvoteSectionProps {
  post: PostSnippetFragment;
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "upvote-load" | "downvote-load" | "no-load"
  >("no-load");

  const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        colorScheme={post.voteStatus === 1 ? "green" : "reddit"}
        variant={post.voteStatus === 1 ? "solid" : "ghost"}
        aria-label="Upvote Post"
        icon={<ChevronUpIcon />}
        isRound
        isDisabled={post.voteStatus === 1}
        onClick={() => {
          setLoadingState("upvote-load");
          vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState("no-load");
        }}
        isLoading={loadingState === "upvote-load"}
      />
      {post.points}
      <IconButton
        colorScheme={post.voteStatus === -1 ? "red" : "reddit"}
        variant={post.voteStatus === -1 ? "solid" : "ghost"}
        aria-label="Downvote Post"
        icon={<ChevronDownIcon />}
        isDisabled={post.voteStatus === -1}
        isRound
        onClick={() => {
          setLoadingState("downvote-load");
          vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState("no-load");
        }}
        isLoading={loadingState === "downvote-load"}
      />
    </Flex>
  );
};
