const url = 'http://127.0.0.1:8000/'

let searchObject = {
    'search_term': '',
    'search_criteria': 'name',
};

let registrationObject ={
    'id': 0,
    'name':'',
    'price':0.0,
    'qty':0,
    'supplier':0
}

const editItem = document.querySelector('.edit-item');
const addnew = document.querySelector('.add-new');
const dropdown = document.querySelectorAll('.dropdown-item');
const searchForm = document.querySelector('.search-bar');
const searchResultContainer = document.querySelector('.search-results');
const supplierDrop = document.querySelector('.supplier-list');
const registrationForm = document.querySelector('.registration-form');
const detailForm = document.querySelector('.detail-form');
const saveItem =document.querySelector('.save-item');
const close = document.querySelectorAll('.close');

let listOfSupplier = [];

window.onload = function() {
    listOfSupplier = getAllSupplier();
    // changeing criteria when dropdown is changed
    dropdown.forEach((option)=>{
        option.addEventListener('click',()=>{
            searchObject['search_criteria'] = option.textContent;
        });
    });

    supplierDrop.addEventListener('click',(e)=>{
        let sup = e.path[0].outerText;
        registrationObject['supplier'] = parseInt(sup.split('-')[0], 10);
    });

    close.forEach((bttn)=>{
        bttn.addEventListener('click',()=>{
            editItem.removeAttribute('disabled');
            saveItem.setAttribute('disabled','True');
            let inputs = document.querySelectorAll('.detail-input')
            inputs.forEach(input=>{
                input.setAttribute('disabled','True');
            });
            
        });
    });
};


// submit the seach item
searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    // searchTerm = searchText
    searchObject["search_term"] = searchForm.searchText.value;
    searchForm.searchText.value ='';
    removeAllChildNodes(searchResultContainer)
    getSearchResult(searchObject);

});

//submit the add item form
registrationForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    console.log(e);
    registrationObject['name'] = registrationForm.item_name_input.value;
    registrationObject['qty'] = parseInt(registrationForm.item_qty_input.value, 10);
    registrationObject['price'] = parseFloat(registrationForm.item_price_input.value);
    registrationForm.item_name_input.value ='';
    registrationForm.item_qty_input.value ='';
    registrationForm.item_price_input.value ='';
    submitItem(registrationObject);
})




// adding new item
addnew.addEventListener('click', addItem);

// edit item
editItem.addEventListener('click', editItemInfo);
detailForm.addEventListener('submit',submitItemEdit);


function getSearchResult(params){
    let query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
    let search_url = url +'search/item?'+ query;
    fetch(search_url, params)
    .then(response=>response.json())
    .then(data=>displayResults(data['results']))
    .catch(err=>console.log(err))
}

function displayResults(data){
    data.forEach(result=>{
        let result_object = result;
        let item = document.createElement('div');
        item.classList.add('row')
        item.innerHTML = `
            <div class row>
                <div id =${result_object['id']} class='row result-container'>
                    <p class='col'>Name: ${result_object['name']}</p>
                    <p class='col'>ID: ${result_object['id']}</p>
                    <p class='col'>Qty: ${result_object['qty']}</p>
                    <p class='col'>Price: ${result_object['price']}</p>
                    <div class=" col button-group">
                        <button type="button" class="btn delete">delete</button>
                        <button type="button" class="btn details" data-bs-toggle="modal" data-bs-target="#seeDetails">details</button>
                    </div>
                </div>
                <hr>
            </div>
        `;
        searchResultContainer.appendChild(item);
    })
    document.querySelectorAll('.delete').forEach(item=>{ item.addEventListener('click', deleteItem)});
    document.querySelectorAll('.details').forEach(item=>{ item.addEventListener('click', seeItemDetails)});
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function deleteItem(e){
    let id = {'id':e.path[2].id};
    let query = Object.keys(id)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(id[k]))
    .join('&');
    let search_url = url +'delete/item?'+ query;
    fetch(search_url, {'method':'post'})
    .then(response=>response.json())
    .then(data=>removeResult(data))
    .catch(err=>console.log(err))
}

function addItem(e){
    listOfSupplier.forEach(sup=>{
        let supplier = document.createElement('li');
        supplier.innerHTML = `
            <a class="dropdown-item" href="#">${sup['id']}-${sup['name']}</a>
        `
        document.querySelector('.supplier-list').appendChild(supplier);

    });

}

function getAllSupplier(){
    let supplier_url = url +'supplier';
    fetch(supplier_url)
    .then(response=>response.json())
    .then(data=> listOfSupplier = data['results'])
    .catch(err=>console.log(err))
}

function submitItem(item){
    let add_url = url +'add/item';
    fetch(add_url, {'method':'post','body':JSON.stringify(item)})
    .then(response=>response.json())
    .then(data=>displayToast(data['message']))
    .catch(err=>console.log(err))
}

function removeResult(data){
    var elem = document.getElementById(data["id"]);
    elem.parentNode.remove();
    displayToast(data["message"]);
    
}

function displayToast(message){
    let toastBody = document.querySelector('.toast-body');
    toastBody.textContent = message;
    let toast = document.querySelector('.toast');
    toast.classList.remove('d-none');
    window.setTimeout(()=>{toast.classList.add('d-none');}, 3000);
}

function seeItemDetails(e){
    let detail_url = url +'detail/item?'+ `id=${e.path[2].id}`;
    fetch(detail_url)
    .then(response=>response.json())
    .then(data=>displayItemDetails(data))
    .catch(err=>console.log(err))
}

function displayItemDetails(data){
    let itemID = document.querySelector("#item_id");
    let itemName = document.getElementById("item_name_detail");
    let itemQty = document.getElementById("item_qty_detail");
    let itemPrice = document.getElementById("item_price_detail");
    let supplierName = document.querySelector("#supplier_name");
    let supplierAddress = document.querySelector("#supplier_address");
    let supplierContact = document.querySelector("#supplier_contact");
    itemName.value= data['item']['name'];
    itemQty.value= data['item']['qty'];
    itemPrice.value= data['item']['price'];
    itemID.textContent = data['item']['id']
    supplierName.textContent = data['supplier']['name']
    supplierAddress.textContent = data['supplier']['address']
    supplierContact.textContent = data['supplier']['contact']
}

function editItemInfo(e){
    let inputs = document.querySelectorAll('.detail-input')
    inputs.forEach(input=>{
        input.removeAttribute('disabled');
    });
    saveItem.removeAttribute('disabled');
    editItem.setAttribute('disabled','True');
}

function submitItemEdit(e){
    // e.preventDefault();
    registrationObject['name'] = detailForm.item_name_detail.value;
    registrationObject['qty'] = parseInt(detailForm.item_qty_detail.value, 10);
    registrationObject['price'] = parseFloat(detailForm.item_price_detail.value);
    registrationObject['id'] = parseInt(document.querySelector('#item_id').textContent, 10);
    let edit_url = url +'edit/item';
    fetch(edit_url, {'method':'post','body':JSON.stringify(registrationObject)})
    .then(response=>response.json())
    .then(data=>displayToast(data['message']))
    .catch(err=>console.log(err))
    let inputs = document.querySelectorAll('.detail-input')
    inputs.forEach(input=>{
        input.setAttribute('disabled',"True");
    });
    editItem.removeAttribute("disabled");
    saveItem.setAttribute('disabled',"True");
}

    



    // detailForm


