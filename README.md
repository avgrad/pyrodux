# TODO

- how to do something like pagination?
  - current implementation is greedy, wants just collection/query and thats it
  - its not thinking about pagination/lazy loading collections when needed
  - example: load tracked entries by month, click "prev month", it will load data from prev month into state *additionaly*
  - rough idea is implemented, but i dont know if it works like i intend
  - and how could this be done with subscriptions????? because you cant "edit" a subscribed query
- does general firestore to object mapping work?
- put docRef / collectionRef in state?
- create/update/delete callbacks? (in Pyrodux index class, or params to dispatches?)
- implement subscribe to collection changes (just as function? or also as redux-thunk action?)

# Pyrodux

Pyrodux is a set of general redux actions to use the Firebase Firestore inside your react app.
It helps you to focus on the main parts of you app instead of data-handling the collections, queries and redux-state.

## NPM Scripts

- `build` -> build to `./build`
- `watch` -> watch for file changes, and build to `./build`
- `release` -> `npm publish build`
- `dev-init` -> install pyrodux dependencies, and install playground dependencies
- `playground:start` -> run playground app locally
- `dev-playground` -> watch for file changes to build pyrodux, and run playground locally

## Prerequisites

- initialized Firebase app (best with firestore and auth already imported)
- redux (with redux-thunk middleware, since actions are async)
- redux-form (if you want to make use of submission errors)

## What can it do?

## How to use

### Auth

// TODO

### Firestore collections

// TODO

### Custom Firestore queries

// TODO

### Use your data in components

// TODO

## What can it NOT do?

Currently there is no way to use it for paged collections, which lazy load
when the user for example navigates pages of a table.

But I am thinking about this and hopefully support will come soon.
