const url = 'http://127.0.0.1:8000/'

let searchObject = {
    'search_term': '',
    'search_criteria': 'first_name',
};

let registrationObject ={
    'id': 0,
    'first_name':'',
    'last_name':'',
    'phone':'N/A',
    'addrress':'N/A',
    'postal':'N/A',
    'customer_type':'R',
}

const editCustomer = document.querySelector('.edit-customer');
const addnew = document.querySelector('.add-new');
const dropdown = document.querySelector('.search-criteria');
const searchForm = document.querySelector('.search-bar');
const searchResultContainer = document.querySelector('.search-results');
const typeDrop = document.querySelector('.type-list');
const registrationForm = document.querySelector('.registration-form');
const detailForm = document.querySelector('.detail-form');
const saveCustomer =document.querySelector('.save-customer');
const typeDetailList = document.querySelector("#detail-customer-type-list")
const close = document.querySelectorAll('.close');




window.onload = function() {
    // changeing criteria when dropdown is changed
    dropdown.addEventListener('click',(e)=>{
        searchObject['search_criteria'] = e.path[0].innerText;
    });

    typeDrop.addEventListener('click',(e)=>{
        let customer_type= e.path[0].innerText;
        registrationObject['customer_type'] = customer_type.charAt(0);
    });

    close.forEach((bttn)=>{
        bttn.addEventListener('click',()=>{
            editCustomer.removeAttribute('disabled');
            saveCustomer.setAttribute('disabled','True');
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
    removeAllChildNodes(searchResultContainer);
    getSearchResult(searchObject);
    searchObject["search_criteria"] = 'first_name';
});

//submit the add item form
registrationForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    console.log(e);
    registrationObject['first_name'] = registrationForm.last_name_input.value;
    registrationObject['last_name'] = registrationForm.first_name_input.value;
    registrationObject['phone'] = registrationForm.phone_input.value;
    registrationObject['address'] = registrationForm.address_input.value;
    registrationObject['postal'] = registrationForm.postal_input.value;

    registrationForm.last_name_input.value ='';
    registrationForm.first_name_input.value ='';
    registrationForm.phone_input.value ='';
    registrationForm.address_input.value ='';
    registrationForm.postal_input.value ='';
    submitCustomer(registrationObject);
})



// edit item
editCustomer.addEventListener('click', editCustomerInfo);
detailForm.addEventListener('submit',submitCustomerEdit);
typeDetailList.parentElement.addEventListener('click',(e)=>{
    let customer_type= e.path[0].innerText;
    registrationObject['customer_type'] = customer_type.charAt(0);
});


function getSearchResult(params){
    let query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
    let search_url = url +'search/customer?'+ query;
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
                    <p class='col'>ID: ${result_object['id']}</p>
                    <p class='col'>Name: ${result_object['first_name']} ${result_object['last_name']}</p>
                    <p class='col'>Type: ${result_object['customer_type']}</p>
                    <p class='col'>Address: ${result_object['address']}, ${result_object['postal']}</p>
                    <p class='col'>Phone: ${result_object['phone']}</p>
                    <div class=" col-3 button-group">
                        <button type="button" class="btn delete">delete</button>
                        <button type="button" class="btn details" data-bs-toggle="modal" data-bs-target="#seeDetails">details</button>
                    </div>
                </div>
                <hr>
            </div>
        `;
        searchResultContainer.appendChild(item);
    })
    document.querySelectorAll('.delete').forEach(item=>{ item.addEventListener('click', deleteCustomer)});
    document.querySelectorAll('.details').forEach(item=>{ item.addEventListener('click', seeCustomerDetails)});
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function deleteCustomer(e){
    let id = {'id':e.path[2].id};
    let query = Object.keys(id)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(id[k]))
    .join('&');
    let search_url = url +'delete/customer?'+ query;
    fetch(search_url, {'method':'post'})
    .then(response=>response.json())
    .then(data=>removeResult(data))
    .catch(err=>console.log(err))
}


function submitCustomer(customer){
    let add_url = url +'add/customer';
    fetch(add_url, {'method':'post','body':JSON.stringify(customer)})
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

function seeCustomerDetails(e){
    let detail_url = url +'detail/customer?'+ `id=${e.path[2].id}`;
    fetch(detail_url)
    .then(response=>response.json())
    .then(data=>displayItemDetails(data))
    .catch(err=>console.log(err))
}

function displayItemDetails(data){
    let customerID = document.querySelector("#customer_id");
    let firstName = document.getElementById("customer_first_name_detail");
    let lastName = document.getElementById("customer_last_name_detail");
    let address = document.getElementById("customer_address_detail");
    let postal = document.getElementById("customer_postal_detail");
    let phone = document.getElementById("customer_phone_detail");
    // let type = document.querySelector("#customer_type_list");
    customerID.textContent = data['customer']['id']
    firstName.value= data['customer']['first_name'];
    lastName.value= data['customer']['last_name'];
    address.value= data['customer']['address'];
    postal.value= data['customer']['postal'];
    phone.value= data['customer']['phone'];
    registrationObject['customer_type'] = data['customer']['customer_type'];
}

function editCustomerInfo(e){
    let inputs = document.querySelectorAll('.detail-input')
    inputs.forEach(input=>{
        input.removeAttribute('disabled');
    });
    typeDetailList.removeAttribute('disabled');
    saveCustomer.removeAttribute('disabled');
    editCustomer.setAttribute('disabled','True');
}

function submitCustomerEdit(e){
    e.preventDefault();
    registrationObject['first_name'] = detailForm.customer_first_name_detail.value;
    registrationObject['last_name'] = detailForm.customer_last_name_detail.value;
    registrationObject['address'] = detailForm.customer_address_detail.value;
    registrationObject['postal'] = detailForm.customer_postal_detail.value;
    registrationObject['phone'] = detailForm.customer_phone_detail.value;
    registrationObject['id'] = parseInt(document.querySelector('#customer_id').textContent, 10);
    let edit_url = url +'edit/customer';
    fetch(edit_url, {'method':'post','body':JSON.stringify(registrationObject)})
    .then(response=>response.json())
    .then(data=>displayToast(data['message']))
    .catch(err=>console.log(err))
    let inputs = document.querySelectorAll('.detail-input')
    inputs.forEach(input=>{
        input.setAttribute('disabled',"True");
    });
    editCustomer.removeAttribute("disabled");
    saveCustomer.setAttribute('disabled',"True");
    typeDetailList.setAttribute('disabled',"True");
}