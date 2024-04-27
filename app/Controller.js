
class Controller{
    query (req) {
        const userId = req?.user?._id;
        let query = { userId };
        if (req.query?._id) {
            query["_id"] = req.query?._id;
        } else if (req?.body?.data?._id) {
            query["_id"] = req?.body?.data?._id;
        } else if (req?.body?._id) {
            query["_id"] = req?.body?._id;
        }
        return query;
    }
}

module.exports = Controller;