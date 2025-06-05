import { useCallback, useState } from "react"

import { Alert } from "react-native";

const API_URL=  "https://duoshop.onrender.com/api"
export const useTransactions=(userId)=>{
    const [transactions,setTransactions]=useState([])
    const [summary,setSummary]=useState({
        balance:0,
        income:0,
        expenses:0,
    });
    const [loading,setIsLoading]=useState(true)
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
    const response=await fetch(`${API_URL}/transactions/summary/${userId}`);
    const data=await response.json();
    setSummary(data);
}catch(error){
    console.error("Error fetching transaction summary:", error);
}
}, [userId])
const loadData=useCallback(async()=>{
    if(!userId) return;
    setIsLoading(true);
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

const deleteTransactions=useCallback(async (id)=>{
    if(!id)return;
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
    }, )
    return {
        transactions,
        summary,
        loading,
        loadData,
        deleteTransactions
    }
}