import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("hireloop");

const ROLES = ["seeker", "recruiter", "admin"];

// Standard Schema validator — better-auth runs it on every signup input.
const roleValidator = {
  "~standard": {
    version: 1,
    vendor: "hireloop",
    validate: (value) =>
      typeof value === "string" && ROLES.includes(value)
        ? { value }
        : { issues: [{ message: `Role must be one of: ${ROLES.join(", ")}` }] },
  },
};

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "seeker",
        input: true, // accept the role chosen in the signup form
        validator: { input: roleValidator },
      },
      // Set to true by the backend (/payments/checkout-verify) after a
      // successful premium purchase. Exposed here so the session's user
      // object carries it — premium users skip the free application limit.
      premium: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false, // never writable from client-side signup/update
      },
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
});
