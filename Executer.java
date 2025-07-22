package Liberary_Book_Tracker;

import java.util.Scanner;

public class Executer {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Library lib = new Library();

        while (true) {
            System.out.println("\n***Library Menu***");
            System.out.println("1. Show books");
            System.out.println("2. Return books");
            System.out.println("3. Borrow book");
            System.out.println("4. Add book");
            System.out.println("5. Show borrowed books");
            System.out.println("6. Search book");
            System.out.println("7. Delete book");
            System.out.println("8. Exit");

            System.out.print("Enter your choice: ");
            int ch = sc.nextInt();
            sc.nextLine();

            switch (ch) {
                case 1:
                    lib.displayBooks();
                    break;
                case 2:
                    lib.showBorrowBook();
                    System.out.print("Which book you are returning? Enter index: ");
                    int ind = sc.nextInt();
                    lib.returnBook(ind);
                    break;
                case 3:
                    lib.displayBooks();
                    System.out.print("Enter the index of the book you want to borrow: ");
                    int ind2 = sc.nextInt();
                    if (lib.borrowBook(ind2)) {
                        System.out.println("Book will be issued");
                    } else {
                        System.out.println("Book can't be issued");
                    }
                    break;
                case 4:
                    System.out.print("Enter book name: ");
                    String name = sc.nextLine();
                    System.out.print("Enter author name: ");
                    String author = sc.nextLine();
                    lib.addBook(name, author);
                    break;
                case 5:
                    lib.showBorrowBook();
                    break;
                case 6:
                    System.out.print("Enter book name or author to search: ");
                    String keyword = sc.nextLine();
                    lib.searchBook(keyword);
                    break;
                case 7:
                    lib.displayBooks();
                    System.out.print("Enter the index of the book to delete: ");
                    int deleteIndex = sc.nextInt();
                    lib.deleteBook(deleteIndex);
                    break;
                case 8:
                    System.out.println("Exiting Library System. Goodbye!");
                    sc.close();
                    return;
                default:
                    System.out.println("Invalid choice. Try again.");
            }
        }
    }
}
