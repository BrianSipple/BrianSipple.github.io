(function (window) {

    var
        SELECTORS = {
            introHeaderContainer: '.js-intro-content',
            introHeader: '.js-intro-header',
            followUpContentContainer: '.js-after-intro',
            introHeaderComma: '.js-intro-header__comma',
            introHeaderText: '.js-intro-header__text'
        },

        DURATIONS = {
            dropDownGreeting: 1.125,
            slideInComma: 1.25,
            revealBody: 0.5,
            scaleShift: 0.8
        },

        EASINGS = {
            dropDownGreeting: Bounce.easeOut,
            slideInComma: Power4.easeOut,
            //slideInComma: Back.easeOut.config(1.2),
            revealBody: Power4.easeOut,
            scaleShift: Power4.easeOut
        },

        COLORS = {
            backgroundIntro: '#2B2D31',
            backgroundPostIntro: '#FAFAFA'

        },

        LABELS = {
            sceneSet: 'sceneSet'
        },

        DOM_REFS,
        MASTER_TL;


    function wireUpDOMRefs () {
        DOM_REFS = {
            introHeaderContainerElem: document.querySelector(SELECTORS.introHeaderContainer),
            followUpContentContainerElem: document.querySelector(SELECTORS.followUpContentContainer),
            introHeaderCommaElem: document.querySelector(SELECTORS.introHeaderComma),
            introHeaderTextElem: document.querySelector(SELECTORS.introHeaderText),
            bodyElem: document.body || document.querySelector('body')
        };
    }


    function prepareScene () {
        var tl = new TimelineMax();

        // hold intro header at the top
        tl.set(
            DOM_REFS.introHeaderContainerElem,
            {
                transformOrigin: '50%, 50%',
                scale: 2.25,
                position: 'absolute',
                left: '50%',
                xPercent: -50,
                top: '0',
                immediateRender: false
            }
        );

        // set the intro background color
        tl.set(DOM_REFS.bodyElem, { backgroundColor: COLORS.backgroundIntro, immediateRender: false });

        // center intro header text
        // tl.set(
        //     DOM_REFS.introHeaderTextElem,
        //     { marginLeft: '-1em', immediateRender: false }
        // );

        // allow the comma to slide in later
        tl.set(
            DOM_REFS.introHeaderCommaElem,
            { left: '100%', immediateRender: false }
        );

        // main body content will slide in from bottom
        tl.set(
            DOM_REFS.followUpContentContainerElem,
            {
                position: 'absolute',
                left: '50%',
                xPercent: -50,
                top: '100%',
                immediateRender: false
            }
        );

        return tl;
    }


    function revealIntroContent () {

        function dropDownHeader () {

            var dropdownTL = new TimelineMax();

            //drop down (an perhaps tilt a bit on the fall?)
            dropdownTL.to(
                DOM_REFS.introHeaderContainerElem,
                DURATIONS.dropDownGreeting,
                {
                    opacity: 1,
                    top: '50%',
                    yPercent: -50,
                    ease: EASINGS.dropDownGreeting
                }
            );

            return dropdownTL;
        }

        /**
         * Slide in the comma. It will be rotated horizontally at
         * first, slow in, twist into place with a light
         * wiggle, and then we'll be ready to scale back
         */
        function slideInComma () {

            var slideInTL = new TimelineMax();

            slideInTL.set(
                DOM_REFS.introHeaderCommaElem,
                {
                    transformOrigin: '50%, 50%',
                    rotationZ: -75,   // slightly more than 45deg diagonal
                    immediateRender: false
                }
            );

            slideInTL.to(
                DOM_REFS.introHeaderCommaElem,
                DURATIONS.slideInComma,
                {
                    opacity: 1,
                    left: '50%',
                    marginLeft: '1em',
                    rotationZ: 0,
                    ease: EASINGS.slideInComma
                }
            );

            return slideInTL;
        }

        var tl = new TimelineMax();

        tl.add(dropDownHeader());
        tl.add(slideInComma(), '+=0.4');

        return tl;
    }


    function scaleBackIntroContent () {

        var tl = new TimelineMax();

        tl.set(
            DOM_REFS.introHeaderContainerElem,
            { className: '+= u__mt3', immediateRender: false }
        );

        tl.to(
            DOM_REFS.introHeaderContainerElem,
            DURATIONS.scaleShift,
            {
                top: '0%',
                yPercent: 0,
                scale: 1,
                ease: EASINGS.scaleShift,
                onComplete: function () {

                    // Finish by placing back in normal flow
                    tl.set(
                        DOM_REFS.introHeaderContainerElem,
                        {
                            position: 'relative',
                            immediateRender: false
                        }
                    );
                }
            },
            0
        );

        tl.to(
            DOM_REFS.bodyElem,
            DURATIONS.scaleShift,
            { backgroundColor: COLORS.backgroundPostIntro },
            0
        );


        return tl;
    }


    function revealRestOfContent () {
        var tl = new TimelineMax();

        tl.set(
            DOM_REFS.followUpContentContainerElem,
            { className: '+= u__mt3', immediateRender: false }
        );

        tl.to(
            DOM_REFS.followUpContentContainerElem,
            DURATIONS.revealBody,
            {
                opacity: 1,
                top: '0%',
                ease: EASINGS.bodyReveal
            }
        );

        tl.set(
            DOM_REFS.followUpContentContainerElem,
            { position: 'relative', left: '0%', xPercent: 0, immediateRender: false }
        );

        return tl;
    }


    function animateIntro () {
        debugger;
        MASTER_TL.add(prepareScene());
        MASTER_TL.addLabel(LABELS.sceneSet);
        MASTER_TL.add(revealIntroContent());
        MASTER_TL.add(scaleBackIntroContent());
        MASTER_TL.add(revealRestOfContent(), '+=0.1');

        //MASTER_TL.timeScale(.0002);
        MASTER_TL.play();
    }


    function init () {

        MASTER_TL = new TimelineMax({ delay: 0.3, paused: true });

        wireUpDOMRefs();
        animateIntro();
    }


    window.addEventListener('DOMContentLoaded', init, false);

})(window);
