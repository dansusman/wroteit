import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useDeletePostMutation } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
}) => {
  const [, deletePost] = useDeletePostMutation();
  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          colorScheme="blue"
          variant="ghost"
          aria-label="Edit Post"
          icon={<EditIcon />}
          isRound
          onClick={() => {}}
        />
      </NextLink>
      <IconButton
        colorScheme="red"
        variant="ghost"
        aria-label="Delete Post"
        icon={<DeleteIcon />}
        isRound
        onClick={() => {
          deletePost({ id });
        }}
      />
    </Box>
  );
};
