# Errors

| HTTP Status | errCode | errMessage                            | Description                           |
| ------------| ------- | ------------------------------------- | -------------------------------------- |
| 500         | 0       | An unexpected server error occurred during login | Unexpected server error occurred during login |
| 500         | 1       | An unexpected server error occurred during registration | Unexpected server error occurred during registration |
| 500         | 2       | An unexpected server error occurred during user verification | Unexpected server error occurred during user verification (check if the user already exists) |
| 401         | 11      | Bad login                             | Email address or password is incorrect |
| 400         | 13      | Missing field                         | Field is missing                       |
| 400         | 14      | Passwords do not match                | Password and confirmation mismatch     |
| 400         | 15      | Invalid email                         | Email format is invalid                |
| 400         | 16      | Invalid password                      | Password does not meet requirements    |
| 400         | 17      | Invalid username                      | Username length is invalid             |
| 400         | 18      | Email address or username already used | User already exists (email or username)                                |
| 401         | 21      | Missing token                          | No token is provided or the token is missing in the request headers    |
| 403         | 22      | Bad token                              | The token is invalid or expired                                        |
| 500         | 30      | A server error occurred when retrieving the box          | A server error occurred when retrieving the box      |
| 500         | 31      | A server error occurred when retrieving the boxes        | A server error occurred when retrieving the boxes    |
| 500         | 32      | A server error occurred when creating the box            | A server error occurred when creating the box        |
| 400         | 33      | Missing required fields                                  | A field is missing (name, learnIt, type)             |
| 400         | 34      | Invalid box type                                         | The box type entered is incorrect (is not 1, 2 or 3) |
| 400         | 35      | Box type not yet implemented                             | The box type entered is 1 or 3 , enter 2             |
| 400         | 36      | Invalid box id                                           | Id format is invalid                                 |
| 403         | 37      | Unauthorised users                                       | The box does not exist or is not owned by the user   |
| 403         | 38      | Unauthorised users                                       | The box does not exist or is not owned by the user   |
| 500         | 39      | A server error occurred when verifying the box owner     | A server error occurred when verifying the box owner |
| 500         | 40      | A server error occurred when deleting a box              | A server error occurred when deleting a box          |
| 400         | 41      | Invalid learnIt value                                    | learnIt must be a boolean value                      |
| 500         | 42      | A server error occurred when when updating "learn it" state' | A server error occurred when updating "learn it" state'          |
| 500         | 51      | A server error occurred when retrieving the cards        | A server error occurred when retrieving the cards                    |
| 500         | 52      | A server error occurred when creating the card           | A server error occurred when creating the card                       |
| 400         | 53      | Missing required fields                                  | A field is missing (question, answer)                                |
| 500         | 55      | A server error occurred when deleting a card             | A server error occurred when deleting a card                         |
| 400         | 56      | Invalid card id                                          | Id format is invalid                                                 |
| 403         | 57      | Unauthorised users                                       | The card does not exist or is not owned by the user                  |
| 403         | 58      | Unauthorised users                                       | The card does not exist or is not owned by the user                  |
| 500         | 59      | A server error occurred when verifying the card owner    | A server error occurred when verifying the card owner                |
<!-- | 400         | 60      | No file uploaded                                         | No file uploaded                                                     | -->
| 400         | 61      | File too large                                           | File too large (3MB max)                                             |
| 400         | 62      | Invalid file type                                        | The file type is not allowed (image only)                            |
| 400         | 63      | File upload error - see the console for more details     | File upload error - see the console for more details                 |
| 500         | 64      | An unexpected error occurred during file upload          | An unexpected error occurred during file uplo                        |
| 500         | 101     | A server error occurred when retrieving cards            | A server error occurred when retrieving cards                        |
| 500         | 102     | A server error occurred when updating the card attributes| A server error occurred when updating the card attributes            |
| 400         | 103     | Missing required field                                   | Field is missing                                                     |
| 400         | 104     | Invalid date format                                      | Date format is invalid                                               |
| 400         | 105     | Invalid compartment format                               | Compartment format is invalid                                        |
| 400         | 106     | Invalid compartment number                               | Compartment number is invalid                                        |
| 500         | 111     | A server error occurred when retrieving instant stats    | A server error occurred when retrieving instant stats                |
| 500         | 112     | A server error occurred when retrieving historical stats | A server error occurred when retrieving historical stats             |
