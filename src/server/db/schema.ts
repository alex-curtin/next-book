import { InferModel, relations } from "drizzle-orm";
import {
	varchar,
	integer,
	pgTable,
	timestamp,
	serial,
	primaryKey,
} from "drizzle-orm/pg-core";

export const books = pgTable("books", {
	id: serial("id").primaryKey().notNull(),
	title: varchar("title").notNull(),
	subtitle: varchar("subtitle"),
	imageUrl: varchar("image_url"),
	googleId: varchar("google_id").notNull(),
	description: varchar("description"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const authors = pgTable("authors", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name").notNull(),
});

export const bookAuthors = pgTable(
	"book_authors",
	{
		bookId: integer("book_id")
			.notNull()
			.references(() => books.id),
		authorId: integer("author_id")
			.notNull()
			.references(() => authors.id),
	},
	(t) => ({
		pk: primaryKey(t.bookId, t.authorId),
	}),
);

export const categories = pgTable("categories", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name").notNull(),
});

export const bookCategories = pgTable(
	"book_categories",
	{
		bookId: integer("book_id")
			.notNull()
			.references(() => books.id),
		categoryId: integer("category_id")
			.notNull()
			.references(() => categories.id),
	},
	(t) => ({
		pk: primaryKey(t.bookId, t.categoryId),
	}),
);

export const posts = pgTable("posts", {
	id: serial("id").primaryKey().notNull(),
	bookId: integer("book_id")
		.notNull()
		.references(() => books.id),
	posterId: varchar("poster_id").notNull(),
	content: varchar("content").notNull(),
	rating: integer("rating").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const comments = pgTable("comments", {
	id: serial("id").primaryKey().notNull(),
	postId: integer("post_id")
		.notNull()
		.references(() => posts.id),
	commentorId: varchar("commentor_id").notNull(),
	content: varchar("content").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const follows = pgTable(
	"follows",
	{
		followerId: varchar("follower_id").notNull(),
		followedId: varchar("followed_id").notNull(),
	},
	(t) => ({ pk: primaryKey(t.followedId, t.followerId) }),
);

export const bookRelations = relations(books, ({ many }) => ({
	bookAuthors: many(bookAuthors),
	posts: many(posts),
	bookCategories: many(bookCategories),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
	bookCategories: many(bookCategories),
}));

export const authorRelations = relations(authors, ({ many }) => ({
	bookAuthors: many(bookAuthors),
}));

export const bookAuthorsRelations = relations(bookAuthors, ({ one }) => ({
	book: one(books, {
		fields: [bookAuthors.bookId],
		references: [books.id],
	}),
	author: one(authors, {
		fields: [bookAuthors.authorId],
		references: [authors.id],
	}),
}));

export const bookCategoriesRelations = relations(bookCategories, ({ one }) => ({
	book: one(books, {
		fields: [bookCategories.bookId],
		references: [books.id],
	}),
	category: one(categories, {
		fields: [bookCategories.categoryId],
		references: [categories.id],
	}),
}));

export const postRelations = relations(posts, ({ many, one }) => ({
	comments: many(comments),
	book: one(books, {
		fields: [posts.bookId],
		references: [books.id],
	}),
}));

export const commentRelations = relations(comments, ({ one }) => ({
	post: one(posts, {
		fields: [comments.postId],
		references: [posts.id],
	}),
}));

export type Category = InferModel<typeof categories>;
export type Book = InferModel<typeof books>;
export type Post = InferModel<typeof posts>;
export type Author = InferModel<typeof authors>;
export type BookAuthor = InferModel<typeof bookAuthors>;
export type BookWithAuthors = Book & {
	bookAuthors: BookAuthor & { author: Author }[];
};
export type PostWithBooksAndAuthors = Post & {
	book: BookWithAuthors;
};
