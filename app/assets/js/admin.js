


//DOM訂單資訊
const dataAdmin = document.querySelector('[data-admin]');
//DOM刪除全部
const delAll = document.querySelector('.js-delAll');

//訂單資訊
let orderData = [];
//初始化網站
function init(){
    renderOrderList();
    
}
init();

//C3
function renderC3(){
    //C3
    let totalObj = {};
    let c3Data = []; 
    //1.轉物件{床架: 24000,收納: 2670,窗簾: 1200}
    orderData.forEach(item=>{
        item.products.forEach(product=>{
            if(totalObj[product.category]==undefined){
                totalObj[product.category] = product.price*product.quantity;
            }else{
                totalObj[product.category] += product.price*product.quantity;
            }
        })
    })
    // 2.轉成[['收納', 2670],['床架', 24000],['窗簾', 1200]];
    c3Data = Object.entries(totalObj);
    // 3.丟進套件
    let chart = c3.generate({
        bindto: '#chart', 
        data: {
            type: "pie",
            columns: c3Data,
            colors:{
                "床架":"#DACBFF",
                "窗簾":"#5434A7",
                "收納": "#9D7FEA",
                "其他": "#301E5F",
            }
        },
    });
}

//渲染訂單資訊
function renderOrderList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
        headers:{
            'Authorization':token,
        } 
    })
    .then(res=>{
        orderData=res.data.orders;
        let str = '';
        renderC3();
        orderData.forEach(item => {
            
            //訂單時間
            const time = new Date(item.createdAt*1000);
            const changeTime = `${time.getFullYear()}/${time.getMonth()+1}/${time.getDate()}`
            //組合產品字串
            let productStr = '';
            item.products.forEach(item=>{
                productStr += `<p>${item.title} X${item.quantity}</p>`;
            })
            //訂單狀態
            let status = '';
            if(item.paid === false){
                status = '未處理'
            }else if(item.paid === true){
                status = '已處理'
            }
            //渲染order list
            str += `<tr>
                <td>${item.id}</td>
                <td>
                    <p>${item.user.name}</p>
                    <p>${item.user.tel}</p>
                </td>
                <td>${item.user.address}</td>
                <td>${item.user.email}</td>
                <td data-productHTML>
                   ${productStr}
                </td>
                <td>${changeTime}</td>
                <td class="orderStatus-admin">
                    <a href="#" data-status='${item.paid}' data-id='${item.id}'>${status}</a>
                </td>
                <td>
                    <input type="button" class="delSingleOrder-Btn" value="刪除" data-id='${item.id}'>
                </td>
            </tr>`
        });
        dataAdmin.innerHTML=str;
        
    })
    .catch(err=>{
        console.log(err);
    })
       
}

//訂單狀態+單筆刪除
dataAdmin.addEventListener('click',e=>{
    e.preventDefault();
    if(e.target.nodeName == 'TD' || e.target.nodeName == 'P'){return}
    //訂單狀態
    if(e.target.nodeName === 'A'){
        let statusId = e.target.getAttribute('data-id');
        
        let statusOrder ;
        if(e.target.getAttribute('data-status')==='false'){
            statusOrder = false;
        }else{
            statusOrder = true;
        }
        orderStatus(statusId,statusOrder);
        
    }
    //單筆刪除
    if(e.target.nodeName === 'INPUT'){
        let deleteId = e.target.getAttribute('data-id');
        orderDelete(deleteId);
    }
})
//修改狀態函式
function orderStatus(id,status){
    let newStatus;
    if(status === false){
        newStatus = true;
    }else{
        newStatus = false;
    }

    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
        "data": {
            "id": id,
            "paid": newStatus
          }
        },{
        headers:{
            'Authorization':token,
        } 
    })
    .then(res=>{
        alert('訂單狀態修改成功')
        renderOrderList();
    })
    .catch(err=>{
        console.log(err);
    })
}
//刪除單筆函式
function orderDelete(id){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`,
    {
        headers:{
            'Authorization':token,
        } 
    })
    .then(res=>{
        alert('單筆刪除成功');
        renderOrderList();
    })
    .catch(err=>{
        console.log(err.data);
    })
}

//全部刪除
delAll.addEventListener('click',e=>{
    e.preventDefault();
    orderDeleteAll();
    
})
function orderDeleteAll(){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
        headers:{
            'Authorization':token,
        } 
    })
    .then(res=>{
        alert('全部刪除成功');
        renderOrderList();
    })
    .catch(err=>{
        console.log(err.data);
    })
}




//優化
//1.餅圖
//2.小數點