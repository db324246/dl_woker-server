const MongoDB = require('mongodb');
// 获取操作数据库ID的方法
const ObjectID = MongoDB.ObjectID;
const MongoClient = MongoDB.MongoClient;
const CONFIG = require('./mongodConfig')

class Mongo {
  // 单例模式，解决多次实例化实例不共享的问题
  static getInstance(){   
    if (!Mongo.instance) {
      Mongo.instance = new Mongo();
    }
    return  Mongo.instance;
  }

  constructor() {
    this.dbase = null;
    this.isConnected = false;
    this.connect()
  }

  // 连接数据库
  connect() {
    return new Promise((r, j) => {
      if (!this.isConnected) {
        const _this = this;
        MongoClient.connect(CONFIG.url, function(err, client) {
          if (err) return j(err)
          console.log('数据库连接成功。。。');
          _this.dbase = client.db(CONFIG.libraryName);
          _this.isConnected = true;
          r()
        })
      } else {
        r()
      }
    })
  }
  // 查询
  find(collectionName, findObj) {
    const _this = this
    return this.connect().then(() => {
      return new Promise((r, j) => {
        _this.dbase.collection(collectionName)
          .find(findObj)
          .toArray(function(err, result) { // 返回集合中所有数据
            if (err) j(err);
            else r(result)
          })
      })
    })
  }
  // 查询
  findOne(collectionName, findObj) {
    const _this = this
    return this.connect().then(() => {
      return new Promise((r, j) => {
        _this.dbase.collection(collectionName)
          .findOne(findObj, function(err, result) { // 返回集合中所有数据
            if (err) j(err);
            else r(result)
          })
      })
    })
  }
  // 更新
  updateOne(collectionName, updateObj, where) {
    const _this = this
    return this.connect().then(() => {
      return new Promise((r, j) => {
        _this.dbase.collection(collectionName)
          .updateOne(where, { $set:  updateObj }, function(err, result) {
            if (err) j(err);
            else r(result)
          });
      })
    })
  }
  // 插入数据
  insertOne(collectionName, insertObj) {
    const _this = this
    return this.connect().then(() => {
      return new Promise((r, j) => {
        _this.dbase.collection(collectionName)
          .insertOne(insertObj, function(err, result) {
            if (err) j(err);
            else r(result)
        })
      })
    })
  }
  // 删除数据
  removeOne(collectionName, removeObj) {
    const _this = this
    return this.connect().then(() => {
      return new Promise((r, j) => {
        _this.dbase.collection(collectionName)
          .removeOne(removeObj, function(err, result) {
            if (err) j(err);
            else r(result)
          })
      })
    })
  }
  // mongodb里面查询_id需要把字符串转换成对象
  getObjectId(id) {    
    return new ObjectID(id);
  }
}

module.exports = Mongo.getInstance()