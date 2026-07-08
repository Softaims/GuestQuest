$(function () {

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id")) || 1;
    const place = destinations.find(d => d.id === id) || destinations[0];

    /* gallery */

    const g = place.gallery;

    $("#pageGallery").html(`
        <div class="gallery-page-main" data-index="0">
            <img src="${g[0]}" alt="${place.title}">
        </div>
        <div class="gallery-page-sub" data-index="1">
            <img src="${g[1]}" alt="${place.title}">
        </div>
        <div class="gallery-page-sub" data-index="2">
            <img src="${g[2]}" alt="${place.title}">
        </div>
        <div class="gallery-page-sub" data-index="3">
            <img src="${g[3]}" alt="${place.title}">
        </div>
        <div class="gallery-page-sub gallery-more" data-index="4">
            <img src="${g[4]}" alt="${place.title}">
            <button class="see-all-btn">
                <i class="bi bi-grid-3x3-gap-fill"></i>
                See all Photos
            </button>
        </div>
    `);

    /* header */

    $("#pageRating").html(`
        <i class="bi bi-star-fill"></i>
        ${place.rating} <small>(${place.reviews})</small>
    `);

    $("#pageTitle").text(place.title);

    /* about section */

    $("#pageAbout1").text(place.description);
    $("#pageAbout2").text(
        `In the spirit of adventure and connection to nature, ${place.title} invites you to relax, unwind, and create memories that last a lifetime. Book your stay with a trusted, well-reviewed host today.`
    );

    $("#pageAddress").text(place.address);

    /* sidebar */

    $("#sideAddress").text(place.address);
    $("#sidePhone").text(place.phone);
    $("#sideTags").text(place.tags.join(" | "));

    /* facebook feed */

    const shortName = place.title.split(" ").slice(0, 3).join(" ");

    $("#fbPostImage").attr("src", g[2]);
    $("#fbAvatar, #fbAvatar2").attr("src", g[0]);
    $("#fbName, #fbName2").text(shortName);
    $("#fbDescription").text(place.description);
    $("#fbHandle").text(`${place.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`);
    $("#fbPhone").text(place.phone);
    $("#fbGraphic").attr("src", g[4]);

    /* nearby lists */

    const RENTAL_NAMES = ["Berger Realty", "Coastal Realty Group", "Harborview Rentals"];
    const HOTEL_NAMES = ["Seaside Grand Hotel", "Mountain View Inn", "Harbor Lights Hotel"];
    const destinationImages = destinations.map(d => d.image);

    const nearbyDestinations = destinations
        .filter(d => d.id !== place.id)
        .slice(0, 4);

    function mockList(names) {
        return names.map((name, i) => ({
            title: name,
            address: place.address,
            rating: (4.5 + i * 0.1).toFixed(1),
            reviews: 90 + i * 22,
            description: "Seaside Vacations helps you find the perfect North Myrtle Beach getaway, with trusted service and well-maintained vacation rentals since 1995. Choose from cozy cabins to full-size lodges.",
            image: destinationImages[(place.id + i * 3) % destinationImages.length],
            tags: []
        }));
    }

    const nearbyLists = {
        destinations: nearbyDestinations,
        rentals: mockList(RENTAL_NAMES),
        hotels: mockList(HOTEL_NAMES)
    };

    function compactCardHTML(item) {

        const tagsHTML = item.tags.length
            ? `<div class="cc-tags">${item.tags.map(t =>
                `<span><i class="bi ${tagIcons[t] || 'bi-geo'}"></i>${t}</span>`
              ).join("")}</div>`
            : "";

        return `
        <div class="compact-card">
            <div class="cc-image"><img src="${item.image}" alt="${item.title}"></div>
            <div class="cc-content">
                <div class="cc-title-row">
                    <h6>${item.title}</h6>
                    <div class="rating">
                        <i class="bi bi-star-fill"></i>
                        ${item.rating} <small>(${item.reviews})</small>
                    </div>
                </div>
                <div class="cc-location">
                    <i class="bi bi-geo-alt"></i>
                    ${item.address}
                </div>
                <p>${item.description}</p>
                ${tagsHTML}
            </div>
        </div>`;
    }

    function renderNearbyList(key, query) {

        const q = (query || "").trim().toLowerCase();
        const items = nearbyLists[key].filter(item =>
            !q || item.title.toLowerCase().includes(q) || item.address.toLowerCase().includes(q)
        );

        const html = items.length
            ? items.map(compactCardHTML).join("")
            : `<div class="compact-empty"><i class="bi bi-search"></i><p>No results found.</p></div>`;

        $(`#${key}List`).html(html);
    }

    ["destinations", "rentals", "hotels"].forEach(key => renderNearbyList(key));

    $(".nearby-search-btn").click(function () {
        const key = $(this).data("list");
        const query = $(`.nearby-search input[data-list="${key}"]`).val();
        renderNearbyList(key, query);
    });

    $(".nearby-search input").on("keyup", function (e) {
        if (e.key !== "Enter") return;
        const key = $(this).data("list");
        renderNearbyList(key, $(this).val());
    });

    /* tabs */

    $(".detail-tab").click(function () {

        $(".detail-tab").removeClass("active");
        $(this).addClass("active");

        const tab = $(this).data("tab");

        $(".detail-tab-panel").addClass("d-none");
        $(`.detail-tab-panel[data-panel="${tab}"]`).removeClass("d-none");

    });

    /* map */

    const map = L.map("pageMap", {
        zoomControl: false,
        scrollWheelZoom: false
    }).setView([place.lat, place.lng], 13);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { attribution: '© OpenStreetMap © CARTO', maxZoom: 20 }
    ).addTo(map);

    const orangeIcon = L.divIcon({
        className: "map-pin",
        html: '<span class="pin-circle"><i class="bi bi-geo-alt-fill"></i></span>',
        iconSize: [34, 34],
        iconAnchor: [17, 17]
    });

    L.marker([place.lat, place.lng], { icon: orangeIcon }).addTo(map);

    /* request info modal */

    const $requestModal = $("#requestInfoModal");
    const $requestForm = $("#requestInfoForm");
    const $requestSuccess = $("#requestInfoSuccess");
    const $requestSubmit = $("#requestInfoSubmit");
    const requestModalEl = document.getElementById("requestInfoModal");

    function resetRequestModal() {
        $requestForm[0].reset();
        $requestForm.find(".form-control").removeClass("is-valid is-invalid");
        $requestSuccess.addClass("d-none");
        $requestForm.removeClass("d-none");
        $requestSubmit.prop("disabled", false);
        $requestSubmit.find(".submit-label").removeClass("d-none");
        $requestSubmit.find(".submit-loading").addClass("d-none");
    }

    function validateField($field, isValid) {
        $field.toggleClass("is-valid", isValid);
        $field.toggleClass("is-invalid", !isValid);
    }

    function validateRequestForm() {
        const name = $("#requestName").val().trim();
        const email = $("#requestEmail").val().trim();
        const phone = $("#requestPhone").val().trim();

        const nameValid = name.length >= 2;
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const phoneDigits = phone.replace(/\D/g, "");
        const phoneValid = phoneDigits.length >= 10;

        validateField($("#requestName"), nameValid);
        validateField($("#requestEmail"), emailValid);
        validateField($("#requestPhone"), phoneValid);

        return nameValid && emailValid && phoneValid;
    }

    $(document).on("click", ".request-info-btn", function () {
        resetRequestModal();
        bootstrap.Modal.getOrCreateInstance(requestModalEl).show();
    });

    $("#requestInfoModal").on("show.bs.modal", function () {
        resetRequestModal();
    });

    $("#requestInfoModal").on("hidden.bs.modal", function () {
        resetRequestModal();
    });

    $requestForm.on("submit", function (e) {
        e.preventDefault();

        if (!validateRequestForm()) {
            return;
        }

        $requestSubmit.prop("disabled", true);
        $requestSubmit.find(".submit-label").addClass("d-none");
        $requestSubmit.find(".submit-loading").removeClass("d-none");

        setTimeout(() => {
            $requestForm.addClass("d-none");
            $requestSuccess.removeClass("d-none");
            $requestSubmit.prop("disabled", false);
            $requestSubmit.find(".submit-label").removeClass("d-none");
            $requestSubmit.find(".submit-loading").addClass("d-none");
        }, 600);
    });

    $requestForm.find(".form-control").on("input", function () {
        if ($(this).hasClass("is-invalid")) {
            validateRequestForm();
        }
    });

    /* gallery modal */

    let galleryStartIndex = 0;

    function openGalleryModal(startIndex) {

        galleryStartIndex = startIndex || 0;

        const $slider = $("#galleryModalSlider");

        if ($slider.hasClass("slick-initialized")) {
            $slider.slick("unslick");
        }

        const slidesHTML = g.map(img => `
            <div class="gallery-slide">
                <img src="${img}" alt="${place.title}">
            </div>
        `).join("");

        $slider.html(slidesHTML);

        $("#galleryModalTitle").text(place.title);
        $("#galleryModalRating").html(`
            <i class="bi bi-star-fill"></i>
            ${place.rating} <small>(${place.reviews} reviews)</small>
        `);
        $("#galleryModalLocation").html(`
            <i class="bi bi-geo-alt"></i>
            ${place.address}
        `);
        $("#galleryModalDescription").text(place.description);
        $("#galleryModalPrice").html(`
            <small>From</small>
            <span>$${place.price}.00</span>
        `);

        bootstrap.Modal.getOrCreateInstance(document.getElementById("galleryModal")).show();

    }

    $(document).on("click", ".see-all-btn", function (e) {

        e.stopPropagation();
        openGalleryModal(0);

    });

    $(document).on("click", ".gallery-page-main, .gallery-page-sub", function () {

        openGalleryModal(parseInt($(this).data("index")) || 0);

    });

    $("#galleryModal").on("shown.bs.modal", function () {

        const $slider = $("#galleryModalSlider");

        $slider.slick({
            dots: true,
            arrows: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            adaptiveHeight: true,
            initialSlide: galleryStartIndex
        });

        setTimeout(() => $slider.slick("setPosition"), 50);

    });

    $("#galleryModal").on("hidden.bs.modal", function () {

        const $slider = $("#galleryModalSlider");

        if ($slider.hasClass("slick-initialized")) {
            $slider.slick("unslick");
        }

    });

});
