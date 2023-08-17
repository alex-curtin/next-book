import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";
import NavBar from "~/components/navbar";

const App = ({ Component, pageProps }: AppProps) => {
	const getLayout = Component.getLayout || ((page) => page);
	return (
		<ClerkProvider>
			<NavBar />
			{getLayout(<Component {...pageProps} />)}
		</ClerkProvider>
	);
};

export default api.withTRPC(App);
