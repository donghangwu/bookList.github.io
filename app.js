//BOOK class: Represent a book
class Book{

    constructor(title,author,isbn)
    {
        this.title = title;
        this.author = author;
        this.isbn = isbn;

    }

}
//UI class: handle UIs
class UI{
    static displayBooks()
    {
        const bookStorage =Storage.getbooks();
        console.log(bookStorage);
        const books = bookStorage;
        books.forEach((element) => {
            UI.addBook(element);
        });
       
        
    }
    //add HTML element to the book table
    static  addBook(book)
    {
        const list = document.querySelector('.book-list')
        const row = document.createElement('tr');
        row.innerHTML=`
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a  class ="btn btn-danger delete">X</a> </td>

        `;
        list.appendChild(row);
    }

    static removeBook(target_element)
    {
        if(target_element.classList.contains('delete'))
        {
            // we want to remove parent's parent of the delete button
            target_element.parentElement.parentElement.remove();
        }
    }

    static warning(message,className)
    {
        const div = document.createElement('div');
        div.className=`alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('.book-form');
        container.insertBefore(div,form)
        //disappear after 3 seconds
        setTimeout(this.removeWarning,3000);
    }
    
    static removeWarning()
    {
        document.querySelector(".alert").remove()       
    }

    


}
//Store class: handle storeage
class Storage{
    static getbooks()
    {
        let books;
        if(localStorage.getItem('books')===null)
        {
            books=[];

        }
        else{
            books=JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addbook(book)
    {
        let books = Storage.getbooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));

    }

    static removebook(isbn)
    {
        const books=Storage.getbooks();
        books.forEach((book,index) => {
            if(book.isbn==isbn)
            {
                books.splice(index,1);
            }        
        });
    
        localStorage.setItem('books',JSON.stringify(books));
    }
}

//Event: Display Books
//this event will happens at the beginning of the web loaded
document.addEventListener('DOMContentLoaded',UI.displayBooks);

//Event: Add a Book
//this event will happens when the submit butoon being clicked
document.querySelector('.book-form').addEventListener('submit',(e)=>
{
    //Prevent actual submitting the page
    e.preventDefault();
    // get the value from the input box
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    if(title===''|| author===''||isbn==='')
    {
       UI.warning('please fill in all fields','danger');
    }
    else
    {
        UI.warning('Book Added','primary');
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';
        //create book instance
        const book = new Book(title,author,isbn);
        UI.addBook(book);
        Storage.addbook(book);
    }


})

//Event: Remove a Book
document.querySelector('.book-list').addEventListener('click',(e)=>
{
    //remove book from UI
    UI.removeBook(e.target);
    UI.warning('Book Removed','info');
    //remove book from local stroage
    Storage.removebook(e.target.parentElement.previousElementSibling.innerHTML);
})