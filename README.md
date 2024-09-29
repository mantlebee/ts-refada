`@mantlebee/ts-refada`

> Typescript implementation of REFADA concepts. Right now, the Typescript implementation is the only one existing, but REFADA concepts can be moved to other languages, like `python`.

# REFADA - Real Fake Data

REFADA allows to generate fake but consistent data that satisies your requirements.
With REFADA each "end date" comes after the "start date", or the count of "completed tasks" are equal or lower the count of "total tasks".
Most important is the possibility to generate data related between different tables, like lookup/multiselection relations or detail tables which values depend on a master table.

The REFADA project consists of following concepts:

- [Tables and Columns](#tables-and-columns): the simplest use of REFADA, to generate data for a specific table.
- [Database, Relation Columns, and Detail Tables](#database-relation-columns-and-detail-tables): the more advanced way to use REFADA, to generate tables, where data is related between them.

## Concepts

### Tables and Columns

The TABLE is the core of REFADA. The TABLE represents the rows to generate, using COLUMNS to define requirements and restriction for data generation. Each TABLE is identified by a typed key: the TABLE KEY that defines the table name and the type of its rows.

Let's have a look to an example!

#### Table Example

We need to generate 1000 users, where each user is defined by the following fields:

- **id**: unique and incremental number.
- **firstName**
- **lastName**
- **active**: simple boolean value.
- **age**: a number between 20 and 80.
- **email**: in the format `firstName.lastName@*.*`, where domain and extension have no restrictions.

```typescript
import {
  BooleanColumn,
  createTableKey,
  EmailColumn,
  FirstNameColumn,
  IdColumn,
  LastNameColumn,
  NumberColumn,
  Table,
} from "@mantlebee/ts-refada";

/**
 * User model.
 */
type User = {
  active: boolean;
  age: number;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
};

/**
 * The TABLE key that defines its rows type and the TABLE's name.
 * Its purpose will be more clear when we'll talk about Database, Relation Columns, and Detail Tables.
 */
const UsersTableKey = createTableKey<User>("Users");

/**
 * The TABLE itself. Each COLUMN defines a field of the user model and how to generate its random value.
 * Positioning "email" after "firstName" and "lastName" allows us to generate a value that depends on them.
 */
const usersTable = new Table<User>(UsersTableKey, [
  // Generates a simple random boolean.
  new BooleanColumn("active"),
  // Generates a number between 20 and 80.
  new NumberColumn("age", { max: 80, min: 20 }),
  // Generates a random firstname.
  new FirstNameColumn("firstName"),
  // Unique and incremental numeric id.
  new IdColumn("id"),
  // Generate a random lastname
  new LastNameColumn("lastName"),
  // Generate a random email, satisfing the requirement: firstname.lastname@somedomain.ext
  new EmailColumn("email", (a) => ({
    firstNames: [a.firstName],
    lastNames: [a.lastName],
  })),
]);

/**
 * We use the `seed` method to populate the table,
 * and the `getRows` method to access the generated data.
 *
 * Pay ATTENTIOn to:
 * - each time the `seed` method is called, the table rows are rewritten.
 */
const users = usersTable.seed(1000).getRows();
```

In this example we wanted to generate exactly 1000 users, but we could define a range too.

```typescript
const users = usersTable.seed({ max: 500, min: 100 }).getRows();
```

### Database, Relation Columns, and Detail Tables

Here is where the magic comes true! As we said, the REFADA project comes in handy when fake data of different tables are related and consistent.

The DATABASE purpose is to seed the tables, making sure to correctly populate the values ​​related between the different tables. To achieve that:

- TABLES can have RELATION COLUMNS that point to other TABLES. RELATION COLUMNS' values generation is based on target TABLES already generated values.
- DETAIL TABLES are TABLES that depend entirely on another TABLE, in order to define COLUMNS that can behave differently, based on the values of each single MASTER ROW.

But why talk difficult, when we can see an easy example?

#### Database Example

We need to generate a list of orders, submitted by some users.

Here the requirements:

- Each _order_ must have info like the user _address_ and the _payment method_, both chosen by a list of addresses and payment methods, already defined by the _user_.
- Each _order_ must have a list of _ordered products_
- Each _product_ belongs to a _category_. This requirement is provided only as example, even if it's not required by the _orders_-_products_ relation.
- _Addresses_ and _payment methods_ of the _users_ are listed in two separated tables.
- Each _user_ must have a _default order preferences_ with a default address and a default payment method, both optional.
- For more consistency, we want define the percentage of not defined default addresses and default payment methods. We suppose that the default payment method is defined for the 80% of the users, while the default address for the 50% of the user, but if and only if the payment method is defined.

Let's have a look to what we need and how we'll implement the requirements.

We need 8 tables (listed alphabetically):

- **Orders**: list of orders submitted by users.
- **OrderProducts**: detail of Orders, each row represent the product chosen and added to the order.
- **Products**: list of available products to order.
- **ProductCategories**: list of product categories. Not necessary in the order, but added as example of category-items.
- **Users**: list of users.
- **UserAddress**: list of addresses. Each user can have more addresses.
- **UserPaymentMethods**: list of payment methods. Each user can have more payment methods.
- **UsersPreferences**: default user preferences for new orders. Each user has one UserPreferences only and it has to exists.

We separate operations in steps.

1. Defining table types.
2. Creating table keys. _Table keys_ are used to create relations between tables, because allow us to relate column between tables that potentially can be not defined yet.
3. Creating tables.
4. Creating the database, seeding it and accessing to generated data.

```typescript
/**
 * Before start:
 * - types, tables, table keys, and columns are all listed alphabetically for simplicity
 * - table columns that depends on other columns of the same table are listed after their dependencies, for obviously reasons.
 * - tables keys and names can be lowercase, UPPERCASE, PascalCase, etc. We decided to use PascalCase.
 */

import {
  ConstantColumn,
  createTableKey,
  Database,
  DateColumn,
  FirstNameColumn,
  IdColumn,
  LastNameColumn,
  LookupRelationColumn,
  NumberColumn,
  PatternColumn,
  Table,
  DetailTable,
  TitleColumn,
} from "@mantlebee/ts-refada";

//#region 1. Defining table types

/**
 * Order model.
 * Each order belongs to a specific user,
 * and has details like user address and payment method choices.
 */
type Order = {
  id: number;
  orderedOn: Date;
  userAddressId: number;
  userId: number;
  userPaymentMethodId: number;
};

/**
 * Ordered product model.
 */
type OrderProduct = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
};

/**
 * Generic product.
 * Each product belongs to a category.
 */
type Product = {
  categoryId: number;
  id: number;
  name: string;
};

/**
 * Generic product category.
 */
type ProductCategory = {
  id: number;
  name: string;
};

/**
 * User model.
 */
type User = {
  firstName: string;
  id: number;
  lastName: string;
};

/**
 * Address model.
 * For simplicity, we add the zip code property only.
 */
type UserAddress = {
  id: number;
  userId: number;
  zipCode: string;
};

/**
 * Payment method model.
 * For simplicity, the model refers to credit/debit cards only.
 * Furthermore we don't apply any security concept,
 * because this is just an example of dake data generation.
 */
type UserPaymentMethod = {
  cardExpiration: Date;
  cardNumber: string;
  cardSecurityCode: string;
  id: number;
  label: string;
  userId: number;
};

/**
 * Default user order preferences,
 * like default address and payment method, if defined.
 */
type UserPreferences = {
  addressId?: number;
  paymentMethodId?: number;
  userId: number;
};

//#endregion

//#region 2. Creating table keys
const OrderProductsTableKey = createTableKey<OrderProduct>("OrderProducts");
const OrdersTableKey = createTableKey<Order>("Orders");
const ProductCategoriesTableKey =
  createTableKey<ProductCategory>("ProductCategories");
const ProductsTableKey = createTableKey<Product>("Products");
const UserAddressesTableKey = createTableKey<UserAddress>("UserAddress");
const UserPaymentMethodsTableKey =
  createTableKey<UserPaymentMethod>("UserPaymentMethods");
const UsersPreferencesTableKey =
  createTableKey<UserPreferences>("UsersPreferences");
const UsersTableKey = createTableKey<User>("Users");
//#endregion

//#region 3. Creating tables
/**
 * The order products table is a perfect example of detail table.
 *
 * A detail table is a table that depends on a master table
 * and in which columns' options for data generation (max, min, nullable, etc.)
 * could change, depending of each master table row.
 *
 * Furthermore a detail table comes in handy when we need to generate
 * a fixed or minimum number of detail rows for each master row.
 *
 * Imagine an order without ordered products, that will be nosense!
 *
 * Using a classic table with a `LookupRelationColumn` doesn't assure us
 * that each order would have at least one ordered product.
 */
const orderProductsTable = new DetailTable<OrderProduct, Order>(
  OrderProductsTableKey,
  OrdersTableKey,
  (order) => [
    new IdColumn("id"),
    new ConstantColumn("orderId", order.id),
    new LookupRelationColumn("productId", 0, ProductsTableKey, "id"),
    new NumberColumn("quantity", { max: 100 }),
  ]
);

/**
 * Fields `userAddressId` and `userPaymentMethodId` can't be picked randomly,
 * from their own tables, because picked items could belongs to users
 * that don't match the user of the order.
 * We use the {@link filter} options of the {@link LookupRelationColumn},
 * to garantuee us to pick an address and a payment method
 * that belongs to the user of the order.
 * ATTENTION:
 */
const ordersTable = new Table<Order>(OrdersTableKey, [
  new IdColumn("id"),
  new DateColumn("orderedOn"),
  new LookupRelationColumn("userId", 0, UsersTableKey, "id"),
  new LookupRelationColumn(
    "userAddressId",
    0,
    UserAddressesTableKey,
    "id",
    (a) => ({ filter: (address) => address.userId === a.userId })
  ),
  new LookupRelationColumn(
    "userPaymentMethodId",
    0,
    UserPaymentMethodsTableKey,
    "id",
    (a) => ({ filter: (paymentMethod) => paymentMethod.userId === a.userId })
  ),
]);

const productCategoriesTable = new Table<ProductCategory>(
  ProductCategoriesTableKey,
  [
    new IdColumn("id"),
    new TitleColumn("name", { maxLength: { max: 20, min: 5 } }),
  ]
);

/**
 * Unlike orders and ordered products,
 * there are no restrictions when we talk about products and their categories.
 * Given that categories could exists without related products,
 * the products table is a classic table: we don't need a detail table here.
 */
const productsTable = new Table<Product>(ProductsTableKey, [
  new LookupRelationColumn("categoryId", 0, ProductCategoriesTableKey, "id"),
  new IdColumn("id"),
  new TitleColumn("name", { maxLength: { max: 20, min: 5 } }),
]);

/**
 * The user addresses table is a detail table,
 * because we want at least one address for each user.
 */
const userAddressesTable = new DetailTable<UserAddress, User>(
  UserAddressesTableKey,
  UsersTableKey,
  (user) => [
    new IdColumn("id"),
    new ConstantColumn("userId", user.id),
    new PatternColumn("zipCode", "00000"),
  ]
);

/**
 * The user payment methods table is a detail table,
 * because we want at least one payment method for each user.
 */
const userPaymentMethodsTable = new DetailTable<UserPaymentMethod, User>(
  UserPaymentMethodsTableKey,
  UsersTableKey,
  (user) => [
    new PatternColumn("cardExpiration", "0[0,1]0/0[2,4]0"),
    new PatternColumn("cardNumber", "0000-0000-0000-0000"),
    new PatternColumn("cardSecurityCode", "000"),
    new IdColumn("id"),
    new TitleColumn("label", { maxLength: { max: 20, min: 5 } }),
    new ConstantColumn("userId", user.id),
  ]
);

/**
 * The users preferences table is a detail table,
 * because we want at least one user preference for each user.
 */
const usersPreferencesTable = new DetailTable<UserPreferences, User>(
  UsersPreferencesTableKey,
  UsersTableKey,
  (user) => [
    /**
     * One of the requirements is to have about 80% of the users
     * with a default payment method defined.
     * To achieve that, we set the `nullable` column option to `20`:
     * this means there is an 20% of probability that the column value will be `null`.
     */
    new LookupRelationColumn(
      "paymentMethodId",
      0,
      UserPaymentMethodsTableKey,
      "id",
      { nullable: 20 }
    ),
    /**
     * One of the requirements is to have about 50% of users
     * with a default address method defined
     * but only if the default payment method is defined too.
     * To achieve that, the `nullable` column option must depends on the value of `paymentMethodId`:
     * if `paymentMethodId` is `null`, `addressId` must be `null` (100% of probability),
     * else there is the 50% of probability that the column value will be `null`.
     * Setting `nullable` to `true` is the same of setting it to `50` (50%).
     */
    new LookupRelationColumn(
      "addressId",
      0,
      UserAddressesTableKey,
      "id",
      (a) => ({ nullable: a.paymentMethodId === null ? 100 : true })
    ),
    new ConstantColumn("userId", user.id),
  ]
);

const usersTable = new Table<User>(UsersTableKey, [
  new FirstNameColumn("firstName"),
  new IdColumn("id"),
  new LastNameColumn("lastName"),
]);
//#endregion

//#region 4. Creating the database, seeding it and accessing to generated data
const database = new Database([
  orderProductsTable,
  ordersTable,
  productCategoriesTable,
  productsTable,
  userAddressesTable,
  userPaymentMethodsTable,
  usersPreferencesTable,
  usersTable,
]);

/**
 * Seeding a database is different from seeding a single table.
 *
 * Despite each table can be seeded by itself,
 * in order to populate relation values the seeding process must be demanded to the database.
 *
 * If we seed tables, using the `seed` method of the table,
 * relation columns will set the default value for every generated row.
 * Using the database's `seed` method instead, even relation columns and detail tables will be populated correctly.
 *
 * The database returns a dataset, that is, a map where the key is the table key,
 * and the value the generated rows.
 *
 * Pay ATTENTION to:
 * - each time the `seed` method is called, all table rows are rewritten.
 * - the amount of rows to generate for each table has two different meanings:
 *    - when applied to a classic table, as we saw in the example before, it means the number (or range) of rows to generate.
 *    - when applied to a detail table instead, it means the number (or range) of detail rows to generate FOR EACH master table row.
 */
const dataset = database
  .seed({
    [OrderProductsTableKey]: { max: 20, min: 1 }, // [DETAIL] each order must have between 1 and 20 ordered products
    [OrdersTableKey]: { max: 10, min: 70 }, // between 700 and 1000 orders
    [ProductCategoriesTableKey]: 5, // exactly 50 product categories
    [ProductsTableKey]: 30, // exactly 300 products
    [UserAddressesTableKey]: { max: 5, min: 1 }, // [DETAIL] each user must have between 1 and 5 defined addresses
    [UserPaymentMethodsTableKey]: { max: 3, min: 1 }, // [DETAIL] each user must have between 1 and 3 defined payment methods
    [UsersPreferencesTableKey]: 1, // [DETAIL] each user must have 1 preferences row
    [UsersTableKey]: 20, // exaclty 200 users
  })
  .getDataset();
//#endregion
```
