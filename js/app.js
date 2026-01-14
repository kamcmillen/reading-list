const API = "https://www.googleapis.com/books/v1/volumes?q=";

function getBooks() {
  return JSON.parse(localStorage.getItem("books") || "{}");
}

function saveBooks(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

async function fetchBookData(query) {
  const res = await fetch(API + encodeURIComponent(query));
  const data = await res.json();
  return data.items ? data.items[0].volumeInfo : null;
}

/* ADMIN PAGE */
async function addBook() {
  const grade = document.getElementById("grade").value;
  const title = document.getElementById("title").value;
  const isbn = document.getElementById("isbn").value;

  const query = isbn ? `isbn:${isbn}` : title;
  const bookData = await fetchBookData(query);

  if (!bookData) {
    alert("Book not found.");
    return;
  }

  const books = getBooks();
  if (!books[grade]) books[grade] = [];

  books[grade].push(bookData);
  saveBooks(books);

  alert("Book added!");
  document.getElementById("bookForm").reset();
}

/* GRADE PAGES */
function loadGrade(grade) {
  const books = getBooks()[grade] || [];
  const container = document.getElementById("bookList");

  books.forEach(book => {
    const div = document.createElement("div");
    div.className = "book";

    const cover = book.imageLinks?.thumbnail || "";
    const rating = book.averageRating || "N/A";

    div.innerHTML = `
      <img src="${cover}">
      <h3>${book.title}</h3>
      <p><strong>${book.authors?.join(", ") || ""}</strong></p>
      <p>⭐ ${rating}</p>
      <p>${book.description?.slice(0, 250) || ""}...</p>
      <a target="_blank" href="https://www.goodreads.com/search?q=${encodeURIComponent(book.title)}">
        View on Goodreads
      </a>
    `;

    container.appendChild(div);
  });
}
