var CookieNotify = {
    id: '#material-cookienotify',
    cookieName: "accepted",
    init: function (data) {
        if (data['delay'] === undefined) {
            throw new Error('Please provide a delay for the text to be displayed.');
        }

        if(!this.hasCookie()){
            window.addEventListener('load', function () {
                CookieNotify.build();
                CookieNotify.show();
            });
        }
    },
    hasCookie: function(){
        var cookie = document.cookie;

        if (document.cookie.indexOf(this.cookieName+'=')>=0) {
            return true;
        }
        return false;
    },
    bakeCookie: function(){
        var age = 60*60*24*265*4 // for four years
        var cookie = this.cookieName+"=true; max-age"+age;

        document.cookie = cookie;
    },
    build: function () {
        var body = document.querySelector('body');

        var node = document.createElement('div');
        node.setAttribute('id',this.id.substring(1));
        node.classList.add('mdl-js-cookie');
        node.classList.add('mdl-snackbar');
        node.innerHTML =
            '<div class="mdl-snackbar__text text"></div>\
            <button class="mdl-snackbar__action" type="button"></button>\
            <button class="mdl-snackbar__done" type="button"></button>';

        register();
        componentHandler.upgradeElement(node);
        body.appendChild(node);
    },
    show: function (){
        var notification = document.querySelector(this.id);
        setTimeout(function(){
            notification.MaterialCookie.showSnackbar(data);
        }, data['delay']);
    }
}


componentHandler = (function () {
    'use strict';

    /** @type {!Array<componentHandler.ComponentConfig>} */
    var registeredComponents_ = [];

    /** @type {!Array<componentHandler.Component>} */
    var createdComponents_ = [];

    var componentConfigProperty_ = 'mdlComponentConfigInternal_';

    /**
     * Searches registered components for a class we are interested in using.
     * Optionally replaces a match with passed object if specified.
     *
     * @param {string} name The name of a class we want to use.
     * @param {componentHandler.ComponentConfig=} optReplace Optional object to replace match with.
     * @return {!Object|boolean}
     * @private
     */
    function findRegisteredClass_(name, optReplace) {
        for (var i = 0; i < registeredComponents_.length; i++) {
            if (registeredComponents_[i].className === name) {
                if (typeof optReplace !== 'undefined') {
                    registeredComponents_[i] = optReplace;
                }
                return registeredComponents_[i];
            }
        }
        return false;
    }

    /**
     * Returns an array of the classNames of the upgraded classes on the element.
     *
     * @param {!Element} element The element to fetch data from.
     * @return {!Array<string>}
     * @private
     */
    function getUpgradedListOfElement_(element) {
        var dataUpgraded = element.getAttribute('data-upgraded');
        // Use `['']` as default value to conform the `,name,name...` style.
        return dataUpgraded === null ? [''] : dataUpgraded.split(',');
    }

    /**
     * Returns true if the given element has already been upgraded for the given
     * class.
     *
     * @param {!Element} element The element we want to check.
     * @param {string} jsClass The class to check for.
     * @returns {boolean}
     * @private
     */
    function isElementUpgraded_(element, jsClass) {
        var upgradedList = getUpgradedListOfElement_(element);
        return upgradedList.indexOf(jsClass) !== -1;
    }

    /**
     * Create an event object.
     *
     * @param {string} eventType The type name of the event.
     * @param {boolean} bubbles Whether the event should bubble up the DOM.
     * @param {boolean} cancelable Whether the event can be canceled.
     * @returns {!Event}
     */
    function createEvent_(eventType, bubbles, cancelable) {
        if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
            return new CustomEvent(eventType, {
                bubbles: bubbles,
                cancelable: cancelable
            });
        } else {
            var ev = document.createEvent('Events');
            ev.initEvent(eventType, bubbles, cancelable);
            return ev;
        }
    }

    /**
     * Searches existing DOM for elements of our component type and upgrades them
     * if they have not already been upgraded.
     *
     * @param {string=} optJsClass the programatic name of the element class we
     * need to create a new instance of.
     * @param {string=} optCssClass the name of the CSS class elements of this
     * type will have.
     */
    function upgradeDomInternal(optJsClass, optCssClass) {
        if (typeof optJsClass === 'undefined' &&
            typeof optCssClass === 'undefined') {
            for (var i = 0; i < registeredComponents_.length; i++) {
                upgradeDomInternal(registeredComponents_[i].className,
                    registeredComponents_[i].cssClass);
            }
        } else {
            var jsClass = /** @type {string} */ (optJsClass);
            if (typeof optCssClass === 'undefined') {
                var registeredClass = findRegisteredClass_(jsClass);
                if (registeredClass) {
                    optCssClass = registeredClass.cssClass;
                }
            }

            var elements = document.querySelectorAll('.' + optCssClass);
            for (var n = 0; n < elements.length; n++) {
                upgradeElementInternal(elements[n], jsClass);
            }
        }
    }

    /**
     * Upgrades a specific element rather than all in the DOM.
     *
     * @param {!Element} element The element we wish to upgrade.
     * @param {string=} optJsClass Optional name of the class we want to upgrade
     * the element to.
     */
    function upgradeElementInternal(element, optJsClass) {
        // Verify argument type.
        if (!(typeof element === 'object' && element instanceof Element)) {
            throw new Error('Invalid argument provided to upgrade MDL element.');
        }
        // Allow upgrade to be canceled by canceling emitted event.
        var upgradingEv = createEvent_('mdl-componentupgrading', true, true);
        element.dispatchEvent(upgradingEv);
        if (upgradingEv.defaultPrevented) {
            return;
        }

        var upgradedList = getUpgradedListOfElement_(element);
        var classesToUpgrade = [];
        // If jsClass is not provided scan the registered components to find the
        // ones matching the element's CSS classList.
        if (!optJsClass) {
            var classList = element.classList;
            registeredComponents_.forEach(function (component) {
                // Match CSS & Not to be upgraded & Not upgraded.
                if (classList.contains(component.cssClass) &&
                    classesToUpgrade.indexOf(component) === -1 &&
                    !isElementUpgraded_(element, component.className)) {
                    classesToUpgrade.push(component);
                }
            });
        } else if (!isElementUpgraded_(element, optJsClass)) {
            classesToUpgrade.push(findRegisteredClass_(optJsClass));
        }

        // Upgrade the element for each classes.
        for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
            registeredClass = classesToUpgrade[i];
            if (registeredClass) {
                // Mark element as upgraded.
                upgradedList.push(registeredClass.className);
                element.setAttribute('data-upgraded', upgradedList.join(','));
                var instance = new registeredClass.classConstructor(element);
                instance[componentConfigProperty_] = registeredClass;
                createdComponents_.push(instance);
                // Call any callbacks the user has registered with this component type.
                for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
                    registeredClass.callbacks[j](element);
                }

                if (registeredClass.widget) {
                    // Assign per element instance for control over API
                    element[registeredClass.className] = instance;
                }
            } else {
                throw new Error(
                    'Unable to find a registered component for the given class.');
            }

            var upgradedEv = createEvent_('mdl-componentupgraded', true, false);
            element.dispatchEvent(upgradedEv);
        }
    }

    /**
     * Upgrades a specific list of elements rather than all in the DOM.
     *
     * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
     * The elements we wish to upgrade.
     */
    function upgradeElementsInternal(elements) {
        if (!Array.isArray(elements)) {
            if (elements instanceof Element) {
                elements = [elements];
            } else {
                elements = Array.prototype.slice.call(elements);
            }
        }
        for (var i = 0, n = elements.length, element; i < n; i++) {
            element = elements[i];
            if (element instanceof HTMLElement) {
                upgradeElementInternal(element);
                if (element.children.length > 0) {
                    upgradeElementsInternal(element.children);
                }
            }
        }
    }

    /**
     * Registers a class for future use and attempts to upgrade existing DOM.
     *
     * @param {componentHandler.ComponentConfigPublic} config
     */
    function registerInternal(config) {
        // In order to support both Closure-compiled and uncompiled code accessing
        // this method, we need to allow for both the dot and array syntax for
        // property access. You'll therefore see the `foo.bar || foo['bar']`
        // pattern repeated across this method.
        var widgetMissing = (typeof config.widget === 'undefined' &&
            typeof config['widget'] === 'undefined');
        var widget = true;

        if (!widgetMissing) {
            widget = config.widget || config['widget'];
        }

        var newConfig = /** @type {componentHandler.ComponentConfig} */ ({
            classConstructor: config.constructor || config['constructor'],
            className: config.classAsString || config['classAsString'],
            cssClass: config.cssClass || config['cssClass'],
            widget: widget,
            callbacks: []
        });

        registeredComponents_.forEach(function (item) {
            if (item.cssClass === newConfig.cssClass) {
                throw new Error('The provided cssClass has already been registered: ' + item.cssClass);
            }
            if (item.className === newConfig.className) {
                throw new Error('The provided className has already been registered');
            }
        });

        if (config.constructor.prototype
            .hasOwnProperty(componentConfigProperty_)) {
            throw new Error(
                'MDL component classes must not have ' + componentConfigProperty_ +
                ' defined as a property.');
        }

        var found = findRegisteredClass_(config.classAsString, newConfig);

        if (!found) {
            registeredComponents_.push(newConfig);
        }
    }

    /**
     * Allows user to be alerted to any upgrades that are performed for a given
     * component type
     *
     * @param {string} jsClass The class name of the MDL component we wish
     * to hook into for any upgrades performed.
     * @param {function(!HTMLElement)} callback The function to call upon an
     * upgrade. This function should expect 1 parameter - the HTMLElement which
     * got upgraded.
     */
    function registerUpgradedCallbackInternal(jsClass, callback) {
        var regClass = findRegisteredClass_(jsClass);
        if (regClass) {
            regClass.callbacks.push(callback);
        }
    }

    /**
     * Upgrades all registered components found in the current DOM. This is
     * automatically called on window load.
     */
    function upgradeAllRegisteredInternal() {
        for (var n = 0; n < registeredComponents_.length; n++) {
            upgradeDomInternal(registeredComponents_[n].className);
        }
    }

    /**
     * Check the component for the downgrade method.
     * Execute if found.
     * Remove component from createdComponents list.
     *
     * @param {?componentHandler.Component} component
     */
    function deconstructComponentInternal(component) {
        if (component) {
            var componentIndex = createdComponents_.indexOf(component);
            createdComponents_.splice(componentIndex, 1);

            var upgrades = component.element_.getAttribute('data-upgraded').split(',');
            var componentPlace = upgrades.indexOf(component[componentConfigProperty_].classAsString);
            upgrades.splice(componentPlace, 1);
            component.element_.setAttribute('data-upgraded', upgrades.join(','));

            var ev = createEvent_('mdl-componentdowngraded', true, false);
            component.element_.dispatchEvent(ev);
        }
    }

    /**
     * Downgrade either a given node, an array of nodes, or a NodeList.
     *
     * @param {!Node|!Array<!Node>|!NodeList} nodes
     */
    function downgradeNodesInternal(nodes) {
        /**
         * Auxiliary function to downgrade a single node.
         * @param  {!Node} node the node to be downgraded
         */
        var downgradeNode = function (node) {
            createdComponents_.filter(function (item) {
                return item.element_ === node;
            }).forEach(deconstructComponentInternal);
        };
        if (nodes instanceof Array || nodes instanceof NodeList) {
            for (var n = 0; n < nodes.length; n++) {
                downgradeNode(nodes[n]);
            }
        } else if (nodes instanceof Node) {
            downgradeNode(nodes);
        } else {
            throw new Error('Invalid argument provided to downgrade MDL nodes.');
        }
    }

    // Now return the functions that should be made public with their publicly
    // facing names...
    return {
        upgradeDom: upgradeDomInternal,
        upgradeElement: upgradeElementInternal,
        upgradeElements: upgradeElementsInternal,
        upgradeAllRegistered: upgradeAllRegisteredInternal,
        registerUpgradedCallback: registerUpgradedCallbackInternal,
        register: registerInternal,
        downgradeElements: downgradeNodesInternal
    };
})();

/**
 * Describes the type of a registered component type managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   constructor: Function,
 *   classAsString: string,
 *   cssClass: string,
 *   widget: (string|boolean|undefined)
 * }}
 */
componentHandler.ComponentConfigPublic; // jshint ignore:line

/**
 * Describes the type of a registered component type managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   constructor: !Function,
 *   className: string,
 *   cssClass: string,
 *   widget: (string|boolean),
 *   callbacks: !Array<function(!HTMLElement)>
 * }}
 */
componentHandler.ComponentConfig; // jshint ignore:line

/**
 * Created component (i.e., upgraded element) type as managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   element_: !HTMLElement,
 *   className: string,
 *   classAsString: string,
 *   cssClass: string,
 *   widget: string
 * }}
 */
componentHandler.Component; // jshint ignore:line

// Export all symbols, for the benefit of Closure compiler.
// No effect on uncompiled code.
componentHandler['upgradeDom'] = componentHandler.upgradeDom;
componentHandler['upgradeElement'] = componentHandler.upgradeElement;
componentHandler['upgradeElements'] = componentHandler.upgradeElements;
componentHandler['upgradeAllRegistered'] =
    componentHandler.upgradeAllRegistered;
componentHandler['registerUpgradedCallback'] =
    componentHandler.registerUpgradedCallback;
componentHandler['register'] = componentHandler.register;
componentHandler['downgradeElements'] = componentHandler.downgradeElements;
window.componentHandler = componentHandler;
window['componentHandler'] = componentHandler;

window.addEventListener('load', function () {
    'use strict';

    /**
     * Performs a "Cutting the mustard" test. If the browser supports the features
     * tested, adds a mdl-js class to the <html> element. It then upgrades all MDL
     * components requiring JavaScript.
     */
    if ('classList' in document.createElement('div') &&
        'querySelector' in document &&
        'addEventListener' in window && Array.prototype.forEach) {
        document.documentElement.classList.add('mdl-js');
        componentHandler.upgradeAllRegistered();
    } else {
        /**
         * Dummy function to avoid JS errors.
         */
        componentHandler.upgradeElement = function () {};
        /**
         * Dummy function to avoid JS errors.
         */
        componentHandler.register = function () {};
    }
});

/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Class constructor for Cookie MDL variant component of the snackbar.
 * Implements MDL component design pattern defined at:
 * https://github.com/jasonmayes/mdl-component-design-pattern
 *
 * @constructor
 * @param {HTMLElement} element The element that will be upgraded.
 */
var MaterialCookie = function MaterialCookie(element) {
    this.element_ = element;
    this.textElement_ = this.element_.querySelector('.' + this.cssClasses_.MESSAGE);
    this.actionElement_ = this.element_.querySelector('.' + this.cssClasses_.ACTION);
    this.doneElement_ = this.element_.querySelector('.' + this.cssClasses_.DONE);
    if (!this.textElement_) {
        throw new Error('There must be a message element for a snackbar.');
    }
    if (!this.actionElement_) {
        throw new Error('There must be an action element for a snackbar.');
    }
    if (!this.doneElement_) {
        throw new Error('There must be an done element for a snackbar.');
    }
    this.active = false;
    this.actionHandler_ = undefined;
    this.message_ = undefined;
    this.actionText_ = undefined;
    this.doneText_ = undefined;
    this.queuedNotifications_ = [];
    this.setActionHidden_(true);
};
window['MaterialCookie'] = MaterialCookie;
/**
 * Store constants in one place so they can be updated easily.
 *
 * @enum {string | number}
 * @private
 */
MaterialCookie.prototype.Constant_ = {
    // The duration of the snackbar show/hide animation, in ms.
    ANIMATION_LENGTH: 500
};
/**
 * Store strings for class names defined by this component that are used in
 * JavaScript. This allows us to simply change it in one place should we
 * decide to modify at a later date.
 *
 * @enum {string}
 * @private
 */
MaterialCookie.prototype.cssClasses_ = {
    SNACKBAR: 'mdl-snackbar',
    MESSAGE: 'mdl-snackbar__text',
    ACTION: 'mdl-snackbar__action',
    DONE: 'mdl-snackbar__done',
    ACTIVE: 'mdl-snackbar--active'
};
/**
 * Display the snackbar.
 *
 * @private
 */
MaterialCookie.prototype.displaySnackbar_ = function () {
    this.element_.setAttribute('aria-hidden', 'true');
    if (this.actionHandler_) {
        this.actionElement_.textContent = this.actionText_;
        this.actionElement_.addEventListener('click', this.actionHandler_);
        this.setActionHidden_(false);
    }
    this.doneElement_.addEventListener('click', function(){
        //FIXME: this is undefined because it is within the scope of the event listener
        this.cleanup_.bind(this);
        CookieNotify.bakeCookie();
    });

    this.textElement_.textContent = this.message_;
    this.doneElement_.innerHTML = this.doneText_;
    this.element_.classList.add(this.cssClasses_.ACTIVE);
    this.element_.setAttribute('aria-hidden', 'false');

    this.actionElement_.style.color = this.actionColor_;
    this.doneElement_.style.color = this.doneColor_;
};
/**
 * Show the snackbar.
 *
 * @param {Object} data The data for the notification.
 * @public
 */
MaterialCookie.prototype.showSnackbar = function (data) {
    if (data === undefined) {
        throw new Error('Please provide a data object with at least a message to display.');
    }
    if (data['message'] === undefined) {
        throw new Error('Please provide a message to be displayed.');
    }
    if (data['doneText'] === undefined) {
        throw new Error('Please provide a done text to be displayed.');
    }
    if (data['actionHandler'] && !data['actionText']) {
        throw new Error('Please provide action text with the handler.');
    }
    if (this.active) {
        this.queuedNotifications_.push(data);
    } else {
        this.active = true;
        this.message_ = data['message'];
        this.doneText_ = data['doneText'];
        if (data['actionHandler']) {
            this.actionHandler_ = data['actionHandler'];
        }
        if (data['actionText']) {
            this.actionText_ = data['actionText'];
        }
        if (data['actionColor']) {
            this.actionColor_ = data['actionColor'];
        }
        if (data['doneColor']) {
            this.doneColor_ = data['doneColor'];
        }
        this.displaySnackbar_();
    }
};
MaterialCookie.prototype['showSnackbar'] = MaterialCookie.prototype.showSnackbar;
/**
 * Check if the queue has items within it.
 * If it does, display the next entry.
 *
 * @private
 */
MaterialCookie.prototype.checkQueue_ = function () {
    if (this.queuedNotifications_.length > 0) {
        this.showSnackbar(this.queuedNotifications_.shift());
    }
};
/**
 * Cleanup the snackbar event listeners and accessiblity attributes.
 *
 * @private
 */
MaterialCookie.prototype.cleanup_ = function () {
    this.element_.classList.remove(this.cssClasses_.ACTIVE);
    setTimeout(function () {
        this.element_.setAttribute('aria-hidden', 'true');
        this.textElement_.textContent = '';
        if (!Boolean(this.actionElement_.getAttribute('aria-hidden'))) {
            this.setActionHidden_(true);
            this.actionElement_.textContent = '';
            this.actionElement_.removeEventListener('click', this.actionHandler_);
        }
        this.actionHandler_ = undefined;
        this.message_ = undefined;
        this.actionText_ = undefined;
        this.active = false;
        this.checkQueue_();

        this.actionColor_ = undefined;
        this.doneColor_ = undefined;
    }.bind(this), this.Constant_.ANIMATION_LENGTH);
};
/**
 * Set the action handler hidden state.
 *
 * @param {boolean} value
 * @private
 */
MaterialCookie.prototype.setActionHidden_ = function (value) {
    if (value) {
        this.actionElement_.setAttribute('aria-hidden', 'true');
    } else {
        this.actionElement_.removeAttribute('aria-hidden');
    }
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
function register(){
    componentHandler.register({
        constructor: MaterialCookie,
        classAsString: 'MaterialCookie',
        cssClass: 'mdl-js-cookie',
        widget: true
    });
}
