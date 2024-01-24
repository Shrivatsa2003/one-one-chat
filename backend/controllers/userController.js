const db = require("../connect");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  try {
    const q = "SELECT * FROM users WHERE username = ?";
    const usernameData = await queryDB(q, [req.body.username]);

    if (usernameData.length > 0) {
      return res.status(409).json("Username already used");
    }

    const q1 = "SELECT * FROM users WHERE email = ?";
    const emailData = await queryDB(q1, [req.body.email]);

    if (emailData.length > 0) {
      return res.status(409).json("Email already used");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const q3 = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const values = [req.body.username, req.body.email, hashedPassword];

    // Execute the INSERT query
    const insertResult = await queryDB(q3, values);

    // Access the inserted id from the result
    const insertedId = insertResult.insertId;

    const responseData = {
      username: req.body.username,
      email: req.body.email,
      _id: insertedId,
      // Access the id here
      // Add other user data here if needed
    };

    return res
      .status(200)
      .json({ message: "User created successfully",_id:insertedId, responseData });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const q = "SELECT * FROM users WHERE username = ?";
    const user = await queryDB(q, [req.body.username]);
    // console.log(user);
    const { password } = req.body;
    if (user.length === 0) {
      return res.json({ msg: "Incorrect Username or Password", status: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect Username or Password", status: false });
    }
    const responseData = {
      username: req.body.username,
      status: true,
      _id: user[0].id,
      avatarImage:user[0].avatarImage,
      isAvatarImageSet:user[0].isAvatarImageSet
    };
    return res
      .status(200)
      .json({ message: "login successful", _id: user[0].id, responseData });
  } catch (err) {
    next(err);
  }
};


const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image
  
    const q = "UPDATE users SET isAvatarImageSet = ?, avatarImage = ? WHERE id = ?";

    const values =[1,avatarImage,userId]

    const userData = await queryDB(q,values)
    console.log(userData);
    
      // Respond with a JSON object containing information about the updated avatar
      return res.json({
        isSet: true,
        image: req.body.image,
      });
    
    
  } catch (ex) {
    console.log(ex);
    next(ex)
  }
}

const getAllUsers  = async(req,res,next)=>{
  try {
    const usersId = req.params.id
    const q = 'SELECT email,username,avatarImage,id FROM users WHERE id!= ?'
    const values = [usersId]
    const users = await queryDB(q,values);
    return res.json(users)
  } catch (error) {
    console.log(error);
    next(error)
  }
 
}

// Helper function to promisify MySQL queries
const queryDB = (query, values) => {

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = { register, login,setAvatar,getAllUsers };
