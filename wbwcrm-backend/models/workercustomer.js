import db from '../util/database.js'; // The database pool we're getting the information/sending information to

class WorkerCustomer{
    constructor(id, customer_id, worker_id){
        this.id = id;
        this.customer_id = customer_id;
        this.worker_id = worker_id;
    }
    
    static all(){
        /* Will give us all of the elements within the database */
        return db.execute('SELECT * FROM workercustomers');
    }

    static findByID(element_id){
        // Will give us a specific element based on the id 
        return db.execute('SELECT * FROM workerCustomers WHERE workerCustomers.id = ?', [element_id]);
    }

    save(worker_id, customer_id){
        // The purpose of this function is to save a new element to the database.
        return db.execute(`INSERT INTO workercustomers (customer_id, worker_id) VALUES(?, ?)`, [customer_id, worker_id])
    }
     
}

export default WorkerCustomer;
