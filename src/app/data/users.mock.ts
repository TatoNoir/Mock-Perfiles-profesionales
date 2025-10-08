import { ApiUser } from '../services/users.service';

// Completa manualmente este arreglo con los usuarios mock.
// Conserva las claves según la interfaz ApiUser del servicio.
export const USERS_MOCK: ApiUser[] = [
  // {
  //   id: 1,
  //   name: 'Nombre Apellido',
  //   email: 'correo@example.com',
  //   phone: null, // o '11-5555-5555'
  //   profile_picture: null, // o URL
  //   description: 'Descripción breve del usuario',
  //   profile_user_id: 10, // o null
  //   profile: { id: 10, name: 'Perfil profesional' }, // o null
  //   activities: [
  //     { id: 1, name: 'Actividad', short_code: 'ACT', tags: 'tag1,tag2', code: 'A-001', disabled: 0 }
  //   ]
  // }

  {
    "id": 5,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+5491130000000",
    "profile_picture": null,
    "description": "Experto en construcción y plomería",
    "profile_user_id": 2,
    "profile": {
      "id": 2,
      "name": "Prestadora"
    },
    "activities": [
      {
        "id": 1,
        "name": "Albañil",
        "short_code": "ALB",
        "tags": "construcción, ladrillos, cemento",
        "code": "ACT001",
        "disabled": 0
      },
      {
        "id": 4,
        "name": "Plomero",
        "short_code": "PLO",
        "tags": "agua, caños, instalaciones",
        "code": "ACT004",
        "disabled": 0
      }
    ]
  },
  {
    "id": 6,
    "name": "Pepito perez",
    "email": "pepito@example.com",
    "phone": "+5491130000000",
    "profile_picture": null,
    "description": "Experto en Electricidad",
    "profile_user_id": 2,
    "profile": {
      "id": 2,
      "name": "Prestadora"
    },
    "activities": [
      {
        "id": 3,
        "name": "Electricista",
        "short_code": "ELE",
        "tags": "instalaciones, cables, energía",
        "code": "ACT003",
        "disabled": 0
      }
    ]
  }
];


