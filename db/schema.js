import { uuid, pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: text().notNull(),
    salt: text().notNull(),
});

export const userSessions = pgTable('userSessions', {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid().references(() => users.id).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
})