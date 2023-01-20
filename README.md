# Northcoders News API

## Available at - https://news-backend-njz3.onrender.com

## Summary
An API providing news articles and associated comments built using the expressjs framework and postgreSQL. The database is hosted on ElephantSQL and the application is hosted on Render.

## Minimum Version

This API was built using Node.js version 19.1.0 and Postgres version 14.6. It is recommended, to ensure stability and functionality, these versions or higher are used. 

## Set-up

### Clone

Please clone the API project inside of your chosen directory using the command below.
```
$ git clone https://github.com/numberwang55/News_Backend.git
```
### Dependencies

In order to install the required dependencies please run:
```
$ npm i
```
##### Development Dependencies 

|`Package`     | `Version` |     
| -------------|-----------|     
| husky        |  8.0.2    |    
| jest         |  27.5.1   |    
| jest-extended|  2.0.0    |    
| jest-sorted  |  1.0.14   |
| pg-format    |  1.0.4    |
| supertest    |  6.3.3    |

##### Production Dependencies

| `Package`   | `Version` |
| ------------|---------- |
|  dotenv     |  16.0.0   |
|  express    |  4.18.2   |
|  pg         |  8.8.0    |


### Environment Variables

In order to access the test & dev databases, add two files with the following: 

1. .env.test - 'PGDATABASE=nc_news_test'
2. .env.development - 'PGDATABASE=nc_news'

### Setup & Seed Database

In order to run the app please first setup the database and then seed the database using the below commands:
```
$ npm run setup-dbs

$ npm run seed
```
### Testing

To run the unit tests please use the below command:
```
$ npm t utils.test.js
```
To run the integration tests please use this command:
```
$ npm t app.test.js
```