# Devs Social App Server

Backend for the Devs Social App

## TODO

- [ ] Pagination for posts
- [ ] Commenting posts
- [ ] Fix: test failing when running together but passing when running alone
- [ ] Better comments in code
- [ ] More tests
- [ ] Migrate to typescript
- [ ] Use prisma
- [ ] Possible migration to a relational database

## Installation & Usage

- Clone this repository

- Install with npm

```bash
  cd devs-social-app-server
  npm install
```

- Rename .env.example to .env and fill the environment variables. Example:

```javascript
  PORT=5000
  MONGO_URI='mongodb://localhost:27017/devs-social-app'
  MONGO_URI_TEST='mongodb://localhost:27017/devs-social-app-test'
  JWT_SECRET_KEY='JWT-SECRET-KEY'
```

- Run the sever

```bash
  npm start
```

### Usage with docker compose

You can use the server with docker compose.

To do that download the `docker-compose.yml` file.

```bash
wget https://raw.githubusercontent.com/JorgeMayoral/devs-social-app-server/main/docker-compose.yml -O docker-compose.yml
```

Create a `db` folder and configure a `.env` file with the following environment variables:

```env
# MongoDb environment variables
MONGO_INITDB_ROOT_USERNAME=''
MONGO_INITDB_ROOT_PASSWORD=''

# Backend environment variables
PORT=''
MONGO_URI='mongodb://mongodb:27017/devs-social'
JWT_SECRET_KEY=''
```

Be sure to use the mongodb username and password in the `MONGO_URI` variable.

Finally use `docker-compose up -d` to run the backend in detached mode.

## API Reference

### User Routes

#### Get all users

Returns all users data without their email and password

```http
  GET /api/v1/user/all
```

#### Get user

Return a user data without their email and password

```http
  GET /api/v1/user/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch |

#### Register user

Register a new user, returns id, username and token

```http
  POST /api/v1/user/register
```

| Body      | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `username`| `string` | **Required**. Username of the new user|
| `name`    | `string` | **Required**. Name of the new user    |
| `email`   | `string` | **Required**. Email of the new user   |
| `password`| `string` | **Required**. Password of the new user|

#### Login user

Login a user, returns user data (without password) and token

```http
  POST /api/v1/user/login
```

| Body      | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`| `string` | **Required**. Username of the user|
| `password`| `string` | **Required**. Password of the user|

### Profile

Return the user data for the logged user

```http
  GET /api/v1/user/profile
```

| Headers         | Type     | Description                                             | Example          |
| :-------------- | :------- | :------------------------------------------------------ | :--------------- |
| `Authentication`| `string` | **Required**. Valid token preceded by the word 'Bearer' | `Bearer <token>` |
  
### Update user

Update the name and/or email of the logged user

```http
  PUT /api/v1/user/update
```

| Headers         | Type     | Description                                             | Example          |
| :-------------- | :------- | :------------------------------------------------------ | :--------------- |
| `Authentication`| `string` | **Required**. Valid token preceded by the word 'Bearer' | `Bearer <token>` |

| Body   | Type     | Description           |
| :----- | :------- | :-------------------- |
| `name` | `string` | New name for the user |
| `email`| `string` | New email for the user|
  
### Delete user

Delete the logged user

```http
  DELETE /api/v1/user/delete
```

| Headers         | Type     | Description                                             | Example          |
| :-------------- | :------- | :------------------------------------------------------ | :--------------- |
| `Authentication`| `string` | **Required**. Valid token preceded by the word 'Bearer' | `Bearer <token>` |
  
### Follow user

The logged user starts to follow the target user (id parameter)

```http
  PUT /api/v1/user/:id/follow
```

| Headers         | Type     | Description                                             | Example          |
| :-------------- | :------- | :------------------------------------------------------ | :--------------- |
| `Authentication`| `string` | **Required**. Valid token preceded by the word 'Bearer' | `Bearer <token>` |

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Id of user to follow |
  
### Post routes

#### Get all posts

Returns all posts

```http
  GET /api/v1/post/all
```

#### Get post

Return a post

```http
  GET /api/v1/post/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch |

#### Create a post

Create a new post from the logged user

```http
  POST /api/v1/post
```

| Body  | Type     | Description                      |
| :---- | :------- | :------------------------------- |
| `body`| `string` | **Required**. Content of the post|

| Headers         | Type     | Description                                             | Example          |
| :-------------- | :------- | :------------------------------------------------------ | :--------------- |
| `Authentication`| `string` | **Required**. Valid token preceded by the word 'Bearer' | `Bearer <token>` |

#### Update a post

Update the content of a post, the author and the logged user should be the same

```http
  PUT /api/v1/post/:id
```

| Headers         | Type     | Description                                             | Example          |
| :-------------- | :------- | :------------------------------------------------------ | :--------------- |
| `Authentication`| `string` | **Required**. Valid token preceded by the word 'Bearer' | `Bearer <token>` |

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | **Required**. Id of the post to update |

#### Delete a post

Delete a post, the author and the logged user should be the same

```http
  DELETE /api/v1/post/:id
```

| Headers         | Type     | Description                                             | Example          |
| :-------------- | :------- | :------------------------------------------------------ | :--------------- |
| `Authentication`| `string` | **Required**. Valid token preceded by the word 'Bearer' | `Bearer <token>` |

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | **Required**. Id of the post to delete |

#### Like a post

Give a like to a post

```http
  PUT /api/v1/post/:id/like
```

| Headers         | Type     | Description                                             | Example          |
| :-------------- | :------- | :------------------------------------------------------ | :--------------- |
| `Authentication`| `string` | **Required**. Valid token preceded by the word 'Bearer' | `Bearer <token>` |

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `string` | **Required**. Id of the post to like |

## Author

- [@JorgeMayoral](https://www.github.com/JorgeMayoral)

## License

[MIT](https://choosealicense.com/licenses/mit/)
