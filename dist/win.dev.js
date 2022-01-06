"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function isWin(curColorArray) {
  var res = {};
  curColorArray.map(function (item, index) {
    var c0c = c0(item, _toConsumableArray(curColorArray));
    var c45c = c45(item, _toConsumableArray(curColorArray));
    var c90c = c90(item, _toConsumableArray(curColorArray));
    var c135c = c135(item, _toConsumableArray(curColorArray));

    if (c0c && c0c.length >= 4) {
      res = {
        status: true,
        arr: c0c
      };
      console.log("c0 isWin...........");
    }

    if (c45c && c45c.length >= 4) {
      res = {
        status: true,
        arr: c45c
      };
      console.log("c45 isWin...........");
    }

    if (c90c && c90c.length >= 4) {
      res = {
        status: true,
        arr: c90c
      };
      console.log("c90 isWin...........");
    }

    if (c135c && c135c.length >= 4) {
      res = {
        status: true,
        arr: c135c
      };
      console.log("c135 isWin...........");
    }
  });

  if (res.status) {
    return true;
  } else {
    return false;
  }
}

function c0(item, array) {
  var arr = [item];
  var a1 = array.filter(function (e) {
    return e[0] === item[0] && e[1] === item[1] + 30;
  });

  if (a1.length > 0) {
    arr.push(a1[0]);
    var a2 = array.filter(function (e) {
      return e[0] === a1[0][0] && e[1] === a1[0][1] + 30;
    });

    if (a2.length > 0) {
      arr.push(a2[0]);
      var a3 = array.filter(function (e) {
        return e[0] === a2[0][0] && e[1] === a2[0][1] + 30;
      });

      if (a3.length > 0) {
        arr.push(a3[0]);
        var a4 = array.filter(function (e) {
          return e[0] === a3[0][0] && e[1] === a3[0][1] + 30;
        });

        if (a4.length > 0) {
          arr.push(a4[0]);
          return arr;
        }
      }
    }
  }
}

function c45(item, array) {
  var arr = [item];
  var a1 = array.filter(function (e) {
    return e[0] === item[0] - 30 && e[1] === item[1] - 30;
  });

  if (a1.length > 0) {
    arr.push(a1[0]);
    var a2 = array.filter(function (e) {
      return e[0] === a1[0][0] - 30 && e[1] === a1[0][1] - 30;
    });

    if (a2.length > 0) {
      arr.push(a2[0]);
      var a3 = array.filter(function (e) {
        return e[0] === a2[0][0] - 30 && e[1] === a2[0][1] - 30;
      });

      if (a3.length > 0) {
        arr.push(a3[0]);
        var a4 = array.filter(function (e) {
          return e[0] === a3[0][0] - 30 && e[1] === a3[0][1] - 30;
        });

        if (a4.length > 0) {
          arr.push(a4[0]);
          return arr;
        }
      }
    }
  }
}

function c90(item, array) {
  var arr = [item];
  var a1 = array.filter(function (e) {
    return e[0] === item[0] - 30 && e[1] === item[1];
  });

  if (a1.length > 0) {
    arr.push(a1[0]);
    var a2 = array.filter(function (e) {
      return e[0] === a1[0][0] - 30 && e[1] === a1[0][1];
    });

    if (a2.length > 0) {
      arr.push(a2[0]);
      var a3 = array.filter(function (e) {
        return e[0] === a2[0][0] - 30 && e[1] === a2[0][1];
      });

      if (a3.length > 0) {
        arr.push(a3[0]);
        var a4 = array.filter(function (e) {
          return e[0] === a3[0][0] - 30 && e[1] === a3[0][1];
        });

        if (a4.length > 0) {
          arr.push(a4[0]);
          return arr;
        }
      }
    }
  }
}

function c135(item, array) {
  var arr = [item];
  var a1 = array.filter(function (e) {
    return e[0] === item[0] - 30 && e[1] === item[1] + 30;
  });

  if (a1.length > 0) {
    arr.push(a1[0]);
    var a2 = array.filter(function (e) {
      return e[0] === a1[0][0] - 30 && e[1] === a1[0][1] + 30;
    });

    if (a2.length > 0) {
      arr.push(a2[0]);
      var a3 = array.filter(function (e) {
        return e[0] === a2[0][0] - 30 && e[1] === a2[0][1] + 30;
      });

      if (a3.length > 0) {
        arr.push(a3[0]);
        var a4 = array.filter(function (e) {
          return e[0] === a3[0][0] - 30 && e[1] === a3[0][1] + 30;
        });

        if (a4.length > 0) {
          arr.push(a4[0]);
          return arr;
        }
      }
    }
  }
}