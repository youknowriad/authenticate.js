AuthenticateJS
=============

AuthenticateJS is a simple angular library for handling security

Installation
------------

To use this library you should have a server application that handles authentication with sessions and it should have a login api that uses a username and password parameters from request body, a logout url and an api to get the current loggedin user with its credentials.

 * Install the library

```bash
bower install authenticateJS
```

 * load the library

```html
<script src="js/angular.min.js"></script>
<script src="js/angular-route.min.js"></script>
<script src="js/authenticate.js"></script>
```

 * add it to your dependencies

```javascript
angular.module('myapp', ['authenticate.js']);
```

 * configure

```javascript
angular.module('myapp').config(['AuthenticateJSProvider', function (AuthenticateJSProvider) {

    AuthenticateJSProvider.setConfig({
        host: 'api/',                  // your base api url
        loginUrl: 'auth/login',        // login api url
        logoutUrl: 'auth/logout',      // logout api url
        loggedinUrl: 'auth/loggedin',  // api to get the user profile and roles

        unauthorizedPage: '/unauthorized',  // url (frontend) of the unauthorized page
        targetPage: '/',                    // url (frontend) of the target page on login success
        loginPage: '/dashborad'             // url (frontend) of the login page
    });

}]);
```

Usage
-----

 * In your login page, include the login form like this

```html
<div authenticate-login-form></div>
```

 * add a security attribute to your routes
     * a false value means that the route is not protected,
     * a true value means, you have to be loggedin to access this route,
     * other custom string can be used to indicate that a user role is required to access this route (the string represent the role that have to be found in user.roles)

* you can call AuthenticateJS.logout(); to loggout

* you cas use AuthenticateJS.getLoggedinUser() to get the current loggedin user
