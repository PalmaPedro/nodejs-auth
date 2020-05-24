# mandatory II - auth project

Auth is the second mandatory project submited for the NODE.JS elective course - 4th Semester - KEA

## Instructions

To run the application:

```bash
npm run start
```
and type in the browser

```bash
http://localhost:3000/
```

## Usage

1 - Start by signup a new user. The new user will receive a confirmation email for account activation. 
2- Newly created user will be added to mysql database, but it is not 'active' yet.
3- Follow the confirmation link. A message should be displayed, which means the account is now 'active'
4- If you check the database, you will see the status is now 'active'.
5- You may now login with the credentials used.
6- The user will be forwarded to a new page (protected, only visible when logged in) and his user details, fetched from the database are now shown.
7 - User may now logout and will be re-directed to the home page


## Author
Pedro Palma

## License
[MIT]