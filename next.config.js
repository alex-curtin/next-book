/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["books.google.com", "images.unsplash.com"],
	},
};

module.exports = nextConfig;
