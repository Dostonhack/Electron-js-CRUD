const {  BrowserWindow , Notification} = require('electron')
const {getConnection} = require('./database')

async function createProduct(product){
    try{
        const conn = await getConnection();
        product.price = parseFloat(product.price)
        const result = await conn.query('INSERT INTO product SET ?', product)
        

        new Notification ({
            title:'Electron MySql',
            body:'New Product Saved Successfully'
        }).show();


        product.id = result.insertId;
        return product

    }catch(error){
        console.log(error)
    }

}


async function getProducts(){
    const  conn = await getConnection();
    const getResults = await new Promise((res, rej) => {
        conn.query('SELECT * FROM product ORDER BY id DESC', (err, results)=>{
            if (err) {
                rej(err);
            }
            res(results);
        })
    }); 
    
    return getResults
}   

async function deleteProduct(id){
    const  conn = await getConnection();
    const result = await conn.query('DELETE FROM product WHERE id = ?', id );
    console.log(result)
    return result;
}

async function getProductById(id){
    const  conn = await getConnection();
    const result = await new Promise((res, rej) => {
        conn.query('SELECT * FROM product WHERE id=' + id, (err, results)=>{
            if (err) {
                rej(err);
            }
            res(results);
        })
    }); 
    
    
    return result;
}

async function updateProduct(id, product){
    const  conn = await getConnection();
    const result = await new Promise((res, rej) => {
        conn.query(`UPDATE product SET price=${product.price}, name='${product.name}', description='${product.description}' WHERE id=${id}`, product , (err, results)=>{
            if (err) {
                rej(err);
            }
            res(results);
        })
    }); 
    
    
    return result;
}



let window
function createWindow() {
    window = new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            nodeIntegration:true
        }
    })
    window.loadFile('src/ui/index.html')
}

module.exports ={

    createWindow,
    createProduct,
    getProducts,
    deleteProduct,
    getProductById,
    updateProduct
    
}