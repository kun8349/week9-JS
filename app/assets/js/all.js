

let productsData = [];
let cartData = [];
//產品列表DOM
const productWrap = document.querySelector('.productWrap');
//篩選器DOM
const productSelect = document.querySelector('.productSelect');
//購物車列表+單筆刪除購物車DOM
const cartListBody = document.querySelector('[data-cartList-body]');
const cartListFoot = document.querySelector('[data-cartList-foot]');
//刪除全部購物車DOM
const discardAllBtn = document.querySelector('.discardAllBtn');
//送出訂單DOM
const customerName = document.querySelector('#customerName');
const customerPhone = document.querySelector('#customerPhone');
const customerEmail= document.querySelector('#customerEmail')
const customerAddress = document.querySelector('#customerAddress');
const tradeWay = document.querySelector('#tradeWay');
const submit = document.querySelector('[data-submit]');




//初始化網站
function init(){
  renderProduct();
  getCartList();
  
}
init();

//渲染產品列表
function renderProduct(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
  .then(function(response){
      productsData = response.data.products;
      let str = '';
      productsData.forEach(item => {
        str += 
        mixProductHTML(item);
      });
      productWrap.innerHTML = str;
  })
}

//消除重複-innerHTML
function mixProductHTML(item){
   return `<li class="productCard">
   <h4 class="productType">新品</h4>
   <img src="${item.images}" alt="">
   <a href="#" class="addCardBtn" data-id='${item.id}'>加入購物車</a>
   <h3>${item.title}</h3>
   <del class="originPrice">NT$${thousand(item.origin_price)}</del>
   <p class="nowPrice">NT$${thousand(item.price)}</p>
</li>`

   
}

//篩選器
productSelect.addEventListener('change',e=>{
  console.log();
  const txt = e.target.value;
  if(txt === '全部'){
    renderProduct();
    return;
  }
  let str = '';
  let filterAry = [];
  productsData.forEach(item=>{
    if(item.category === txt){
      str += 
      mixProductHTML(item);

    }
  })
  productWrap.innerHTML = str;
})

//取得購物車列表
function getCartList(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
  .then(response=>{
    cartData = response.data.carts;
    let str = ''
    cartData.forEach(item=>{
      str += `<tr class='shoppingCart-bottom'>
                <td>
                    <div class="cardItem-title">
                        <img src="${item.product.images}" alt="">
                        <p>${item.product.title}</p>
                    </div>
                </td>
                <td>NT$${thousand(item.product.price)}</td>
                <td>${item.quantity}</td>
                <td>NT$${thousand(item.product.price*item.quantity)}</td>
                <td class="discardBtn">
                    <a data-product='${item.id}' href="#" class="material-icons">
                        clear
                    </a>
                </td>
              </tr>`
    })
    cartListBody.innerHTML = str;
    cartListFoot.textContent = `NT${thousand(response.data.finalTotal)}`
  }).catch(error=>{
    console.log(error.data);
  })
}

//加入購物車
productWrap.addEventListener('click',e=>{
  e.preventDefault();
  discardAllBtn.classList.remove('discss');
  const txtId = e.target.getAttribute('data-id');
  let num = 1;
  cartData.forEach(item=>{
    if(item.product.id===txtId){
      num += 1;
    }
  })
  if(e.target.nodeName !== 'A'){return};
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
    "data": {
      "productId": txtId,
      "quantity": num
    }
  }).then(response=>{
    alert('產品加入成功');
    getCartList();
  }).catch(error=>{
    console.log(error.data);
  })
})

//刪除全部購物車
discardAllBtn.addEventListener('click',e=>{
  e.preventDefault();
  discardAllBtn.classList.add('discss');
  deleteAll();  
})
function deleteAll(){
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(response=>{
      alert('產品全部刪除成功');
      getCartList();
      
    }).catch(error=>{
      console.log(error.data);
    })
}

//單筆刪除購物車
cartListBody.addEventListener('click',e=>{
  e.preventDefault();
  if(e.target.nodeName !=='A'){return};
  let id = e.target.getAttribute('data-product');
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${id}`)
    .then(response=>{
      alert('產品刪除成功!');
      getCartList();

    }).catch(error=>{
      console.log(error.data);
    })
  if(cartData.length<=1){discardAllBtn.classList.add('discss');}
})

//送出表單資料
submit.addEventListener('click',e=>{
  e.preventDefault();
  if(cartData.length==0){return alert('請加入購物車清單')}
  if(customerName.value == ''|| customerPhone.value == ''||customerEmail.value == ''||customerAddress.value == ''||tradeWay.value == '')
  {return alert('請填寫正確訂單資訊')}
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,{
  "data": {
    "user": {
      "name": customerName.value,
      "tel": customerPhone.value,
      "email": customerEmail.value,
      "address": customerAddress.value,
      "payment": tradeWay.value
    }
  }
  }).then(response=>{
    alert('訂單建立成功')
    customerName.value = '';
    customerPhone.value = '';
    customerEmail.value = '';
    customerAddress.value = '';
    tradeWay.value = 'ATM';
    cartData.length = 0;
    getCartList();
  }).catch(error=>{
    console.log(response.data);
  })
  
})

//驗證
//綁驗證value的DOM
const inputs = document.querySelectorAll("input[name],select[data=payment]");
//綁整個表單的DOM
const form = document.querySelector(".orderInfo-form");
//validate格式
const constraints = {
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
  },
};


inputs.forEach((item) => {
  item.addEventListener("change", function () {
    //更換成空字串
    item.nextElementSibling.textContent = '';
    let errors = validate(form, constraints) || '';
    console.log(errors)

    if (errors) {
      Object.keys(errors).forEach(function (keys) {
        // console.log(document.querySelector(`[data-message=${keys}]`))
        document.querySelector(`[data-message="${keys}"]`).textContent = errors[keys];
      })
    }
  });
});


//utility js
function thousand(num){
  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}



