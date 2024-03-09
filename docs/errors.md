# Errors

| errCode | errMessage                            | Description                           |
| ------- | ------------------------------------- | -------------------------------------- |
| 0       | An unexpected server error occurred during login | Unexpected server error occurred during login |
| 1       | An unexpected server error occurred during registration | Unexpected server error occurred during registration |
| 2       | An unexpected server error occurred during user verification | Unexpected server error occurred during user verification (check if the user already exists) |
| 11      | Bad login                             | Email address or password is incorrect |
| 13      | Missing field                         | Field is missing                       |
| 14      | Passwords do not match                | Password and confirmation mismatch     |
| 15      | Invalid email                         | Email format is invalid                |
| 16      | Invalid password                      | Password does not meet requirements    |
| 17      | Invalid username                      | Username length is invalid             |
| 18      | Email address or username already used | User already exists (email or username)                                |
| 21      | Missing token                          | No token is provided or the token is missing in the request headers    |
| 22      | Bad token                              | The token is invalid or expired                                        |
| 31      | A server error occurred when retrieving the boxes        | A server error occurred when retrieving the boxes    |
| 32      | A server error occurred when creating the box            | A server error occurred when creating the box        |
| 33      | Missing required fields                                  | A field is missing (name, learnIt, type)             |
| 34      | Invalid box type                                         | The box type entered is incorrect (is not 1, 2 or 3) |
| 35      | Box type not yet implemented                             | The box type entered is 1 or 3 , enter 2             |
| 36      | Invalid box id                                           | Id format is invalid                                 |
| 37      | Unauthorised users                                       | The box does not exist or is not owned by the user   |
| 38      | Unauthorised users                                       | The box does not exist or is not owned by the user   |
| 39      | A server error occurred when verifying the box owner     | A server error occurred when verifying the box owner |
| 40      | A server error occurred when deleting a box              | A server error occurred when deleting a box          |
| 41      | Invalid learnIt value                                    | learnIt must be a boolean value                      |
| 42      | A server error occurred when when updating "learn it" state' | A server error occurred when updating "learn it" state'          |
| 51      | A server error occurred when retrieving the cards        | A server error occurred when retrieving the cards    |
| 52      | A server error occurred when creating the card           | A server error occurred when creating the card       |
| 53      | Missing required fields                                  | A field is missing (question, answer)                |
| 55      | A server error occurred when deleting a card             | A server error occurred when deleting a card         |
| 56      | Invalid card id                                          | Id format is invalid                                 |
| 57      | Unauthorised users                                       | The card does not exist or is not owned by the user  |
| 58      | Unauthorised users                                       | The card does not exist or is not owned by the user  |
| 59      | A server error occurred when verifying the card owner    | A server error occurred when verifying the card owner|
