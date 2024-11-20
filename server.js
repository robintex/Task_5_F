const express = require('express');
const { faker } = require('@faker-js/faker');
const seedrandom = require('seedrandom');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/books', (req, res) => {
    try {
        const { seed = 42, page = 1, language = 'en', likes = 5, reviews = 4.7 } = req.query;

        // Initialize the RNG with the combined seed and page
        const rng = seedrandom(`${seed}-${page}`);

        // Configure Faker.js locale
        faker.locale = language;

        const books = Array.from({ length: 20 }, (_, i) => ({
            index: i + 1 + (page - 1) * 20,
            isbn: faker.string.uuid(), // Generate a UUID for ISBN
            title: faker.lorem.words(Math.ceil(rng() * 5 + 1)), // Generate random title
            authors: `${faker.person.firstName()} ${faker.person.lastName()}`, // Generate random author name
            publisher: faker.company.name(), // Generate random publisher
            likes: Math.round(rng() * likes), // Calculate likes based on the range
            reviews: rng() < reviews % 1 ? Math.floor(reviews) + 1 : Math.floor(reviews), // Probabilistic review generation
        }));

        res.json(books);
    } catch (error) {
        console.error('Error generating books:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

