/* cliente */
console.log("hola desde el server");

const socket = io();
const form = document.getElementById("form");

// Esto es para escuchar un mensaje
socket.on("connect", () => {
    console.log("conectado al server");
});

// Esto es para escuchar la lista de productos actualizada
socket.on("products", (products) => {
    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    let rowsHTML = ""; // variable para acumular todas las filas
    products.forEach((product) => {
        const availabilityIcon = product.available
            ? "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"30\" height=\"30\" fill=\"currentColor\" color=\"green\" class=\"bi bi-check2 available\" viewBox=\"0 0 16 16\"><path d=\"M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0\"/></svg>"
            : "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"30\" height=\"30\" fill=\"currentColor\" color=\"red\" class=\"bi bi-x-lg available\" viewBox=\"0 0 16 16\"><path d=\"M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z\"/></svg>";
        rowsHTML += `
            <tr class="categories__item">
                <td class="id">${product.id}</td>
                <td class="code update" id=${product.id}>${product.code}</td>
                <td class="category update" id=${product.id}>${product.category}</td>
                <td class="title update" id=${product.id}>${product.title}</td>
                <td class="thumbnail update" id=${product.id}><a href="${product.thumbnail[0]}" target="_blank">${product.thumbnail[0]}</a></td>
                <td class="price update" id=${product.id}>${product.price}</td>
                <td class="stock update" id=${product.id}>${product.stock}</td>
                <td><a class="available" id="${product.id}">${availabilityIcon}</a></td>
                <td><a>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" color="red" class="bi bi-trash3 delete" id=${product.id} viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                </a></td>
            </tr>
        `;
    });
    tbody.innerHTML = rowsHTML; // Establecer el innerHTML de tbody una sola vez

    // Agregar event listener para los botones de eliminar
    document.querySelectorAll(".delete").forEach((button) => {
        button.addEventListener("click", function(event) {
            event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace

            const productId = this.getAttribute("id");

            // Mostrar SweetAlert para confirmar la eliminación
            Swal.fire({
                title: "¿Deseas eliminar el producto?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    // Emitir evento al servidor para eliminar el producto
                    socket.emit("delete-product", productId);

                    // Mostrar mensaje de éxito al eliminar el producto
                    Swal.fire({
                        title: "Producto eliminado ❌",
                        text: "El producto ha sido eliminado con éxito",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            });
        });
    });

    // Agregar event listener para los botones de disponibilidad
    document.querySelectorAll(".available").forEach((button) => {
        button.addEventListener("click", function() {
            const productId = this.getAttribute("id");
            socket.emit("toggle-availability", productId);
        });
    });
});

form.addEventListener("submit", function(event) {
    event.preventDefault();
    // obtener valores del formulario
    const file = document.getElementById("file").value;
    const code = document.getElementById("code").value;
    const category = document.getElementById("category").value;
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const description = document.getElementById("description").value;
    // enviar el nuevo producto al servidor a través de socket
    const product = {
        code: code,
        category: category,
        title: title,
        description: description,
        price: Number(price),
        stock: Number(stock),
        thumbnail: [file],
        available: true,
    };
    socket.emit("add-product", product);
    form.reset();

    // Mostrar SweetAlert después de enviar el producto
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto agregado con exito 😊",
        showConfirmButton: false,
        timer: 1500,
    });
});

// Esto aparece al desconectar el servidor (control+c)
socket.on("disconnect", () => {
    console.log("se desconectó el server");
});