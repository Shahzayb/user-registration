# user-registeration-vu
It's a user registeration module with login, register, search users and forget password functionalities.


## Getting Started

Follow these instructions to setup the project for development environment.

### 3rd Party Services
This website uses [SendGrid](https://sendgrid.com/) to send emails.


### Installing

1. Clone the project and install dependencies

```
git clone https://github.com/Shahzayb/user-registration-vu.git
```
```
cd client && npm install
```
```
cd server && npm install
```

2. Create SendGrid Account and retrieve api key.

3. inside `user-registration-vu/server/config` folder, create `.env` file.


**inside `.env` file, create these key value pairs**

`JWT_SECRET=secret`

`SENDGRID_API_KEY=sendgrid will provide this value`

`COMPANY_EMAIL=user-registration-vu@no-reply.com`

`CLIENT_BASE_URL=http://localhost:3000`



## Running the tests

inside the root of the project run:
```
cd server/
npm run test
```


## Built With
* [Express.js](http://expressjs.com/)
* [Mongoose](https://mongoosejs.com/)
* [NPM](https://www.npmjs.com/)
* [Create React App](https://create-react-app.dev/)
* [Redux](https://redux.js.org/introduction/getting-started)

## Versioning

For the versions available, see the [tags on this repository](https://github.com/shahzayb/freemage/tags). 

## Author

* **Shahzaib Sarwar**  - [shahzayb](https://github.com/shahzayb)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
