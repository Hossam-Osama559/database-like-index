this is my initial thought about database index using b tree 
this is not  as typical as how database index works but it is intial step to dig more deep in that 
b tree to  index  a column called id in table contain (id,name,age)
by making the key contain the id and the page number that belong to it 

just a btree with insert method and helper function called "handle input" that take record from user and ensure when records in current file exeed a certain number
it create a new file and insert to it 
with helper json file called "current_page.json" that keeps track the number of the current file and the number of records in it 

and a text file called "node.txt" that help to persist the b tree by inserting to it the id and the page number 
and another helper function "handle_search" that take id and begin to search for it in the tree by its o(log n) advantage then if it exist take the page number and 
begin to extract all the record from it 
