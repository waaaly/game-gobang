"use strict";

var mjData = require('./mj');

function shuffle(arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    var temp = arr[i];
    var rnd = i + Math.floor(Math.random() * (arr.length - i));
    arr[i] = arr[rnd];
    arr[rnd] = temp;
  }

  return arr;
}

function sort(arr) {
  var wanArr = [],
      tongArr = [],
      tiaoArr = [],
      ziArr = [];
  arr.forEach(function (item) {
    if (item.charset === 'wan') {
      wanArr.push(item);
    } else if (item.charset === 'tong') {
      tongArr.push(item);
    } else if (item.charset === 'tiao') {
      tiaoArr.push(item);
    } else {
      ziArr.push(item);
    }
  });
  wanArr.sort(function (a, b) {
    return a.face - b.face;
  });
  tongArr.sort(function (a, b) {
    return a.face - b.face;
  });
  tiaoArr.sort(function (a, b) {
    return a.face - b.face;
  });
  ziArr.sort(function (a, b) {
    return a.face - b.face;
  });
  return [].concat(wanArr, tongArr, tiaoArr, ziArr);
}

function insert(p, arr) {
  var wanArr = [],
      tongArr = [],
      tiaoArr = [],
      ziArr = [],
      sArr = [];
  arr.forEach(function (item) {
    if (item.charset === 'wan') {
      wanArr.push(item);
    } else if (item.charset === 'tong') {
      tongArr.push(item);
    } else if (item.charset === 'tiao') {
      tiaoArr.push(item);
    } else {
      ziArr.push(item);
    }
  });

  if (p.charset === 'wan') {
    sArr = wanArr;
  } else if (p.charset === 'tong') {
    sArr = tongArr;
  } else if (p.charset === 'tiao') {
    sArr = tiaoArr;
  } else {
    sArr = ziArr;
  }

  var len = 0;

  while (len < sArr.length) {
    if (p.face >= sArr[sArr.length - 1].face) {
      sArr.push(p);
      break;
    }

    if (p.face < sArr[len].face || p.face == sArr[len].face) {
      sArr.splice(len, 0, p);
      break;
    }

    len++;
  }

  if (p.charset === 'wan') {
    return [].concat(sArr, tongArr, tiaoArr, ziArr);
  } else if (p.charset === 'tong') {
    return [].concat(wanArr, sArr, tiaoArr, ziArr);
  } else if (p.charset === 'tiao') {
    return [].concat(wanArr, tongArr, sArr, ziArr);
  } else {
    return [].concat(wanArr, tongArr, tiaoArr, sArr);
  }
}

var p1 = shuffle(mjData).splice(0, 14);
console.log(p1);
p1 = sort(p1);
console.log(p1);
var a = {
  text: '二筒',
  charset: 'tong',
  face: 2,
  uid: 0
};
p1 = insert(a, p1);
console.log(p1);