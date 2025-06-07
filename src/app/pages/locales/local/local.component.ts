import { Component } from '@angular/core';

@Component({
  selector: 'app-local',
  standalone: false,
  templateUrl: './local.component.html',
  styleUrl: './local.component.scss'
})
export class LocalComponent {
  local = {
    nombre: 'Café Central',
    cod_postal: '12345',
    region: 'Ciudad',
    comuna: 'Comuna',
    capacidad: 100,
    precioH: 10,
    direccion: 'Av. Siempre Viva 123, Springfield',
    telefono: '(123) 456-7890',
    correo:'juan@gmail.com',
    descripcion: 'Un acogedor café ubicado en el corazón de la ciudad, ideal para disfrutar de un ambiente tranquilo y cálido. Ofrecemos una cuidada selección de cafés de especialidad, tés artesanales y una deliciosa variedad de postres caseros, preparados diariamente con ingredientes frescos. Nuestro espacio cuenta con cómodas mesas, conexión Wi-Fi gratuita y una pequeña biblioteca para quienes deseen relajarse leyendo o trabajar en un entorno inspirador. Además, organizamos eventos culturales como lecturas, música en vivo y talleres los fines de semana. Perfecto para reuniones informales, citas o simplemente para disfrutar de un buen momento con una taza caliente entre manos.',
    imagenUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Backrooms_model.jpg/1200px-Backrooms_model.jpg',
    imagenMap: 'https://lh3.googleusercontent.com/YOXD2PhKTGyasUdmsGwH-9md1HjSBuQ_6s-6e46IfXGIrearmeqgfWDfleEq-JN9ld8TCISJaffrusemhMw7U8sB-EP0xxqkn8lp=rw-e365-w1375'
  };
}
