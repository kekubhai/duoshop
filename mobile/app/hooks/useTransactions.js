import { useCallback, useState } from "react"
import axios from "axios";
import { Alert } from "react-native";
import { Alert } from "react-native";
const API_URL= process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
export const useTransactions=(userId)=>{
    const [transactions,setTransactions]=useState([])
    const [summary,setSummary]=useState({
        balance:0,
        income:0,
        expenses:0,
    });
    const [loading,setIsLoading]=useState(null)
    // const fetchTransactions=async()=>{
    //     try{
    //         const response=await fetch (`${API_URL}/transactions/${userId}`);
    //         const data=await response.json();
    //         setTransactions(data)
    //     }catch(error){

    //     }
    // }
    const getfetchTransactions=useCallback(async ()=>{
        try {
            const response=await fetch(`${API_URL}/transactions/${userId}`);
            const data= await response.json();
            setTransactions(data);

        }catch(error){
            console.error("Error fetching transactions:", error);
        }
    }, [userId])
 const getTransactionssummary=useCallback(async()=>{
try {
    const response=await axios(`${API_URL}/transactions/summary/${userId}`);
    const data=await response.data;
    setSummary(data);
}catch(error){
    console.error("Error fetching transaction summary:", error);
}
}, [userId])
const loadData=useCallback(async()=>{
    if(!userId) return;
    isLoading(true);
    try{
        await Promise.all([
            getfetchTransactions(),
            getTransactionssummary()
        ]);
    }catch(error){
        console.error("Error loading data:", error);
    }finally{
        setIsLoading(false);
    }
}, [getfetchTransactions, getTransactionssummary])

const deleteTransactions=useCallback(async ()=>{
    try {
        const response =await fetch (`${API_URL}/transactions/${id}`, {method:"DELETE"})
        if(!response.ok){
            throw new Error("Failed to delete transactions ")

        }

        }
        catch(error){
            console.error("Error deleting transactions:", error);
            Alert.alert("Error", "Failed to delete transactions. Please try again later."); 
        }
    }, [id])
    return {
        transactions,
        summary,
        loading,
        loadData,
        deleteTransactions
    }
}