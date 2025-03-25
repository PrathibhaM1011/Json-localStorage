let container = document.getElementById("container");
let btnContainer = document.getElementById("btn-container");

async function getData() {
    try {
        let response = await fetch("https://just-caramel-carnation.glitch.me/products");
        if (!response.ok) {
            throw new Error("HTTP Error: " , response.status);
        }
        let result = await response.json();

        localStorage.setItem("products", JSON.stringify(result));

        let products = JSON.parse(localStorage.getItem("products"));
        displayData(products);

    } catch (err) {
        console.error(err);
    }
}

function displayData(products) {
    
    container.innerHTML = "";

    if (!products || products.length === 0) {
        container.innerHTML = `<h1>No Data Available</h1>`;
        return;
    }
    else{

        
    products.forEach(product => {
        let { images, title, description, price, rating, category, id } = product;

        let imageSrc = "https://www.freeiconspng.com/uploads/no-image-icon-1.jpg"; // Default image

        if (images && images.length > 0) {
            imageSrc = images[0]; // Use the first image if available
        }

        let item = document.createElement("div");
        
        item.className = "item";

        item.innerHTML = `
            <img src="${imageSrc}">
            <p><strong>Title:</strong> ${title}</p>
            <p> <strong>Price:</strong> $${price}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p class="rating" style="color:red; font-weight:600"><strong>Rating:</strong> <span style="font-size:20px">⭐️</span>${rating}</p>
            <p><b>Category: ${category}</b></p>
            <button class="delete-btn" onclick="deleteItem(${id})">Delete</button>
        `;

        container.appendChild(item);
    });

    displayButtons();
}
}

function displayButtons() {
    btnContainer.innerHTML = ""; 

    let products = JSON.parse(localStorage.getItem("products"));

   
    let select = document.createElement("select");
    select.id = "categoryDropdown";

    
    let defaultOption = document.createElement("option");
    defaultOption.textContent = "Select a Category";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

   
    new Set(products.map(product => product.category)).forEach(category => {
        let option = document.createElement("option");
        option.textContent = category;
        option.value = category;
        select.appendChild(option);
    });

    btnContainer.appendChild(select);

    
    select.addEventListener("change", function() {
        let selectedValue = document.getElementById("categoryDropdown").value;
        filterData(selectedValue, products);
    });
}

function filterData(selectedCategory, products) {
    let filteredProducts = products.filter(product => product.category === selectedCategory);
    displayData(filteredProducts);
}


async function deleteItem(id) {
    console.log("Deleting item with ID:", id);

   
    let deleteButton = document.querySelector(`button[onclick="deleteItem(${id})"]`);

    let loader = document.createElement("div");
    loader.className = "loader";

    
    deleteButton.after(loader);

    
    setTimeout(async () => {
        try {
            let response = await fetch(`https://just-caramel-carnation.glitch.me/products/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                let products = JSON.parse(localStorage.getItem("products"));

                products = products. filter(product=> product.id != id)
                console.log(`Item with ID ${id} deleted successfully`);
                getData(); 
            } else {
                console.error("Failed to delete item:", response.status);
            }
        } catch (err) {
            console.error("Error deleting item:", err);
        } 
            
        loader.remove(); 
        
    }, 2000);
}

getData();