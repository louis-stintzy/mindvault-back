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
    "token": "token JWT",
}
```

##### 401 Unauthorized <!-- {#login-section} -->

An error is returned if the email address or password is incorrect

```json
{
    "errCode":1,
    "err":"bad login"
} 
```

### Register

Create a user account

``` POST /api/user/register ```

#### Request body <!-- {#register-section} -->

```json
{
    "email": "user email",
    "username": "user name",
    "pwd": "user password"
}
```

#### Responses <!-- {#register-section} -->

##### 201 Created <!-- {#register-section} -->

a success message is returned

```json
{
    "message":"account created successfully",
    "username": "username"
} 
```

##### 400 Bad request <!-- {#register-section} -->

An error message is returned if a field is missing

```json
{
    "errCode":2,
    "errMessage":"missing field"
} 
```

An error message is returned if the elements sent are invalid

```json
{
    "errCode":3,
    "errMessage":"invalid elements"
} 
```

An error message is returned if the user already exists. The message is deliberately not explicit for security reasons (not revealing information about existing accounts)

```json
{
    "errCode":4,
    "errMessage":"account creation fails."
} 
```
