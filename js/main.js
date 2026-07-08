// click Cards Badges active State
$(function () {

    $(".tab-btn").click(function () {

        $(".tab-btn").removeClass("active");

        $(this).addClass("active");

    });

});

let activeCategory = null;
let pendingCategory = null;

function updateFilterCount() {

    const $badge = $(".filter-count");

    if (activeCategory) {
        $badge.text("1").show();
    } else {
        $badge.hide();
    }

}

$(function () {

    updateFilterCount();

    $("#filterModal").on("show.bs.modal", function () {

        pendingCategory = activeCategory;

        $("#filterModal .chip").removeClass("active");

        const selector = activeCategory
            ? `#filterModal .chip[data-category="${activeCategory}"]`
            : `#filterModal .chip[data-category=""]`;

        $(selector).addClass("active");

    });

    $("#filterModal .chip").on("click", function () {

        $("#filterModal .chip").removeClass("active");

        $(this).addClass("active");

        pendingCategory = $(this).data("category") || null;

    });

    $(".btn-apply").on("click", function () {

        activeCategory = pendingCategory;
        currentPage = 1;

        updateFilterCount();
        renderCardsWithLoading();

        bootstrap.Modal.getInstance(document.getElementById("filterModal")).hide();

    });

    $("#clearFilters").click(function (e) {

        e.preventDefault();

        activeCategory = null;
        pendingCategory = null;

        $("#filterModal .chip").removeClass("active");
        $(`#filterModal .chip[data-category=""]`).addClass("active");

        updateFilterCount();
        currentPage = 1;
        renderCardsWithLoading();

        bootstrap.Modal.getInstance(document.getElementById("filterModal")).hide();

    });

});



// grid / list toggle

let currentView = "list";
let currentPage = 1;
const ITEMS_PER_PAGE = 10;

$(function () {

    $(".view-btn").click(function () {

        $(".view-btn").removeClass("active");

        $(this).addClass("active");

        currentView = $(this).data("view");

        currentPage = 1;

        renderCardsWithLoading();

    });

});

/* data */

const tagIcons = {
    "National Parks": "bi-tree",
    "Restaurant": "bi-cup-hot",
    "Local Parks": "bi-tree",
    "Wildlife Areas": "bi-bug",
    "Hiking Trails": "bi-signpost-2",
};

let destinations = [];
window.destinations = destinations;

function mapDestinationData(spots) {
        return spots.map((spot, i) => ({
                id: i + 1,
                title: spot.title,
                category: spot.category,
                address: spot.location,
                description: spot.description,
                price: spot.price,
                rating: spot.rating,
                reviews: `${Math.floor(Math.random() * 491) + 10}`,
                phone: `(${200 + (i * 11) % 700}) 555-${String(1000 + (i * 37) % 9000).slice(0, 4)}`,
                email: `info@${spot.title.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`,
                website: `www.${spot.title.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`,
                image: spot.images[0],
                gallery: spot.images,
                tags: spot.tags || [],
                lat: spot.lat,
                lng: spot.lng
        }));
}

window.destinationsReady = fetch("/js/data.json")
        .then(response => {
                if (!response.ok) {
                        throw new Error(`Failed to load data.json (${response.status})`);
                }

                return response.json();
        })
        .then(spots => {
                destinations = mapDestinationData(spots);
                window.destinations = destinations;
                return destinations;
        })
        .catch(error => {
                console.error(error);
                destinations = [];
                window.destinations = destinations;
                return destinations;
        });

/* render */

function cardHTML(place) {

    const tagsHTML = place.tags.map(t =>
        `<span><i class="bi ${tagIcons[t] || 'bi-geo'}"></i>${t}</span>`
    ).join("");

    return `
    <div class="destination-card" data-id="${place.id}">
        <div class="card-image">
            <img src="${place.image}" alt="${place.title}">
        </div>
        <div class="card-content">
            <div class="card-title-row">
                <h3>${place.title}</h3>
                <div class="rating">
                    <i class="bi bi-star-fill"></i>
                    ${place.rating} <small>(${place.reviews})</small>
                </div>
            </div>
            <div class="card-location">
                <i class="bi bi-geo-alt"></i>
                ${place.address}
            </div>
            <p>${place.description}</p>
            <div class="card-tags">${tagsHTML}</div>
            <div class="card-footer">
                <div class="price-from">
                    <small>From</small>
                    <span class="price">$${place.price}.00</span>
                </div>
                <button class="request-btn">
                    <span class="radio-dot"></span>
                    Request Info
                </button>
            </div>
        </div>
    </div>`;
}

let searchQuery = "";

function getFilteredDestinations() {

    return destinations.filter((d) => {

        const matchesCategory = !activeCategory
            || (d.category || "").toLowerCase() === activeCategory.toLowerCase()
            || (d.tags || []).some(t => t.toLowerCase() === activeCategory.toLowerCase());

        const matchesSearch = !searchQuery
            || d.title.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;

    });

}

function currentPageItems() {
    const filtered = getFilteredDestinations();
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
}

function emptyStateHTML() {

    return `
    <div class="empty-state">
        <i class="bi bi-search"></i>
        <h5>No results found</h5>
        <p>Try a different category or search term.</p>
    </div>`;

}

function loadingSkeletonHTML() {

    return Array.from({ length: 4 }).map(() => `
    <div class="destination-card skeleton-card">
        <div class="card-image skeleton-block"></div>
        <div class="card-content">
            <div class="skeleton-line skeleton-line-title"></div>
            <div class="skeleton-line skeleton-line-sm"></div>
            <div class="skeleton-line"></div>
        </div>
    </div>`).join("");

}

function renderCards() {

    const filtered = getFilteredDestinations();
    const items = currentPageItems();

    if (filtered.length === 0) {

        $("#resultsContainer")
            .removeClass("results-grid")
            .addClass("results-list")
            .html(emptyStateHTML());

        $("#resultCount").text(0);

        renderPagination();
        renderMapMarkers([]);

        return;

    }

    $("#resultsContainer")
        .removeClass("results-list results-grid")
        .addClass(currentView === "grid" ? "results-grid" : "results-list")
        .html(items.map(place => cardHTML(place)).join(""));

    $("#resultCount").text(filtered.length);

    renderPagination();
    renderMapMarkers(items);
}

function showLoadingState() {

    $("#resultsContainer")
        .removeClass("results-grid")
        .addClass("results-list")
        .html(loadingSkeletonHTML());

}

function renderCardsWithLoading() {

    showLoadingState();

    setTimeout(renderCards, 350);

}

let destinationAppStarted = false;

function startDestinationApp() {

    if (destinationAppStarted || !destinations.length || !$("#resultsContainer").length) {
        return;
    }

    destinationAppStarted = true;
    updateFilterCount();
    renderCardsWithLoading();

}

$(function () {

    window.destinationsReady.then(startDestinationApp);

});

/* pagination */

function renderPagination() {

    const totalPages = Math.ceil(getFilteredDestinations().length / ITEMS_PER_PAGE);
    const $pagination = $("#pagination");

    if (totalPages <= 1) {
        $pagination.empty();
        return;
    }

    let html = `<button class="page-btn ${currentPage === 1 ? "disabled" : ""}" data-page="${currentPage - 1}">
        <i class="bi bi-chevron-left"></i>
    </button>`;

    const pages = [];
    pages.push(1);
    for (let p = currentPage - 1; p <= currentPage + 1; p++) {
        if (p > 1 && p < totalPages) pages.push(p);
    }
    pages.push(totalPages);

    const uniquePages = [...new Set(pages)].sort((a, b) => a - b);

    let prev = 0;
    uniquePages.forEach(p => {
        if (p - prev > 1) {
            html += `<span class="page-dots">...</span>`;
        }
        html += `<button class="page-btn ${p === currentPage ? "active" : ""}" data-page="${p}">${p}</button>`;
        prev = p;
    });

    html += `<button class="page-btn ${currentPage === totalPages ? "disabled" : ""}" data-page="${currentPage + 1}">
        <i class="bi bi-chevron-right"></i>
    </button>`;

    $pagination.html(html);
}

$(document).on("click", ".page-btn:not(.disabled)", function () {

    currentPage = parseInt($(this).data("page"));

    renderCards();

    $('html, body').animate({
        scrollTop: $("#resultsContainer").offset().top - 130
    }, 300);

});


/* detail modal of things to do page */

function openDetailModal(place) {

    const gallery = place.gallery;

    $("#detailGallery").html(`
        <div class="gallery-main"><img src="${gallery[0]}" alt="${place.title}"></div>
        <div class="gallery-sub"><img src="${gallery[1]}" alt="${place.title}"></div>
        <div class="gallery-sub"><img src="${gallery[2] || gallery[0]}" alt="${place.title}"></div>
    `);

    $("#detailTitle").text(place.title);
    $("#detailRating").html(`
        <i class="bi bi-star-fill"></i>
        ${place.rating} <small>(${place.reviews} reviews)</small>
    `);
    $("#detailDescription").text(place.description);
    $("#detailPrice").text(`$${place.price}.00`);
    $("#detailAddress").text(place.address);
    $("#detailPhone").text(place.phone);
    $("#detailEmail").text(place.email);
    $("#detailWebsite").text(place.website).attr("href", `https://${place.website}`);
    $("#detailFullLink").attr("href", `/pages/destination-detail.html?id=${place.id}`);

    bootstrap.Modal.getOrCreateInstance(document.getElementById("detailModal")).show();
}

$(document).on("click", ".destination-card", function () {

    const id = parseInt($(this).data("id"));
    const place = destinations.find(d => d.id === id);

    if (place) openDetailModal(place);

});

let searchDebounceTimer = null;

$(document).on("input", "#titleSearchInput", function () {

    const value = $(this).val();

    clearTimeout(searchDebounceTimer);

    searchDebounceTimer = setTimeout(() => {

        searchQuery = value.trim();
        currentPage = 1;
        renderCardsWithLoading();

    }, 250);

});

/* homepage search suggestions */

function searchSuggestionHTML(place) {

    return `
    <div class="search-suggestion-item" data-id="${place.id}">
        <i class="bi bi-geo-alt-fill"></i>
        <div>
            <div class="search-suggestion-title">${place.title}</div>
            <div class="search-suggestion-location">${place.address}</div>
        </div>
    </div>`;

}

let homeSearchDebounceTimer = null;

$(document).on("input", "#homeSearchInput", function () {

    const value = $(this).val().trim();
    const $suggestions = $("#homeSearchSuggestions");

    clearTimeout(homeSearchDebounceTimer);

    if (!value) {
        $suggestions.removeClass("show").empty();
        return;
    }

    homeSearchDebounceTimer = setTimeout(() => {

        const query = value.toLowerCase();

        const matches = destinations.filter(d =>
            d.title.toLowerCase().includes(query) || d.address.toLowerCase().includes(query)
        ).slice(0, 6);

        const viewAllHTML = `
            <a class="search-suggestion-viewall" href="/pages/things-to-do.html?q=${encodeURIComponent(value)}">
                View all in Things to do
                <i class="bi bi-arrow-right"></i>
            </a>`;

        if (matches.length === 0) {
            $suggestions.addClass("show").html(`<div class="search-suggestion-empty">No matching places found</div>` + viewAllHTML);
        } else {
            $suggestions.addClass("show").html(matches.map(searchSuggestionHTML).join("") + viewAllHTML);
        }

    }, 200);

});

$(document).on("click", ".search-suggestion-item", function () {

    const id = parseInt($(this).data("id"));
    window.location.href = `/pages/destination-detail.html?id=${id}`;

});

$(document).on("keydown", "#homeSearchInput", function (e) {

    if (e.key === "Escape") {
        $("#homeSearchSuggestions").removeClass("show").empty();
    }

});

$(document).on("click", function (e) {

    if (!$(e.target).closest("#homeSearchInput, #homeSearchSuggestions").length) {
        $("#homeSearchSuggestions").removeClass("show").empty();
    }

});

/* pre-fill title search on things-to-do page from ?q= (e.g. homepage "View all" link) */

(function () {

    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const $titleSearchInput = $("#titleSearchInput");

    if (q && $titleSearchInput.length) {
        $titleSearchInput.val(q);
        searchQuery = q.trim();
    }

})();