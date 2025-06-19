# 📡 GraphQL Basics

GraphQL is a query language for APIs that allows clients to request exactly the data they need.

---

## 🚀 Example Query

```graphql
query GetUser {
  user(id: "123") {
    id
    name
    email
  }
}
