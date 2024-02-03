import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import Urls from '../api/baseUrl';

const AddTaskForm = () => {
  const [todo, setTodo] = useState({
    name:'',
    title:'',
    description:'',
    email:'',
    phoneNumber: '',
    date:'',
    priority:'',
    days:[],
    time:''
    // file:''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [statusSubmission, setStatusSubmission] = useState(false);

  const validateForm = ()=>{
    let errors ={};

    if(!todo.name){
        errors.name = "Name is required";
    }else if(!/^.{0,50}$/.test(todo.name)){
        errors.name ="Title can only contain 50 characters or less"
    }

    // if(!todo.date){
    //     errors.date = 'Date is required';
    // }

    if(!todo.email){
        errors.email = 'Email is required';
    }else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(todo.email)){
        errors.email = 'Invalid email address';
    }

    if(!todo.phoneNumber){
        errors.phoneNumber = 'Phone number is required';
    } else if (!/^[789]\d{9}$/.test(todo.phoneNumber)){
        errors.phoneNumber = 'Invalid Phone Number';
    }

    if(!todo.title){
        errors.title = "Title is required";
    }else if(!/^.{0,20}$/.test(todo.title)){
        errors.title ="Title can only contain 20 characters or less"
    }

    if(!todo.description){
        errors.description = "Title is required";
    }else if(!/^.{0,50}$/.test(todo.description)){
        errors.description ="Title can only contain 50 characters or less"
    }

    if(!todo.priority){
        errors.priority = "Please set the priority";
    }

    if(todo.days.length===0){
        errors.days = "Please select atleast one day";
    }

    if(!todo.time){
        errors.time = "Please set any time of the day" ;
    }

    if(!selectedFile){
        errors.file = "Please Upload a file" ;
    }else if(!selectedFile.name.match(/\.(jpg|jpeg|png)$/)){
        errors.file = "Only JPG, JPEG, and PNG files are allowed";
    }else if(selectedFile.size > (1*1024 * 1024)){
        errors.file = "The file should be less than 5 MB";
    }

    setErrors(errors);
    return Object.keys(errors).length===0;
  }

  const handleChange =(e)=>{
    const {name, value, type, checked, files} = e.target;

    if (type === 'checkbox') {
        // For checkboxes, update the array based on checked status
        if (checked) {
          // Add the value to the array if checked
          setTodo((prevData) => ({
            ...prevData,
            days: [...prevData.days, {day: value}],
          }));
        } else {
          // Remove the value from the array if unchecked
          setTodo((prevData) => ({
            ...prevData,
            days: prevData.days.filter((item) => item.day !== value),
          }));
        }
    }else{
        // const val = type === 'file' ? files[0] : value;
        setTodo((prevData) =>({
            ...prevData,
            [name] : value,
        }));
    }
  }

  const handleFileChange = (e) =>{
    const file = e.target.files[0];
    setSelectedFile(file);
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    let response;
    try{
        if(validateForm()){
            //if we have a complex form (file upload) and we are using the axios/fetch
            //we need to make an instance of FormData because it can handle the submissions of complex data
            //rather than using the plain javascript object.

            const formData = new FormData();

            //then we convert the obj to JSON string

            const todoJson = JSON.stringify(todo);

            //and then append the JSON string into the formData with the key -todo and value as entire string
            formData.append('todo' , todoJson);
            formData.append('file', selectedFile);

            await axios.post(`${Urls.baseUrl}/api/todos` , formData ,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Form submitted", todo);
            setStatusSubmission(true);
            setTodo({
                name:'',
                title:'',
                description:'',
                email:'',
                phoneNumber: '',
                date:'',
                priority:'',
                days:[],
                time:'',
              });
              setSelectedFile(null);
        }   
        else{
            console.log("Error in the validation");
        }
    }catch(error){
        setErrors({...errors, submitError: "Failed to Submit. Try Again."});
        setStatusSubmission(false);
        //console.error(response);
    }
  }

  const handleCloseSuccess = () => {
    setStatusSubmission(false);
  };

  return (
    <div className='addTaskContainer'>
        <div className='heading'><h1>Todo List App</h1></div>
        <div className="formContainer">
            <div className='formHeading'><h1>Add your tasks here</h1></div>

            {errors && <div style={{ color: 'red' }}>{errors.submitError}</div>}
            {statusSubmission && (
                <div style={{ color: 'green', marginBottom: '10px' }}>
                Form submitted successfully!
                <button onClick={handleCloseSuccess} style={{ marginLeft: '10px' }}>Close</button>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        name="name"
                        value={todo.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                    />
                    <input
                        type="text"
                        name="title"
                        value={todo.title}
                        onChange={handleChange}
                        placeholder="Enter Title"
                    />
                </div>
               <div>
                    {errors.name && <div style={{color:"red"}}>{errors.name}</div>}
                    {errors.title && <div style={{color:"red"}}>{errors.title}</div>}
               </div>

                <textarea
                    type="text"
                    name="description"
                    value={todo.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                />
                {errors.description && <div style={{color:"red"}}>{errors.description}</div>}

                <input
                    type="date"
                    name="date"
                    value={todo.date}
                    onChange={handleChange}
                />
                {errors.date && <div style={{color:"red"}}>{errors.date}</div>}

                <input
                    type="email"
                    name="email"
                    value={todo.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                {errors.email && <div style={{color:"red"}}>{errors.email}</div>}

                <input
                    type="tel"
                    name="phoneNumber"
                    value={todo.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                />
                {errors.phoneNumber && <div style={{color:"red"}}>{errors.phoneNumber}</div>}

                <select
                    name="priority"
                    value={todo.priority}
                    onChange={handleChange}
                >
                    <option value="">Priority</option>
                    <option value="HIGH">High </option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low </option>
                </select>
                {errors.priority && <div style={{color:"red"}}>{errors.priority}</div>}

                <fieldset>
                    <legend>Choose the days in the week</legend>
                    <input
                        type="checkbox"
                        name="days"
                        value="monday"
                        //checked={todo.days.includes('monday')}
                        onChange={handleChange}
                    />
                    Monday
                    <input
                        type="checkbox"
                        name="days"
                        value="tuesday"
                        //checked={todo.days.includes('tuesday')}
                        onChange={handleChange}
                    />
                    Tuesday
                    <input
                        type="checkbox"
                        name="days"
                        value="wednesday"
                        //checked={todo.days.includes('wednesday')}
                        onChange={handleChange}
                    />
                    Wednesday
                </fieldset>
                {errors.days && <div style={{color:"red"}}>{errors.days}</div>}

                <fieldset>
                    <legend>Choose what time in a day</legend>
                    <input
                        type="radio"
                        name="time"
                        value= "morning"
                        onChange={handleChange}
                    />
                    Morning
                    <input
                        type="radio"
                        name="time"
                        value= "afternoon"
                        onChange={handleChange}
                    />
                    Afternoon
                    <input
                        type="radio"
                        name="time"
                        value= "evening"
                        onChange={handleChange}
                    />
                    Evening
                </fieldset>
                {errors.time && <div style={{color:"red"}}>{errors.time}</div>}

                <input
                    id="file"
                    type="file"
                    name="file"
                    accept=".jpg, .jpeg, .png, .pdf"
                    onChange={handleFileChange}
                />
                {errors.file && <div style={{color:"red"}}>{errors.file}</div>}

                <button type="submit">Submit</button>
            </form>
        </div>
    </div>
  )
}

export default AddTaskForm;

