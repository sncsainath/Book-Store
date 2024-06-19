class BookModel {
    id: number;
    title: string;
    author?: string;
    description?: string;
    copies?: number;
    copiesAvailable?: number;
    category?: string;
    img?: string;

    constructor(
        id: number,
        title: string,
        author: string = "", // Default value for author
        description: string = "", // Default value for description
        copies: number = 0, // Default value for copies
        copiesAvailable: number = 0, // Default value for copiesAvailable
        category: string = "", // Default value for category
        img: string = "" // Default value for img
    ) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.description = description;
        this.copies = copies;
        this.copiesAvailable = copiesAvailable;
        this.category = category;
        this.img = img;
    }
}

export default BookModel;
