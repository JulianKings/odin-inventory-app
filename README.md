# Odin's Inventory App
A simple inventory application to practice my skills with Mongo DB and Express.

It has been updated to enable uploading images for the products, everything else also works properly (creating, reading, updating, deleting).

I had to update the service to use Environment Variables for convenience of my hosting provider and the app deployment but it had, at least until the last few commits, a system to read on a settings.properties file which had two key pairs, (database_url and secret_password), which made it pretty convenient to test on local. It was hidden from git (using the .gitignore file) to protect the data.

You need a secret password for the destructive actions (delete and update).

Click [here](https://odin-inventory-app-a38978611381.herokuapp.com/) for a live preview
