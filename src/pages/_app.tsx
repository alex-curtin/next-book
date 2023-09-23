import type { AppProps } from "next/app";
import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { NextPage } from "next";
import { Toaster } from "react-hot-toast";

import "~/styles/globals.css";
import { api } from "~/utils/api";
import NavBar from "~/components/navbar";

export type Page<P = {}> = NextPage<P> & {
	getLayout?: (page: ReactNode) => ReactNode;
};

const App = ({ Component, pageProps }: AppProps & { Component: Page }) => {
	const getLayout = Component.getLayout || ((page: ReactNode) => page);
	return (
		<ClerkProvider>
			<NavBar />
			<Toaster position="bottom-center" />
			{getLayout(<Component {...pageProps} />)}
		</ClerkProvider>
	);
};

export default api.withTRPC(App);
