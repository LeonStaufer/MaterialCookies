# MaterialCookies

A simple, customizable [material design](https://getmdl.io/) cookie notification. Relies upon the MDL [BigSnackbar](https://github.com/LeonStaufer/material-bigsnackbar).

## Basic usage

Install MaterialCookies by loading the ``MaterialCookies.js`` as well as adding BigSnackbar to your project. If you are not loading MDL, you will need the `handler.js` file as well, as this upgrades the component.

```html
<!-- import MDL -->
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" href="path_to/material-design-lite/material.min.css">
<script defer src="path_to/material-design-lite/material.min.js"></script> 

<!-- import handler.js if you are not loading the MDL JS
<script defer src="path_to/handler.js"></script> -->
  
<!-- import Big Snackbar -->   
<link rel="stylesheet" href="path_to/BigSnackbar.css">
<script defer src="path_to/BigSnackbar.js"></script>
```

To show the cookie notification add the following JavaScript to your page:

```javascript
var data = {
    message: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies',
    actionText: 'Learn more',
    actionHandler: function(event) {
        location.href = "#privacy";
    },
    doneText: 'Accept',
};

MaterialCookies.init(data);
```

### Dependencies

Relies upon the MDL [BigSnackbar](https://github.com/LeonStaufer/material-bigsnackbar) component.

```html
<!-- import Big Snackbar -->   
<link rel="stylesheet" href="path_to/BigSnackbar.css">
<script defer src="path_to/BigSnackbar.js"></script>
```

Requires MDL or alternatively the `handler.js`
```html
<!-- import MDL -->
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" href="path_to/material-design-lite/material.min.css">
<script defer src="path_to/material-design-lite/material.min.js"></script> 

<!-- or import handler.js -->
<script defer src="path_to/handler.js"></script>
```

## Data property

The ``data`` object is explained below:

|Property|Effect|Remarks|Type|
|--- |--- |--- |--- |
|message|The text message to display|Required|String|
|actionText|The text message to display|Required|String|
|doneText|The text message to display|Required|String|
|actionHandler|The text message to display|Required|Function|
|delay|The amount of time in milliseconds to wait before showing the notification.|Optional (default 0)|Integer|
|actionColor|Represents the CSS style color for the action text|Optional (default "#fff")|String|
|doneColor|Represents the CSS style color for the done text|Optional (default "#ffe34f")|String|
|cookieAge|The lifetime of the cookie in seconds that holds the users accept decision.|Optional (default 0)|Integer|
