let localizacion;

 if (location.hostname === "localhost") {
   localizacion = "/estetica360";
 } else {
   localizacion = "https://sanchez.ctpoba.com";
 }

//USUARIOS
fetch(`${localizacion}/api/index.php?recurso=Usuarios`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
         nombre: "Juan",
         apellido: "Pérez",
         usuario_login: "juanp",
         contraseña: "123456",
         rol: "admin"
     })
 })
 .then(res => res.json())
 .then(data => console.log("POST:", data))

 fetch(`${localizacion}/api/index.php?recurso=Usuarios`, {
     method: "PUT",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
         id_usuario: 10,
         nombre: "NuevoNombre",
         apellido: "NuevoApellido",
         usuario_login: "nuevoLogin",
         rol: "empleado"
     })
 })
 .then(res => res.json())
 .then(data => console.log("PUT:", data))

 fetch(`${localizacion}/api/index.php?recurso=Usuarios`, {
     method: "DELETE",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
         id_usuario: 10
     })
 })
 .then(res => res.json())
 .then(data => console.log("DELETE:", data))

 export async function obtenerUsuarios() {
     const res = await fetch(`${localizacion}/api/index.php?recurso=Usuarios`);
     return await res.json();
 }
