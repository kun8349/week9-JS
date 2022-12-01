let orderData = [];

//DOM訂單資訊
const dataAdmin = document.querySelector('[data-admin]');
//DOM訂單狀態



//初始化網站
function init(){
    renderOrderList();
}
init();



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
        orderData.forEach(item => {
            //組合產品字串
            let productStr = '';
            item.products.forEach(item=>{
                productStr += `<p>${item.title} X${item.quantity}</p>`;
            })
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
                <td>${item.createdAt}</td>
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
        let status = e.target.getAttribute('data-status');
        
        orderStatus(statusId,status)
        console.log(status);
    }
    // console.log(e.target.getAttribute('data-id'));

    
    
    
})

//修改狀態函式
function orderStatus(id,status){
    let newStatus;
    if(status === true){
        newStatus = false;
    }else if(status === false){
        newStatus = true;
    }
    console.log(newStatus);
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
        renderOrderList();
    })
    .catch(err=>{
        console.log(err);
    })
}


//刪除單筆函式