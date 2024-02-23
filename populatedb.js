#! /usr/bin/env node

console.log(
    'This script populates some test items and categories.'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const item = require("./models/items");
  const category = require("./models/categories");
  
  const items = [];
  const categories = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // category[0] will always be the Technology category, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function categoryCreate(index, name, description) {
    const newCategory = new category({ name: name, description: description });
    await newCategory.save();
    categories[index] = newCategory;
    console.log(`Added category: ${name}`);
  }
  
  async function itemCreate(index, name, description, price, category, amount, imageUrl, rating) {
    const itemDetail = {
      name: name,
      description: description,
      price: price,
      category: category,
      amount: amount,
      imageUrl: imageUrl,
      rating: rating,
    };
  
    const newItem = new item(itemDetail);
    await newItem.save();
    items[index] = newItem;
    console.log(`Added item: ${name}`);
  }
  
  async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
      categoryCreate(0, "Technology", 'The most recent technology at the palm of your hands.'),
      categoryCreate(1, "Clothing", 'A wide variety of clothing to fulfill your needs.'),
      categoryCreate(2, "Jewelry", 'The most beautiful jewelry out there.'),
      categoryCreate(3, "Furniture", 'Decorate your house with style!'),
    ]);
  }
  
  async function createItems() {
    console.log("Adding items");
    await Promise.all([
      itemCreate(0, "Asus ROG Ally", "The first ROG portable console, running Windows so you can play your favorite games anywhere.", 
      649, categories[0], 14, '', 5),
      itemCreate(1, "Steam Deck", "The original portable console that valve made, enabling you to play your favorite steam games anywhere.", 
      449, categories[0], 8391, '', 4),
      itemCreate(2, "Logitech G PRO X 2", "Amazing wireless headsets made by Logitech.", 
      249, categories[0], 3, '', 5),
      itemCreate(3, "Logitech G502", "One of the best wireless mouses ever made, made by Logitech.", 
      94, categories[0], 401, '', 4),
      itemCreate(4, "Nintendo Switch OLED", "The latest portable console of Nintendo, with an amazing catalog and designed to be really easy and comfortable to use.", 
      299, categories[0], 401, '', 4),
      itemCreate(5, "Blue Jersey", "A comfy jersey to stay warm during the winter.", 
      14, categories[1], 401, '', 3),
      itemCreate(6, "Black T-Shirt", "A comfy black t-shirt made with the best fibers.", 
      4, categories[1], 401, '', 3),
      itemCreate(7, "Red T-Shirt", "A red black t-shirt made with the best fibers.", 
      4, categories[1], 401, '', 3),
      itemCreate(8, "Blue T-Shirt", "A blue black t-shirt made with the best fibers.", 
      4, categories[1], 401, '', 3),
      itemCreate(9, "Diamond Ring", "The most beautiful diamond ring you'll ever see.", 
      4999, categories[2], 401, '', 3),
    ]);
  }