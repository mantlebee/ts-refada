`@mantlebee/ts-refada`

> Typescript implementation of REFADA concepts. Right now, the Typescript implementation is the only one existing, but REFADA concepts can be moved to other languages, like `python`.

# REFADA - REal FAke DAta

REFADA allows to generate fake but consistent data that satisies your requirements.
With REFADA each "end date" comes after the "start date", or the count of "completed tasks" are equal or lower the count of "total tasks".
Most important is the possibility to generate data related between different tables, like lookup/multiselection relations or detail tables which values depend on a master table.

The REFADA project consists of following concepts:

- [Tables and Columns](#tables-and-columns): the simplest use of REFADA, to generate data for a specific table.
- Database, Relation Columns and Detail Tables: the more advanced way to use REFADA, to generate tables, where data is related between them.

## Concepts

### Tables and Columns

The TABLE is the core of REFADA. The TABLE represents the rows to generate, using COLUMNS to define requirements and restriction for data generation. Each TABLE is identified by a typed key: the TABLE KEY that defines the table name and the type of its rows.

Let's have a look to an example!

```typescript
/**
 * We need to generate 1000 users, where each user is defined by the following fields:
 * - id (unique and incremental number)
 * - firstName
 * - lastName
 * - active (simple boolean)
 * - age (number between 20 and 80)
 * - email (in the format firstName.lastName@somedomain.extension)
 */
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

// Type that defines a user.
type User = {
  active: boolean;
  age: number;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
};

// The TABLE key that defines its rows type and the TABLE's name.
// Its purpose will be more clear when we'll talk about Database, Relation Columns, and Detail Tables.
const usersTableKey = createTableKey<User>("users");

/**
 * The TABLE itself. Each COLUMN define a field of the user type and how to generate the random data.
 * The "email" column value depends on the "firstName" and "lastName" columns, so it is positioned after them,
 * in order to generate data using previous generated values for the row.
 */
const usersTable = new Table<User>(usersTableKey, [
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

// Populate the table with 1000 items and returns them.
const users = usersTable.seed(1000).getRows();
```
