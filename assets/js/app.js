$(document).ready(function ($) {

    window.onscroll = function () {
        stickyTop()
        scrollFunction()
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

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("topArrow").style.display = "block";
        } else {
            document.getElementById("topArrow").style.display = "none";
        }
    }

    // $(".scroll").click(function (event) {
    //     event.preventDefault();
    //     $('html,body').animate({ scrollTop: $(this.hash).offset().top }, 900);
    // });

    // $("span.menu").click(function () {
    //     $(".top-menu ul").slideToggle("slow", function () {
    //     });
    // });

    var coll = document.getElementsByClassName("collapsible");
    var showText = document.getElementById("showText");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("activate");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }

            if (this.classList.contains("activate")) {
                showText.innerHTML = "Show Less";
            }
            else {
                showText.innerHTML = "Show More";

            }
        });
    };

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

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};
