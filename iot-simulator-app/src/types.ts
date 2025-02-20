
// export interface Device {
//   id: string
//   name: string
//   type: string
//   state: boolean
// }

// export interface User {
//   id: string
//   name: string
//   email: string
// }

// export interface DeviceUpdate {
//   type: "deviceUpdate"
//   device: Device
//   user: User
// }

// export interface UpdateDeviceRequest {
//   deviceId: string
//   newState: boolean
//   userId: string
// }




export interface Device {
  id: string
  name: string
  type: string
  state: boolean
}

export interface User {
  id: string
  name: string
  email: string
}

export interface DeviceUpdate {
  type: "deviceUpdate"
  device: Device
  // user: User
}

export interface UpdateDeviceRequest {
  deviceId: string
  newState: boolean
  userId: string
}

  
  