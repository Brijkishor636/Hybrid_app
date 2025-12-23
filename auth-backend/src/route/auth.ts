import express from "express";

const userRouter = express.Router();

userRouter.post("/signup", async (req, res)=>{
    const body = req.body;
      try {
        if (!body) {
          return res.status(400).json({
            msg: "Request body is missing"
          });
        }

        const existUser = await prisma.user.findUnique({
          where: { username: body.username }
        });
    
        if (existUser) {
          return res.status(409).json({
            msg: "User already exists, please login!"
          });
        }
    
        const hashedPassword = await bcrypt.hash(body.password, 10);
    
        const user = await prisma.user.create({
          data: {
            username: body.username,
            password: hashedPassword,
            name: body?.name,
            mobile: body?.mobile,
            role: body.role ?? "STUDENT" 
          }
        });
    
        const secretKey = process.env.JWT_SECRET as Secret;
        console.log(secretKey);
        if (!secretKey) {
          return res.status(500).json({ msg: "JWT secret is not configured" });
        }
    
        const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: "1h" });
        res.cookie("token", token, {
        httpOnly: true,
        path: '/'
        })

        return res.status(201).json({
          msg: "User created successfully"
        });
      } catch (e) {
        console.error("Signup error:", e);
        if (e instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ msg: "Token expired, please login again" });
        }
        return res.status(500).json({ msg: "Internal server error!!" });
      }
})

export default userRouter;