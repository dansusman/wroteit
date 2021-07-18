import { Box, Button, FormControl, FormHelperText } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState(false);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>Email has been sent!</Box>
          ) : (
            <FormControl>
              <Form>
                <Box mt={4}>
                  <InputField
                    name="email"
                    placeholder="email"
                    label="Email"
                    type="email"
                  />
                </Box>
                <Button
                  disabled
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="orange"
                >
                  forgot password
                </Button>
                <FormHelperText mt={4}>
                  Emailing Service is not currently active. This feature is in
                  development. Please make a new account if you have forgotten
                  your account credentials.
                </FormHelperText>
              </Form>
            </FormControl>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
