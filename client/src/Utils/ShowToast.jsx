import Swal from "sweetalert2";

const showToast = (title, text, icon) => {
  Swal.fire({
    title,
    text,
    icon,
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};
export default showToast;
