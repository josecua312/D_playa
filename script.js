document.addEventListener('DOMContentLoaded', () => {

    // ---------- SCROLL SUAVE ----------
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if(target){
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // ---------- CARRITO ----------
    let cart = [];
    const cartDiv = document.getElementById("cart");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const toast = document.getElementById("toast");

    document.getElementById("cart-icon").addEventListener("click", () => {
        cartDiv.style.display = "block";
        renderCart();
    });

    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            const img = btn.dataset.img;

            const existing = cart.find(item => item.name === name);
            if(existing) existing.quantity++;
            else cart.push({name, price, img, quantity:1});

            showToast(`${name} agregado al carrito 🛒`);
            renderCart();
        });
    });

    function renderCart(){
        cartItemsContainer.innerHTML = "";
        let total = 0;
        if(cart.length === 0){
            cartItemsContainer.innerHTML = "<p>El carrito está vacío</p>";
            cartTotal.textContent = "Total: $0";
            return;
        }

        cart.forEach((item, index)=>{
            const subtotal = item.price * item.quantity;
            total += subtotal;
            const div = document.createElement("div");
            div.classList.add("cart-item");
            div.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-details">
                    <h4>${item.name}</h4>
                    <div class="quantity">
                        <button onclick="changeQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <span>$${subtotal}</span>
            `;
            cartItemsContainer.appendChild(div);
        });
        cartTotal.textContent = "Total: $" + total;
    }

    window.changeQuantity = function(index, amount){
        cart[index].quantity += amount;
        if(cart[index].quantity <= 0) cart.splice(index,1);
        renderCart();
    }

    window.sendOrder = function(){
        if(cart.length === 0){
            showToast("El carrito está vacío ❌", false);
            return;
        }
        showToast("Pedido enviado con éxito ✅");
        cart = [];
        renderCart();
        closeCart();
    }

    window.closeCart = function(){ cartDiv.style.display = "none"; }

    // ---------- TOAST ----------
    function showToast(msg, success=true){
        toast.textContent = msg;
        toast.style.background = success ? "#28a745" : "#dc3545";
        toast.classList.add("show");
        setTimeout(()=> toast.classList.remove("show"),3000);
    }
    window.showToast = showToast;

    // ---------- MODAL USUARIO ----------
    const userModal = document.getElementById("user-modal");
    document.getElementById("user-btn").addEventListener("click",(e)=>{
        e.preventDefault();
        userModal.classList.remove("hidden");
    });

    window.closeUserModal = function(){ userModal.classList.add("hidden"); }
    window.showLogin = function(){
        document.getElementById("login-form").classList.remove("hidden");
        document.getElementById("register-form").classList.add("hidden");
    }
    window.showRegister = function(){
        document.getElementById("register-form").classList.remove("hidden");
        document.getElementById("login-form").classList.add("hidden");
    }

    // ---------- PERFIL Y SESIÓN ----------
    function updateProfile(username, photo){
        localStorage.setItem("loggedUser", username);
        localStorage.setItem("profilePhoto", photo);
        document.getElementById("profile-user").textContent = username;
        document.getElementById("profile-pic").src = photo;
        document.getElementById("profile-icon-img").src = photo;
        document.getElementById("profile-icon").classList.remove("hidden");
        closeUserModal();
        showToast(`¡Bienvenido ${username}!`);
    }

    window.login = function(){
        const username = document.getElementById("login-user").value;
        const password = document.getElementById("login-pass").value;
        if(!username || !password){ showToast("Ingresa usuario y contraseña", false); return; }
        const savedPhoto = localStorage.getItem("profilePhoto") || "default-avatar.png";
        updateProfile(username, savedPhoto);
    }

    window.register = function(){
        const name = document.getElementById("reg-name").value;
        const email = document.getElementById("reg-email").value;
        const pass = document.getElementById("reg-pass").value;
        const photoInput = document.getElementById("reg-photo");

        if(!name || !email || !pass){ showToast("Por favor, completa todos los campos.", false); return; }

        let photoURL = "default-avatar.png";
        if(photoInput.files && photoInput.files[0]){
            const reader = new FileReader();
            reader.onload = function(e){ updateProfile(name, e.target.result); }
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            updateProfile(name, photoURL);
        }
    }

    window.logout = function(){
        localStorage.removeItem("loggedUser");
        localStorage.removeItem("profilePhoto");
        document.getElementById("profile-user").textContent = "Usuario";
        document.getElementById("profile-pic").src = "default-avatar.png";
        document.getElementById("profile-icon-img").src = "default-avatar.png";
        document.getElementById("profile-container").classList.add("hidden");
        document.getElementById("profile-icon").classList.add("hidden");
        showToast("Has cerrado sesión correctamente");
    }

    window.toggleProfile = function(){
        document.getElementById("profile-container").classList.toggle("hidden");
    }
    window.closeProfile = function(){
        document.getElementById("profile-container").classList.add("hidden");
    }

    // ---------- CARGAR PERFIL AL INICIAR ----------
    const savedUser = localStorage.getItem("loggedUser");
    const savedPhoto = localStorage.getItem("profilePhoto") || "default-avatar.png";
    if(savedUser){
        document.getElementById("profile-user").textContent = savedUser;
        document.getElementById("profile-pic").src = savedPhoto;
        document.getElementById("profile-icon-img").src = savedPhoto;
        document.getElementById("profile-icon").classList.remove("hidden");
    } else {
        document.getElementById("profile-icon").classList.add("hidden");
    }

    // ---------- MENÚ HAMBURGUESA ----------
    const menuToggle = document.getElementById("menu-toggle");
    const navUl = document.querySelector("nav ul");

    menuToggle.addEventListener("click", () => {
        navUl.classList.toggle("show");
        menuToggle.textContent = navUl.classList.contains("show") ? "✖" : "☰";
    });

    // Cerrar menú al hacer click en enlace (móvil)
    navUl.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            if(navUl.classList.contains("show")){
                navUl.classList.remove("show");
                menuToggle.textContent = "☰";
            }
        });
    });

});
