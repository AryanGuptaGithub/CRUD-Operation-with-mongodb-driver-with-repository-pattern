
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb"; // this will help us is setting the id of the object

class ExpenseRepository {
  constructor() {
    this.collectionName = "expenses"; // name of the collection in mongodb
  }

  // Create a new expense
  async addExpense(expense) {
    const db = getDB();
    const result = await db.collection(this.collectionName).insertOne(expense);
    return {...expense, _id: result.insertedId}; // this will return expense with generated id
  }

  // Get one expnese by its ID
  async getOne(id) {
      const db = getDB();
      const result = await db.collection(this.collectionName).findOne({_id: new ObjectId(id)});
      return result;
  } 

  // Get all expenses
  async getAllExpenses() {
      const db = getDB();
      return await db.collection(this.collectionName).find().toArray();
  }

  // Add tag to an expense
  async addTagToExpense(id, tag) {
      const db = getDB();
      const result = await db.collection(this.collectionName).findOneAndUpdate(
        { _id: new ObjectId(id) },   // find by id
        { $push: { tags: tag } },    // add new tag into tags array
        { returnDocument: 'after' }  //  return updated document
      );
      return result.value; // the updated expense
  }

  // Filter expenses based on amount, isRecurring field
  async filterExpenses(criteria) {
      const db = getDB();
      const query = {};

      //build dynamic query
      if(criteria.minAmount) query.amount = { ...query.amount, $gte: Number(criteria.minAmount) };
      if(criteria.maxAmount) query.amount = { ...query.amount, $lte: Number(criteria.maxAmount) };
      if(criteria.isRecurring !== undefined) query.isRecurring = criteria.isRecurring == "true";

      return await db.collection(this.collectionName).find(query).toArray();

}
}
export default ExpenseRepository;
