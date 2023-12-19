import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";

class ExpenseRepository {
  constructor() {
    this.collectionName = "expenses"; // name of the collection in mongodb
  }

  // Create a new expense
  async addExpense(expense) {
    try{
      const db = getDB();
      const collection = db.collection(this.collectionName);
      await collection.insertOne(expense);
      // res.status(200).send("Expense added");
      return expense;
    }catch(err){
      console.log(err);
    }
  }

  // Get one expnese by its ID
  async getOne(id) {
    try{
      const db = getDB();
      const collection = db.collection(this.collectionName);
      const expense = await collection.findOne({_id: new ObjectId(id)});
      return expense;
    }catch(err){
      console.log(err);
    }
  }

  // Get all expenses
  async getAllExpenses() {
    try{
      const db = getDB();
      const collection = db.collection(this.collectionName);
      const expense = await collection.find().toArray();
      return expense;
    }catch(err){
      console.log(err);
    }
  }

  // Add tag to an expense
  async addTagToExpense(id, tag) {
    try{
      const db = getDB();
      const collection = db.collection(this.collectionName);
      const expense = await collection.updateOne({_id: new ObjectId(id)},{$push:{tags:tag}});
      return expense;
    }catch(err){
      console.log(err);
    }
  }

  // Filter expenses based on date, amount, and isRecurring field
  async filterExpenses(criteria) {
    try{
      const db = getDB();
      const filterExp = {};
      // console.log(criteria.minAmount,criteria.maxAmount,criteria.isRecurring)
      if(criteria.minAmount){
        filterExp.amount = {$gte : parseFloat(criteria.minAmount)};
      }
      if(criteria.maxAmount){
        filterExp.amount = {...filterExp.price, $lte : parseFloat(criteria.maxAmount)};
      }
      if(criteria.isRecurring){
        filterExp.isRecurring = JSON.parse(criteria.isRecurring);
      }
      // console.log(filterExp);
      const collection = db.collection(this.collectionName);
      const expense = await collection.find(filterExp).toArray();
      // console.log(expense);
      return expense;
    }catch(err){
      console.log(err);
    }
  }

  // Update a tag in an expense
  async updateTagInExpense(id, oldTag, newTag) {
    const db = getDB();
    const filter = { _id: new ObjectId(id), tags: oldTag };
    const update = { $set: { "tags.$": newTag } };
    const expenses = await db.collection(this.collectionName).updateOne(filter, update);
    return expenses;

  }

  // Delete a tag from an expense
  async deleteTagFromExpense(id, tag) {

    const db = getDB();
    const filter = { _id: new ObjectId(id) };
    const update = { $pull: { tags: tag } };
    await db.collection(this.collectionName).updateOne(filter, update);

  }


  // Aggregate total revenue for each product
  async aggregateTotalRevenue() {
    const db = getDB();
    const pipeline = [
      {
        $group: {
          _id: "$title",
          totalRevenue: { $sum: "$amount" }
        }
      }
    ];

    const result = await db.collection(this.collectionName).aggregate(pipeline).toArray();
    return result;
  }

  // Group expenses by tags
  async groupExpensesByTags() {
    const db = getDB();
    const pipeline = [
      { $group: { _id: "$tags", expenses: { $push: { _id: "$_id", title: "$title", amount: "$amount", date: "$date", isRecurring: "$isRecurring", tags: "$tags" } } } }


    ];

    const result = await db.collection(this.collectionName).aggregate(pipeline).toArray();
    return result;
  }

  // Group and calculate average by recurring status
  async groupAndCalculateAvgByRecurring() {
    const db = getDB();
    const pipeline = [
      {
        $group: {
          _id: "$isRecurring",
          avgAmount: { $avg: "$amount" }
        }
      }
    ];

    const result = await db.collection(this.collectionName).aggregate(pipeline).toArray();
    return result;
  }

  async addExpenseWithTransaction(expense, session) {
    const db = getDB();
    await db.collection(this.collectionName).insertOne(expense, { session });
    return expense;
  }

  // Transactional version: Update a tag in an expense with transaction
  async updateTagInExpenseWithTransaction(id, oldTag, newTag, session) {
    const db = getDB();
    const filter = { _id: new ObjectId(id), tags: oldTag };
    const update = { $set: { "tags.$": newTag } };
    const expenses = await db.collection(this.collectionName).updateOne(filter, update, { session });
    return expenses;
  }


  // -----------Above is previous code-------------

  async addExpenseAndUpdateTagTransaction(addParams, updateParams) {
    const { title, amount, date, isRecurring, tags } = addParams;
    const newTag = updateParams.newTag;
    const oldTag = updateParams.oldTag;

    const expenseToCreate = new ExpenseModel(
      title,
      amount,
      date,
      isRecurring,
      tags
    );

    const client = getClient();
    const session = client.startSession();

    try {
      session.startTransaction();
      await this.addExpenseWithTransaction(expenseToCreate, session);

      const { id } = expenseToCreate;
      await this.updateTagInExpenseWithTransaction(id, oldTag, newTag, session);

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    } finally {
      // client.close();
    }
  }
}

export default ExpenseRepository;
