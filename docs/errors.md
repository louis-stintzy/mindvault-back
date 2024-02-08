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
| 36      | Invalid learnIt value                                    | Must be true or false                                |
