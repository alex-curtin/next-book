import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<ClerkProvider>
			<Component {...pageProps} />
		</ClerkProvider>
	);
};

export default api.withTRPC(App);
