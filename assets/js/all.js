"use strict";

var api_path = 'kevin';
var token = 'ueJmhsnczaYWpT00AQFG9GxbHxN2';
var productsData = [];
var cartData = []; //產品列表DOM

var productWrap = document.querySelector('.productWrap'); //篩選器DOM

var productSelect = document.querySelector('.productSelect'); //購物車列表+單筆刪除購物車DOM

var cartListBody = document.querySelector('[data-cartList-body]');
var cartListFoot = document.querySelector('[data-cartList-foot]'); //刪除全部購物車DOM

var discardAllBtn = document.querySelector('.discardAllBtn'); //送出訂單DOM

var customerName = document.querySelector('#customerName');
var customerPhone = document.querySelector('#customerPhone');
var customerEmail = document.querySelector('#customerEmail');
var customerAddress = document.querySelector('#customerAddress');
var tradeWay = document.querySelector('#tradeWay');
var submit = document.querySelector('[data-submit]'); //初始化網站

function init() {
  renderProduct();
  getCartList();
}

init(); //渲染產品列表

function renderProduct() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/products")).then(function (response) {
    productsData = response.data.products;
    var str = '';
    productsData.forEach(function (item) {
      str += mixProductHTML(item);
    });
    productWrap.innerHTML = str;
  });
} //消除重複-innerHTML


function mixProductHTML(item) {
  return "<li class=\"productCard\">\n   <h4 class=\"productType\">\u65B0\u54C1</h4>\n   <img src=\"".concat(item.images, "\" alt=\"\">\n   <a href=\"#\" class=\"addCardBtn\" data-id='").concat(item.id, "'>\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n   <h3>").concat(item.title, "</h3>\n   <del class=\"originPrice\">NT$").concat(item.origin_price, "</del>\n   <p class=\"nowPrice\">NT$").concat(item.price, "</p>\n</li>");
} //篩選器


productSelect.addEventListener('change', function (e) {
  console.log();
  var txt = e.target.value;

  if (txt === '全部') {
    renderProduct();
    return;
  }

  var str = '';
  var filterAry = [];
  productsData.forEach(function (item) {
    if (item.category === txt) {
      str += mixProductHTML(item);
    }
  });
  productWrap.innerHTML = str;
}); //取得購物車列表

function getCartList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts")).then(function (response) {
    cartData = response.data.carts;
    var str = '';
    cartData.forEach(function (item) {
      str += "<tr class='shoppingCart-bottom'>\n                <td>\n                    <div class=\"cardItem-title\">\n                        <img src=\"".concat(item.product.images, "\" alt=\"\">\n                        <p>").concat(item.product.title, "</p>\n                    </div>\n                </td>\n                <td>NT$").concat(item.product.price, "</td>\n                <td>").concat(item.quantity, "</td>\n                <td>NT$").concat(item.product.price * item.quantity, "</td>\n                <td class=\"discardBtn\">\n                    <a data-product='").concat(item.id, "' href=\"#\" class=\"material-icons\">\n                        clear\n                    </a>\n                </td>\n              </tr>");
    });
    cartListBody.innerHTML = str;
    cartListFoot.textContent = "NT".concat(response.data.finalTotal);
  })["catch"](function (error) {
    console.log(error.data);
  });
} //加入購物車


productWrap.addEventListener('click', function (e) {
  e.preventDefault();
  discardAllBtn.classList.remove('discss');
  var txtId = e.target.getAttribute('data-id');
  var num = 1;
  cartData.forEach(function (item) {
    if (item.product.id === txtId) {
      num += 1;
    }
  });

  if (e.target.nodeName !== 'A') {
    return;
  }

  ;
  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts"), {
    "data": {
      "productId": txtId,
      "quantity": num
    }
  }).then(function (response) {
    alert('產品加入成功');
    getCartList();
  })["catch"](function (error) {
    console.log(error.data);
  });
}); //刪除全部購物車

discardAllBtn.addEventListener('click', function (e) {
  e.preventDefault();
  discardAllBtn.classList.add('discss');
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts")).then(function (response) {
    alert('產品全部刪除成功');
    getCartList();
  })["catch"](function (error) {
    console.log(error.data);
  });
}); //單筆刪除購物車

cartListBody.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.nodeName !== 'A') {
    return;
  }

  ;
  var id = e.target.getAttribute('data-product');
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts/").concat(id)).then(function (response) {
    alert('產品刪除成功!');
    getCartList();
  })["catch"](function (error) {
    console.log(error.data);
  });

  if (cartData.length <= 1) {
    discardAllBtn.classList.add('discss');
  }
}); //送出表單資料

submit.addEventListener('click', function (e) {
  e.preventDefault();

  if (cartData.length == 0) {
    return alert('請加入購物車清單');
  }

  if (customerName.value == '' || customerPhone.value == '' || customerEmail.value == '' || customerAddress.value == '' || tradeWay.value == '') {
    return alert('請填寫正確訂單資訊');
  }

  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts"), {
    "data": {
      "user": {
        "name": customerName.value,
        "tel": customerPhone.value,
        "email": customerEmail.value,
        "address": customerAddress.value,
        "payment": tradeWay.value
      }
    }
  }).then(function (response) {
    console.log(response.data);
    alert('訂單建立成功');
  })["catch"](function (error) {
    console.log(response.data);
  });
});
//# sourceMappingURL=all.js.map
