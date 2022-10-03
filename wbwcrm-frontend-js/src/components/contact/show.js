import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateNotes, destroyCustomer } from '../../actions/contact';
import { useNavigate } from 'react-router-dom';

import '../components.scss';

const Show = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const customerChosen = useSelector((state) => state.contacts.selected_customer); //This is the current customer we get from redux
    const selectedWorkers = useSelector((state) => state.contacts.selected_customer_workers); //These are the workers themselves
    const customerErrors = useSelector((state) => state.contacts.errors); //These are the customer errors
    const [currentNotesInTextArea, setCurrentNotesInTextArea] = useState(""); //This will start off as an empty string and change as the user types in the notes field
    const [confirmComponentVisibility, setConfirmComponentVisibility] = useState("confirm_invisible"); //When it's on "confirm_invisible" the user can't interact and it's invisible. Otherwise they can access it
    const [mainDivAccessible, setMainDivAccessible] = useState("accessible") //If this is on "accessible", then the user should be able to utilize it. If not (when the confirm is up), we will disable it


    useEffect(() => {
        //When the customer gets deleted (if there are no errors), we navigate to the main page
        if (Object.keys(customerChosen).length === 0){
            if (customerErrors === ""){
                navigate("/contacts");
            }
        }
    }, [customerChosen, customerErrors, navigate])

    const renderMaker = () => {
        //Depending on which keys of the customer are non-empty, those get rendered, and the others don't 
        const divs = [];
        for (const key of Object.keys(customerChosen)){
            if (key !== "notes" && key !== "id" && customerChosen[key] !== ""){
                divs.push(
                    <div key={key + 'div'} className='show_h2_div'>
                        <h2>{key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</h2>
                        <h3 key={key + 'h3'}>{customerChosen[key]}</h3>
                    </div>
                )
            }
            if (key === "contact_title"){
                divs.push(
                <div key="workers" className='show_h2_div'>
                    <h2>Workers</h2>
                    {selectedWorkers.map((worker, index) =>{
                        return(<h3 key={worker + `${index}`}>{worker.label}</h3>)
                    })}
                </div>
                )
            }
            
        }
        return divs;
    }

    const handleChangeInNotes = (event) => {
        //With each character, we will change the currentNotesInTextArea field to match it
        setCurrentNotesInTextArea(event.target.value)
    }

    const handleSubmission = (event) => {
        //Here we handle the submission of the notes and make the text how it should be when we put it in the db
        const date = new Date(); // Initializing a date object
        const options = { //This allows us to provide which information in our date we want to include
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }
        const notes_with_date_and_slash_n_added = date.toLocaleString('en-US', options) + ": " + currentNotesInTextArea + " \n " //The new Date() thing creates the timestamp and then we have a new line thing so we can split it up
        dispatch(updateNotes({value: notes_with_date_and_slash_n_added, id: customerChosen.id}));   
    }

    const handleDeleteButtonClicked = (event) => {
        //Starts the deletion process by rendering the 
        setConfirmComponentVisibility("confirm_visible");
        setMainDivAccessible("inaccessible");
    }

    const handleCancelClicked = (event) => {
        //This is what happens when the user hits cancel in the confirm screen
        setConfirmComponentVisibility("confirm_invisible");
        setMainDivAccessible("accessible");
    }

    const handleDeletion = (event) => {
        //When the user hits delete in the confirm box, it brings us here. This does the actual calling of the deletion
        dispatch(destroyCustomer(customerChosen.id));
        setConfirmComponentVisibility("confirm_invisible");
        setMainDivAccessible("accessible");
        
    }

    return(
        <>
            <div id="confirm_box" className={confirmComponentVisibility}>
                <h3 id="confirm_message">Are you sure you want to delete this customer? It will be gone forever if you do delete it.</h3>
                <button className="confirm_box_button" onClick={e => handleCancelClicked(e)}>Cancel</button>
                <button className="confirm_box_button" onClick={e => handleDeletion(e)}>Delete</button>
            </div>

            <div id="rest_of_show" className={mainDivAccessible}>
                <div>{renderMaker().map(element => element)}</div>
                <div key={`notes_${customerChosen.id}`} className='show_h2_div'>
                    <h2>Notes:</h2>
                    <h3 id="customer_chosen_notes">{customerChosen.notes}</h3>
                    <textarea id='notes_textarea' defaultValue={currentNotesInTextArea} onChange={e => handleChangeInNotes(e)}></textarea><br/>
                    <button onClick={e => handleSubmission(e)}>Submit Notes</button>
                </div>
                <button id="deletion_button" onClick={e => handleDeleteButtonClicked(e)}>Delete this Customer</button>
            </div>
        </>
    )
}

export default Show;
