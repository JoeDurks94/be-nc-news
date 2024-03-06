# About this API

This API is a reddit-style RESTful API that is used to access application data programmatically. It is to be visualised using a front end (which is currently in development). The API is there to mimic a real world backend service which a front end can be used in order to display the data held by the backend

# Technology Used

This uses Express.js and Node.js for the server whcih utilises a PostgreSQL database which stores all then data. During the development of this we used various tools such as Nodemon, Husky, Supertest, Jest and PG-format

# Available Endpoints
|Endpoint|Description|
|--------|------------|
|GET /api| serves up a json representation of all the available endpoints of the api|
|GET /api/topics |serves an array of all topics|
|GET /api/articles|serves an array of article objects and can be queried by the topic|
|GET /api/articles/:article_id|this is used to access an object containing all of the information regarding the passed item|
|GET /api/articles/:article_id/comments|this endpoint will respond with an array of comments objects when passed an article_id that has comments|
|POST /api/articles/:article_id/comments|this endpoint allows the user to post comments to an article by supplying the article_id of which article is to be posted on|
|DELETE /api/comments/:comment_id|this endpoint allows the user to delete comments by passing it a valid comment_id of the comment they want to delete|
|GET /api/users|serves an array of all users|

# Access the API online
You can view a hosted version of my API [here](https://nc-news-app-ju8c.onrender.com/api)

# Access the API on your localmachine

In order for you to access the repo locally, you will need to do some installing of dependancies and also ensure that the correct environment variable are available so that you are able to access the database and authentication checks are passed.




# To use test data

Please create a new file in the root folder of this project folder and call it .env.test. You will need to add the following text inside your .env.test file - PGDATABASE=nc_news_test

# To use development data

Please create a new file in the root folder of this project folder and call it .env.development. You will then need to add the following text inside your .env.development file - PGDATABASE=nc_news
