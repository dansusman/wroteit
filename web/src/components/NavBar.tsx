import { Box, Button, Flex, Text, Link, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { Logo } from "./Logo";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  let body = null;

  if (fetching) {
    // data loading
  } else if (!data?.me) {
    // not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
  } else {
    // user logged in
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={3} colorScheme="orange">
            create post
          </Button>
        </NextLink>
        <VStack align="center">
          <Text>{data?.me?.username}</Text>
          <Button
            onClick={async () => {
              await logout();
              router.reload();
            }}
            isLoading={logoutFetching}
            variant="link"
          >
            logout
          </Button>
        </VStack>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="gray.400" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Logo focusable="true" boxSize="min-content" viewBox="0 0 655 180" />
        </NextLink>
        <Box p={4} ml={"auto"}>
          {body}
        </Box>
      </Flex>
    </Flex>
  );
};
