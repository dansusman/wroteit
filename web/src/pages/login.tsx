import {
  Box,
  Button,
  Flex,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

interface registerProps {}

const Login: React.FC<registerProps> = ({}) => {
  const color = useColorModeValue("tomato", "orange");
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            // login succeeded, reroute to home page
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              autoFocus
              name="usernameOrEmail"
              placeholder="username or email address"
              label="Username or Email Address"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Flex mt={2}>
              <NextLink href="/forgot-password">
                <Link ml="auto">forgot password?</Link>
              </NextLink>
            </Flex>
            <Button
              mt={2}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="orange"
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
      <Text mt={3}>
        New to wroteit?
        <NextLink href="/register">
          <Link ml={1} fontWeight="bold" color={color}>
            Sign up
          </Link>
        </NextLink>
      </Text>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
