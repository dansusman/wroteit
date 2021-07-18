import {
  Box,
  Button,
  Flex,
  Link,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { Logo } from "./Logo";
import { SettingsPopover } from "./SettingsPopover";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  const bg = useColorModeValue("lightblue", "gray.500");

  let body = null;

  if (fetching) {
    // data loading
  } else if (!data?.me) {
    // not logged in
    body = (
      <>
        <NextLink href="/login">
          <Button mr={3} colorScheme="orange">
            login
          </Button>
        </NextLink>
        <NextLink href="/register">
          <Button colorScheme="orange">register</Button>
        </NextLink>
      </>
    );
  } else {
    // user logged in
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button mr={3} colorScheme="orange">
            create post
          </Button>
        </NextLink>
        <SettingsPopover></SettingsPopover>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg={bg} p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Logo
            cursor="pointer"
            _hover={{
              outlineColor: "orange",
              transform: "scale(1.05)",
            }}
            focusable="true"
            boxSize="fit-content"
            viewBox="0 0 480 183"
          />
        </NextLink>
        <Box p={4} ml={"auto"}>
          {body}
        </Box>
      </Flex>
    </Flex>
  );
};
