$(document).ready(function ($) {

    window.onscroll = function () {
        stickyTop()
    };

    var iconbar = document.getElementById("icon-bar");
    var sticky = iconbar.offsetTop;

    function stickyTop() {
        if (window.pageYOffset >= sticky) {

            iconbar.classList.add("sticky")
        } else {
            iconbar.classList.remove("sticky")
        }
    };

    // $(".scroll").click(function (event) {
    //     event.preventDefault();
    //     $('html,body').animate({ scrollTop: $(this.hash).offset().top }, 900);
    // });

    // $("span.menu").click(function () {
    //     $(".top-menu ul").slideToggle("slow", function () {
    //     });
    // });

    var carousel = $(".carousel"),
        currdeg = 0;

    $(".next").on("click", { d: "n" }, rotate);
    $(".prev").on("click", { d: "p" }, rotate);

    function rotate(e) {
        if (e.data.d == "n") {
            currdeg = currdeg - 60;
        }
        if (e.data.d == "p") {
            currdeg = currdeg + 60;
        }
        carousel.css({
            "-webkit-transform": "rotateY(" + currdeg + "deg)",
            "-moz-transform": "rotateY(" + currdeg + "deg)",
            "-o-transform": "rotateY(" + currdeg + "deg)",
            "transform": "rotateY(" + currdeg + "deg)"
        });
    }

})