const request = require('supertest')
const app = require('../../app')

// PAUSED

describe('POST /Login', function () {
  it('The post request works', function (done) {
    request(app)
      .post('/login')
      .send({ name: 'test', password: '12345' })
      .set('Accept', 'application/json')
      .expect(200, done)
  })
})
