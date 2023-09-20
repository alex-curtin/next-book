import axios from "axios";

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

type GoogleBooksResult = {
	id: string;
	volumeInfo: {
		authors: string[];
		imageLinks: {
			thumbnail: string;
		};
		title: string;
		subtitle: string | null;
	};
};

export type Book = {
	authors: { name: string; id: number }[];
	imageUrl: string;
	title: string;
	subtitle: string;
	googleId: string;
	description: string;
};

const transformBooks = (books: GoogleBooksResult[]): Book[] => {
	return books.map((book) => {
		const { volumeInfo, id } = book;
		return {
			authors: volumeInfo?.authors || [],
			imgUrl: volumeInfo?.imageLinks?.thumbnail,
			title: volumeInfo?.title,
			subtitle: volumeInfo?.subtitle || null,
			googleId: id,
		};
	});
};

export const searchBooks = async (term: string) => {
	const { data } = await axios.get(
		`${BASE_URL}?q=${term}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
	);

	return transformBooks(data.items);
};

export const getBookById = async (id: string) => {
	const { data } = await axios.get(
		`${BASE_URL}/${id}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
	);

	return transformBooks([data]);
};
