/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }

  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);

  return response;
};

const getAllBooksHandler = (request, h) => {
  let responseBody;
  // eslint-disable-next-line prefer-destructuring
  const query = request.query;
  const { name, reading, finished } = query;

  if (name) {
    const array = [];
    for (let i = 0; i < books.length; i++) {
      if (books[i].name.toLowerCase().includes(name.toLowerCase())) {
        // eslint-disable-next-line no-shadow
        const { id, name, publisher } = books[i];
        array.push({ id, name, publisher });
      }
    }
    responseBody = h.response({
      status: 'success',
      data: {
        books: array,
      },
    });
    return responseBody;
  }

  if ((reading && Number(reading) === 0) || Number(reading) === 1) {
    const array = [];
    for (let i = 0; i < books.length; i++) {
      if (books[i].reading == reading) {
        // eslint-disable-next-line no-shadow
        const { id, name, publisher } = books[i];
        array.push({ id, name, publisher });
      }
    }
    responseBody = h.response({
      status: 'success',
      data: {
        books: array,
      },
    });
    return responseBody;
  }

  if ((finished && Number(finished) === 0) || Number(finished) === 1) {
    const array = [];
    for (let i = 0; i < books.length; i++) {
      if (books[i].finished == finished) {
        // eslint-disable-next-line no-shadow
        const { id, name, publisher } = books[i];
        array.push({ id, name, publisher });
      }
    }
    responseBody = h.response({
      status: 'success',
      data: {
        books: array,
      },
    });
    return responseBody;
  }
  if (finished && Number(finished) !== 0 && Number(finished) !== 1) {
    const array = [];
    for (let i = 0; i < books.length; i++) {
      array.push({ id: books[i].id, name: books[i].name, publisher: books[i].publisher });
    }
    responseBody = h.response({
      status: 'success',
      data: {
        books: array,
      },
    });
    return responseBody;
  }
  if (books.length > 0 && !name && !reading && !finished) {
    const array = [];
    for (let i = 0; i < books.length; i++) {
      array.push({ id: books[i].id, name: books[i].name, publisher: books[i].publisher });
    }
    responseBody = h.response({
      status: 'success',
      data: {
        books: array,
      },
    });
    return responseBody;
  }
  responseBody = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  return responseBody;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);

  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);

      return response;
    }

    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);

      return response;
    }

    const finished = pageCount === readPage;

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((note) => note.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
