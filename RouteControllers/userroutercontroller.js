const User = require ('../Models/authuser.model');
const Conversation = require ('../Models/conversation.model');

const getUserBySearch = async(req,res)=>{
    try {
       const search = req.query.search || '';
       const currentUserID = req.user._id;
       const user = await User.find({
        $and: [{
            $or:[
                {username:{$regex:'.*'+ search + '.*' , $options:'i'}},
                {fullname:{$regex:'.*'+ search + '.*' , $options:'i'}}
            ]
        },{
            _id : {$ne: currentUserID}
            }]
       }).select("-password") 

       res.status(200).send(user)

    } catch (error) {
        res.status(500).json({success:false,message: error.message})
    }
}



const getCurrentChatter= async(req,res)=>{
    try {
        const currentUserID = req.user._id;
        const currentChatters = await Conversation.find({
            participants:currentUserID
        }).sort({
            updatedAt: -1
            });

            if(!currentChatters || currentChatters.length === 0)  return res.status(200).send([]);

            const participantsIDs = currentChatters.reduce((ids,conversation)=>{
                const otherParticipents = conversation.participants.filter(id => id.toString() !== currentUserID.toString());
                return [...ids , ...otherParticipents]
            },[])
            const otherParticipentsIDS = participantsIDs.filter(id => id.toString() !== currentUserID.toString());

            const user = await User.find({_id:{$in:otherParticipentsIDS}}).select("-email -password");

            const users = otherParticipentsIDS.map(id => user.find(user => user._id.toString() === id.toString()));
            

            res.status(200).send(users)

    } catch (error) {
        res.status(500).json({success:false,message: error.message})
        
    }
}

module.exports = {getUserBySearch , getCurrentChatter}