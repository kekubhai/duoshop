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
 const getTransactionssummary = useCallback(async() => {
  try {
    // First try to get from API
    const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
    const data = await response.json();
    
    // Check if we got valid data, otherwise calculate locally
    if (!data || (data.balance === 0 && data.income === 0 && data.expenses === 0)) {
      calculateSummaryFromTransactions();
    } else {
      setSummary(data);
    }
  } catch(error) {
    console.error("Error fetching transaction summary:", error);
    // Fallback to calculating from transactions
    calculateSummaryFromTransactions();
  }
}, [userId]);

// Add this helper function to calculate summary from transactions
const calculateSummaryFromTransactions = useCallback(() => {
  if (!transactions.length) return;
  
  const income = transactions
    .filter(t => Number(t.amount) > 0)
    .reduce((acc, t) => acc + Number(t.amount), 0);
    
  const expenses = transactions
    .filter(t => Number(t.amount) < 0)
    .reduce((acc, t) => acc + Number(t.amount), 0);
    
  setSummary({
    income,
    expenses,
    balance: income + expenses
  });
}, [transactions]);

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

    const deleteTransactions = useCallback(async (id) => {
  if(!id) return;
  try {
    const response = await fetch(`${API_URL}/transactions/${id}`, {method:"DELETE"})
    if(!response.ok){
      throw new Error("Failed to delete transaction")
    }
    
    // Update local state after successful deletion
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    // Recalculate summary
    calculateSummaryFromTransactions();
    
  } catch(error) {
    console.error("Error deleting transaction:", error);
    Alert.alert("Error", "Failed to delete transaction. Please try again later."); 
  }
}, [calculateSummaryFromTransactions]);

    return {
        transactions,
        summary,
        loading,
        loadData,
        deleteTransactions
    }
}