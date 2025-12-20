import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  numeric,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* =========================
   ROLES
========================= */
export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* =========================
   USERS
========================= */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name').notNull(),
  age: varchar('age'),
  email: varchar('email').notNull().unique(),
  phone: varchar('phone').notNull().unique(),
  password: varchar('password').notNull(),
  role_id: uuid('role_id')
    .notNull()
    .references(() => roles.id),
  is_email_verified: boolean('is_email_verified').notNull().default(false),
  is_phone_verified: boolean('is_phone_verified').notNull().default(false),
  status: varchar('status', {
    enum: ['active', 'inactive', 'deleted', 'suspended'],
  }).default('active'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

/* =========================
   CATEGORIES
========================= */
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   PRODUCTS
========================= */
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),

  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0),

  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   CART
========================= */
export const cart = pgTable("cart", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),

  quantity: integer("quantity").notNull().default(1),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   ORDERS
========================= */
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),

  status: varchar("status", {
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
  }).default("pending"),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   ORDER ITEMS
========================= */
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),

  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),

  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
});

/* =========================
   PAYMENTS
========================= */
export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),

  paymentMethod: varchar("payment_method", {
    enum: ["upi", "card", "netbanking", "cod"],
  }),

  transactionId: varchar("transaction_id"),

  status: varchar("status", {
    enum: ["success", "failed", "pending"],
  }),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   ADDRESSES
========================= */
export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  addressLine: varchar("address_line", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  pincode: varchar("pincode", { length: 10 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   REVIEWS
========================= */
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),

  rating: integer("rating").notNull(),
  comment: varchar("comment", { length: 500 }),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   RELATIONS
========================= */
export const userRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.role_id],
    references: [roles.id],
  }),
  orders: many(orders),
  cartItems: many(cart),
  addresses: many(addresses),
  reviews: many(reviews),
}));

export const roleRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  cartItems: many(cart),
  orderItems: many(orderItems),
  reviews: many(reviews),
}));

export const cartRelations = relations(cart, ({ one }) => ({
  user: one(users, {
    fields: [cart.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cart.productId],
    references: [products.id],
  }),
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  payment: one(payments),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const paymentRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const addressRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));
