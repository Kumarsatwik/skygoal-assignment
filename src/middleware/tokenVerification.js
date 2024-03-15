import jwt from "jsonwebtoken";

export const tokenVerify = (req, res, next) => {
  try {
    const token =
      req.headers["authorization"].split(" ")[1] || req.cookies.token;

    if (!token) {
      return res.status(401).send({ message: "No token provided." });
    }
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Failed to authenticate token." });
      }
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
};
