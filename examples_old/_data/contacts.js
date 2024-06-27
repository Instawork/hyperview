const { faker } = require('@faker-js/faker');

// Generate a sorted list of 20000 users
module.exports = Array.from({ length: 20000 }, () => ({
  email: faker.internet.email(),
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  phone: faker.phone.number('(###) 555-####'),
})).sort((a, b) => a.name.localeCompare(b.name));
