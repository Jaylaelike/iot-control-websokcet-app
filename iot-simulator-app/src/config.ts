import dotenv from 'dotenv'

dotenv.config()

// export const config = {
//   port: process.env.PORT || 8080,
//   devices: [
//     { id: "cm6t1gbi700003k3n7qjxy02l", name: "Living Room Light", type: "light", state: false, updateInterval: 5000 },
//     { id: "cm6t1guxy00013k3nusj1sump", name: "Kitchen Thermostat", type: "thermostat", state: false, updateInterval: 10000 },
//     { id: "3", name: "Bedroom Fan", type: "fan", state: false, updateInterval: 7000 },
//     { id: "4", name: "Garage Door", type: "door", state: false, updateInterval: 15000 },
//   ],
// }


export const config = {
  port: process.env.PORT || 8080,
  devices: [
    { id: "cm6t1gbi700003k3n7qjxy02l", name: "IRD", type: "light", state: false, updateInterval: 5000 },
    { id: "cm6t1guxy00013k3nusj1sump", name: "T2edge", type: "thermostat", state: false, updateInterval: 10000 },
    { id: "3", name: "Bedroom Fan", type: "fan", state: false, updateInterval: 7000 },
    { id: "4", name: "Garage Door", type: "door", state: false, updateInterval: 15000 },
  ],
  users: [
    { id: "u1", name: "Alice Smith", email: "alice@example.com" },
    { id: "u2", name: "Bob Johnson", email: "bob@example.com" },
    { id: "u3", name: "Charlie Brown", email: "charlie@example.com" },
  ],
}

