// import session from "express-session";
// import MongoStore from "connect-mongo";

// const sessionMiddleware = session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGODB_URL,
//     dbName: "dellcube", 
//     ttl: 14 * 24 * 60 * 60, 
//     collectionName: "sessions",
//     crypto: {
//         secret: process.env.SESSION_SECRET,   
//     }
//   }),
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24, // 1 day
//     secure: process.env.NODE_ENV === "production",
//     httpOnly: true,
//   },
// });

// export default sessionMiddleware;
