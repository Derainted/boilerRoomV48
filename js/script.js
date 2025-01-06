console.log('-------- News Js Loaded --------')

const apiKey = '66b0ea02e0394bec9136d7766a6fc09b';
const apiUrl = 'https://newsapi.org/v2/everything?';
const newsContainer = document.getElementById('container');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const loadingIndicator = document.getElementById('loading');

async function fetchNews(query = 'top-headlines') {
    try {
        // Loading indicator display
        loadingIndicator.style.display = 'block';

        const url = `${apiUrl}q=${query}&apiKey=${apiKey}`;
        const response = await fetch(url);

        if(!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key');
            } else if (response.status === 404) {
                throw new Error('API URL not found')
            } else {
                throw new Error(`Error: ${response.status}`);
            }
        }

        const data = await response.json();
        console.log(data);
        displayNews(data.articles)
    } 
    
    catch (error) {
        newsContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`
    } finally {
        // hides loading indicator
        loadingIndicator.style.display = 'none';
    }
}

function displayNews(articles) {
    newsContainer.innerHTML = ""; // clears previous news, start with clean slate

    if (articles.length === 0) {
        newsContainer.innerHTML = "<p class='error'>OOOPPS.. NO NEWS FOUND</p>";
        return;
    }

    articles.forEach((article) => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("article");

        const title = document.createElement("h3");
        title.textContent = article.title || "Title is missing";

        const description = document.createElement("p");
        description.textContent = article.description || "Description is missing";

        const author = document.createElement("p");
        author.textContent = article.author || "Author not available";

        const published = document.createElement("p");
        published.textContent =
            article.publishedAt || "Publication date not available";

        const image = document.createElement("img");
        image.src = article.urlToImage || "https://via.placeholder.com/273x182";

        const readMore = document.createElement("a");
        readMore.href = article.url;
        readMore.target = "_blank";
        readMore.textContent = "Read More";

        articleElement.appendChild(title);
        articleElement.appendChild(description);
        articleElement.appendChild(author);
        articleElement.appendChild(published);
        articleElement.appendChild(image);
        articleElement.appendChild(readMore);

        newsContainer.appendChild(articleElement);
    });
}

async function fetchMultipleCategories(categories) {
    try {
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        
        const requests = categories.map((category) => {
            const url = `${apiUrl}q=${category}&apiKey=${apiKey}`;
            return fetch(url)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch category: ${category}`);
                    }
                    return response.json();
                });
        });

        // wait for all the fetch request to resolve
        const results = await Promise.all(requests);
        const allArticles = results.flatMap((result) => result.articles);
        displayNews(allArticles);
    } 
    
    catch (error) {
        newsContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    } finally {
        // hide loading indicaqot
        loadingIndicator.style.display = 'none';
    }
}

// Handle category button click event
const categoryBtn = document.querySelectorAll(".category-button");
categoryBtn.forEach((button) => {
    button.addEventListener("click", (event) => {
        const category = event.target.getAttribute("data-category");
        fetchMultipleCategories([category]); // Fetch the selected category
    });
});

// Real-time updates every 30 seconds
setInterval(() => {
    const query = searchInput.value.trim() || "top-headlines";
    fetchNews(query);
}, 30000);

// Search functionality
searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchNews(query);
        searchInput.value = ""; // Clear the search input field after the search
    } else {
        alert("Search bar cannot be empty");
    }
});

// Handle Enter key press for search
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
            fetchNews(query);
            searchInput.value = ""; // Clear the search input field after the search
        } else {
            alert("Search bar cannot be empty");
        }
    }
});

// Initial fetch
fetchNews();