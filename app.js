const { json } = require("body-parser");
const { stdin, stdout } = require("process");
const fs=require('fs').promises;
const readline=require('readline');
const { parse } = require("path");

const r1=readline.createInterface({
    input:process.stdin,
    output: process.stdout
})

// taking  record data
function askQuestion(query) {
    return new Promise((resolve) => r1.question(query, resolve));
}


// function to retrieve the record data for specific id  from the file if it exist 


async function get_record(id,page_number){
   let data=await fs.readFile(`${page_number}.txt`);
   
   data=data.toString();
   data.split(0,data.length-1);
   data=data.split('\n');
  
   data.forEach((rec)=>{
      
      rec=rec.split(',');
      if(rec.length===3){
          rec[0]=parseInt(rec[0]);

          if(rec[0]===id){
            console.log(`and his id is  ${rec[0]}, his name is ${rec[1]}, his age is ${rec[2]}`)
          }
      }

      
     
   })
}


// if overflow ocur in node and keys become 3

function split(i,parent){ // i is the ind of the full child   and n is the parent 
    
    let full_node=parent.childs[i];
    let median=full_node.keys[1];
    
       

    parent.count++;
    let left_node=new node(full_node.leaf);
    left_node.keys.push(full_node.keys[2]);
    left_node.count=1;
    for (let j=2;j<full_node.childs.length;j++){
        left_node.childs.push(full_node.childs[j]);
       
    }
    

   full_node.count=1;
   full_node.keys.splice(1,2);
   full_node.childs.splice(2);
    
parent.keys.push(median);
parent.keys.sort((a,b)=>a-b)

parent.childs.splice(i+1,0,left_node);
}




// node of the b tree 
class node {
    constructor(leaf){
        this.leaf=leaf;
        this.count=0;
        this.keys=[]; // each key will be an object contain key value and page number {key  ,  page_number}
        this.childs=[];
    }
}



// b tree class with insert method and handle if root's count become 3 

class b_tree{
    constructor(){
        this.root=null; 
    }

    insert(element,page){
        let key_obj={value:element,page_number:page};

        // if the b tree dosn't contain any node 
        if (!this.root){
            
            let nod=new node(1);
            nod.keys.push(key_obj);
            
            nod.count=1;
            this.root=nod; 
            
        }

        // if the root is the only node in the tree and contain 1 key or 2 
        else if (this.root.leaf){
              
                if (this.root.count===1){
                    
                    this.root.keys.push(key_obj);
                   
                }
                else if (this.root.count===2){
                    this.root.keys.push(key_obj);
                  
                }
                this.root.keys.sort((a,b)=>a.value-b.value);
                this.root.count+=1;
        }



        // if the root is not a leaf node 
        else {

           function recur(current){
              
                if (current.childs[0]&&current.childs[0].leaf&&element<current.keys[0].value){
                    current.childs[0].keys.push(key_obj);
                    current.childs[0].count++;
                    
                    current.childs[0].keys.sort((a, b) => {
                        return a.value - b.value; 
                      });
                    
                    if (current.childs[0].count===3){
                       split(0,current);
                    }
                    
                    return ;
                }
                if (current.count===1&&current.childs[1]&&current.childs[1].leaf&&element>current.keys[0].value){
                    current.childs[1].keys.push(key_obj);
                   
                    current.childs[1].count++;
                    
                    current.childs[1].keys.sort((a, b) => {
                        return a.value - b.value; 
                      });
                      
                    if (current.childs[1].count===3){
                    
                    split(1,current);
                    }
                    return ;
                }
                if (current.count==2&&current.childs[1]&&current.childs[1].leaf&&element<current.keys[1].value){
                    current.childs[1].keys.push(key_obj);
                    current.childs[1].count++;
                    current.childs[1].keys.sort((a, b) => {
                        return a.value - b.value; 
                      });
                    if (current.childs[1].count==3){
                   
                    split(1,current);
                    }
                    
                   
                    return ;
                }
             
                if (current.childs[2]&&current.childs[2].leaf&&element>current.keys[1].value){
                    
                    current.childs[2].keys.push(key_obj);
                    current.childs[2].count++;
                    current.childs[2].keys.sort((a, b) => {
                        return a .value- b.value; 
                      });
                    if (current.childs[2].count==3){
                       
                        split(2,current);
                    }
                    
                    return ;
                }
               

                 if (current.childs[0]&&element<current.keys[0].value){
                    recur(current.childs[0]);
                 }
                 else if ((current.childs[1]&&element>current.keys[0].value&&current.count==1)||(current.childs[1]&&current.count==2&&element>current.keys[0].value&&element<current.keys[1].value)){
                 
                    recur(current.childs[1]);
                 }

                 else if (current.childs[2]&&current.count==2&&element>current.keys[1].value){
                   
                    recur(current.childs[2]);
                 }

               
                   
                  // recursively after insertion check overflowed nodes 
                  for (let i=0;i<3;i++){

                       
                    
                      if (current.childs[i]&&current.childs[i].count==3){

                      split(i,current);
                     }
    
                      }
            }


            recur(this.root);
           }
           
            // check after insertion  if the root is full    and count =3
           if (this.root.count===3){   
          
                let new_root=new node(0);
                new_root.count=1;
                new_root.keys.push(this.root.keys[1]);
                let left_node=new node(Number(!this.root.childs[2]&&!this.root.childs[3]));
                left_node.keys.push(this.root.keys[2]);
                left_node.count=1;
                this.root.count=1;
                for (let j=2;j<this.root.childs.length;j++){ // if the root has more than three childs now 
                    left_node.childs.push(this.root.childs[j]);
                }
               this.root.keys.splice(1,2);
            
               this.root.childs.splice(2,2);
              
               let old_root=this.root;
               this.root=new_root;
               this.root.childs.push(old_root);
               this.root.childs.push(left_node);
               
            }

           }

        }
        let btree=new b_tree();



       async function construct_tree(){
         if (!btree.root){
            let x=await fs.readFile('node.txt');
            x=x.toString();
            x=x.slice(0,x.length-1);
          
            x=x.split(',').map(Number);
            
            for(var i=0;i<(x.length);i+=2){
               btree.insert(x[i],x[i+1]);
               
            }
         
          }

          
          
        }

        construct_tree();
        // insert operation (id,name,age)
        
        async function handle_input() {
          
            try {
                const id = await ((askQuestion("Enter your ID: ")));
                let id_=parseInt(id,10);
                const name = await askQuestion("What is your name? ");
                const age = await askQuestion("What is your age? ");
                
                const insertion_data = `${id_},${name},${age}\n`;
        
                // Read current_page.json
                let data = await fs.readFile('current_page.json', 'utf8');
                const obj = JSON.parse(data);
        
                let page = obj["current_bage"], cnt = obj["current_count"];
                if (cnt === 3) {
                    // Create a new file
                    const newFile = `${page + 1}.txt`;
                    await fs.writeFile(newFile, insertion_data);
                    obj["current_bage"]++;
                    obj["current_count"] = 1;
                } else {
                    // Append to the existing file
                    const oldFile = `${page}.txt`;
                    await fs.appendFile(oldFile, insertion_data);
                    obj["current_count"]++;
                }
        
                // Update the btree node file 
                let node=`${id_},${obj.current_bage},`;
                await fs.appendFile('node.txt',node);

                btree.insert(id_,obj.current_bage);
                
               
                
                // Write back the updated current_page.json
                const json_data = JSON.stringify(obj, null, 2);
                await fs.writeFile('current_page.json', json_data);

        
                console.log("insertion completed successfully.");
                
            } catch (err) {
                console.error("An error occurred:", err);
            } 
        }

       // search for specific id 
      async  function handle_search(id){

            let location=0;
            function recur(node){

                   if (!node){
                     return ;
                   }

                   for (let i=0;i<node.keys.length;i++){
                       if (node.keys[i].value===id){
                        
                        location=node.keys[i].page_number+1;
                        return ;
                       }
                   }


                 let ops1=0,ops2=0,ops3=0,ops4=0,ops5=0;
                 if (node.count===1&&id>node.keys[0].value){
                    ops1=recur(node.childs[1]);
                 }
                 else if (node.count===1&&id<node.keys[0].value){
                  ops2=recur(node.childs[0]);
                 }

                 else if (node.count===2&&id<node.keys[0].value){
                  ops3=recur(node.childs[0]);
                 }
                 else if (node.count===2&&id>node.keys[0].value&&id<node.keys[1].value){
                  ops4=recur(node.childs[1]);
                 }
                 else if (node.count===2&&id>node.keys[1].value&&node.childs[2]){
                  ops5=recur(node.childs[2]);
                 }

             
            }

          recur(btree.root);

          if (location){
            console.log("this  employee exist  ");
           await get_record(id,location-1);
          }
          else {
            console.log("not exist");
          }

        }

        (async () => {
            
            for (let j = 0; ; j++) {
            

              let query=await askQuestion("enter your query {insert,search,exit}");

                 
                if (query==="insert"){
                  console.log("enter the data",'\n');
                  await handle_input();
                }

                else if (query==="search") {
                  x=await askQuestion("enter the id ");
                  x=parseInt(x,10);
                  await handle_search(x);
                 
                }

                else if (query==="exit") {
                  break;
                }
                
            }
        
            
            r1.close();
        })();
        

        