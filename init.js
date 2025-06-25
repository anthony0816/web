import { autenticar } from "./script.js";
import { iniciarApp } from "./script.js";
import { CargarTema } from "./script.js";





let estado = autenticar("Bb", "1234");

if (estado == false) {
  document.getElementsByTagName('body')[0].innerHTML=""
} else {
    CargarTema() 
  await iniciarApp(20);
}