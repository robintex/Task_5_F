const languageSelector = document.getElementById("language");
const seedInput = document.getElementById("seed");
const generateSeedButton = document.getElementById("generate-seed");
const submitButton = document.getElementById("submit");
const likesSlider = document.getElementById("likes");
const likesValue = document.getElementById("likes-value");
const reviewsInput = document.getElementById("reviews");
const booksTableBody = document.getElementById("books-tbody");
const loadingIndicator = document.getElementById("loading");

let currentPage = 1;
let isLoading = false;

// Update likes display value
likesSlider.addEventListener("input", () => {
    likesValue.textContent = likesSlider.value;
});

// Generate a random seed and reset
generateSeedButton.addEventListener("click", () => {
    const randomSeed = Math.floor(Math.random() * 100000);
    seedInput.value = randomSeed;
    
});

// Handle the Submit button click
submitButton.addEventListener("click", () => {
    resetAndFetchBooks();
});

// Reset and fetch books
const resetAndFetchBooks = () => {
    currentPage = 1;
    booksTableBody.innerHTML = "";
    fetchBooks();
};

// Fetch books from API
const fetchBooks = async () => {
    if (isLoading) return;
    isLoading = true;
    loadingIndicator.style.display = "block";

    const seed = seedInput.value;
    const language = languageSelector.value;
    const likes = likesSlider.value;
    const reviews = reviewsInput.value;

    try {
        const response = await fetch(
            `/api/books?seed=${seed}&page=${currentPage}&language=${language}&likes=${likes}&reviews=${reviews}`
        );
        if (!response.ok) throw new Error("Failed to fetch books.");

        const books = await response.json();
        renderBooks(books);
        currentPage++;
    } catch (error) {
        console.error("Error fetching books:", error);
    } finally {
        isLoading = false;
        loadingIndicator.style.display = "none";
    }
};

// Render books to the table with a dropdown for details
const renderBooks = (books) => {
    books.forEach((book) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.index}</td>
            <td>${book.isbn}</td>
            <td>${book.title}</td>
            <td>${book.authors}</td>
            <td>${book.publisher}</td>
            <td><button class="toggle-details">Show</button></td>
        `;

        // Add hidden details row
        const detailsRow = document.createElement("tr");
        detailsRow.classList.add("details-row");
        detailsRow.style.display = "none";
        detailsRow.style.padding = "30px";
        detailsRow.style.paddingLeft = "20rem";
        detailsRow.innerHTML = `
            <td colspan="6">
                <strong>Title : ${book.title}</strong></br>
                <strong>Author : ${book.authors}</strong></br>
                <strong>Publisher : ${book.publisher}</strong></br>
                <strong>Likes:</strong> ${book.likes} | <strong>Reviews:</strong> ${book.reviews}
            </td>
        `;

        // Attach event listener for toggle
        row.querySelector(".toggle-details").addEventListener("click", (e) => {
            if (detailsRow.style.display === "none") {
                detailsRow.style.display = "table-row";
                e.target.textContent = "Hide";
            } else {
                detailsRow.style.display = "none";
                e.target.textContent = "Show";
            }
        });

        booksTableBody.appendChild(row);
        booksTableBody.appendChild(detailsRow);
    });
};

// Infinite scrolling
window.addEventListener("scroll", () => {
    if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 50
    ) {
        fetchBooks();
    }
});

// Initial fetch
resetAndFetchBooks();
