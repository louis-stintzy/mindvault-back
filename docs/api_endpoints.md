# API Endpoints

## Table of Contents

| Endpoint Description                     | Route                    |
|------------------------------------------|--------------------------|
| [Login](#login-section-id)                  | POST /api/user/login     |
| [Register](#register-section)            | POST /api/user/register  |
| [Validate Token](#validateToken-section) | GET /api/user/validateToken |
| [Get Box by Id](#getBoxById-section-id)     | GET /api/box/:boxId      |
| [Get Boxes](#getBoxes-section)           | GET /api/boxes           |
| [Create Box](#createBox-section)         | POST /api/boxes          |
| [Update Box](#updateBox-section)         | PUT /api/box/:boxId      |
| [Update Box Learn It](#updateBoxLearnIt-section) | PATCH /api/box/:boxId/learnit |
| [Delete Box](#deleteBox-section)         | DELETE /api/box/:boxId   |
| [Get Cards](#getCards-section)           | GET /api/box/:boxId/cards |
| [Create Card](#createCard-section)       | POST /api/box/:boxId/cards |
| [Update Card](#updateCard-section)       | PUT /api/box/:boxId/card/:cardId |
| [Delete Card](#deleteCard-section)       | DELETE /api/box/:boxId/card/:cardId |
| [Get Random Cards](#getRandomCards-section) | GET /api/play/box/:boxId |
| [Update Card Attributes](#updateCardAttributes-section) | PATCH /api/play/card/:cardId |
| [Get Instant Stats](#getInstantStats-section) | GET /api/stats/instant/box/:boxId |
| [Get Historical Stats](#getHistoricalStats-section) | GET /api/stats/historical/box/:boxId |

## User

Operations about user

### Login <!-- {#login-section-id} -->

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
    "errCode":22,
    "errMessage":"Bad token"
} 
```

## Box

Operations about boxes


### Get Box by Id {#getBoxById-section-id}

<!-- todo : réaliser la doc Get Box by Id -->
Get a specific box by its id.

### Get Boxes

Lists the user's boxes.

``` GET /api/boxes ```

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

``` POST /api/boxes ```

#### Request body <!-- {#createBox-section} -->

The request body should be `multipart/form-data` including the image file and other box details.

| Field                    | Type      | Description                                           |
|--------------------------|-----------|-------------------------------------------------------|
| `name`                   | `string`  | Name of the box                                       |
| `description`            | `string`  | Description of the box                                |
| `color`                  | `string`  | Colour associated with the box                        |
| `label`                  | `string`  | Label (theme) of the box                              |
| `level`                  | `string`  | Level of difficulty of questions                      |
| `defaultQuestionLanguage`| `string`  | Default question language (speech-to-text)            |
| `defaultQuestionVoice`   | `string`  | Default question voice (speech-to-text)               |
| `defaultAnswerLanguage`  | `string`  | Default answer language (speech-to-text)              |
| `defaultAnswerVoice`     | `string`  | Default answer voice (speech-to-text)                 |
| `learnIt`                | `boolean` | Indicates if the box is in training                   |
| `type`                   | `number`  | Type of box, see data dictionary                      |
| `image`                  | `file`    | Image file for illustration                           |

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

### Update Box

Update a box.

``` PUT /api/box/:boxId ```

#### Request body & Response

See "Create Box"

##### 500 Internal Server Error <!-- {#updateBox-section} -->

An error is returned if an unexpected server error occurs when updating a box.
Remember to look at the backend console for more information.

```json
{
    "errCode":132,
    "errMessage":"A server error occurred when updating the box"
} 
```

### Update Box "learn it" value

Update the "learn it" value of the box

``` PATCH /api/box/:boxId/learnit ```

<!-- TODO Update Box -->

### Delete Box

Delete a box.

``` DELETE /api/box/:boxId ```

<!-- TODO Delete Box -->

## Card

Operations about cards

### Get Cards

Lists the cards in a box.

``` GET /api/box/:boxId/cards ```

#### Responses <!-- {#getCards-section} -->

##### 200 OK <!-- {#getCards-section} -->

A list of cards is returned

<!-- TODO mettre la doc à jour en fonction de ce qui est retourné -->

##### 400 Bad request <!-- {#getCards-section} -->

An error message is returned if the box id is not a number

```json
{
    "errCode":36,
    "errMessage":"Invalid box id"
} 
```

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
    "errCode":39,
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

``` POST /api/box/:boxId/cards ```

#### Request body <!-- {#createCard-section} -->

```json
{
    "questionLanguage":"language used for the question",
    "questionVoice":"voice used for the question",
    "answerLanguage":"language used for the answer",
    "answerVoice":"voice used for the question",
    "question": "Question",
    "answer": "Answer",
    "attachment": "Illustration of the question",
}
```

#### Responses <!-- {#createCard-section} -->

##### 201 OK <!-- {#createCard-section} -->

The new card is returned

<!-- TODO mettre la doc à jour en fonction de ce qui est retourné dans la card -->

##### 400 Bad request <!-- {#createCard-section} -->

An error message is returned if the box id is not a number

```json
{
    "errCode":36,
    "errMessage":"Invalid box id"
} 
```

An error message is returned if the card id is not a number

```json
{
    "errCode":56,
    "errMessage":"Invalid card id"
} 
```

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

An error message is returned if the card does not exist or is not owned by the user

```json
{
    "errCode":57,
    "errMessage":"Unauthorised users"
} 
```

An error message is returned if the card does not exist or is not owned by the user

```json
{
    "errCode":58,
    "errMessage":"Unauthorised users"
} 
```

> **Note**: If no card, we normally return a 404 error. Here we return a 403 error to not give information on the existence or not of the card (only the error code differs)

##### 500 Internal Server Error <!-- {#createCard-section} -->

An error is returned if an unexpected server error occurs when checking the owner of the box.
Remember to look at the backend console for more information.

```json
{
    "errCode":39,
    "errMessage":"A server error occurred when verifying the box owner"
} 
```

An error is returned if an unexpected server error occurs when checking the owner of the card.
Remember to look at the backend console for more information.

```json
{
    "errCode":59,
    "errMessage":"A server error occurred when verifying the card owner"
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

### Update Card

Update a card.

``` PUT /api/box/:boxId/card/:cardId ```

<!-- TODO Update Card -->

### Delete Card

Delete a card.

``` DELETE /api/box/:boxId/card/:cardId ```

#### Responses <!-- {#deleteCard-section} -->

##### 204 No Content <!-- {#deleteCard-section} -->

Nothing is returned when a card is successfully deleted

##### 500 Internal Server Error <!-- {#deleteCard-section} -->

An error is returned if an unexpected server error occurs when deleting a card.
Remember to look at the backend console for more information.

```json
{
    "errCode":55,
    "errMessage":"A server error occurred when deleting a card"
} 
```

## Play

Operations about play

### Get Random Cards

Collect cards from a box whose "date to ask" question is today or in the past. Cards are collected in batches of 10.

``` GET /api/play/box/:boxId ```

#### Responses <!-- {#getRandomCards-section} -->

##### 200 OK <!-- {#getRandomCards-section} -->

A list of boxes is returned

<!-- TODO mettre la doc à jour en fonction de ce qui est retourné -->

##### 400 Bad request <!-- {#getRandomCards-section} -->

An error message is returned if the box id is not a number

```json
{
    "errCode":36,
    "errMessage":"Invalid box id"
} 
```

##### 403 Forbidden  <!-- {#getRandomCards-section} -->

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

##### 500 Internal Server Error <!-- {#getRandomCards-section} -->

An error is returned if an unexpected server error occurs when checking the owner of the box.
Remember to look at the backend console for more information.

```json
{
    "errCode":39,
    "errMessage":"A server error occurred when verifying the box owner"
} 
```

An error is returned if an unexpected server error occurs while retrieving cards from the box.
Remember to look at the backend console for more information.

```json
{
    "errCode":101,
    "errMessage":"A server error occurred when retrieving cards"
} 
```

### Update Card Attributes

Update the "date to ask" and "compartment" values of the card

``` PATCH /api/play/card/:cardId ```

#### Request body <!-- {#updateCardAttributes-section} -->

```json
{
    "nextCompartment": "Indicates the new compartment in which the card will be deposited",
    "nextDateToAsk": "Indicates the new date on which the question will be asked again"
    
}
```

#### Responses <!-- {#updateCardAttributes-section} -->

##### 200 OK <!-- {#updateCardAttributes-section} -->

A list of boxes is returned

<!-- TODO mettre la doc à jour en fonction de ce qui est retourné -->

##### 400 Bad request <!-- {#updateCardAttributes-section} -->

An error message is returned if the card id is not a number

```json
{
    "errCode":56,
    "errMessage":"Invalid card id"
} 
```

An error message is returned if a required field is missing

```json
{
    "errCode":103,
    "errMessage":"Missing required field"
} 
```

An error message is returned if nextDateToAsk is not an date

```json
{
    "errCode":104,
    "errMessage":"Invalid date format"
} 
```

An error message is returned if nextCompartment is not a number

```json
{
    "errCode":105,
    "errMessage":"Invalid compartment format"
} 
```

##### 403 Forbidden  <!-- {#updateCardAttributes-section} -->

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

##### 500 Internal Server Error <!-- {#updateCardAttributes-section} -->

An error is returned if an unexpected server error occurs when checking the owner of the card.
Remember to look at the backend console for more information.

```json
{
    "errCode":59,
    "errMessage":"A server error occurred when verifying the card owner"
} 
```

An error is returned if an unexpected server error occurs while updating the card attributes.
Remember to look at the backend console for more information.

```json
{
    "errCode":102,
    "errMessage":"A server error occurred when updating the card attributes"
} 
```

## Stats

Obtain instant and historical box statistics

### Get instant statistics for a box

Shows the total number of cards in a box and their distribution by compartment

``` GET /api/stats/instant/box/:boxId ```

#### Responses <!-- {#getInstantStats-section} -->

##### 200 OK <!-- {#getInstantStats-section} -->

A JSON object is returned. Below is an example of a returned object

```json
{
  "totalCards": 100,
  "cardsByCompartment": {
    "compartment1": 25,
    "compartment2": 25,
    "compartment3": 25,
    "compartment4": 25,
    "compartment5": 0,
    "compartment6": 0,
    "compartment7": 0,
    "compartment8": 0
  }
}
```

##### 500 Internal Server Error <!-- {#getInstantStats-section} -->

An error is returned if an unexpected server error occurs when retrieving instant stats.
Remember to look at the backend console for more information.

```json
{
    "errCode":111,
    "errMessage":"A server error occurred when retrieving instant stats"
} 
```

##### Other possible answers <!-- {#getInstantStats-section} -->

The owner of the box is verified. The following errors may be returned: 10, 36, 37, 38, 39. Please refer to the errors.md file.

### Get historical statistics for a box

Shows the total number of cards in a box and their distribution by compartment per week.

``` GET /api/stats/historical/box/:boxId ```

#### Responses <!-- {#getHistoricalStats-section} -->

##### 200 OK <!-- {#getHistoricalStats-section} -->

An array of objects is returned. Each object representing the statistics for a specific week for the box requested. Below is an example of the returned array, containing statistics for two different weeks:

```json
[
  {
    "totalCards": 120,
    "cardsByCompartment": {
      "compartment1": 20,
      "compartment2": 20,
      "compartment3": 20,
      "compartment4": 20,
      "compartment5": 20,
      "compartment6": 10,
      "compartment7": 5,
      "compartment8": 5
    },
    "statsDate": {
      "statisticsDay": "2024-03-14",
      "weekNumber": 11,
      "year": 2024
    }
  },
  {
    "totalCards": 100,
    "cardsByCompartment": {
      "compartment1": 25,
      "compartment2": 25,
      "compartment3": 25,
      "compartment4": 15,
      "compartment5": 5,
      "compartment6": 3,
      "compartment7": 1,
      "compartment8": 1
    },
    "statsDate": {
      "statisticsDay": "2024-03-07",
      "weekNumber": 10,
      "year": 2024
    }
  }
]
```

##### 500 Internal Server Error <!-- {#getHistoricalStats-section} -->

An error is returned if an unexpected server error occurs when retrieving historical stats.
Remember to look at the backend console for more information.

```json
{
    "errCode":11,
    "errMessage":"A server error occurred when retrieving historical stats"
} 
```

##### Other possible answers <!-- {#getHistoricalStats-section} -->

The owner of the box is verified. The following errors may be returned: 10, 36, 37, 38, 39. Please refer to the errors.md file.
