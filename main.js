//Traer info del array principal en el JSON

document.addEventListener("DOMContentLoaded", function () {
	//llamar el archivo JSON
	fetch('data.json')
		.then(response => response.json())
		.then(data => {
			// traer los datos del JSON y imprimirlos en el HTML
			const productosContainer = document.getElementById('productos-container');

			data.forEach(producto => {
				const productoDiv = document.createElement('div');
				productoDiv.classList.add('item');
				productoDiv.innerHTML = `
					<figure>
						<img src="${producto.picture}" alt="producto">
					</figure>
					<div class="info-product">
						<center><h2>${producto.title}</h2></center>				
						<center><p class="price">$${producto.price}</p></center>
						<button class="btn-add-cart">Añadir al carrito</button>
					</div>
				`;
				productosContainer.appendChild(productoDiv);
			});
		})
});

//traer elementos de la API 

//variable donde se almacenaran los datos
const listado = document.getElementById("listado");

//fetch para pedir datos de la api
const pedirDatos = async () => {
  const response = await fetch("https://fakestoreapi.com/products");
  const data = await response.json();

  //bucle para imprimir los datos de la api
  data.forEach((post) => {
    const div = document.createElement("div");
	div.classList.add("producto");
    div.innerHTML = `
		<center>
        <h4>${post.title}</h4>
		<img src="https://cdn-icons-png.flaticon.com/512/8653/8653175.png " height="100px">
		<br>
        <p>Precio del Producto: ${post.price}</p>
		<h3>Descripcion del producto: </h3>
		<p>${post.description}</p>
		<p>${post.category}</p>
		</center>
    `;
    listado.append(div);
  });
};

//llamar funcion del fetch
pedirDatos();

//variables para usuario
let usuario;
let usuarioStorage = localStorage.getItem("usuario");

// Validación del usuario
if (usuarioStorage) {
    // Si el usuario ya está almacenado en localStorage usarlo
    usuario = usuarioStorage;
	Swal.fire({
		position: "top-end",
		title: `Bienvenido de nuevo ${usuario}`,
		showConfirmButton: false,
 		timer: 1000
			});
} else {
    // Si no está almacenado, usa Swal.fire para solicitarlo
    Swal.fire({
        title: "Bienvenido a nuestra tienda \nIngresa un usuario",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Ingresar",
		inputValidator: nombre => {
            // Si el valor es válido, debes regresar undefined. Si no, una cadena
            if (!nombre) {
                return "Por favor escribe un nombre de usuario";
            } else {
                return undefined;
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, se asigna el valor y se alamacena en localStorage
            usuario = result.value;
            localStorage.setItem("usuario", usuario);
            Swal.fire({
				title: `Bienvenido ${usuario}`,
			   });

			   setTimeout (() => {
				location.reload()
				    }, 1500)
			
        } else {
            // Si el usuario cancela se recarga la pagina
            Swal.fire({
				title: `Has cancelado el proceso de registro de usuario`,
			});
			setTimeout (() => {
				location.reload()
			}, 3000)   
			
        }
    });
}

// Actualizar el elemento HTML con el nombre de usuario
let userTitle = document.getElementById("userTitle");
userTitle.append(usuario);


//Boton de carrito y contenedor de productos del carrito
const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector(
	'.container-cart-products'
);

//Evento de Boton para mostrar el carrito de compras
btnCart.addEventListener('click', () => {
	containerCartProducts.classList.toggle('hidden-cart');
});

/* ========================= */
const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

// Lista de todos los contenedores de productos
const productsList = document.querySelector('.container-items');

// Variable de arreglos de Productos vacia para añadir los productos
let allProducts = [];

//variable para almacenar el valor total
const valorTotal = document.querySelector('.total-pagar');

//variable para almacenar la cantidad de productos seleccionados en el carrito
const countProducts = document.querySelector('#contador-productos');

//variable para carrito vacio
const cartEmpty = document.querySelector('.cart-empty');

//variable para el total de items en el carrito
const cartTotal = document.querySelector('.cart-total');

//funcion para añadir productos al carrito
productsList.addEventListener('click', e => {
	Swal.fire({
		title: "Esta seguro de añadir el producto?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Si, seguro",
		cancelButtonText: "No, no quiero",
	  }).then((result) =>{
		if (result.isConfirmed){
			if (e.target.classList.contains('btn-add-cart')) {
				const product = e.target.parentElement;
		
				//añadimos el producto tomando sus valores
				const infoProduct = {
					quantity: 1,
					title: product.querySelector('h2').textContent,
					price: product.querySelector('p').textContent,
				};
		
				//hacemos una validacion de si el producto existe, lo tomamos como producto duplicado si se cumple
				const exits = allProducts.some(
					product => product.title === infoProduct.title
				);
		
				if (exits) {
					const products = allProducts.map(product => {
						if (product.title === infoProduct.title) {
							product.quantity++;
							return product;
						} else {
							return product;
						}
					});
					allProducts = [...products];
				} else {
					allProducts = [...allProducts, infoProduct];
				}
		
				showHTML();
			}
			localStorage.setItem("allProducts", JSON.stringify(allProducts));

			Swal.fire({
				title: "Añadido al carrito",
				icon: "success",
				text: "El producto ha sido añadido",
			});
		}
	  });
	
});

//funcion para eliminar productos del carrito
rowProduct.addEventListener('click', e => {
	Swal.fire({
		title: "Esta seguro de eliminar el producto?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Si, seguro",
		cancelButtonText: "No, no quiero",
	  }).then((result) =>{
		if (result.isConfirmed){

			if (e.target.classList.contains('icon-close')) {
				const product = e.target.parentElement;
				const title = product.querySelector('p').textContent;
		
				allProducts = allProducts.filter(
					product => product.title !== title
				);
		
				console.log(allProducts);
					
				showHTML();
			}

			localStorage.setItem("allProducts", JSON.stringify(allProducts));
				
			Swal.fire({
				title: "Eliminado del carrito",
				icon: "success",
				text: "El producto ha sido eliminado",
			});
		}
	  });
	
});


//almacenar productos seleccionados en el carrito en el storage
const storedProducts = localStorage.getItem("allProducts");

//parsear a JSON
if (storedProducts) {
    // Parsear la cadena JSON y asignarla a la variable allProducts
    allProducts = JSON.parse(storedProducts);
}

//almacenar productos
const saveToLocalStorage = () => {
    // Convertir el array allProducts a cadena JSON y almacenarlo
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
};

// Funcion para mostrar  HTML despues de añadir productos y mantenerlo oculto cuando esta vacio
const showHTML = () => {
	if (!allProducts.length) {
		cartEmpty.classList.remove('hidden');
		rowProduct.classList.add('hidden');
		cartTotal.classList.add('hidden');
	} else {
		cartEmpty.classList.add('hidden');
		rowProduct.classList.remove('hidden');
		cartTotal.classList.remove('hidden');
	}

	// Limpiar HTML
	rowProduct.innerHTML = '';

	//Mostrar Productos añadidos al carrito
	let total = 0;
	let totalOfProducts = 0;
	
	//Bucle para mostrar todos los productos añadidos al carrito
	allProducts.forEach(product => {
		const containerProduct = document.createElement('div');
		containerProduct.classList.add('cart-product');

		containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;
		
		rowProduct.append(containerProduct);

		//mostrar cantidad de productos e incluir si hay duplicados
		total = total + parseInt(product.quantity * product.price.slice(1));
		totalOfProducts = totalOfProducts + product.quantity;

	});

	//suma de elementos del total del carrito
	valorTotal.innerText = `$${total}`;
	countProducts.innerText = totalOfProducts;

	//guardar info en el storage
	saveToLocalStorage();
};

showHTML();

