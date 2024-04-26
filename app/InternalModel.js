class InternalModel {
    api = null;
    constructor(model){
        if (!model) {
            throw new Error(`Undefined model name`);
        }
        this.api = model;
    }
    async incrementId() {
        try {
            const lastId = await this.api.db.findOne({})
                .sort("-id")
                .select("id");
            let value = (lastId && !isNaN(lastId.id)) ? parseInt(lastId.id) + 1 : 1;
            return value;
        } catch (error) {
            return 1;
        }
    }
    async count(query){
        const count = await this.api.db.count(query).catch(e => e);
        return count;
    }
    async findOne(query, fields){
        const data = await this.api.db.findOne(query, fields).catch(e => e);
        return data;
    }
    async findMany(query, fields){
        const data = await this.api.db.find(query, fields).catch(e => e);
        return data;
    }
    async paginate(options){
        const { limit, page, query, fields } = options;
        const total = await this.api.db.count(query??{});
        const skip = (page - 1) * limit;
        const items = await this.api.db.where(query??{})
            .select(fields??{})
            .sort( { _id: 1 } )
            .limit(limit)
            .skip(skip);
        const pages = Math.ceil(total/limit);
        const nextPage = page + 1;
        const prevPage = page - 1;
        
        var hasNext = page < pages?true:false;
        var hasPrev = page > 1?true:false;

        if (prevPage > pages) {
            hasPrev = undefined;
        }
        const next = hasNext?{ limit, page: nextPage, query, fields }:undefined;
        const prev = hasPrev?{ limit, page: prevPage, query, fields }:undefined;

        const paginated_results = {
            total,
            prev,
            next,
            items: limit === 1?undefined:items,
            item: limit === 1?items[0]:undefined,
        };
        return paginated_results;
    }
    async bulkCreate(data) {
        const created = await this.api.db.insertMany(data).catch(e => e);
        return created;
    }
    async updateMany(query, data) {
        const created = await this.api.db.updateMany(query, data).catch(e => e);
        return created;
    }
    async save(data) {
        var tbl = new this.api.db(data);
        const saved = await tbl.save().catch((e) => e);
        return saved;
    }
    async updateOne(id, data){
        const updated = await this.api.db.updateOne({_id: id}, data).catch(e => e);
        return updated;
    }
    async bulkUpdate(data){
        const updateOperations = [];
        for (let index = 0; index < data.length; index++) {
            const item = data[index];
            updateOperations.push({
                updateOne: {
                    filter: item.find,
                    update: item.update,
                }
            });
        }
        try {
            var result = await this.api.db.bulkWrite(updateOperations);
            return result;
        } catch (error) {
            return {
                errors: error
            };
        }
    }
    async bulkUpdateOrInsert(data) {
        let updateOperations = [];
        let iid = await this.incrementId();
        for (let index = 0; index < data.length; index++) {
            const item = data[index];
            updateOperations.push({
                updateOne: {
                    filter: item.find,
                    update: { ...{ id: iid + index }, ...item.update }, // Update operation with the entire document
                    upsert: true, // Insert the document if it doesn't exist
                }
            });
        }
        try {
            var result = await this.api.db.bulkWrite(updateOperations);
            return result;
        } catch (error) {
            return {
                errors: error
            };
        }
    }
    async updateOneOrInsert(query, data) {
        let iid = await this.incrementId();
        const updateOperations = [{
            updateOne: {
                filter: query,
                update: { ...{ id: iid }, ...data }, // Update operation with the entire document
                upsert: true, // Insert the document if it doesn't exist
            }
        }];
        try {
            var result = await this.api.db.bulkWrite(updateOperations);
            return result;
        } catch (error) {
            return {
                errors: error
            };
        }
    }
    async findOneAndUpdate(query, data){
        const updated = await this.api.db.updateOne(query, data).catch(e => e);
        return updated;
    }
    async deleteOne(id){
        const data = await this.api.db.deleteOne({_id: id}).catch(e => e);
        return data;
    }
    async deleteOneByQuery(query){
        const data = await this.api.db.deleteOne(query).catch(e => e);
        return data;
    }
    async deleteBySKU(sku){
        const data = await this.api.db.deleteMany({sku: sku}).catch(e => e);
        return data;
    }
    async deleteMany(query) {
        const data = await this.api.db.deleteMany(query).catch( e => e);
        return data;
    }
    async table(type, fields, query){
        const data = await this.api.db[type](query, fields).catch(e => e);
        return data;
    }
}

module.exports = InternalModel;