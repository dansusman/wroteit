import { MoonIcon, SettingsIcon, SunIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface SettingsPopoverProps {}

export const SettingsPopover: React.FC<SettingsPopoverProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data }] = useMeQuery({
    pause: isServer(),
  });
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Popover variant="responsive">
      <PopoverTrigger>
        <IconButton
          aria-label="Toggle Settings Dialog"
          icon={<SettingsIcon />}
        ></IconButton>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader
            flex={"true"}
            mr={5}
            fontWeight="bold"
            border="0"
            cursor="default"
          >
            Logged in as: {data?.me?.username}
          </PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Flex p={2}>
              <Tooltip
                hasArrow
                closeOnClick={true}
                label="Toggle Dark/Light Mode"
                openDelay={300}
              >
                <IconButton
                  icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                  aria-label={`Switch to {} mode`}
                  mr={3}
                  onClick={toggleColorMode}
                />
              </Tooltip>
              <Button
                colorScheme="orange"
                onClick={async () => {
                  await logout();
                  router.reload();
                }}
                isLoading={logoutFetching}
              >
                logout
              </Button>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
