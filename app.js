const form = document.querySelector('form');
const subjectSelect = document.querySelector('#subject');
const availableBox = document.querySelector('#available');
const status = document.querySelector('#status');
const tbody = document.querySelector('#results tbody');
const button = form.querySelector('button');

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
  button.disabled = true;
  status.textContent = 'Searching…';
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
    tbody.replaceChildren();
    status.textContent = "Couldn't load the books. Please try again.";
  } finally {
    button.disabled = false;
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  loadBooks();
});
subjectSelect.addEventListener('change', loadBooks);
availableBox.addEventListener('change', loadBooks);

loadSubjects();
loadBooks();