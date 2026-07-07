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



// grid section 

$(function () {

    $(".view-btn").click(function () {

        $(".view-btn").removeClass("active");

        $(this).addClass("active");

        let view = $(this).data("view");

        if (view === "grid") {

            $("#resultsContainer")

                .removeClass("results-list")

                .addClass("results-grid");

        }

        else {

            $("#resultsContainer")

                .removeClass("results-grid")

                .addClass("results-list");

        }

    });

});