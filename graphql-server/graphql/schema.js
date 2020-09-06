const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageURL: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    input userInputData {
        email: String!
        name: String!
        password: String!
    }

    input postInputData {
        title: String!
        imageURL: String!
        content: String!
    }

    type authData {
        userId: String!
        token: String!
    }

    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }

    type RootQuery {
        login(email: String!, password: String!): authData!
        loadPosts(page: Int): PostData!
        viewPost(postId: String!): Post!
        user: User!
    }

    type RootMutation {
        createUser(userInput: userInputData): User!
        createPost(postInput: postInputData): Post!
        updatePost(id: ID!, postInput: postInputData): Post!
        deletePost(id: ID!): Post!
        updateStatus(status: String!): User!
    } 

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);