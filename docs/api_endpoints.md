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

##### 400 Bad request <!-- {#login-section} -->

An error message is returned if a field is missing

```json
{
    "errCode":13,
    "errMessage":"Missing field"
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

### Validate Token

Validates the user's JWT to confirm they are authenticated.

``` GET /api/user/validateToken ```

#### Headers  <!-- {#validateToken-section} -->

```plaintext
Authorization: Bearer <your_token_here>
```

#### Responses <!-- {#validateToken-section} -->

##### 200 OK <!-- {#validateToken-section} -->

Indicates the token is valid.

```json
{
    "message": "Token is valid",
}
```

##### 401 Unauthorized <!-- {#validateToken-section} -->

An error is returned if no token is provided or the token is missing in the request headers.

```json
{
    "errCode":21,
    "errMessage":"Missing token"
} 
```

##### 403 Forbidden  <!-- {#validateToken-section} -->

An error is returned if the token is invalid or expired.

```json
{
    "errCode":21,
    "errMessage":"Bad token"
} 
```

## Box

Operations about boxes

### Get Boxes

Lists the user's boxes.

``` GET /api/box/getBoxes ```

#### Responses <!-- {#getBoxes-section} -->

##### 200 OK <!-- {#getBoxes-section} -->

A list of boxes is returned

<!-- TODO mettre la doc à jour en fonction de ce qui est retourné -->

##### 500 Internal Server Error <!-- {#getBoxes-section} -->

An error is returned if an unexpected server error occurs during the retrieval of the user's boxes.
Remember to look at the backend console for more information.

```json
{
    "errCode":31,
    "errMessage":"A server error occurred when retrieving the boxes"
} 
```

### Create Box

Create a new box.

``` POST /api/box/createBox ```

#### Request body <!-- {#createBox-section} -->

```json
{
    "name": "Box name",
    "description": "Description",
    "boxPicture": "Path to the box illustration",
    "color":"Colour associated with the box",
    "label": "Label (theme) of the box",
    "level":"Level of difficulty of questions",
    "learnIt": "Box in training ?",
    "type":"Type of box, see data_dictionary"
}
```

#### Responses <!-- {#createBox-section} -->

##### 201 Created <!-- {#createBox-section} -->

The new box is returned

<!-- TODO mettre la doc à jour en fonction de ce qui est retourné -->

##### 400 Bad request <!-- {#createBox-section} -->

An error message is returned if a field is missing (name, learnIt, type)

```json
{
    "errCode":33,
    "errMessage":"Missing required fields"
} 
```

An error is returned if the box type entered is incorrect (is not 1, 2 or 3)

```json
{
    "errCode":34,
    "errMessage":"Invalid box type"
} 
```

An error is returned if the box type entered is 1 or 3

```json
{
    "errCode":35,
    "errMessage":"Box type not yet implemented"
} 
```

<!-- An error is returned if the learnIt value is not Boolean

```json
{
    "errCode":36,
    "errMessage":"Invalid learnIt value"
} 
``` -->

##### 500 Internal Server Error <!-- {#createBox-section} -->

An error is returned if an unexpected server error occurs when creating a box.
Remember to look at the backend console for more information.

```json
{
    "errCode":32,
    "errMessage":"A server error occurred when creating the box"
} 
```

## Card

Operations about cards

### Get Cards

Lists the cards in a box.

``` GET /api/box/:id/getCards/ ```

#### Responses <!-- {#getCards-section} -->

##### 200 OK <!-- {#getCards-section} -->

A list of cards is returned

<!-- TODO mettre la doc à jour en fonction de ce qui est retourné -->

##### 403 Forbidden  <!-- {#getCards-section} -->

An error message is returned if the box does not exist or is not owned by the user

```json
{
    "errCode":37,
    "errMessage":"Unauthorised users"
} 
```

An error message is returned if the box does not exist or is not owned by the user

```json
{
    "errCode":38,
    "errMessage":"Unauthorised users"
} 
```

> **Note**: If no box, we normally return a 404 error. Here we return a 403 error to not give information on the existence or not of the box (only the error code differs)

##### 500 Internal Server Error <!-- {#getCards-section} -->

An error is returned if an unexpected server error occurs when checking the owner of the box.
Remember to look at the backend console for more information.

```json
{
    "errCode":36,
    "errMessage":"A server error occurred when verifying the box owner"
} 
```

An error is returned if an unexpected server error occurs during the retrieval of the list of cards.
Remember to look at the backend console for more information.

```json
{
    "errCode":51,
    "errMessage":"A server error occurred when retrieving the cards"
} 
```


### Create Card

Create a new card.

``` POST /api/box/:id/createCard ```

#### Request body <!-- {#createCard-section} -->

```json
{
    "question": "Question",
    "answer": "Answer",
    "attachment": "Illustration of the question",
}
```

#### Responses <!-- {#createCard-section} -->

##### 201 OK <!-- {#createCard-section} -->

The new card is returned

<!-- TODO mettre la doc à jour en fonction de ce qui est retourné -->

##### 400 Bad request <!-- {#createCard-section} -->

An error message is returned if a field is missing (question, answer)

```json
{
    "errCode":53,
    "errMessage":"Missing required fields"
} 
```

##### 403 Forbidden  <!-- {#createCard-section} -->

An error message is returned if the box does not exist or is not owned by the user

```json
{
    "errCode":37,
    "errMessage":"Unauthorised users"
} 
```

An error message is returned if the box does not exist or is not owned by the user

```json
{
    "errCode":38,
    "errMessage":"Unauthorised users"
} 
```

> **Note**: If no box, we normally return a 404 error. Here we return a 403 error to not give information on the existence or not of the box (only the error code differs)

##### 500 Internal Server Error <!-- {#createCard-section} -->

An error is returned if an unexpected server error occurs when checking the owner of the box.
Remember to look at the backend console for more information.

```json
{
    "errCode":36,
    "errMessage":"A server error occurred when verifying the box owner"
} 
```

An error is returned if an unexpected server error occurs when creating a card.
Remember to look at the backend console for more information.

```json
{
    "errCode":52,
    "errMessage":"A server error occurred when creating the card"
} 
```
