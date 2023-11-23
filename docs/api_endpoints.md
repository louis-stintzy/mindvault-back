# API Endpoints

## User

Operations about user

### Login

Logs the user to the application

``` POST /api/user/login ```

#### Request body <!-- {#login-section} -->

```json
{
    "email": "user email",
    "password": "user password"
}
```

#### Responses <!-- {#login-section} -->

##### 200 OK <!-- {#login-section} -->

A token is returned for successful authentication

```json
{
    "username": "user name",
    "token": "token JWT",
}
```

##### 401 Unauthorized <!-- {#login-section} -->

An error is returned if the email address or password is incorrect

```json
{
    "errCode":11,
    "errMessage":"Bad login"
} 
```

##### 500 Internal Server Error <!-- {#login-section} -->

An error is returned if an unexpected server error occurs during the login process.

```json
{
    "errCode":0,
    "errMessage":"A server error occurred during login"
} 
```

### Register

Create a user account

``` POST /api/user/register ```

#### Request body <!-- {#register-section} -->

```json
{
    "username": "user name",
    "email": "user email",
    "password": "user password",
    "confirmPassword": "retyped password"
}
```

#### Responses <!-- {#register-section} -->

##### 201 Created <!-- {#register-section} -->

a success message is returned

```json
{
    "message":"Registration successful",
    "username": "username"
} 
```

##### 400 Bad request <!-- {#register-section} -->

An error message is returned if a field is missing

```json
{
    "errCode":13,
    "errMessage":"Missing field"
} 
```

An error message is returned if the password and password confirmation are not equivalent

```json
{
    "errCode":14,
    "errMessage":"Passwords do not match"
} 
```

An error message is returned if the string is not an email

```json
{
    "errCode":15,
    "errMessage":"Invalid email"
} 
```

An error message is returned if the string cannot be considered a strong password

```json
{
    "errCode":16,
    "errMessage":"Invalid password"
} 
```

An error message is returned if the username is less than 3 characters or more than 49

```json
{
    "errCode":17,
    "errMessage":"Invalid username"
} 
```

An error message is returned if the user already exists (email or username). The message is deliberately not explicit for security reasons (not revealing information about existing accounts)

```json
{
    "errCode":18,
    "errMessage":"Email address or username already used"
} 
```

##### 500 Internal Server Error <!-- {#register-section} -->

An error is returned if an unexpected server error occurs during the registration process.

```json
{
    "errCode":1,
    "errMessage":"A server error occurred during registration"
} 
```

An error is returned if an unexpected server error occurs during the user verification process (check if the user already exists).

```json
{
    "errCode":2,
    "errMessage":"A server error occurred during user verification"
} 
```
