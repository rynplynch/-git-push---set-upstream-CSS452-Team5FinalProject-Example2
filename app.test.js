// external libraries
const request = require("supertest");

// our own application
const app = require("./app.js");

test('GET root', async () => {
  return (
    request(app)
      .get('/')
      .expect("Content-Type", "text/html; charset=UTF-8")
  )
});
