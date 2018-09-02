var MaterialCookies= {
    id: '#MaterialCookiesContainer',
    cookieName: "MaterialCookiesContainer-accepted",
    init: function (data) {
        //validate data input
        {
            if (data['message'] === undefined) {
                throw new Error('Please provide a message to be displayed.');
            }

            if (data['actionText'] === undefined) {
                throw new Error('Please provide a text for the action button.');
            }

            if (data['doneText'] === undefined) {
                throw new Error('Please provide a text for the done button.');
            }

            if (data['actionHandler'] === undefined) {
                throw new Error('Please provide a function that should be executed when the action button is clicked.');
            }

            if (data['delay'] === undefined) {
                data['delay'] = 0;
                console.info("%c[MaterialCookies]%c: No value for delay passed. Using default of %i", "color: #1792ff", "", 0);
            }

            if (data['actionColor'] === undefined) {
                data['actionColor'] = "#fff";
                console.info("%c[MaterialCookies]%c: No value for actionColor passed. Using default of %c%s", "color: #1792ff", "", "color: " + data.actionColor + ";background: #323232", data.actionColor)
            }

            if (data['doneColor'] === undefined) {
                data['doneColor'] = "#ffe34f";
                console.info("%c[MaterialCookies]%c: No value for doneColor passed. Using default of %c%s", "color: #1792ff", "", "color: " + data.doneColor + ";background: #323232", data.doneColor)
            }

            if (data['cookieAge'] === undefined) {
                data['cookieAge'] = 60 * 60 * 24 * 265 * 4; // for four years
                console.info("%c[MaterialCookies]%c: No value for cookieAge passed. Using default of %f/%s", "color: #1792ff", "", data.cookieAge, "4 years")
            }

            this.data = data;
        }

        if (!this.allowsCookies()) return;

        if (!this.hasCookie()) {
            window.addEventListener('load', function () {
                this.build();
                this.show();
            }.bind(MaterialCookies));
        }
    },
    hasCookie: function () {
        var cookie = document.cookie;

        if (document.cookie.indexOf(this.cookieName + '=') >= 0) {
            return true;
        }
        return false;
    },
    allowsCookies: function () {
        // taken from https://github.com/Modernizr/Modernizr/blob/5eea7e2a213edc9e83a47b6414d0250468d83471/feature-detects/cookies.js

        // Quick test if browser has cookieEnabled host property
        if (navigator.cookieEnabled) return true;

        // Create cookie
        document.cookie = "cookietest=1";
        var allowed = document.cookie.indexOf("cookietest=") != -1;

        // Delete cookie
        document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
        return allowed;
    },
    bakeCookie: function () {
        var age = this.data.cookieAge;
        var cookie = this.cookieName + "=true; max-age=" + age;

        document.cookie = cookie;
    },
    build: function () {
        var body = document.querySelector('body');

        var node = document.createElement('div');
        node.setAttribute('id', this.id.substring(1));
        node.classList.add('mdl-js-bigsnackbar');
        node.classList.add('mdl-bigsnackbar');
        node.innerHTML =
            '<div class="mdl-bigsnackbar__text"></div>\
            <button class="mdl-bigsnackbar__action" type="button" style="color:' + this.data.actionColor + '"></button>\
            <button class="mdl-bigsnackbar__action" type="button" style="color:' + this.data.doneColor + '"></button>';

        componentHandler.upgradeElement(node);
        body.appendChild(node);
    },
    show: function () {
        var snackbarContainer = document.querySelector(this.id);

        setTimeout(function () {
            var data = {
                message: this.data.message,
                actions: [
                    [this.data.actionText, this.data.actionHandler],
                    [this.data.doneText, function (event) {
                        snackbarContainer.MaterialBigSnackbar.closeBigSnackbar();
                        this.bakeCookie();
                    }.bind(MaterialCookies)]
                ],
                timeout: null
            };

            snackbarContainer.MaterialBigSnackbar.showBigSnackbar(data);
        }, this.data.delay);
    }
}
