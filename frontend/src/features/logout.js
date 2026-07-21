import React from 'react'
import api from '../utils/axios'

const logout = async() => {
  try {
    const {data}= await api.get("/api/auth/logout")
  } catch (error) {
    console.log(error)
  }
}

export default logout
