const db = require("../config/db");
const mongoose = require("mongoose"), Schema = mongoose.Schema;

mongoose.set("strictQuery", false);

class Model {
    path = "../databases";
    model = null;
    tableName = null;
    fields = null;
    db = null;
    conn = null;
    mainSchema = null;
    constructor(options) {
        if (options.db_file_name) {
            const t = require(this.path + "/" + options.db_file_name + "_table");
            if (!t.fields) throw new Error("Database table fields is not defined");
            if (!t.model) {
                throw new Error("Database table is not defined");
            }
            this.tableName = options.db_file_name;
            this.model = t.model;
            this.fields = {
                ...t.fields, ...{}
            };
            this.mainSchema = new Schema(this.fields, {
                collection: this.tableName,
                timestamps: true,
                toJSON: { virtuals: true },
                toObject: { virtuals: true }
            });
            if (options.virtuals && typeof options.virtuals === "object") {
                options.virtuals.forEach(virtual => {
                    this.mainSchema.virtual(virtual.name).get(virtual.get);
                });
            }
            if (options.pre && typeof options.pre === "object") {
                options.pre.forEach(pre => {
                    this.mainSchema.pre(pre.name, pre.get);
                });
            }

            this.db = mongoose.model(
                this.model, this.mainSchema,
                this.tableName
            );

            if (options.watch) {
                const changeStream = this.db.watch();
                // Listen for change events
                changeStream.on('change', options.watch);
            }

        } else {
            throw new Error("Database is not defined");
        }
    }
    prepareQuery(req) {
        let query = {
            "$and": []
        };
        let fields = {};
        let sort = { title: 1 };
        var page = parseInt(1);
        let limit = parseInt(100);
        if (req.query.page && !isNaN(parseInt(req.query.page)) && parseInt(req.query.page) > 0) {
            page = parseInt(req.query.page);
        }
        if (req.query.limit && !isNaN(parseInt(req.query.limit))) {
            limit = parseInt(req.query.limit);
        }
        if (limit > 100) limit = 100;
        for (const key in req.query) {
            if (req.query.hasOwnProperty(key)) {
                const value = req.query[key];
                if (!value) {
                    continue;
                }
                if (key === "limit" || key === "page" || key === "sort" || key === "qMatchWith") {
                    continue;
                }
                if (key === "q") {
                    if (req.query.hasOwnProperty("qMatchWith")) {
                        let mw = [];
                        String(req.query?.qMatchWith).split(",")?.forEach(x => {
                            if (value && String(value).trim() !== "" && typeof value === "string") {
                                mw.push({
                                    [x]: { $regex: value, $options: "i" }
                                })
                            }
                        });
                        if (mw.length > 0) {
                            query["$and"].push({
                                "$or": mw
                            });
                        }
                    }
                }
                else if (key === "fields") {
                    value.split(",").forEach(r => {
                        fields[r] = 1;
                    });
                }
                else if (key === "deselect") {
                    // value.split(",").forEach(r => {
                    //     fields[r] = 0;
                    // });
                }
                else {
                    if (String(key).indexOf(".") > -1) {
                        let column = String(key).split(".")[0];
                        let expression = String(key).split(".")[1];
                        if (expression === "disjunction") { // if OR operator is used in query
                            let disjunctionQuery = [];
                            for (const disjunctionKey in query[column]) {
                                let disjunctionValue = query[column][disjunctionKey];
                                disjunctionQuery.push({
                                    [column]: {
                                        [disjunctionKey]: disjunctionValue
                                    }
                                });
                            }
                            if (disjunctionQuery.length > 0) {
                                query["$and"].push({
                                    "$or": disjunctionQuery
                                });
                            }
                            try {
                                delete query[column];
                            } catch (error) {

                            }
                        }
                        else {
                            let v = !isNaN(value) ? Number(value) : value;
                            if (query.hasOwnProperty(column)) {
                                query[column][expression] = v;
                            }
                            else {
                                query[column] = {
                                    [expression]: v
                                }
                            }
                        }
                    }
                    else {
                        query[key] = !isNaN(value) ? Number(value) : value;
                    }
                }
            }
        }
        if (query["$and"].length === 0) {
            try {
                delete query.$and;
            } catch (error) {

            }
        }
        return {
            fields,
            query,
            sort,
            limit,
            page
        }
    }
    async count(query) {
        try {
            const count = await this.db.count(query);
            return count;
        } catch (error) {
            return {
                error: error
            };
        }
    }
    async countAll() {
        const count = await this.db.count({}).catch(e => e);
        return count;
    }
    async all() {
        const data = await this.db.find({}).catch(e => e);
        return data;
    }
    async lookup(req) {
        const { query, fields, page, limit, sort } = this.prepareQuery(req);
        const total = await this.db.count(query);
        const skip = (page - 1) * limit;
        const items = await this.db
            .find(query)
            .select(fields)
            .sort(sort)
            .limit(limit)
            .skip(skip);
        const pages = Math.ceil(total / limit);
        const nextPage = page + 1;
        const prevPage = page - 1;

        var hasNext = page < pages ? true : false;
        var hasPrev = page > 1 ? true : false;

        if (prevPage > pages) {
            hasPrev = undefined;
        }

        let nextQuery = "";

        const count = items?.length;

        const href = `?limit=${limit}&page=${page}${nextQuery}`;
        const next = count ? hasNext ? `?limit=${limit}&page=${nextPage}${nextQuery}` : undefined : undefined;
        const prev = count ? hasPrev ? `?limit=${limit}&page=${prevPage}${nextQuery}` : undefined : undefined;

        const paginated_results = {
            pages,
            page,
            limit,
            total,
            prev,
            href,
            next,
            items,
            count,
            query
        };
        return paginated_results;
    }
    async getAll(query) {
        const data = await this.db.find(query).catch(e => e);
        return data;
    }
    async get(_id) {
        const data = await this.db.find({ _id: _id }).catch(e => e);
        return data;
    }
    async findByQuery(query, fields) {
        const data = await this.db.find(query, fields).catch(e => e);
        return data;
    }
    async findOrFirst(query, fields) {
        let data = await this.db.findOne(query, fields).catch(e => e);
        if (!data) {
            data = await this.db.findOne({}, fields).limit(1);
        }
        return data;
    }
    async one(query, fields) {
        const data = await this.db.findOne(query, fields).catch(e => e);
        return data;
    }
    async findOne(query, fields) {
        const data = await this.db.findOne(query, fields).catch(e => e);
        return data;
    }
    async findAll(query, fields) {
        const data = await this.db.find(query, fields).catch(e => e);
        return data;
    }
    async paginate(req) {
        const { page, fields, query, limit, sort } = this.prepareQuery(req);
        const skip = (page - 1) * limit;
        const items = await this.db
            .find(query)
            .select(fields)
            .sort(sort)
            .limit(limit)
            .skip(skip);
        const total = await this.count(query);
        const pages = Math.ceil(total / limit);
        const nextPage = page + 1;
        const prevPage = page - 1;

        var hasNext = page < pages ? true : false;
        var hasPrev = page > 1 ? true : false;

        if (prevPage > pages) {
            hasPrev = undefined;
        }

        const href = `?limit=${limit}&page=${page}`;
        const next = hasNext ? `?limit=${limit}&page=${nextPage}` : undefined;
        const prev = hasPrev ? `?limit=${limit}&page=${prevPage}` : undefined;

        const paginated_results = {
            page,
            limit,
            total,
            href,
            prev,
            next,
            items,
        };
        return paginated_results;
    }
    async save(data) {
        var tbl = new this.db(data);
        const saved = await tbl.save().catch(e => e);
        return saved;
    }
    async add(data) {
        var tbl = new this.db(data);
        const saved = await tbl.save().catch(e => e);
        return saved;
    }
    async bulkCreate(data) {
        const created = await this.db.insertMany(data).catch(e => e);
        return created;
    }
    async updateOne(_id, data) {
        const updated = await this.db.updateOne({ _id: _id }, data).catch(e => e);
        return updated;
    }
    async updateOneByQuery(query, data) {
        const updated = await this.db.updateOne(query, data).catch(e => e);
        return updated;
    }
    async updateOneOrInsert(query, data) {
        const count = await this.count(query).catch(e => e);
        if (count >= 1) {
            await this.db.updateOne(query, data);
            const new_data = await this.db.findOne(query).catch(e => e);
            return new_data;
        } else {
            const updated = await this.save(data).catch(e => e);
            return updated;
        }
    }
    async bulkUpdateOrInsert(data) {
        let updateOperations = [];
        for (let index = 0; index < data.length; index++) {
            const item = data[index];
            updateOperations.push({
                updateOne: {
                    filter: item.find,
                    update: { ...{ }, ...item.update }, // Update operation with the entire document
                    upsert: true, // Insert the document if it doesn't exist
                }
            });
        }
        try {
            var result = await this.db.bulkWrite(updateOperations);
            return result;
        } catch (error) {
            return {
                error: error
            };
        }
    }
    async bulkUpdate(data) {
        const updateOperations = [];
        for (let index = 0; index < data.length; index++) {
            const item = data[index];
            updateOperations.push({
                updateOne: {
                    filter: item.find,
                    update: item.update, // Update operation with the entire document
                }
            });
        }
        try {
            var result = await this.db.bulkWrite(updateOperations);
            return result;
        } catch (error) {
            return {
                error: error
            };
        }
    }
    async updateMany(query, data) {
        const created = await this.db.updateMany(query, data).catch(e => e);
        return created;
    }
    async deleteOne(_id) {
        const data = await this.db.deleteOne({ _id: _id }).catch(e => e);
        return data;
    }
    async deleteByQuery(query) {
        const data = await this.db.deleteOne(query).catch(e => e);
        return data;
    }
    async deleteMany(query) {
        const data = await this.db.deleteMany(query).catch(e => e);
        return data;
    }
}

module.exports = Model;