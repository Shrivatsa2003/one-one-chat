const db = require("../connect");

const addMessage= async(req,res,next)=>{

    try {
        const{from,to,message}=req.body
        const usersJson = await JSON.stringify([from,to])
        const q = 'INSERT INTO messages (message,users,sender) VALUES(?,?,?)'
        const values = [message,usersJson,from]
        const data = await queryDB(q,values);
        if (data.affectedRows > 0) {
          return res.json({ msg: "Message added successfully." });
        } else {
          return res.json({ msg: "Failed to add message to the database" });
        }
        
    } catch (err) {
        next(err)
        console.log(err);
    }

}






const getAllMessage= async(req,res,next)=>{
try {
    const {from,to}=req.body;
    const q =  'SELECT  CASE WHEN sender = ?  THEN 1 ELSE 0 END AS fromSelf , message as message FROM messages WHERE users LIKE ? AND users LIKE ? ORDER BY updated_at ASC'
    const values = [from,`%${from}%`,`%${to}%`]
    const result = await queryDB(q,values);
      const projectedMessages = result.map((msg) => ({
    fromSelf: msg.fromSelf === 1,
    message: msg.message,
  }));

  res.json(projectedMessages);

} catch (error) {
    next(error)
    console.log(error);
}
}


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
module.exports={addMessage,getAllMessage}