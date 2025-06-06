function voltar() {
  window.location.href = "index.html"; 
}

function comprar() {
  Swal.fire({
    title: "Redirecionando...",
    text: "Você será levado para a página de compra!",
    icon: "info",
    confirmButtonText: "Ok",
    confirmButtonColor: "#3085d6",
    background: "#fff",
    color: "#333",
    customClass: {
      popup: 'swal-custom'
    }
  }).then(() => {
    window.location.href = "Pagamento.html";
  });
}

function toggleMenu() {
  const navLinks = document.getElementById("nav-links");
  navLinks.classList.toggle("active");
}


window.onload = () => {
  const navLinks = document.querySelectorAll("#nav-links a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      document.getElementById("nav-links").classList.remove("active");
    });
  });
};
