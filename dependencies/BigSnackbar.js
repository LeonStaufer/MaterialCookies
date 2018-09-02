/**
 * Class constructor for BigSnackbar MDL component.
 * Implements MDL component design pattern defined at:
 * https://github.com/jasonmayes/mdl-component-design-pattern
 *
 * @constructor
 * @param {HTMLElement} element The element that will be upgraded.
 */
var MaterialBigSnackbar = function MaterialBigSnackbar(element) {
    this.element_ = element;
    this.textElement_ = this.element_.querySelector('.' + this.cssClasses_.MESSAGE);
    this.actionElements_ = this.element_.querySelectorAll('.' + this.cssClasses_.ACTION);
    if (!this.textElement_) {
        throw new Error('There must be a message element for a big snackbar.');
    }
    if (!this.actionElements_) {
        throw new Error('There must be an action element for a big snackbar.');
    }
    this.active = false;
    this.actions_ = [];
    this.message_ = undefined;
    this.queuedNotifications_ = [];
    this.setActionHidden_(true);
};
window['MaterialBigSnackbar'] = MaterialBigSnackbar;
/**
 * Store constants in one place so they can be updated easily.
 *
 * @enum {string | number}
 * @private
 */
MaterialBigSnackbar.prototype.Constant_ = {
    // The duration of the bigsnackbar show/hide animation, in ms.
    ANIMATION_LENGTH: 250
};
/**
 * Store strings for class names defined by this component that are used in
 * JavaScript. This allows us to simply change it in one place should we
 * decide to modify at a later date.
 *
 * @enum {string}
 * @private
 */
MaterialBigSnackbar.prototype.cssClasses_ = {
    SNACKBAR: 'mdl-bigsnackbar',
    MESSAGE: 'mdl-bigsnackbar__text',
    ACTION: 'mdl-bigsnackbar__action',
    ACTIVE: 'mdl-bigsnackbar--active',
    ACTION_LEFT: 'mdl-bigsnackbar__action--left',
    ACTION_RIGHT: 'mdl-bigsnackbar__action--right'
};
/**
 * Display the bigsnackbar.
 *
 * @private
 */
MaterialBigSnackbar.prototype.displayBigSnackbar_ = function () {
    this.element_.setAttribute('aria-hidden', 'true');
    if (this.actions_) {
        for (let i = 0; i < this.actions_.length; i++) {
            this.actionElements_[i].textContent = this.actions_[i][0];
            this.actionElements_[i].addEventListener('click', this.actions_[i][1]);
        }
        this.setActionHidden_(false);
    }
    this.textElement_.textContent = this.message_;
    this.element_.classList.add(this.cssClasses_.ACTIVE);
    this.element_.setAttribute('aria-hidden', 'false');

    this.actionElements_[0].classList.add(this.cssClasses_.ACTION_LEFT);
    this.actionElements_[this.actionElements_.length - 1].classList.add(this.cssClasses_.ACTION_RIGHT);

    if (this.timeout_ != null) setTimeout(this.cleanup_.bind(this), this.timeout_);
};
/**
 * Show the big snackbar.
 *
 * @param {Object} data The data for the notification.
 * @public
 */
MaterialBigSnackbar.prototype.showBigSnackbar = function (data) {
    if (data === undefined) {
        throw new Error('Please provide a data object with at least a message to display.');
    }
    if (data['message'] === undefined) {
        throw new Error('Please provide a message to be displayed.');
    }
    if (this.active) {
        this.queuedNotifications_.push(data);
    } else {
        this.active = true;
        this.message_ = data['message'];
        if (data['actions']) {
            if (data['actions'].length != this.actionElements_.length) {
                throw new Error('The number of action pairs and action HTML elements need to be equal.');
            }
            data['actions'].forEach(function (actionPair) {
                if (actionPair.length != 2) {
                    throw new Error('Each action pair must be an array of a text followed by a function.');
                }
                this.actions_.push(actionPair);
            }, this);
        }
        if (data['timeout']) {
            this.timeout_ = data['timeout'];
        }
        this.displayBigSnackbar_();
    }
};
MaterialBigSnackbar.prototype['showBigSnackbar'] = MaterialBigSnackbar.prototype.showBigSnackbar;
/**
 * Check if the queue has items within it.
 * If it does, display the next entry.
 *
 * @private
 */
MaterialBigSnackbar.prototype.checkQueue_ = function () {
    if (this.queuedNotifications_.length > 0) {
        this.showBigSnackbar(this.queuedNotifications_.shift());
    }
};
/**
 * Easier function to read for closing Snackbar
 *
 * @public
 */
MaterialBigSnackbar.prototype.closeBigSnackbar = function () {
    this.cleanup_();
};
/**
 * Cleanup the big snackbar event listeners and accessibility attributes.
 *
 * @private
 */
MaterialBigSnackbar.prototype.cleanup_ = function () {
    this.element_.classList.remove(this.cssClasses_.ACTIVE);
    setTimeout(function () {
        this.element_.setAttribute('aria-hidden', 'true');
        this.textElement_.textContent = '';
        for (let i = 0; i < this.actions_.length; i++) {
            if (!Boolean(this.actionElements_[i].getAttribute('aria-hidden'))) {
                this.setActionHidden_(true);
                this.actionElements_[i].textContent = '';
                this.actionElements_[i].removeEventListener('click', this.actions_[i][1]);
            }
        }
        this.message_ = undefined;
        this.active = false;
        this.actions_ = [];
        this.checkQueue_();
    }.bind(this), this.Constant_.ANIMATION_LENGTH);
};
/**
 * Set the action handler hidden state.
 *
 * @param {boolean} value
 * @private
 */
MaterialBigSnackbar.prototype.setActionHidden_ = function (value) {
    if (value) {
        this.actionElements_.forEach(function (element) {
            element.setAttribute('aria-hidden', 'true');
        });
    } else {
        this.actionElements_.forEach(function (element) {
            element.removeAttribute('aria-hidden');
        });
    }
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialBigSnackbar,
    classAsString: 'MaterialBigSnackbar',
    cssClass: 'mdl-js-bigsnackbar',
    widget: true
});
