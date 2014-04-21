angular.module('authenticate.js').factory('Referer', function() {

  return {
    url: false,

    has: function() {
      return this.url !== false;
    },

    reset: function () {
      this.url = false;
    },

    set: function (url) {
      this.url = url;
    },

    get: function () {
      return this.url;
    }
  };

});