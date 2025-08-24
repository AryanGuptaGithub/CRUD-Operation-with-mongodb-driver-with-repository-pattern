import ExpenseRepository from "./expense.repository.js";
import ExpenseModel from "./expense.model.js";

export default class ExpenseController {
  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  // Create new expense
  add = async (req, res) => {
        try{
          const { title, amount, data, isRecurring, tags } = req.body;
          const expense = new ExpenseModel(title, amount, Date, isRecurring, tags || []);
          const savedExpense = await this.expenseRepository.addExpense(expense);
          res.status(201).send(savedExpense);
        }catch(err){
          res.status(500).send({error: err.message});
        }
  };

  // Get a specific expense
  getOne = async (req, res) => {
          try{
            const {id} = req.params;
            const expense = await this.expenseRepository.getOne(id);
            if(!expense){
              res.status(200).send(expense);
            }else{
              res.status(404).send(expense);
            }
          }catch(err){
            res.status(500).send({error: err.message })
          }
  };

  // Get all expenses
  getAll = async (req, res) => {
      try{
        const expense = await this.expenseRepository.getAllExpenses();
        res.status(200).send(expense);
      }catch(err){
        res.status(500).send({error: err.message});
      }
  };

  // Add a tag to an expense
  addTag = async (req, res) => {
      try{
        const{id} = req.params;
        const {tag} = req.body;
        const updatedExpense = await this.expenseRepository.addTagToExpense(id, tag);
        res.status(200).send(updatedExpense);
      if(!updatedExpense){
        res.status(400).send({message: "Expense not found"});
      }else{
        res.status(200).send(updatedExpense);
      }
    }catch(err){
      res.status(500).send({error: err.message });
    }
  };

  // Filter expenses based on given criteria
  filter = async (req, res) => {
      try{
        const {minAmount, maxAmount, isRecurring } = req.query;
        const criteria = {minAmount, maxAmount, isRecurring };
        const filteredExpenses = await this.expenseRepository.filterExpenses(criteria);
        res.status(200).send(filteredExpenses);
      }catch(err){
        res.status(500).send({error: err.message });
      }
  };
}
