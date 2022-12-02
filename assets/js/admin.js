"use strict";

var orderData = []; //DOM訂單資訊

var dataAdmin = document.querySelector('[data-admin]'); //DOM訂單狀態
//初始化網站

function init() {
  renderOrderList();
}

init(); //渲染訂單資訊

function renderOrderList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
    headers: {
      'Authorization': token
    }
  }).then(function (res) {
    orderData = res.data.orders;
    var str = '';
    orderData.forEach(function (item) {
      //組合產品字串
      var productStr = '';
      item.products.forEach(function (item) {
        productStr += "<p>".concat(item.title, " X").concat(item.quantity, "</p>");
      });
      var status = '';

      if (item.paid === false) {
        status = '未處理';
      } else if (item.paid === true) {
        status = '已處理';
      } //渲染order list


      str += "<tr>\n                <td>".concat(item.id, "</td>\n                <td>\n                    <p>").concat(item.user.name, "</p>\n                    <p>").concat(item.user.tel, "</p>\n                </td>\n                <td>").concat(item.user.address, "</td>\n                <td>").concat(item.user.email, "</td>\n                <td data-productHTML>\n                   ").concat(productStr, "\n                </td>\n                <td>").concat(item.createdAt, "</td>\n                <td class=\"orderStatus-admin\">\n                    <a href=\"#\" data-status='").concat(item.paid, "' data-id='").concat(item.id, "'>").concat(status, "</a>\n                </td>\n                <td>\n                    <input type=\"button\" class=\"delSingleOrder-Btn\" value=\"\u522A\u9664\" data-id='").concat(item.id, "'>\n                </td>\n            </tr>");
    });
    dataAdmin.innerHTML = str;
  })["catch"](function (err) {
    console.log(err);
  });
} //訂單狀態+單筆刪除


dataAdmin.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.nodeName == 'TD' || e.target.nodeName == 'P') {
    return;
  } //訂單狀態


  if (e.target.nodeName === 'A') {
    var statusId = e.target.getAttribute('data-id');
    var statusOrder;

    if (e.target.getAttribute('data-status') === 'false') {
      statusOrder = false;
    } else {
      statusOrder = true;
    }

    orderStatus(statusId, statusOrder);
  } //單筆刪除


  if (e.target.nodeName === 'INPUT') {
    var deleteId = e.target.getAttribute('data-id');
    orderDelete(deleteId);
  }
}); //修改狀態函式

function orderStatus(id, status) {
  var newStatus;

  if (status === false) {
    newStatus = true;
  } else {
    newStatus = false;
  }

  axios.put("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
    "data": {
      "id": id,
      "paid": newStatus
    }
  }, {
    headers: {
      'Authorization': token
    }
  }).then(function (res) {
    alert('訂單狀態修改成功');
    renderOrderList();
  })["catch"](function (err) {
    console.log(err);
  });
} //刪除單筆函式


function orderDelete(id) {
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders/").concat(id), {
    headers: {
      'Authorization': token
    }
  }).then(function (res) {
    alert('單筆刪除成功');
    renderOrderList();
  })["catch"](function (err) {
    console.log(err.data);
  });
} //全部刪除
//優化
//1.餅圖
//2.小數點
//# sourceMappingURL=admin.js.map
