package Liberary_Book_Tracker;

public class Book {
    String name;
    String author;
    boolean isBorrowed;

    public Book(String name, String author) {
        this.name = name;
        this.author = author;
        this.isBorrowed = false;
    }

    public String getName() {
        return name;
    }

    public String getAuthor() {
        return author;
    }

    public boolean isBorrowed() {
        return isBorrowed;
    }

    public void borrow() {
        isBorrowed = true;
    }

    public void returnBook() {
        isBorrowed = false;
    }

    @Override
    public String toString() {
        return name + " by " + author + (isBorrowed ? " (Borrowed)" : " (Available)");
    }
}
