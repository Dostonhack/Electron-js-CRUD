const productForm = document.getElementById('productForm')

const { remote } = require('electron')

// const main = remote.require("./main.js")
const main = require('../main')
const productName = document.getElementById('name')
const productPrice = document.getElementById('price')
const productDescription = document.getElementById('description')
const productsList = document.getElementById('products')

let products = []
let editingStatus = true
let editProductId = ''

// This Add product in MySql
productForm.addEventListener('submit', async (e)=>{
    e.preventDefault()
    
    const newProduct = {
        name: productName.value,
        price:productPrice.value,
        description:productDescription.value
    
    }
    
    if(!editingStatus){
        const result= await main.createProduct(newProduct)
        console.log(result)
    
    } else {
        await main.updateProduct(editProductId, newProduct)
        editProductId = ''
        editingStatus = false
    }
    
    productForm.reset();
    productName.focus();

    getProducts()
})

// This Get Product 

async function deleteProduct(id){
    const response = confirm('Are your sure you want to delete it ?');
    if(response){
        await main.deleteProduct(id)
        await getProducts();
    }
    return;
    
}

async function editProduct (id){
    const product = await main.getProductById(id);
    product.forEach(element =>{
        productName.value = element.name;
        productPrice.value = element.price
        productDescription.value = element.description
        editProductId = element.Id
    })

    editingStatus = true;
    

}

function renderProducts(products){
    productsList.innerHTML = ''

    products.forEach(element => {
        productsList.innerHTML += `
        <div class = "card card-body my-2 animate__animated animate__bounce  ">
            <h4> ${element.name}</h4>
            <p> ${element.description}</p>
            <h3> ${element.price}</h3>
            <p>
                <button class="btn btn-danger" onClick= "deleteProduct('${element.Id}')">
                    Delete
                </button>
                <button class="btn btn-secondary" onclick = "editProduct('${element.Id}')">
                    Edit
                </button>
            </p>
        </div>
        `
        
    });

}


const getProducts =  async() =>{
    products = await main.getProducts();
    renderProducts(products)
}

async function init(){
    getProducts()
}

init()