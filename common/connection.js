const mongoose = require("mongoose");
global.ObjectId = mongoose.Types.ObjectId;

const mongodb = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URL,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            },
            (error, result) => {
                error ? console.error("Mongo", error) : console.log("Mongo Connected");
            }
        );
    } catch (error) {
        console.error(error);
    }
};

module.exports = { mongodb };