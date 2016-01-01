(function (window) {

    var
        SELECTORS = {
            introHeaderContainer: '.js-intro-content',
            introHeader: '.js-intro-header',
            followUpContentContainer: '.js-after-intro',
            introHeaderComma: '.js-intro-header__comma'
        },

        DURATIONS = {
            dropDownGreeting: 1.3,
            slideInComma: 1.5,
            revealBody: 0.5,
            scaleShift: 0.5
        },

        EASINGS = {
            dropDownGreeting: Bounce.easeOut,
            slideInComma: Power4.easeOut,
            //slideInComma: Back.easeOut.config(1.2),
            revealBody: Power4.easeOut,
            scaleShift: Power4.easeOut
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
            introHeaderCommaElem: document.querySelector(SELECTORS.introHeaderComma)
        };
    }


    function prepareScene () {
        var tl = new TimelineMax();

        // hold intro header at the top
        tl.set(
            DOM_REFS.introHeaderContainerElem,
            {
                scale: 2,
                position: 'absolute',
                top: 0,
                immediateRender: false
            }
        );

        // allow the comma to slide in later
        tl.set(
            DOM_REFS.introHeaderCommaElem,
            { left: '100%', immediateRender: false }
        );

        // main body content will slide in from bottom
        tl.set(
            DOM_REFS.followUpContentContainerElem,
            { top: 100, immediateRender: false }
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

        // tl.set(
        //     DOM_REFS.introHeaderContainerElem,
        //     { xPercent: 0, yPercent: 0, immediateRender: false }
        // );

        tl.to(
            DOM_REFS.introHeaderContainerElem,
            DURATIONS.scaleShift,
            { top: 0, yPercent: 0, left: '0%', scale: 1, ease: EASINGS.scaleShift }
            //{ position: 'relative', textAlign: 'left', scale: 1, ease: EASINGS.scaleShift }
        );

        // Finish by placing back in normal flow
        tl.set(
            DOM_REFS.introHeaderContainerElem,
            {
                position: 'relative',
                immediateRender: false
            }
        )

        return tl;
    }


    function revealRestOfContent () {
        var tl = new TimelineMax();

        tl.to(
            DOM_REFS.followUpContentContainerElem,
            DURATIONS.revealBody,
            {
                opacity: 1,
                top: 0,
                ease: EASINGS.bodyReveal
            }
        );

        return tl;
    }


    function animateIntro () {
        debugger;
        MASTER_TL.add(prepareScene());
        MASTER_TL.addLabel(LABELS.sceneSet);
        MASTER_TL.add(revealIntroContent());
        MASTER_TL.add(scaleBackIntroContent());
        //MASTER_TL.add(revealRestOfContent(), '+=0.5');

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
