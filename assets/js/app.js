$(document).ready(function ($) {

    // CANVAS & MOBILE TEST
    var windowWidth = $(window).width(),
        windowHeight = $(window).height();
    var isMobile = navigator.userAgent.match(/mobile/i);
    var webGLTrue = false;

    if (window.WebGLRenderingContext) {
        webGLTrue = true;
    }

    // CLASSES
    if (isMobile) {
        $('body').addClass('mobile');
    }
    else if (!isMobile) {
        $('body').addClass('desktop');
    }

    // GLOBAL VARIABLES
    var img,
        canvas,
        container,
        imgRatio,
        containerRatio;
    var screenShotCanvas,
        canvasDataURL,
        canvasImage,
        screenCaptured = false,
        animateable = true,
        popstate = false,
        isFourOhFour = false,
        inputReady = true;

    var seriously,
        sourceImage,
        layers,
        edge,
        blend1,
        linearGreen,
        scale1,
        blend2,
        linearPurple,
        scale2,
        blend3,
        blend4,
        blend5,
        target;

    // INITIAL LOAD FUNCTIONS
    startupFunctions();

    $(window).load(function () {
        if (webGLTrue) {
            captureScreen();
        }
        initialLoader();
    });

    function startupFunctions() {
        if (isMobile) {
            $('body').removeClass('noscroll');
        }

        widowControl();
    }

    // IMAGE FUNCTIONS
    function imageFunctions() {

        var slickDrag = false;
        if (isMobile) {
            slickDrag = true;
        }
    }

    // DEBOUNCE FUNCTION
    function debounce(func, wait, immediate) {
        var timeout;

        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    var debounceAdjust = debounce(function () {
        widowControl();
    }, 50);

    window.addEventListener('resize', debounceAdjust);

    // WIDOW CONTROL
    function widowControl() {
        windowWidth = $(window).width();
        var widowElements = $('h1, h2, h3, h4, h5, h6, li, p, figcaption, .case-study-tagline, .large-cta').not('.discovery_cell p, #site-nav li, footer li');


        widowElements.each(function () {
            $(this).html($(this).html().replace(/&nbsp;/g, ' '));
        });

        if (windowWidth > 640) {
            widowElements.each(function () {
                $(this).html($(this).html().replace(/\s((?=(([^\s<>]|<[^>]*>)+))\2)\s*$/, '&nbsp;$1'));
            });
        }
    };

    // HTML CANVAS & INITIAL LOAD FUNCTIONS
    function captureScreen() {
        html2canvas($('.ajax'), {
            letterRendering: true,
            allowTaint: true,
            onrendered: function (canvas) {
                screenShotCanvas = canvas;
                canvasDataURL = screenShotCanvas.toDataURL();
                canvasImage = new Image();
                canvasImage.src = canvasDataURL;
                screenCaptured = true;
                console.log(canvas);
            }
        });
    }

    function initialLoader() {
        $('body').removeClass('noscroll');

        var loadText = 'Welcome';
        var loaderDone = false;
        $.each(loadText.split(''), function (i, letter) {
            setTimeout(function () {
                $('#loader-text').html($('#loader-text').html() + letter);
            }, 60 * i);
        });

        setTimeout(function () {
            loaderDone = true;
        }, 1700);


        //check to make sure the document has been fully loaded before removing loader
        var readyStateCheckInterval = setInterval(function () {
            if (document.readyState === "complete" && loaderDone) {
                clearInterval(readyStateCheckInterval);
                $('#initial-loader').velocity({
                    translateZ: 0,
                    opacity: 0
                }, {
                        display: 'none',
                        delay: 0,
                        duration: 800
                    });

                if (webGLTrue) {
                    loadPageCanvas();

                    setTimeout(function () {
                        removePageCanvas();
                        $('#initial-loader').remove();
                    }, 500);
                }
                else {
                    setTimeout(function () {
                        $('#initial-loader').remove();
                    }, 1001);
                }
            }
        }, 10);
    }



    // GLITCHING
    function initializeGlitch(image, height) {
        var container,
            stats;

        var camera,
            scene,
            sceneBG,
            renderer,
            composer,
            composerScene;

        var mesh,
            light,
            dotEffect,
            shiftEffect,
            sepiaEffect;

        var glitchDtSize = 100,
            // var glitchDtSize = 500,
            glitchDelay = 1,
            glitchAmplification = .5;

        var fps = 20;
        if (isFourOhFour) {
            fps = 5;
        }

        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = height;
        // var SCREEN_HEIGHT = 1000;
        var ratio = SCREEN_WIDTH / SCREEN_HEIGHT;

        if (height > 4096) {
            SCREEN_HEIGHT = 4096;
        }

        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = height / 2;

        var delta = 0.1;

        function init() {
            scene = new THREE.Scene();
            sceneBG = new THREE.Scene();

            camera = new THREE.OrthographicCamera(-windowHalfX, windowHalfX, windowHalfY, -windowHalfY, 1, 10000);
            camera.position.z = 100;

            //background
            background = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(image),
                depthTest: false
            });

            background.map.needsUpdate = true;
            var plane = new THREE.PlaneBufferGeometry(1, 1);

            var bgMesh = new THREE.Mesh(plane, background);
            bgMesh.position.z = 1;
            bgMesh.scale.set(SCREEN_WIDTH, height, 1);
            sceneBG.add(bgMesh);

            bgMesh.material.map.needsUpdate = true;

            var sceneMask = new THREE.Scene();

            renderer = new THREE.WebGLRenderer();
            renderer.setClearColor(0xffffff);
            renderer.setSize(window.innerWidth, window.innerHeight);
            // renderer.setSize(window.innerWidth, 1000);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.autoClear = false;

            renderer.gammaInput = true;
            renderer.gammaOutput = true;

            renderBackground = new THREE.RenderPass(sceneBG, camera);

            // $(renderer.domElement).attr('id', 'loader').css('height', height);
            $(renderer.domElement).attr('id', 'loader').css('height', 900);
            $('#page-effect').append(renderer.domElement);

            var rtParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: true };

            var clearMask = new THREE.ClearMaskPass();

            composer = new THREE.EffectComposer(renderer, new THREE.WebGLRenderTarget(SCREEN_WIDTH, SCREEN_HEIGHT, rtParameters));
            renderScene = new THREE.TexturePass(composer.renderTarget2);
            composer.addPass(renderBackground);
            composer.addPass(clearMask);

            composer1 = new THREE.EffectComposer(renderer, new THREE.WebGLRenderTarget(SCREEN_WIDTH, SCREEN_HEIGHT, rtParameters));

            var glitch = new THREE.GlitchPass(glitchDtSize, glitchDelay, glitchAmplification);
            glitch.renderToScreen = true;

            composer1.addPass(renderScene);
            composer1.addPass(glitch);

            renderScene.uniforms['tDiffuse'].value = composer.renderTarget2;
        }

        function render() {
            renderer.clear();
            composer.render(delta);
            composer1.render(delta);
        }

        function animate() {
            if (animateable) {
                setTimeout(function () {
                    render();
                    requestAnimationFrame(animate);
                }, 1000 / fps);
            }
        }

        init();
        animate();
    }

    function loadPageCanvas() {
        $('.container').hide();
        $('html').velocity('scroll', {
            axis: 'y',
            duration: 1000,
            mobileHA: false
        });

        animateable = true;

        initializeGlitch(canvasDataURL, screenShotCanvas.height);

        $('#loader').velocity({
            opacity: [1, 0]
        }, {
                duration: 1000
            });

    }


    function removePageCanvas() {
        $('#loader').velocity({
            opacity: 0
        }, {
                delay: 500,
                duration: 1000
            });

        setTimeout(function () {
            animateable = false;
            $('#loader').remove();
            $('.container').show()
        }, 1600);

    }

    function loadPageStatic() {
        $('body').prepend('<div id="initial-loader" class="padded" style="opacity: 0;"><span id="loader-text"></span></div>');

        $('#initial-loader').velocity({
            translateZ: 0,
            opacity: 1
        }, {
                duration: 150
            });
    }

    function removePageStatic() {
        var loadText = 'Loaded';
        $.each(loadText.split(''), function (i, letter) {
            setTimeout(function () {
                $('#loader-text').html($('#loader-text').html() + letter);
            }, 60 * i);
        });

        $('#initial-loader').velocity({
            translateZ: 0,
            opacity: 0
        }, {
                display: 'none',
                delay: 900,
                duration: 500
            });

        setTimeout(function () {
            $('#initialLoader').remove();
        }, 1401);
    }
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
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
