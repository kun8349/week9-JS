
let productsData = [];
const productWrap = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');

//初始化網站
function init(){
  renderProduct();
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

//消除重複-印innerHTML
function mixProductHTML(item){
   return `<li class="productCard">
   <h4 class="productType">新品</h4>
   <img src="${item.images}" alt="">
   <a href="#" class="addCardBtn">加入購物車</a>
   <h3>${item.title}</h3>
   <del class="originPrice">NT$${item.origin_price}</del>
   <p class="nowPrice">NT$${item.price}</p>
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