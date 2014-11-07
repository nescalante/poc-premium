module.exports = db

function db(table) {
  return {
    get: function () {
      if (global.localStorage && global.localStorage[table]) {
        // its evalution baby!
        return eval('(' + global.localStorage[table] + ')');
      }
      else {
        return [];
      }
    },
    save: function (data) {
      var data = JSON.stringify(data);

      global.localStorage[table] = data;
    }
  };
}
