$(function () {

    $(".tab-btn").click(function () {

        $(".tab-btn").removeClass("active");

        $(this).addClass("active");

    });

});


$(function () {

    $(".chip").on("click", function () {

        $(this)
            .siblings()
            .removeClass("active");

        $(this)
            .addClass("active");

    });

    $("#clearFilters").click(function (e) {

        e.preventDefault();

        $(".chip").removeClass("active");

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

/*==================================================
DATA
==================================================*/

const tagIcons = {
    "National Parks": "bi-tree",
    "State Parks": "bi-tree-fill",
    "Local Parks": "bi-flower1",
    "Wildlife Areas": "bi-binoculars",
    "Nature Centre": "bi-flower2",
    "Botanical Gardens": "bi-flower3",
    "Restaurant": "bi-cup-hot",
    "Hiking Trails": "bi-signpost-split"
};

const destinationImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=80",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=500&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&q=80",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500&q=80",
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=500&q=80",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&q=80",
    "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=500&q=80"
];

const allTags = Object.keys(tagIcons);

const spots = [
    { title: "Atlantic City Your Way", city: "Brigantine", state: "NJ", lat: 39.36, lng: -74.42 },
    { title: "Key West Sunshine Retreats", city: "Key West", state: "FL", lat: 24.56, lng: -81.78 },
    { title: "Grandma Hayes Grocery & Camp", city: "Asheville", state: "NC", lat: 35.6, lng: -82.55 },
    { title: "Lehrach's Lakeside Cabins", city: "Lake Tahoe", state: "CA", lat: 39.09, lng: -120.03 },
    { title: "Terra Amory Campground", city: "Sedona", state: "AZ", lat: 34.87, lng: -111.76 },
    { title: "Brookgrove Gardens Retreat", city: "Charleston", state: "SC", lat: 32.78, lng: -79.93 },
    { title: "Hilton Head Island Getaways", city: "Hilton Head", state: "SC", lat: 32.22, lng: -80.75 },
    { title: "Bay Grove Camping Resort", city: "Traverse City", state: "MI", lat: 44.76, lng: -85.62 },
    { title: "Cape Cod Coastal Retreats", city: "Cape Cod", state: "MA", lat: 41.68, lng: -70.24 },
    { title: "Lakeside Campground & Cabins", city: "Lake Placid", state: "NY", lat: 44.28, lng: -73.98 },
    { title: "Redwood Ridge Retreat", city: "Eureka", state: "CA", lat: 40.8, lng: -124.16 },
    { title: "Blue Ridge Mountain Lodge", city: "Asheville", state: "NC", lat: 35.59, lng: -82.55 },
    { title: "Yellowstone Trailhead Cabins", city: "West Yellowstone", state: "MT", lat: 44.66, lng: -111.1 },
    { title: "Desert Bloom RV Resort", city: "Sedona", state: "AZ", lat: 34.86, lng: -111.79 },
    { title: "Emerald Coast Beach Houses", city: "Destin", state: "FL", lat: 30.39, lng: -86.5 },
    { title: "Pine Hollow Family Campground", city: "Pocono", state: "PA", lat: 41.12, lng: -75.32 },
    { title: "Sunset Cliffs Getaway", city: "San Diego", state: "CA", lat: 32.72, lng: -117.16 },
    { title: "Smoky Mountain Trail Cabins", city: "Gatlinburg", state: "TN", lat: 35.71, lng: -83.51 },
    { title: "Silver Lake Family Resort", city: "Traverse City", state: "MI", lat: 44.77, lng: -85.65 },
    { title: "Great Basin Wilderness Camp", city: "Baker", state: "NV", lat: 38.92, lng: -114.2 },
    { title: "Coastal Pines RV Park", city: "Savannah", state: "GA", lat: 32.08, lng: -81.09 },
    { title: "Rocky Ridge Adventure Lodge", city: "Estes Park", state: "CO", lat: 40.38, lng: -105.52 },
    { title: "Whispering Pines Retreat", city: "Lake George", state: "NY", lat: 43.42, lng: -73.71 },
    { title: "Golden Valley Vineyard Stay", city: "Napa", state: "CA", lat: 38.3, lng: -122.29 },
    { title: "Maplewood Family Campground", city: "Burlington", state: "VT", lat: 44.48, lng: -73.21 },
    { title: "Ocean Breeze Coastal Cabins", city: "Outer Banks", state: "NC", lat: 35.58, lng: -75.47 },
    { title: "Canyon View RV Resort", city: "Moab", state: "UT", lat: 38.57, lng: -109.55 },
    { title: "Willow Creek Nature Retreat", city: "Jackson Hole", state: "WY", lat: 43.48, lng: -110.76 },
    { title: "Harbor Point Getaway", city: "Bar Harbor", state: "ME", lat: 44.39, lng: -68.2 },
    { title: "Sunrise Ridge Family Camp", city: "Flagstaff", state: "AZ", lat: 35.2, lng: -111.65 }
];

const destinations = spots.map((spot, i) => ({
    id: i + 1,
    title: spot.title,
    address: `PO Box ${300 + i}, ${spot.city}, ${spot.state}`,
    description: `${spot.title} helps you find the perfect ${spot.city} getaway, with trusted service and well-maintained vacation rentals since 1995. Choose from cozy cabins to full-size lodges.`,
    price: 100 + (i * 7) % 200,
    rating: (4.2 + (i % 6) * 0.1).toFixed(1),
    reviews: 80 + (i * 13) % 150,
    image: destinationImages[i % destinationImages.length],
    tags: [allTags[i % allTags.length], allTags[(i + 3) % allTags.length]],
    lat: spot.lat,
    lng: spot.lng
}));

/*==================================================
RENDER
==================================================*/

function cardHTML(place) {

    const tagsHTML = place.tags.map(t =>
        `<span><i class="bi ${tagIcons[t] || 'bi-geo'}"></i>${t}</span>`
    ).join("");

    return `
    <div class="destination-card">
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

function currentPageItems() {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return destinations.slice(start, start + ITEMS_PER_PAGE);
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

/*==================================================
PAGINATION
==================================================*/

function renderPagination() {

    const totalPages = Math.ceil(destinations.length / ITEMS_PER_PAGE);
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