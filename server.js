// require("dotenv").config(); // For Env Variables 
const app = require("./app")
const http = require("http")


const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT)

// // Global Error Handler. IMPORTANT function params MUST start with err
// app.use((err, req, res, next) => {
//     console.log(err.stack);
//     console.log(err.name);
//     console.log(err.code);
  
//     res.status(500).json({
//       message: "Something went rely wrong",
//     });
//   });
  
  // Listen on pc port
//   app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  