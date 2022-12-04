"use strict";

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
  return "<li class=\"productCard\">\n   <h4 class=\"productType\">\u65B0\u54C1</h4>\n   <img src=\"".concat(item.images, "\" alt=\"\">\n   <a href=\"#\" class=\"addCardBtn\" data-id='").concat(item.id, "'>\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n   <h3>").concat(item.title, "</h3>\n   <del class=\"originPrice\">NT$").concat(thousand(item.origin_price), "</del>\n   <p class=\"nowPrice\">NT$").concat(thousand(item.price), "</p>\n</li>");
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
      str += "<tr class='shoppingCart-bottom'>\n                <td>\n                    <div class=\"cardItem-title\">\n                        <img src=\"".concat(item.product.images, "\" alt=\"\">\n                        <p>").concat(item.product.title, "</p>\n                    </div>\n                </td>\n                <td>NT$").concat(thousand(item.product.price), "</td>\n                <td>\n                  <div class='d-flex justify-content-center align-items-center'>\n                    <a href=\"#\"><span class=\"material-icons cartAmount-icon\" data-id=\"").concat(item.id, "\">remove</span></a>\n                    <p data-change>").concat(item.quantity, "</p>\n                    <a href=\"#\"><span class=\"material-icons cartAmount-icon\" data-id=\"").concat(item.id, "\" data-qty=\"").concat(item.quantity, "\">add</span></a>\n                  </div>\n                </td>\n                <td>NT$").concat(thousand(item.product.price * item.quantity), "</td>\n                <td class=\"discardBtn\">\n                    <a data-product='").concat(item.id, "' href=\"#\" class=\"material-icons\">\n                        clear\n                    </a>\n                </td>\n              </tr>");
    });
    cartListBody.innerHTML = str;
    cartListFoot.textContent = "NT".concat(thousand(response.data.finalTotal)); //新增功能:修改數量

    var cartAmountBtn = document.querySelectorAll('.cartAmount-icon');
    cartAmountBtn.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        var id = e.target.getAttribute('data-id');
        var qty = Number(e.target.getAttribute('data-qty'));

        if (e.target.textContent === 'add') {
          qty += 1;
        } else if (e.target.textContent === 'remove') {
          qty -= 1;
        }

        axios.patch("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts"), {
          "data": {
            "id": id,
            "quantity": qty
          }
        }).then(function (res) {
          alert('修改數量成功');
          getCartList();
        })["catch"](function (error) {
          console.log(error.data);
        });
      });
    });
  });
} //新增功能:修改購物車數量
//加入購物車


productWrap.addEventListener('click', function (e) {
  e.preventDefault();
  discardAllBtn.classList.remove('discss');
  var txtId = e.target.getAttribute('data-id');
  var num = 1;
  cartData.forEach(function (item) {
    if (item.product.id === txtId) {
      num = item.quantity += 1;
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
  deleteAll();
});

function deleteAll() {
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts")).then(function (response) {
    alert('產品全部刪除成功');
    getCartList();
  })["catch"](function (error) {
    console.log(error.data);
  });
} //單筆刪除購物車


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

  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/orders"), {
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
    alert('訂單建立成功');
    customerName.value = '';
    customerPhone.value = '';
    customerEmail.value = '';
    customerAddress.value = '';
    tradeWay.value = 'ATM';
    cartData.length = 0;
    getCartList();
  })["catch"](function (error) {
    console.log(response.data);
  });
}); //驗證
//綁驗證value的DOM

var inputs = document.querySelectorAll("input[name],select[data=payment]"); //綁整個表單的DOM

var form = document.querySelector(".orderInfo-form"); //validate格式

var constraints = {
  "姓名": {
    presence: {
      message: "必填欄位"
    }
  },
  "電話": {
    presence: {
      message: "必填欄位"
    },
    length: {
      minimum: 8,
      message: "需超過 8 碼"
    }
  },
  "Email": {
    presence: {
      message: "必填欄位"
    },
    email: {
      message: "格式錯誤"
    }
  },
  "寄送地址": {
    presence: {
      message: "必填欄位"
    }
  },
  "交易方式": {
    presence: {
      message: "必填欄位"
    }
  }
};
inputs.forEach(function (item) {
  item.addEventListener("change", function () {
    //更換成空字串
    item.nextElementSibling.textContent = '';
    var errors = validate(form, constraints) || '';
    console.log(errors);

    if (errors) {
      Object.keys(errors).forEach(function (keys) {
        // console.log(document.querySelector(`[data-message=${keys}]`))
        document.querySelector("[data-message=\"".concat(keys, "\"]")).textContent = errors[keys];
      });
    }
  });
}); //utility js

function thousand(num) {
  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
//# sourceMappingURL=all.js.map
