(function (window) {

    'use strict';

    var buttonSetContainer = document.querySelector('.button-set-container'),
        shareToggleButton = document.querySelector('.button-share__toggle'),
        shareToggleButtonIcon = shareToggleButton.querySelector('.ic'),
        toggleButtonWidth = shareToggleButton.clientWidth,
        linkButtonPadding = toggleButtonWidth * 0.8,

        shareLinkButtons = [],  // filled after we create them on load (we can create them later because they'll be hidden at first)
        linkButtonIcons = [],   // same here
        totalSpreadDistance,    // and here

        isToggledOpen = false,
        openButtonScale = 0.8,  // scale to size to when the set expands


        shareLinkData = [
            {href: 'https://www.twitter.com/@Brian_Sipple', iconClass: 'icon-social-twitter'},
            {href: 'https://www.linkedin.com/in/briansipple', iconClass: 'icon-social-linkedin'},
            {href: 'https://plus.google.com/+BrianSipple', iconClass: 'icon-social-gplus'},
            {href: 'https://github.com/BrianSipple', iconClass: 'icon-social-github'}
        ],

        ANIMATION_DURATION_MULTIPLIER = 1.1;


    function toggleOptions() {

        var leftButtons = shareLinkButtons.slice(0, shareLinkButtons.length / 2),
            rightButtons = shareLinkButtons.slice(shareLinkButtons.length / 2),
            xDist = isToggledOpen ? 0 : totalSpreadDistance,

            tl;
        if (isToggledOpen) {
            // if here, this tl is closing the buttons, and so
            // we'll wait until completion to remove `expanded` class
            tl = new TimelineMax({});
            tl.add([resetToggleButton(), closeButtons(leftButtons, false), closeButtons(rightButtons, true)]);
            shareToggleButton.classList.remove('expanded');
        } else {
            // if here, this tl is opening the buttons, and so
            // we'll turn on the `expanded` class as soon as it starts
            tl = new TimelineMax({
                onStart: function () {
                    shareToggleButton.classList.add('expanded');
                }
            });
            tl.add(squishToggleButton());
            tl.add([openButtons(leftButtons, -xDist, false), openButtons(rightButtons, xDist, true)]);
        }

        isToggledOpen = !isToggledOpen;
    }

    /**
     * Generate staggered tweens of items to a distance computed
     * based upon the max and current index
     *
     * @param isTweeningRight - boolean - allows us to track whether we're
     * tweening the left buttons or the right buttons so that we can set values with
     * respect to the distance from the center.
     */
    function openButtons(buttons, totalXDist, isTweeningRight) {   // TODO: Possibliy remane this to expand buttons, and make a separate collapse function
        var n = buttons.length,
            currentDurationMultiplier,
            currentXDist,
            currentZIndex,
            currentIcon,
            tweens = [];
        buttons.forEach(function (button, idx) {

            currentXDist = (isTweeningRight) ?
                (totalXDist * (idx + 1) / n) :
                (totalXDist * (n - idx) / n);

            currentZIndex = (isTweeningRight) ?
                (idx + 1) : (n - idx);

            currentDurationMultiplier = (isTweeningRight) ?
            ANIMATION_DURATION_MULTIPLIER + (idx * 0.3) :
            ANIMATION_DURATION_MULTIPLIER + ( (n - (idx + 1)) * 0.3);

            //console.log('Is tweening right: ' + isTweeningRight);
            //console.log('Current Duration Multiplier for button scaling: ' + currentDurationMultiplier);

            currentIcon = (isTweeningRight) ?
                linkButtonIcons[(n + idx)] :
                linkButtonIcons[(n - idx - 1)];

            tweens.push(
                TweenMax.set(button, {css: {zIndex: currentZIndex}}),
                TweenMax.to(
                    button,
                    currentDurationMultiplier * 2.2,
                    {
                        x: currentXDist,
                        scale: 0.6,
                        scaleX: 1.3,
                        ease: Elastic.easeOut.config(1.01, 0.5)
                    }
                ),
                TweenMax.to(
                    button,
                    currentDurationMultiplier * 1.6,
                    {
                        scale: openButtonScale,
                        ease: Elastic.easeOut.config(1.1, 0.6),
                        delay: (0.2 * currentDurationMultiplier) - 0.1
                    }
                ),
                TweenMax.fromTo(
                    currentIcon,
                    ANIMATION_DURATION_MULTIPLIER * 0.2,
                    {scale: 0},
                    {
                        scale: 1.0,
                        delay: (0.2 * currentDurationMultiplier) - 0.1,
                        ease: Power4.easeInOut
                    }
                )
            );
        });
        return tweens;
    }

    /**
     * Generate staggered tweens of the buttons to fold them back under the toggle button
     *
     * @param isTweeningRight - boolean - allows us to track whether we're
     * tweening the left buttons or the right buttons so that we can set values with
     * respect to the distance from the center.
     */
    function closeButtons(buttons, isTweeningRight) {
        var tweens = [];

        var n = buttons.length,
            currentZIndex,
            currentIcon,
            currentDurationMultiplier;
        buttons.forEach(function (button, idx) {

            currentZIndex = (isTweeningRight) ?
                (idx + 1) : (n - idx);

            currentDurationMultiplier = isTweeningRight ?
            ANIMATION_DURATION_MULTIPLIER + (idx * 0.1) :
            ANIMATION_DURATION_MULTIPLIER + ( (n - idx) * 0.1);

            currentIcon = (isTweeningRight) ?
                linkButtonIcons[idx] : linkButtonIcons[(n - idx - 1)];

            tweens.push(
                TweenMax.set(button, {css: {zIndex: currentZIndex}}),
                TweenMax.to(
                    button,
                    (currentDurationMultiplier * 0.1) + 0.4,
                    {
                        x: 0,
                        scale: 0.95,
                        ease: Power4.easeInOut
                    }
                ),
                TweenMax.to(
                    currentIcon,
                    ANIMATION_DURATION_MULTIPLIER * 0.2,
                    {
                        scale: 0,
                        ease: Power4.easeIn
                    }
                )
            );
        });
        return tweens;
    }


    function squishToggleButton() {
        return TweenMax.to(
            [shareToggleButton, shareLinkButtons],
            ANIMATION_DURATION_MULTIPLIER * 0.1,
            {
                scaleX: 1.2,
                scaleY: 0.6,
                ease: Power4.easeOut,
                onComplete: function () {
                    TweenMax.to(
                        shareToggleButton,
                        ANIMATION_DURATION_MULTIPLIER,
                        {
                            scale: openButtonScale,
                            ease: Elastic.easeOut.config(1.1, 0.6),
                            delay: ANIMATION_DURATION_MULTIPLIER * 0.075
                        }
                    );
                    TweenMax.to(
                        shareToggleButtonIcon,
                        ANIMATION_DURATION_MULTIPLIER * 0.8,
                        {
                            scale: 1.4,
                            ease: Elastic.easeOut.config(1.1, 0.6)
                        }
                    );
                }
            }
        );
    }

    function resetToggleButton() {
        return TweenMax.to(
            [shareToggleButton, shareToggleButtonIcon],
            ANIMATION_DURATION_MULTIPLIER * 1.4,
            {
                scale: 1,
                delay: ANIMATION_DURATION_MULTIPLIER * 0.1,
                ease: Elastic.easeOut.config(1.1, 0.3)
            }
        );
    }


    function createOptionButtons() {

        var optionButtonsFrag = document.createDocumentFragment(),
            optionButtonElem,
            optionButtonLink,
            optionButtonIcon;
        for (var i = 0, l = shareLinkData.length; i < l; i++) {

            // Create our initial elements
            optionButtonElem = document.createElement('button');
            optionButtonLink = document.createElement('a');
            optionButtonIcon = document.createElement('i');

            // Make 'em classy
            optionButtonElem.classList.add('button-share__link');
            optionButtonLink.setAttribute('href', shareLinkData[i].href);
            optionButtonLink.setAttribute('target', '_new');
            optionButtonIcon.classList.add('ic');
            optionButtonIcon.classList.add('ic_share-link');
            optionButtonIcon.classList.add(shareLinkData[i].iconClass);

            // Assemble the button and add it to the fragment
            optionButtonLink.appendChild(optionButtonIcon);
            optionButtonElem.appendChild(optionButtonLink);
            optionButtonsFrag.appendChild(optionButtonElem);

            // store the references
            shareLinkButtons.push(optionButtonElem);
            linkButtonIcons.push(optionButtonIcon);
        }
        buttonSetContainer.appendChild(optionButtonsFrag);

        // Make sure the toggle button will always have the highest z-index
        // out of all buttons in the set. (We'll be tweaking the z-index of the link
        // buttons during the animation, so this is important to set here)
        shareToggleButton.style.zIndex = shareLinkButtons.length + 1;

        // Compute the total spread distance based upon number of link buttons
        totalSpreadDistance =
            ((shareLinkButtons.length - 2) * toggleButtonWidth) +
            ((shareLinkButtons.length - 2) * linkButtonPadding);
    }


    function init() {
        createOptionButtons();  // create other buttons
    }


    ////////////////////// Listeners  //////////////////////
    window.addEventListener('load', function () {
        init();
    }, false);

    shareToggleButton.addEventListener('click', toggleOptions, false);

})(window);
