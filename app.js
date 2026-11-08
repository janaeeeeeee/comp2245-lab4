const form = document.querySelector('form');
const subjectSelect = document.querySelector('#subject');
const status = document.querySelector('#status');
const tbody = document.querySelector('#results tbody');

async function loadSubjects() {
  try {
    const response = await fetch('subjects.php');
    if (!response.ok) {
      throw new Error('Request failed: ' + response.status);
    }
    const subjects = await response.json();
    for (const subject of subjects) {
      const option = document.createElement('option');
      option.value = subject.id;
      option.textContent = subject.name;
      subjectSelect.append(option);
    }
  } catch (error) {
    console.error(error);
  }
}

async function loadBooks() {
  const params = new URLSearchParams(new FormData(form));
  try {
    const response = await fetch(`books.php?${params}`);
    if (!response.ok) {
      throw new Error('Request failed: ' + response.status);
    }
    const books = await response.json();

    tbody.replaceChildren();
    for (const book of books) {
      const row = document.createElement('tr');
      const values = [
        book.title,
        book.author,
        book.year,
        book.subject,
        `${book.available} of ${book.copies}`,
      ];
      for (const value of values) {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.append(cell);
      }
      if (Number(book.available) === 0) {
        row.lastElementChild.classList.add('out');
      }
      tbody.append(row);
    }

    if (books.length === 0) {
      status.textContent = 'No books match your search.';
    } else if (books.length === 1) {
      status.textContent = '1 book found.';
    } else {
      status.textContent = `${books.length} books found.`;
    }
  } catch (error) {
    console.error(error);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  loadBooks();
});

loadSubjects();
loadBooks();