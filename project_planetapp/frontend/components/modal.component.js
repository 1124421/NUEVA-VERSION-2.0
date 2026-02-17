      // Obtener referencias a los elementos
      const abrirLoginBtn = document.getElementById("abrir-login");
      const loginModal = document.getElementById("login-modal");

      // Mostrar el modal cuando se hace clic en "Ingresar"
      abrirLoginBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Evita que el enlace salte a #
        loginModal.style.display = "flex"; // Cambia display a flex para mostrarlo
      });

      // Opcional: Cerrar el modal al hacer clic fuera de la caja de login
      loginModal.addEventListener("click", function (event) {
        if (event.target === loginModal) {
          // Si el clic es directamente en el fondo del modal
          loginModal.style.display = "none"; // Ocultar el modal
        }
      });