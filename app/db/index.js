'use strict';

module.exports = db;

function db(table) {
  return {
    get: function () {
      var item = global.localStorage.getItem(table);

      if (item) {
        // its evalution baby!
        return eval('(' + item + ')');
      }
      else {
        return [];
      }
    },
    save: function (data) {
      var str = JSON.stringify(data);

      global.localStorage.setItem(table, str);
    },
    clear: function (table) {
      global.localStorage.removeItem(table);
    }
  };
}
