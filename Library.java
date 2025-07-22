package Liberary_Book_Tracker;

import java.util.ArrayList;

public class Library {
    ArrayList<Book> books;

    public Library() {
        books = new ArrayList<>();
        books.add(new Book("Harry Potter", "J.K. Rowling"));
        books.add(new Book("The Hobbit", "J.R.R. Tolkien"));
        books.add(new Book("1984", "George Orwell"));
    }

    public void addBook(String name, String author) {
        books.add(new Book(name, author));
        System.out.println("Book added successfully!");
    }

    public void displayBooks() {
        System.out.println("\nAvailable Books:");
        for (int i = 0; i < books.size(); i++) {
            System.out.println(i + ". " + books.get(i));
        }
    }

    public void showBorrowBook() {
        System.out.println("\nBorrowed Books:");
        for (int i = 0; i < books.size(); i++) {
            if (books.get(i).isBorrowed()) {
                System.out.println(i + ". " + books.get(i));
            }
        }
    }

    public void returnBook(int index) {
        if (index >= 0 && index < books.size() && books.get(index).isBorrowed()) {
            books.get(index).returnBook();
            System.out.println("Book returned successfully!");
        } else {
            System.out.println("Invalid book index or book is not borrowed.");
        }
    }

    public boolean borrowBook(int index) {
        if (index >= 0 && index < books.size() && !books.get(index).isBorrowed()) {
            books.get(index).borrow();
            return true;
        }
        return false;
    }

    public void searchBook(String keyword) {
        System.out.println("\nSearch Results for \"" + keyword + "\":");
        boolean found = false;
        for (int i = 0; i < books.size(); i++) {
            Book b = books.get(i);
            if (b.getName().toLowerCase().contains(keyword.toLowerCase()) ||
                b.getAuthor().toLowerCase().contains(keyword.toLowerCase())) {
                System.out.println(i + ". " + b);
                found = true;
            }
        }
        if (!found) {
            System.out.println("No books found matching your search.");
        }
    }

    public void deleteBook(int index) {
        if (index >= 0 && index < books.size()) {
            System.out.println("Deleted: " + books.get(index));
            books.remove(index);
        } else {
            System.out.println("Invalid book index.");
        }
    }
}
