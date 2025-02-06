// import type { Server } from "socket.io"

// export type NextApiResponseServerIO = NextApiResponse & {
//   socket: {
//     server: {
//       io: Server | undefined
//     }
//   }
// }

// interface NextApiResponse {
//   end: () => void
//   socket: {
//     server: {
//       io?: Server
//     }
//   }
// }


import type { Server as NetServer, Socket } from "net"
import type { NextApiResponse } from "next"
import type { Server as SocketIOServer } from "socket.io"

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

