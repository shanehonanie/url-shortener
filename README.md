# url-shortener

Coding excercise given as a take home assessment.

## Problem

Build a simple URL shortener/redirection service similar to Bit.ly or TinyURL. The service should allow a user to input a "long" URL, output a "shortened" URL and redirect users to the long URL when the shortened URL is visited. Bonus points for handling edge cases and writing tests as you go.

- As a user, I should be able to create a "shortened" URL from a long URL.
- As a user, I should be redirected to the "long" URL when I visit the "shortened" URL in a web browser.
- As a user, I should be able to choose a custom or vanity path when creating my "shortened" URL.
- As a user, I should be able to delete or rename a "shortened" URL I have created.
- As a user, I cannot delete or rename "shortened" URLs that others have created.
- As a user, I should be able to see how many people have clicked on my "shortened" URL.

[Link to Problem](https://github.com/Subatomic-Agency/takehome-url-shortener-web-dev-test)

## Solution Approach

I chose to implement a REST API using Typescript, Node.js, and Express.js to solve this problem.

## Future Improvements

- Add useful jest tests.
- Create standard for returning error responses and validation errors.
- Use a real database solution instead of storing data to file and loading all data into memory.
- Incorporate a real user system that uses a standard such as JWTs to verify the client idenity.
- Add a Client UI.

## Running the Code

Prerequisite: Must have node.js installed

1. `git clone https://github.com/shanehonanie/url-shortener.git`
2. Navigate to the root of the project
3. `yarn`
4. `yarn start`
