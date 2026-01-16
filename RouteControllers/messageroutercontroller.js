const Message = require ("../Models/message.model")
const Conversation = require ( "../Models/conversation.model")
const { getReceiverSocket,io } = require ( "../Socket/socket");

const sendMessage = async(req,res)=>{
    try {
    const {message} = req.body
    const {id:receiverId} = req.params;
    const senderId = req.user._id
    let chats = await Conversation.findOne({
        participants:{$all:[senderId,receiverId]}
    })
    if (!chats) {
        chats = await Conversation.create ({
            participants:[senderId,receiverId],
    })}

    const newMessages = new Message({
        senderId,
        receiverId,
        message,
        conversationId:chats._id
    })

    if(newMessages){
        chats.messages.push(newMessages._id);
    }


    await Promise.all([chats.save(), newMessages.save()])
    //socket.io.function
    const receiverSocketId = getReceiverSocket(receiverId);
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessages)
    }

    res.status(201).json(newMessages)

    } catch (error) {
        res.status(500).json({success: false , message: error.message})
    }
}


const getMessage = async(req,res)=>{
    try {
        const {id:receiverId} = req.params;
        const senderId = req.user._id
        const chats = await Conversation.findOne({
        participants:{$all:[senderId,receiverId]}
    }).populate("messages")
    if (!chats) return res.status(200).json([]);
    // const message = chats.messages;
    res.status(200).json(chats.messages);

    } catch (error) {
        res.status(500).json({success: false , message: error.message})
    }
}

module.exports = {sendMessage , getMessage}