"use strict";

var productsData = [];
var productWrap = document.querySelector('.productWrap');
var productSelect = document.querySelector('.productSelect'); //初始化網站

function init() {
  renderProduct();
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
} //消除重複-印innerHTML


function mixProductHTML(item) {
  return "<li class=\"productCard\">\n   <h4 class=\"productType\">\u65B0\u54C1</h4>\n   <img src=\"".concat(item.images, "\" alt=\"\">\n   <a href=\"#\" class=\"addCardBtn\">\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n   <h3>").concat(item.title, "</h3>\n   <del class=\"originPrice\">NT$").concat(item.origin_price, "</del>\n   <p class=\"nowPrice\">NT$").concat(item.price, "</p>\n</li>");
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
});
//# sourceMappingURL=all.js.map
