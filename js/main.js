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

        renderCards();

    });

});

/* data */

const tagIcons = {
    "National Parks": "bi-tree",
    "Restaurant": "bi-cup-hot",
};


const allTags = Object.keys(tagIcons);


const spots = [
  {
    "id": 1,
    "title": "Sunset Kayak Tour",
    "category": "Outdoor",
    "location": "Lake Tahoe, CA",
    "price": 65,
    "rating": 4.8,
    "state": "NJ", "lat": 39.36, "lng": -74.42,
    "description": "Paddle across calm waters as the sun sets behind the mountains. Includes gear, a certified guide, and light refreshments. Suitable for beginners.",
    "images": [
      "https://picsum.photos/id/1018/800/500",
      "https://picsum.photos/id/1015/800/500",
      "https://picsum.photos/id/1019/800/500",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&q=80",
  
    ]
  },
  {
    "id": 2,
    "title": "Old Town Food Walk",
    "category": "Food & Drink",
    "location": "Savannah, GA",
    "price": 49,
    "rating": 4.9,
    "state": "FL", "lat": 24.56, "lng": -81.78,
    "description": "A guided 3-hour tasting tour through historic streets. Six stops, local specialties, and stories from a longtime resident guide.",
    "images": [
      "https://picsum.photos/id/292/800/500",
      "https://picsum.photos/id/431/800/500",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&q=80",
  
    ]
  },
  {
    "id": 3,
    "title": "Family Wildlife Safari",
    "category": "Family",
    "location": "San Diego, CA",
    "price": 38,
    "rating": 4.6,
    "state": "NC", "lat": 35.6, "lng": -82.55,
    "description": "An open-air ride through a 1,800-acre wildlife park. Great for kids, with up-close animal viewing and an onboard naturalist.",
    "images": [
      "https://picsum.photos/id/237/800/500",
      "https://picsum.photos/id/433/800/500",
      "https://picsum.photos/id/169/800/500",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&q=80",
  
    ]
  },
  {
    "id": 4,
    "title": "Historic City Bus Tour",
    "category": "Tours",
    "location": "Boston, MA",
    "price": 30,
    "rating": 4.3,
    "state": "CA", "lat": 39.09, "lng": -120.03,
    "description": "Hop-on hop-off tour covering 18 landmarks with live commentary. Tickets valid all day across all stops.",
    "images": [
      "https://picsum.photos/id/164/800/500",
      "https://picsum.photos/id/180/800/500",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&q=80",
  
    ]
  },
  {
    "id": 5,
    "title": "Mountain Sunrise Hike",
    "category": "Outdoor",
    "location": "Boulder, CO",
    "price": 25,
    "rating": 4.7,
    "state": "AZ", "lat": 34.87, "lng": -111.76,
    "description": "A guided early-morning hike to a scenic ridge. Moderate difficulty, about 4 miles round trip. Coffee included at the summit.",
    "images": [
      "https://picsum.photos/id/1036/800/500",
      "https://picsum.photos/id/1037/800/500",
      "https://picsum.photos/id/1039/800/500",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&q=80",
  
    ]
  },
  {
    "id": 6,
    "title": "Craft Brewery Tasting",
    "category": "Food & Drink",
    "location": "Portland, OR",
    "price": 55,
    "rating": 4.5,
    "state": "SC", "lat": 32.78, "lng": -79.93,
    "description": "Sample flights from four award-winning local breweries with a guide who knows the scene. Includes transport between locations.",
    "images": [
      "https://picsum.photos/id/225/800/500",
      "https://picsum.photos/id/431/800/500",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&q=80",
  
    ]
  }
]

// map all destination 
const destinations = spots.map((spot, i) => ({
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
    tags: allTags,
    lat: spot.lat,
    lng: spot.lng
}));

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
            || (d.category || "").toLowerCase() === activeCategory.toLowerCase();

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

function renderCards() {

    const items = currentPageItems();

    $("#resultsContainer")
        .removeClass("results-list results-grid")
        .addClass(currentView === "grid" ? "results-grid" : "results-list")
        .html(items.map(place => cardHTML(place)).join(""));

    $("#resultCount").text(destinations.length);

    renderPagination();
    renderMapMarkers(items);
}

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

    new bootstrap.Modal(document.getElementById("detailModal")).show();
}

$(document).on("click", ".destination-card", function () {

    const id = parseInt($(this).data("id"));
    const place = destinations.find(d => d.id === id);

    if (place) openDetailModal(place);

});