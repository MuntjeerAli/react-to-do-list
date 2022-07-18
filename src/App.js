import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const getLocalStorageData = () => {
  return localStorage.getItem('things') ? JSON.parse(localStorage.getItem('things')) : [];
};


const App = () => {
  const [list, setList] = useState({title:'', price:''});
  const [things, setThings] = useState(getLocalStorageData());

  const [isEditing, setIsEditing] = useState(false);

  const [editId, setEditId] = useState(null);

  const changeHandler =(e) => {
    const key = e.target.name;
    const value = e.target.value;

    setList({...list, [key]:value});
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if(!list.title || !list.price){
      alert('All fields are mandatory!')
    }else if(isEditing){
      let updatedThings = things.map((item) => {
        if(item.id === editId){
          return {...item, title:list.title, price:list.price }
        }else{
          return item;
        }
      });
      setThings(updatedThings);
      setIsEditing(false);
      setEditId(null);
      setList({title:'', price:''});
    }else{
      let newList = {...list, id: uuidv4()};
      let newThings = [...things, newList];
      setThings(newThings);
      setList({title:'', price:''});
    }    
  };

  const deleteList = (id) => {
    const remainingThings = things.filter(
      (list) => list.id !== id
    );
    setThings(remainingThings);
  };

  const updateList = (id) => {
    setIsEditing(true);
    const updatedList = things.find(list => list.id === id);
    setList(updatedList);
    setEditId(id);
  };

  useEffect(() => {
    localStorage.setItem('things', JSON.stringify(things));
  }, [things])


  return (
    <>
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor='title'>
          Title:
        </label>
        <input type="text" 
        id='title' 
        name='title' 
        placeholder='Title' 
        value={list.title} 
        onChange={changeHandler} />
      </div>
      <br/>
      <div>
        <label htmlFor='price'>
          Price:
        </label>
        <input type="text" 
        id='price' name='price' 
        placeholder='Price' 
        value={list.price} 
        onChange={changeHandler} />
      </div>
      <br/>
      <button type='submit'>{isEditing ? 'Update' : 'Add'}</button>
    </form>
    <ul>
      {things.map((item) => {

        const {id, title, price} = item;
        return(
        <li key={id}>
          <h2>{title}</h2>
          <h2>{price}</h2>
          <button onClick = {() => updateList(id)}>Edit</button>
          <button onClick = {() => deleteList(id)}>Delete</button>
        </li>
        );
      })}
    </ul>
    
    </>
  )
}

export default App;
