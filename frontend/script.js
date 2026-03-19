/**
 * Library Book Tracker Core Logic
 * Replicates the Java backend logic in JavaScript utilizing LocalStorage.
 */

// --- MODEL ---
class Book {
    constructor(name, author, isBorrowed = false, id = Date.now().toString()) {
        this.name = name;
        this.author = author;
        this.isBorrowed = isBorrowed;
        this.id = id;
    }
}

// --- STATE MANAGEMENT ---
class LibraryManager {
    constructor() {
        this.books = [];
        this.loadBooks();
    }

    loadBooks() {
        const storedBooks = localStorage.getItem('library_books');
        if (storedBooks) {
            const parsed = JSON.parse(storedBooks);
            this.books = parsed.map(b => new Book(b.name, b.author, b.isBorrowed, b.id));
        } else {
            // Initial Seed Data (like the Java app)
            this.books = [
                new Book("Harry Potter", "J.K. Rowling", false, "1"),
                new Book("The Hobbit", "J.R.R. Tolkien", false, "2"),
                new Book("1984", "George Orwell", false, "3")
            ];
            this.saveBooks();
        }
    }

    saveBooks() {
        localStorage.setItem('library_books', JSON.stringify(this.books));
        this.updateStats();
    }

    addBook(name, author) {
        const newBook = new Book(name, author);
        this.books.push(newBook);
        this.saveBooks();
        return newBook;
    }

    deleteBook(id) {
        this.books = this.books.filter(b => b.id !== id);
        this.saveBooks();
    }

    borrowBook(id) {
        const book = this.books.find(b => b.id === id);
        if (book && !book.isBorrowed) {
            book.isBorrowed = true;
            this.saveBooks();
            return true;
        }
        return false;
    }

    returnBook(id) {
        const book = this.books.find(b => b.id === id);
        if (book && book.isBorrowed) {
            book.isBorrowed = false;
            this.saveBooks();
            return true;
        }
        return false;
    }

    searchBooks(query) {
        const lowerQuery = query.toLowerCase();
        return this.books.filter(b => 
            b.name.toLowerCase().includes(lowerQuery) || 
            b.author.toLowerCase().includes(lowerQuery)
        );
    }

    getBooksByFilter(filterType) {
        if (filterType === 'available') return this.books.filter(b => !b.isBorrowed);
        if (filterType === 'borrowed') return this.books.filter(b => b.isBorrowed);
        return this.books; // 'all'
    }

    updateStats() {
        const totalElem = document.getElementById('total-books-count');
        const borrowedElem = document.getElementById('borrowed-books-count');
        
        if (totalElem && borrowedElem) {
            totalElem.textContent = this.books.length;
            borrowedElem.textContent = this.books.filter(b => b.isBorrowed).length;
        }
    }
}

// --- DOM INTERACTION & UI CONTROLLER ---
document.addEventListener('DOMContentLoaded', () => {
    const library = new LibraryManager();
    let currentFilter = 'all';
    let currentSearch = '';

    // Elements
    const views = {
        dashboard: document.getElementById('dashboard-view'),
        'add-book': document.getElementById('add-book-view')
    };
    const navItems = document.querySelectorAll('.nav-item');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    
    const booksGrid = document.getElementById('books-grid');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const addBookForm = document.getElementById('add-book-form');
    const toastContainer = document.getElementById('toast-container');

    // Init
    library.updateStats();
    renderBooks();

    // -- VIEW SWITCHING --
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetView = item.dataset.view;
            
            // Update active state on nav
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Toggle views
            Object.keys(views).forEach(key => {
                if(key === targetView) {
                    views[key].classList.remove('hidden');
                } else {
                    views[key].classList.add('hidden');
                }
            });

            // Update Header
            if(targetView === 'dashboard') {
                pageTitle.textContent = 'Dashboard';
                pageSubtitle.textContent = 'Manage your entire book collection';
                document.querySelector('.search-container').style.display = 'flex';
                renderBooks();
            } else if (targetView === 'add-book') {
                pageTitle.textContent = 'Add Book';
                pageSubtitle.textContent = 'Expand your library collection';
                document.querySelector('.search-container').style.display = 'none';
            }
        });
    });

    // -- ADD BOOK FORM --
    addBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('book-title');
        const authorInput = document.getElementById('book-author');
        
        library.addBook(titleInput.value.trim(), authorInput.value.trim());
        
        showToast(`Added "${titleInput.value}" to library!`, 'success');
        
        // Reset form and go back to dashboard
        addBookForm.reset();
        navItems[0].click(); // Click dashboard nav
    });

    // -- SEARCH & FILTER --
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderBooks();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderBooks();
        });
    });

    // -- RENDER ENGINE --
    function renderBooks() {
        booksGrid.innerHTML = '';
        
        // First filter by availability
        let filteredBooks = library.getBooksByFilter(currentFilter);
        
        // Then filter by search query
        if (currentSearch.trim() !== '') {
            const lowerQuery = currentSearch.toLowerCase();
            filteredBooks = filteredBooks.filter(b => 
                b.name.toLowerCase().includes(lowerQuery) || 
                b.author.toLowerCase().includes(lowerQuery)
            );
        }

        if (filteredBooks.length === 0) {
            emptyState.classList.remove('hidden');
            booksGrid.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            booksGrid.classList.remove('hidden');
            
            filteredBooks.forEach(book => {
                const bookEl = document.createElement('div');
                bookEl.className = `book-card ${book.isBorrowed ? 'borrowed' : ''}`;
                
                const statusHtml = book.isBorrowed 
                    ? `<span class="book-status status-borrowed">Borrowed</span>`
                    : `<span class="book-status status-available">Available</span>`;
                
                const actionsHtml = book.isBorrowed
                    ? `<button class="action-btn btn-return" onclick="window.returnItem('${book.id}')">↩️ Return</button>`
                    : `<button class="action-btn btn-borrow" onclick="window.borrowItem('${book.id}')">📚 Borrow</button>`;

                bookEl.innerHTML = `
                    <div class="book-card-header">
                        <div class="book-icon">${getIconForTitle(book.name)}</div>
                        <button class="delete-btn" onclick="window.deleteItem('${book.id}')" title="Delete Book">🗑️</button>
                    </div>
                    ${statusHtml}
                    <div class="book-info">
                        <h3>${book.name}</h3>
                        <p>by ${book.author}</p>
                    </div>
                    <div class="book-actions">
                        ${actionsHtml}
                    </div>
                `;
                booksGrid.appendChild(bookEl);
            });
        }
    }

    // -- GLOBAL ACTIONS --
    // We attach these to window so inline onclick handlers can reach them
    window.borrowItem = (id) => {
        if(library.borrowBook(id)) {
            showToast('Book borrowed successfully!', 'success');
            renderBooks();
        }
    };

    window.returnItem = (id) => {
        if(library.returnBook(id)) {
            showToast('Book returned to library.', 'success');
            renderBooks();
        }
    };

    window.deleteItem = (id) => {
        if(confirm('Are you sure you want to delete this book?')) {
            library.deleteBook(id);
            showToast('Book removed from library.', 'success');
            renderBooks();
        }
    };

    // Helper: Generate a random emoji or icon based on book title length
    function getIconForTitle(title) {
        const icons = ['📘', '📕', '📗', '📙', '📖', '📚', '📓', '📒'];
        const index = title.length % icons.length;
        return icons[index];
    }

    // Toast Notification System
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '✅' : '❌';
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        
        toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after 3s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});
