
const express = require("express");
const openDatabase = require("./db");

const app = express();

app.use(express.json());

let db;


app.get("/books/", async (request, response) => {
    try {
        const getBooksQuery = `
            SELECT *
            FROM book
            ORDER BY id;
        `;

        const books = await db.all(getBooksQuery);

        response.status(200).send(books);
    } catch (error) {
        response.status(500).send({ error: error.message });
    }
});


app.get("/books/:bookId/", async (request, response) => {
    try {
        const { bookId } = request.params;

        const getBookQuery = `
            SELECT *
            FROM book
            WHERE id = ?;
        `;

        const book = await db.get(getBookQuery, [bookId]);

        if (book === undefined) {
            response.status(404).send({ error: "Book Not Found" });
        } else {
            response.status(200).send(book);
        }
    } catch (error) {
        response.status(500).send({ error: error.message });
    }
});


app.post("/books/", async (request, response) => {
    try {
        const { title, author, price, pages } = request.body;

        const addBookQuery = `
            INSERT INTO book (title, author, price, pages)
            VALUES (?, ?, ?, ?);
        `;

        const result = await db.run(addBookQuery, [
            title,
            author,
            price,
            pages
        ]);

        response.status(201).send({
            message: "Book Added Successfully",
            bookId: result.lastID
        });
    } catch (error) {
        response.status(500).send({ error: error.message });
    }
});

app.put("/books/:bookId/", async (request, response) => {
    try {
        const { bookId } = request.params;
        const { title, author, price, pages } = request.body;

        const updateBookQuery = `
            UPDATE book
            SET title = ?, author = ?, price = ?, pages = ?
            WHERE id = ?;
        `;

        const result = await db.run(updateBookQuery, [
            title,
            author,
            price,
            pages,
            bookId
        ]);

        if (result.changes === 0) {
            response.status(404).send({ error: "Book Not Found" });
        } else {
            response.status(200).send({ message: "Book Updated Successfully" });
        }
    } catch (error) {
        response.status(500).send({ error: error.message });
    }
});


app.delete("/books/:bookId/", async (request, response) => {
    try {
        const { bookId } = request.params;

        const deleteBookQuery = `
            DELETE FROM book
            WHERE id = ?;
        `;

        const result = await db.run(deleteBookQuery, [bookId]);

        if (result.changes === 0) {
            response.status(404).send({ error: "Book Not Found" });
        } else {
            response.status(200).send({ message: "Book Deleted Successfully" });
        }
    } catch (error) {
        response.status(500).send({ error: error.message });
    }
});



const PORT = process.env.PORT || 3000;

const initializeDBAndServer = async () => {
    try {
        db = await openDatabase();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(`Database Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();
