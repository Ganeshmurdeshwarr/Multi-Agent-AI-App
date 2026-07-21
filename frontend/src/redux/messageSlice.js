import { createSlice } from "@reduxjs/toolkit";


const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
   
  },
  reducers: {
    setMessages:(state , action)=>{
        state.messages = action.payload
    },
    addMessages:(state , action)=>{
        state.messages.push(action.payload) 

    },
    


  },
});

export const {setMessages,addMessages } = messageSlice.actions;
export default messageSlice.reducer;
