import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import theme from "../theme";

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <Head>
        <title>wroteit - A Simplified, Bootleg Reddit.</title>
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-32x32.png"
        />
      </Head>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
